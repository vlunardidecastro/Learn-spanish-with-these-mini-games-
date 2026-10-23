import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export interface SceneInteractionCallbacks {
  onIngredientClick: (ingredientId: string) => void;
  onCuttingBoardClick: () => void;
  onMolcajeteClick: () => void;
}

export class KitchenScene {
  private container: HTMLElement;
  private scene: THREE.Scene;
  private camera: THREE.OrthographicCamera;
  private renderer: THREE.WebGLRenderer;
  private frameId: number = 0;
  private callbacks: SceneInteractionCallbacks;

  // 3D Subject Groups
  private chefGroup: THREE.Group = new THREE.Group();
  private leftEyeMesh: THREE.Mesh | null = null;
  private rightEyeMesh: THREE.Mesh | null = null;
  private molcajeteGroup: THREE.Group = new THREE.Group();
  private tejoloteGroup: THREE.Group = new THREE.Group();
  private guacamoleFillMesh: THREE.Mesh | null = null;
  private molcajeteContentsGroup: THREE.Group = new THREE.Group();
  private cuttingBoardGroup: THREE.Group = new THREE.Group();
  private activeFoodGroup: THREE.Group = new THREE.Group();
  private knifeGroup: THREE.Group = new THREE.Group();
  private saltShakerOverBowl: THREE.Group = new THREE.Group();
  private saltParticlesGroup: THREE.Group = new THREE.Group();
  private limeOverBowl: THREE.Group = new THREE.Group();
  private limeJuiceParticles: THREE.Group = new THREE.Group();
  private cratesMap: Map<string, THREE.Group> = new Map();
  private interactiveMeshes: THREE.Mesh[] = [];

  // Active Slicing State
  private currentBoardIngredient: string | null = null;
  private currentSliceStep: number = 0;
  private avocadoPitMesh: THREE.Mesh | null = null;

  // Animation States
  private clock: THREE.Clock = new THREE.Clock();
  private chefBounceTime: number = 0;
  private knifeChopAnim: number = 0;
  private pestleMashAnim: number = 0;
  private saltShakeAnim: number = 0;
  private limeSquashAnim: number = 0;
  private confettiGroup: THREE.Group = new THREE.Group();
  private isVictory: boolean = false;
  private chefExcitedJump: boolean = false;
  private isSoftwareGl: boolean = false;

  constructor(container: HTMLElement, callbacks: SceneInteractionCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // Detect software WebGL guard
    this.isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF4EBE1);
    this.scene.fog = new THREE.Fog(0xF4EBE1, 28, 50);

    // 2. Camera Setup (True Isometric angle with clear tabletop framing)
    const aspect = container.clientWidth / container.clientHeight;
    const d = 8.6;
    this.camera = new THREE.OrthographicCamera(
      -d * aspect,
      d * aspect,
      d,
      -d,
      1,
      100
    );
    this.camera.position.set(16, 18, 16);
    this.camera.lookAt(0, 1.8, 0.3);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(
      this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2)
    );
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(this.renderer.domElement);

    // 4. Room Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmremGenerator.fromScene(
        new RoomEnvironment(),
        0.04
      ).texture;
      pmremGenerator.dispose();
    } catch (e) {
      console.warn('RoomEnvironment fallback', e);
    }

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Build Cubic/Minecraft 3D Kitchen Environment
    this.buildKitchenEnvironment();
    this.buildTinyChef();
    this.buildCuttingBoardAndKnife();
    this.buildMolcajete();
    this.buildSaltShakerOverBowl();
    this.buildLimeOverBowl();
    this.buildIngredientCrates();
    this.buildCelebrationAssets();

    // 7. Event Listeners
    window.addEventListener('resize', this.onResize);
    this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown);

    // 8. Start Loop
    this.tick();
  }

  public updateCallbacks(newCallbacks: SceneInteractionCallbacks) {
    this.callbacks = newCallbacks;
  }

  private setupLighting() {
    const keyLight = new THREE.DirectionalLight(0xFFF3E0, 1.9);
    keyLight.position.set(14, 22, 12);
    keyLight.castShadow = !this.isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.camera.near = 0.5;
      keyLight.shadow.camera.far = 45;
      const b = 11;
      keyLight.shadow.camera.left = -b;
      keyLight.shadow.camera.right = b;
      keyLight.shadow.camera.top = b;
      keyLight.shadow.camera.bottom = -b;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    this.scene.add(keyLight);

    const hemiLight = new THREE.HemisphereLight(0xE1F5FE, 0x8D6E63, 0.95);
    this.scene.add(hemiLight);

    const counterSpot = new THREE.PointLight(0xFFE082, 1.3, 16);
    counterSpot.position.set(0, 6.5, 2);
    this.scene.add(counterSpot);
  }

  private buildKitchenEnvironment() {
    const floorGeo = new THREE.PlaneGeometry(36, 36);
    const floorMat = new THREE.MeshStandardMaterial({ color: 0xCFD8DC, roughness: 0.85 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.05;
    floor.receiveShadow = !this.isSoftwareGl;
    this.scene.add(floor);

    // Enlarged Spacious Kitchen Table (14.5 x 8.2)
    const tableTopGeo = new THREE.BoxGeometry(14.5, 0.75, 8.2);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.6 });
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(0, 1.8, 0.1);
    tableTop.castShadow = !this.isSoftwareGl;
    tableTop.receiveShadow = !this.isSoftwareGl;
    this.scene.add(tableTop);

    const legGeo = new THREE.BoxGeometry(0.7, 1.8, 0.7);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
    const legPositions = [
      [-6.4, 0.9, -3.5],
      [6.4, 0.9, -3.5],
      [-6.4, 0.9, 3.6],
      [6.4, 0.9, 3.6],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      leg.castShadow = !this.isSoftwareGl;
      this.scene.add(leg);
    });
  }

  // Minecraft-style Tiny Chef with animated smiling squint eyes
  private buildTinyChef() {
    this.chefGroup = new THREE.Group();
    this.chefGroup.position.set(-0.3, 2.2, -2.6);

    // Apron Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 1.35, 0.95);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.4 });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.7;
    body.castShadow = !this.isSoftwareGl;
    this.chefGroup.add(body);

    // Red Neckerchief
    const scarfGeo = new THREE.BoxGeometry(0.95, 0.22, 1.0);
    const scarfMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, roughness: 0.5 });
    const scarf = new THREE.Mesh(scarfGeo, scarfMat);
    scarf.position.y = 1.45;
    this.chefGroup.add(scarf);

    // Voxel Head
    const headGeo = new THREE.BoxGeometry(0.9, 0.85, 0.85);
    const headMat = new THREE.MeshStandardMaterial({ color: 0xFFCC80, roughness: 0.6 });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.95;
    head.castShadow = !this.isSoftwareGl;
    this.chefGroup.add(head);

    // Eyes: normal open blocks (will squint on victory)
    const eyeGeo = new THREE.BoxGeometry(0.12, 0.14, 0.05);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
    this.leftEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    this.leftEyeMesh.position.set(-0.24, 1.98, 0.43);
    this.rightEyeMesh = new THREE.Mesh(eyeGeo, eyeMat);
    this.rightEyeMesh.position.set(0.24, 1.98, 0.43);
    this.chefGroup.add(this.leftEyeMesh, this.rightEyeMesh);

    // Chef Hat
    const hatBaseGeo = new THREE.BoxGeometry(0.95, 0.3, 0.9);
    const hatMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
    const hatBase = new THREE.Mesh(hatBaseGeo, hatMat);
    hatBase.position.y = 2.45;
    this.chefGroup.add(hatBase);

    const hatTopGeo = new THREE.BoxGeometry(1.15, 0.6, 1.1);
    const hatTop = new THREE.Mesh(hatTopGeo, hatMat);
    hatTop.position.y = 2.85;
    this.chefGroup.add(hatTop);

    // Right Arm
    const armGeo = new THREE.BoxGeometry(0.32, 0.7, 0.32);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.8, 0.9, 0.4);
    rightArm.rotation.x = -0.6;
    this.chefGroup.add(rightArm);

    this.scene.add(this.chefGroup);
  }

  // Wooden Cutting Board & Voxel Knife (Visible on opposite side, handle facing chef)
  private buildCuttingBoardAndKnife() {
    this.cuttingBoardGroup = new THREE.Group();
    this.cuttingBoardGroup.position.set(-1.4, 2.2, 0.2);

    const boardGeo = new THREE.BoxGeometry(3.6, 0.28, 2.6);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0xD7CCC8, roughness: 0.45 });
    const boardMesh = new THREE.Mesh(boardGeo, boardMat);
    boardMesh.position.y = 0.14;
    boardMesh.castShadow = !this.isSoftwareGl;
    boardMesh.receiveShadow = !this.isSoftwareGl;
    boardMesh.name = 'cutting_board';
    (boardMesh as any).interactiveType = 'cutting_board';
    this.cuttingBoardGroup.add(boardMesh);
    this.interactiveMeshes.push(boardMesh);

    // Voxel Knife: Placed on the OPPOSITE (left) side of the cutting board
    // Handle facing the chef (pointing toward negative Z)
    this.knifeGroup = new THREE.Group();
    this.knifeGroup.position.set(-2.3, 0.18, 0.0);

    // Shiny steel blade extending forward (toward positive Z)
    const bladeGeo = new THREE.BoxGeometry(0.1, 0.48, 1.55);
    const bladeMat = new THREE.MeshStandardMaterial({
      color: 0xF5F5F5,
      metalness: 0.95,
      roughness: 0.15,
    });
    const blade = new THREE.Mesh(bladeGeo, bladeMat);
    blade.position.set(0, 0.24, 0.55);
    blade.castShadow = !this.isSoftwareGl;
    this.knifeGroup.add(blade);

    // Metal collar / bolster
    const bolsterGeo = new THREE.BoxGeometry(0.14, 0.32, 0.12);
    const bolsterMat = new THREE.MeshStandardMaterial({ color: 0xCFD8DC, metalness: 0.9, roughness: 0.2 });
    const bolster = new THREE.Mesh(bolsterGeo, bolsterMat);
    bolster.position.set(0, 0.24, -0.25);
    this.knifeGroup.add(bolster);

    // Dark walnut wooden handle pointing toward the chef (negative Z)
    const handleGeo = new THREE.BoxGeometry(0.18, 0.28, 0.85);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.7 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(0, 0.24, -0.75); // facing chef!
    handle.castShadow = !this.isSoftwareGl;
    this.knifeGroup.add(handle);

    // Brass handle rivets for voxel craftsmanship detail
    for (let r = -0.55; r >= -0.95; r -= 0.25) {
      const rivet = new THREE.Mesh(
        new THREE.BoxGeometry(0.2, 0.08, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.8 })
      );
      rivet.position.set(0, 0.24, r);
      this.knifeGroup.add(rivet);
    }

    this.cuttingBoardGroup.add(this.knifeGroup);

    this.activeFoodGroup = new THREE.Group();
    this.activeFoodGroup.position.set(0, 0.35, 0);
    this.cuttingBoardGroup.add(this.activeFoodGroup);

    this.scene.add(this.cuttingBoardGroup);
  }

  // Volcanic Stone Molcajete (Basalt Mortar & Pestle)
  private buildMolcajete() {
    this.molcajeteGroup = new THREE.Group();
    this.molcajeteGroup.position.set(2.8, 2.2, 0.3);

    const basaltMat = new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.95 });

    const baseBowl = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.8, 2.4), basaltMat);
    baseBowl.position.y = 0.4;
    baseBowl.castShadow = !this.isSoftwareGl;
    baseBowl.receiveShadow = !this.isSoftwareGl;
    baseBowl.name = 'molcajete';
    (baseBowl as any).interactiveType = 'molcajete';
    this.molcajeteGroup.add(baseBowl);
    this.interactiveMeshes.push(baseBowl);

    const rimBowl = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.4, 2.7), basaltMat);
    rimBowl.position.y = 0.9;
    this.molcajeteGroup.add(rimBowl);

    const legPositions = [
      [0.9, 0.15, -0.9],
      [-0.9, 0.15, -0.9],
      [0, 0.15, 0.9],
    ];
    legPositions.forEach(([lx, ly, lz]) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), basaltMat);
      leg.position.set(lx, ly, lz);
      this.molcajeteGroup.add(leg);
    });

    // Guacamole smooth green filling
    const fillGeo = new THREE.BoxGeometry(2.1, 0.4, 2.1);
    const fillMat = new THREE.MeshStandardMaterial({ color: 0x689F38, roughness: 0.8 });
    this.guacamoleFillMesh = new THREE.Mesh(fillGeo, fillMat);
    this.guacamoleFillMesh.position.y = 0.88;
    this.guacamoleFillMesh.scale.set(0.1, 0.1, 0.1); // starts empty
    this.molcajeteGroup.add(this.guacamoleFillMesh);

    // Visible food chunks piling into bowl
    this.molcajeteContentsGroup = new THREE.Group();
    this.molcajeteContentsGroup.position.set(0, 0.92, 0);
    this.molcajeteGroup.add(this.molcajeteContentsGroup);

    // Tejolote (Stone pestle)
    this.tejoloteGroup = new THREE.Group();
    const pestle = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.4, 0.48), basaltMat);
    this.tejoloteGroup.add(pestle);
    this.tejoloteGroup.position.set(0.7, 1.4, 0.4);
    this.tejoloteGroup.rotation.z = -0.5;
    this.tejoloteGroup.rotation.x = 0.25;
    this.molcajeteGroup.add(this.tejoloteGroup);

    this.scene.add(this.molcajeteGroup);
  }

  // Salt Shaker Over Bowl
  private buildSaltShakerOverBowl() {
    this.saltShakerOverBowl = new THREE.Group();
    this.saltShakerOverBowl.position.set(2.8, 4.2, 0.3);
    this.saltShakerOverBowl.visible = false;

    const shaker = this.buildVoxelSaltShaker();
    shaker.rotation.z = -1.35;
    this.saltShakerOverBowl.add(shaker);

    // Hitbox for clicking the hovering salt shaker directly
    const saltHit = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 1.5, 1.6),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    saltHit.name = 'salt_hover_hitbox';
    (saltHit as any).interactiveType = 'molcajete';
    this.saltShakerOverBowl.add(saltHit);
    this.interactiveMeshes.push(saltHit);

    this.saltParticlesGroup = new THREE.Group();
    for (let i = 0; i < 20; i++) {
      const p = new THREE.Mesh(
        new THREE.BoxGeometry(0.08, 0.08, 0.08),
        new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.2 })
      );
      p.position.set((Math.random() - 0.5) * 0.6, -Math.random() * 0.8, (Math.random() - 0.5) * 0.6);
      this.saltParticlesGroup.add(p);
    }
    this.saltParticlesGroup.visible = false;
    this.saltShakerOverBowl.add(this.saltParticlesGroup);

    this.scene.add(this.saltShakerOverBowl);
  }

  // Lime Over Bowl for Squeezing Actions (Click 2 & 3)
  private buildLimeOverBowl() {
    this.limeOverBowl = new THREE.Group();
    this.limeOverBowl.position.set(2.8, 3.8, 0.3);
    this.limeOverBowl.visible = false;

    // Two lime halves facing down
    const rindMat = new THREE.MeshStandardMaterial({ color: 0x558B2F, roughness: 0.6 });
    const pulpMat = new THREE.MeshStandardMaterial({ color: 0xC0CA33, roughness: 0.4 });

    const half1 = new THREE.Group();
    const peel1 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.45), rindMat);
    const pulp1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.38), pulpMat);
    pulp1.position.y = -0.18;
    half1.add(peel1, pulp1);
    half1.position.set(-0.28, 0, 0);

    const half2 = new THREE.Group();
    const peel2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.35, 0.45), rindMat);
    const pulp2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.05, 0.38), pulpMat);
    pulp2.position.y = -0.18;
    half2.add(peel2, pulp2);
    half2.position.set(0.28, 0, 0);

    this.limeOverBowl.add(half1, half2);

    // Hitbox for clicking the hovering lime halves directly
    const limeHit = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.4, 1.8),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
    );
    limeHit.name = 'lime_hover_hitbox';
    (limeHit as any).interactiveType = 'molcajete';
    this.limeOverBowl.add(limeHit);
    this.interactiveMeshes.push(limeHit);

    // Lime juice drop particles
    this.limeJuiceParticles = new THREE.Group();
    for (let i = 0; i < 15; i++) {
      const drop = new THREE.Mesh(
        new THREE.BoxGeometry(0.09, 0.14, 0.09),
        new THREE.MeshStandardMaterial({ color: 0xCDDC39, roughness: 0.2 })
      );
      drop.position.set((Math.random() - 0.5) * 0.5, -Math.random() * 0.9, (Math.random() - 0.5) * 0.5);
      this.limeJuiceParticles.add(drop);
    }
    this.limeJuiceParticles.visible = false;
    this.limeOverBowl.add(this.limeJuiceParticles);

    this.scene.add(this.limeOverBowl);
  }

  // Show or hide lime halves hovering over the molcajete
  public showLimeOverBowl(visible: boolean) {
    this.limeOverBowl.visible = visible;
    if (visible) {
      // Clear cutting board completely so lemon is ONLY over molcajete
      while (this.activeFoodGroup.children.length > 0) {
        this.activeFoodGroup.remove(this.activeFoodGroup.children[0]);
      }
      this.currentBoardIngredient = null;
      this.currentSliceStep = 0;
      this.limeSquashAnim = 0;
      this.limeJuiceParticles.visible = false;
      this.limeOverBowl.scale.set(1.0, 1.0, 1.0);
      this.limeOverBowl.position.set(2.8, 3.8, 0.3);
    }
  }

  // 6 Wooden Crates Spaced Generously Across Enlarged Table
  private buildIngredientCrates() {
    const crateConfig = [
      { id: 'aguacate', x: -5.4, z: -1.7 },
      { id: 'cebolla', x: -5.4, z: 1.8 },
      { id: 'tomate', x: -2.3, z: 2.9 },
      { id: 'cilantro', x: 0.9, z: 2.9 },
      { id: 'sal', x: 5.4, z: -1.7 },
      { id: 'limon', x: 5.4, z: 1.8 },
    ];

    crateConfig.forEach((cfg) => {
      const crateGroup = new THREE.Group();
      crateGroup.position.set(cfg.x, 2.2, cfg.z);

      const woodMat = new THREE.MeshStandardMaterial({ color: 0x8D6E63, roughness: 0.75 });
      const base = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.1, 1.65), woodMat);
      base.position.y = 0.05;
      crateGroup.add(base);

      const cornerOffsets = [
        [-0.75, 0.35, -0.75],
        [0.75, 0.35, -0.75],
        [-0.75, 0.35, 0.75],
        [0.75, 0.35, 0.75],
      ];
      cornerOffsets.forEach(([px, py, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.2), woodMat);
        post.position.set(px, py, pz);
        crateGroup.add(post);
      });

      const hitBox = new THREE.Mesh(
        new THREE.BoxGeometry(1.7, 0.85, 1.7),
        new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
      );
      hitBox.position.y = 0.4;
      hitBox.name = `crate_${cfg.id}`;
      (hitBox as any).interactiveType = 'ingredient';
      (hitBox as any).ingredientId = cfg.id;
      crateGroup.add(hitBox);
      this.interactiveMeshes.push(hitBox);

      const tag = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.28, 0.05),
        new THREE.MeshStandardMaterial({ color: 0x263238, roughness: 0.9 })
      );
      tag.position.set(0, 0.42, 0.85);
      crateGroup.add(tag);

      const produce = this.buildDetailedVoxelProduce(cfg.id);
      produce.position.y = 0.3;
      crateGroup.add(produce);

      this.cratesMap.set(cfg.id, crateGroup);
      this.scene.add(crateGroup);
    });
  }

  // BUILD AUTHENTIC CUBIC MINECRAFT-STYLE INGREDIENTS
  private buildDetailedVoxelProduce(id: string): THREE.Group {
    const grp = new THREE.Group();

    if (id === 'aguacate') {
      // 🥑 Minecraft Voxel Avocado Half
      const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 });
      const limeFleshMat = new THREE.MeshStandardMaterial({ color: 0x8BC34A, roughness: 0.5 });
      const brownPitMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.4 });

      const avoGroup = new THREE.Group();

      const shellBottom = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.55), darkGreenMat);
      shellBottom.position.y = 0.22;
      avoGroup.add(shellBottom);

      const shellTop = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.35, 0.5), darkGreenMat);
      shellTop.position.set(0, 0.55, 0);
      avoGroup.add(shellTop);

      const flesh = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.72, 0.1), limeFleshMat);
      flesh.position.set(0, 0.38, 0.26);
      avoGroup.add(flesh);

      const pit = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.2), brownPitMat);
      pit.position.set(0, 0.32, 0.3);
      avoGroup.add(pit);

      avoGroup.position.set(0, 0.05, 0);
      grp.add(avoGroup);
    } else if (id === 'tomate') {
      // 🍅 Minecraft Voxel Tomato
      const redMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, roughness: 0.3 });
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.6 });

      const tomGroup = new THREE.Group();
      const body = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.65, 0.72), redMat);
      body.position.y = 0.32;
      tomGroup.add(body);

      const stemCenter = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.25, 0.12), stemMat);
      stemCenter.position.set(0, 0.72, 0);
      tomGroup.add(stemCenter);

      const stemCrossX = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.06, 0.12), stemMat);
      stemCrossX.position.set(0, 0.66, 0);
      tomGroup.add(stemCrossX);

      const stemCrossZ = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.06, 0.5), stemMat);
      stemCrossZ.position.set(0, 0.66, 0);
      tomGroup.add(stemCrossZ);

      tomGroup.position.set(0, 0.05, 0);
      grp.add(tomGroup);
    } else if (id === 'cebolla') {
      // 🧅 Solid Purple Onion with small green sprout on top!
      const purpleMat = new THREE.MeshStandardMaterial({ color: 0x7B1FA2, roughness: 0.4 }); // Pure Purple Onion
      const sproutMat = new THREE.MeshStandardMaterial({ color: 0x43A047, roughness: 0.5 }); // Green Sprout

      const onnGroup = new THREE.Group();

      // Lower cubic purple bulb
      const baseBulb = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.45, 0.75), purpleMat);
      baseBulb.position.y = 0.25;
      onnGroup.add(baseBulb);

      // Stepped upper purple neck
      const neck = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.3, 0.5), purpleMat);
      neck.position.y = 0.55;
      onnGroup.add(neck);

      // Small green sprout block on top!
      const sprout = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.32, 0.16), sproutMat);
      sprout.position.y = 0.82;
      onnGroup.add(sprout);

      grp.add(onnGroup);
    } else if (id === 'cilantro') {
      // 🌿 Cilantro looking like a "small broccoli with stems" (voxel stems + clustered floret canopy)
      const stemMat = new THREE.MeshStandardMaterial({ color: 0x388E3C, roughness: 0.6 });
      const floretDarkMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.7 });
      const floretBrightMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.7 });

      const broccoliGroup = new THREE.Group();

      // Main stalk stem
      const mainStem = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.45, 0.2), stemMat);
      mainStem.position.y = 0.22;
      broccoliGroup.add(mainStem);

      // Branching side stems
      const leftBranch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), stemMat);
      leftBranch.position.set(-0.16, 0.38, 0);
      leftBranch.rotation.z = 0.35;
      broccoliGroup.add(leftBranch);

      const rightBranch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.35, 0.12), stemMat);
      rightBranch.position.set(0.16, 0.38, 0);
      rightBranch.rotation.z = -0.35;
      broccoliGroup.add(rightBranch);

      // Clustered cubic floret canopy (broccoli head)
      const floretOffsets = [
        [0, 0.68, 0, 0.5, 0.3, 0.5, floretDarkMat],
        [-0.26, 0.62, 0, 0.38, 0.28, 0.38, floretBrightMat],
        [0.26, 0.62, 0, 0.38, 0.28, 0.38, floretBrightMat],
        [0, 0.64, 0.24, 0.38, 0.28, 0.38, floretDarkMat],
        [0, 0.64, -0.24, 0.38, 0.28, 0.38, floretBrightMat],
        [0, 0.85, 0, 0.32, 0.2, 0.32, floretBrightMat], // top floret tip
      ];
      floretOffsets.forEach(([fx, fy, fz, sx, sy, sz, fMat]) => {
        const floret = new THREE.Mesh(new THREE.BoxGeometry(sx as number, sy as number, sz as number), fMat as THREE.Material);
        floret.position.set(fx as number, fy as number, fz as number);
        broccoliGroup.add(floret);
      });

      grp.add(broccoliGroup);
    } else if (id === 'limon') {
      // 🍋 Minecraft Voxel Lime
      const rindMat = new THREE.MeshStandardMaterial({ color: 0x558B2F, roughness: 0.6 });
      const pulpMat = new THREE.MeshStandardMaterial({ color: 0xC0CA33, roughness: 0.4 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFAFAFA, roughness: 0.5 });

      const limeGroup = new THREE.Group();
      const peel = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.68, 0.45), rindMat);
      peel.position.y = 0.34;
      limeGroup.add(peel);

      const pith = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.58, 0.05), whiteMat);
      pith.position.set(0, 0.34, 0.24);
      limeGroup.add(pith);

      const pulp = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.06), pulpMat);
      pulp.position.set(0, 0.34, 0.26);
      limeGroup.add(pulp);

      grp.add(limeGroup);
    } else if (id === 'sal') {
      grp.add(this.buildVoxelSaltShaker());
    }

    return grp;
  }

  // Voxel Salt Shaker
  private buildVoxelSaltShaker(): THREE.Group {
    const shaker = new THREE.Group();
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0xE0F7FA,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.75,
    });
    const saltMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.9 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x90A4AE, metalness: 0.9, roughness: 0.2 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.5), glassMat);
    body.position.y = 0.35;
    shaker.add(body);

    const salt = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.48, 0.42), saltMat);
    salt.position.y = 0.26;
    shaker.add(salt);

    const lid = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.18, 0.52), metalMat);
    lid.position.y = 0.78;
    shaker.add(lid);

    return shaker;
  }

  // LOAD THE ACTUAL CUBIC INGREDIENT ONTO CUTTING BOARD
  public setIngredientOnBoard(ingredientId: string | null) {
    this.currentBoardIngredient = ingredientId;
    this.currentSliceStep = 0;
    this.avocadoPitMesh = null;

    while (this.activeFoodGroup.children.length > 0) {
      const child = this.activeFoodGroup.children[0];
      this.activeFoodGroup.remove(child);
    }

    this.saltShakerOverBowl.visible = false;
    // Only hide limeOverBowl when placing another ingredient on the board,
    // so clearing the cutting board does not make the hovering lime disappear
    if (ingredientId !== null) {
      this.limeOverBowl.visible = false;
    }

    if (!ingredientId) return;

    if (ingredientId === 'sal') {
      this.saltShakerOverBowl.visible = true;
      return;
    }

    // Place actual cubic item on board
    if (ingredientId === 'aguacate') {
      // Avocado with dark skin, lime flesh, and removable brown pit!
      const darkGreenMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 });
      const limeFleshMat = new THREE.MeshStandardMaterial({ color: 0x8BC34A, roughness: 0.5 });
      const brownPitMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.4 });

      // Left Half
      const leftHalf = new THREE.Group();
      leftHalf.name = 'part_left';
      const leftSkin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.6), darkGreenMat);
      const leftFlesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.1), limeFleshMat);
      leftFlesh.position.z = 0.31;
      leftHalf.add(leftSkin, leftFlesh);
      leftHalf.position.set(-0.28, 0.28, 0);

      // Right Half
      const rightHalf = new THREE.Group();
      rightHalf.name = 'part_right';
      const rightSkin = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.6), darkGreenMat);
      const rightFlesh = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.68, 0.1), limeFleshMat);
      rightFlesh.position.z = 0.31;
      rightHalf.add(rightSkin, rightFlesh);
      rightHalf.position.set(0.28, 0.28, 0);

      // Pit sitting in center (disappears on Click 1!)
      this.avocadoPitMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.36, 0.28), brownPitMat);
      this.avocadoPitMesh.position.set(0, 0.28, 0.34);

      this.activeFoodGroup.add(leftHalf, rightHalf, this.avocadoPitMesh);
    } else {
      const actualVoxelItem = this.buildDetailedVoxelProduce(ingredientId);
      actualVoxelItem.position.set(0, 0.15, 0);
      actualVoxelItem.scale.set(1.4, 1.4, 1.4);
      this.activeFoodGroup.add(actualVoxelItem);
    }
  }

  // CHOP PROGRESSION: 3 Distinct Clicks Break Apart the Ingredient
  // Click 1: Slices in half (and avocado pit disappears!)
  // Click 2: Quarters
  // Click 3: Dices into spreading cubes
  public triggerChopAnimation(sliceStep: number) {
    this.currentSliceStep = sliceStep;
    this.knifeChopAnim = 1.0;
    this.chefBounceTime = 1.0;

    // LIME SPECIFIC SEQUENCE: Click 1 cuts in half on board
    if (this.currentBoardIngredient === 'limon') {
      if (sliceStep === 1) {
        while (this.activeFoodGroup.children.length > 0) {
          this.activeFoodGroup.remove(this.activeFoodGroup.children[0]);
        }
        const rindMat = new THREE.MeshStandardMaterial({ color: 0x558B2F, roughness: 0.6 });
        const pulpMat = new THREE.MeshStandardMaterial({ color: 0xC0CA33, roughness: 0.4 });

        for (let s = -1; s <= 1; s += 2) {
          const half = new THREE.Group();
          const p = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.48, 0.3), rindMat);
          const f = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.05), pulpMat);
          f.position.z = 0.16;
          half.add(p, f);
          half.position.set(s * 0.5, 0.24, 0);
          half.rotation.y = s * 0.4;
          this.activeFoodGroup.add(half);
        }
      }
      return;
    }

    // ONION, TOMATO, CILANTRO, & AVOCADO:
    // Click 1: Break into 2 cubes (Volume = V/2 each = 0.256, side = 0.635)
    // Click 2: Break into 4 cubes (Volume = V/4 each = 0.128, side = 0.504)
    // Click 3: Break into 7 cubes of varying sizes (2 large, 3 medium, 2 small)
    // Total Mass Sum (V = 0.512) is strictly conserved across all steps!
    const ingId = this.currentBoardIngredient || 'cebolla';

    // Clear previous cutting board children
    while (this.activeFoodGroup.children.length > 0) {
      this.activeFoodGroup.remove(this.activeFoodGroup.children[0]);
    }
    this.avocadoPitMesh = null; // Pit is removed on first slice

    // Material definitions based on ingredient
    let primaryMat: THREE.Material;
    let secondaryMat: THREE.Material;
    let accentMat: THREE.Material;

    if (ingId === 'cebolla') {
      // Purple onion with small green sprout accent
      primaryMat = new THREE.MeshStandardMaterial({ color: 0x7B1FA2, roughness: 0.4 });
      secondaryMat = new THREE.MeshStandardMaterial({ color: 0x8E24AA, roughness: 0.4 });
      accentMat = new THREE.MeshStandardMaterial({ color: 0x43A047, roughness: 0.5 }); // green sprout
    } else if (ingId === 'tomate') {
      // Red tomato with green stem accent
      primaryMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F, roughness: 0.35 });
      secondaryMat = new THREE.MeshStandardMaterial({ color: 0xC62828, roughness: 0.35 });
      accentMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.5 }); // green calyx
    } else if (ingId === 'cilantro') {
      // Broccoli-like cilantro with stems & florets
      primaryMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.7 });
      secondaryMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.6 });
      accentMat = new THREE.MeshStandardMaterial({ color: 0x4CAF50, roughness: 0.7 }); // bright leaflet
    } else {
      // Aguacate: lime flesh and dark peel
      primaryMat = new THREE.MeshStandardMaterial({ color: 0x8BC34A, roughness: 0.5 });
      secondaryMat = new THREE.MeshStandardMaterial({ color: 0x7CB342, roughness: 0.5 });
      accentMat = new THREE.MeshStandardMaterial({ color: 0x1B5E20, roughness: 0.8 }); // skin
    }

    if (sliceStep === 1) {
      // CLICK 1: 2 CUBES (Total Volume = 2 * 0.635^3 = 0.512)
      const s1 = 0.635;
      const cube1 = new THREE.Mesh(new THREE.BoxGeometry(s1, s1, s1), primaryMat);
      cube1.position.set(-0.38, s1 / 2, 0);
      cube1.rotation.y = -0.15;
      cube1.castShadow = !this.isSoftwareGl;

      const cube2 = new THREE.Mesh(new THREE.BoxGeometry(s1, s1, s1), secondaryMat);
      cube2.position.set(0.38, s1 / 2, 0);
      cube2.rotation.y = 0.15;
      cube2.castShadow = !this.isSoftwareGl;

      // Small accent on one cube (sprout/stem/skin)
      const cap = new THREE.Mesh(new THREE.BoxGeometry(s1 * 0.35, 0.1, s1 * 0.35), accentMat);
      cap.position.set(0, s1 / 2 + 0.05, 0);
      cube1.add(cap);

      this.activeFoodGroup.add(cube1, cube2);
    } else if (sliceStep === 2) {
      // CLICK 2: 4 CUBES (Total Volume = 4 * 0.504^3 = 0.512)
      const s2 = 0.504;
      const positions = [
        [-0.34, s2 / 2, -0.34, primaryMat, -0.1],
        [0.34, s2 / 2, -0.34, secondaryMat, 0.12],
        [-0.34, s2 / 2, 0.34, secondaryMat, 0.18],
        [0.34, s2 / 2, 0.34, primaryMat, -0.14],
      ];

      positions.forEach(([x, y, z, mat, rotY], idx) => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(s2, s2, s2), mat as THREE.Material);
        cube.position.set(x as number, y as number, z as number);
        cube.rotation.y = rotY as number;
        cube.castShadow = !this.isSoftwareGl;

        if (idx === 0) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(s2 * 0.35, 0.08, s2 * 0.35), accentMat);
          cap.position.set(0, s2 / 2 + 0.04, 0);
          cube.add(cap);
        }
        this.activeFoodGroup.add(cube);
      });
    } else if (sliceStep >= 3) {
      // CLICK 3: 7 CUBES OF VARYING SIZES
      // 2 Large cubes (s=0.479, vol=0.110 each -> 0.220)
      // 3 Medium cubes (s=0.402, vol=0.065 each -> 0.195)
      // 2 Small cubes (s=0.365, vol=0.0485 each -> 0.097)
      // Total Volume = 0.220 + 0.195 + 0.097 = 0.512 = SAME TOTAL MASS!
      const cubeConfigs = [
        // 2 Large cubes
        { s: 0.479, x: -0.58, z: -0.28, rot: 0.25, mat: primaryMat },
        { s: 0.479, x: 0.54, z: 0.24, rot: -0.3, mat: secondaryMat },
        // 3 Medium cubes
        { s: 0.402, x: -0.06, z: 0.38, rot: 0.4, mat: primaryMat },
        { s: 0.402, x: -0.42, z: 0.32, rot: -0.2, mat: secondaryMat },
        { s: 0.402, x: 0.46, z: -0.36, rot: 0.15, mat: primaryMat },
        // 2 Small cubes
        { s: 0.365, x: 0.08, z: -0.34, rot: -0.35, mat: accentMat },
        { s: 0.365, x: -0.04, z: 0.02, rot: 0.2, mat: secondaryMat },
      ];

      cubeConfigs.forEach(({ s, x, z, rot, mat }, idx) => {
        const cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), mat);
        cube.position.set(x, s / 2, z);
        cube.rotation.y = rot;
        cube.castShadow = !this.isSoftwareGl;

        if (idx === 0) {
          const cap = new THREE.Mesh(new THREE.BoxGeometry(s * 0.3, 0.06, s * 0.3), accentMat);
          cap.position.set(0, s / 2 + 0.03, 0);
          cube.add(cap);
        }
        this.activeFoodGroup.add(cube);
      });
    }
  }

  // LIME SQUEEZE OVER MOLCAJETE (Clicks 2 & 3)
  // Bouncy squash & squish compression
  public triggerLimeSqueeze(clickCount: number) {
    // Clear cutting board active food so lemon is ONLY over the molcajete
    while (this.activeFoodGroup.children.length > 0) {
      this.activeFoodGroup.remove(this.activeFoodGroup.children[0]);
    }

    this.limeOverBowl.visible = true;
    this.limeSquashAnim = 1.0;
    this.limeJuiceParticles.visible = true;

    // Reset drop positions
    this.limeJuiceParticles.children.forEach((d) => {
      d.position.y = -Math.random() * 0.3;
      d.position.x = (Math.random() - 0.5) * 0.4;
      d.position.z = (Math.random() - 0.5) * 0.4;
    });

    // Add juice droplets to molcajete
    this.addLimeJuiceToMolcajete();

    if (clickCount >= 3) {
      // Lime halves disappear after 3rd click!
      setTimeout(() => {
        this.limeOverBowl.visible = false;
        this.limeJuiceParticles.visible = false;
      }, 450);
    }
  }

  // Salt Shaking over Molcajete
  public triggerSaltShake(shakeStep: number) {
    this.saltShakeAnim = 1.0;
    this.saltParticlesGroup.visible = true;

    this.saltParticlesGroup.children.forEach((p) => {
      p.position.y = -Math.random() * 0.4;
      p.position.x = (Math.random() - 0.5) * 0.4;
      p.position.z = (Math.random() - 0.5) * 0.4;
    });

    this.addSaltCubesToMolcajete();
  }

  // Add the SPECIFIC CUBIC INGREDIENT into the molcajete as it is added!
  public addIngredientToMolcajete(ingredientId: string, currentStepIndex: number, totalSteps: number) {
    let colorHex = 0x689F38;
    let size = 0.32;
    let count = 5;

    if (ingredientId === 'aguacate') {
      colorHex = 0x7CB342; // Lime green avocado chunks
      size = 0.38;
      count = 6;
    } else if (ingredientId === 'cebolla') {
      colorHex = 0x7B1FA2; // Pure purple onion chunks!
      size = 0.28;
      count = 6;
    } else if (ingredientId === 'tomate') {
      colorHex = 0xD32F2F; // Diced red tomato cubes
      size = 0.32;
      count = 6;
    } else if (ingredientId === 'cilantro') {
      colorHex = 0x2E7D32; // Green floret broccoli flakes
      size = 0.22;
      count = 7;
    } else if (ingredientId === 'sal') {
      colorHex = 0xFFFFFF;
      size = 0.12;
      count = 10;
    }

    const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });

    for (let i = 0; i < count; i++) {
      const chunk = new THREE.Mesh(new THREE.BoxGeometry(size, size, size), mat);
      chunk.position.set(
        (Math.random() - 0.5) * 1.5,
        (currentStepIndex * 0.08) + (Math.random() * 0.1),
        (Math.random() - 0.5) * 1.5
      );
      chunk.rotation.set(Math.random() * 0.5, Math.random() * Math.PI, 0);
      this.molcajeteContentsGroup.add(chunk);
    }

    if (this.guacamoleFillMesh) {
      const ratio = (currentStepIndex + 1) / totalSteps;
      const s = 0.3 + ratio * 0.65;
      this.guacamoleFillMesh.scale.set(s, s * 0.85, s);
    }
  }

  private addLimeJuiceToMolcajete() {
    const juiceMat = new THREE.MeshStandardMaterial({ color: 0xCDDC39, roughness: 0.3 });
    for (let i = 0; i < 4; i++) {
      const dot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.08, 0.18), juiceMat);
      dot.position.set((Math.random() - 0.5) * 1.4, 0.42 + Math.random() * 0.08, (Math.random() - 0.5) * 1.4);
      this.molcajeteContentsGroup.add(dot);
    }
  }

  private addSaltCubesToMolcajete() {
    const saltMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });
    for (let i = 0; i < 8; i++) {
      const dot = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), saltMat);
      dot.position.set((Math.random() - 0.5) * 1.4, 0.48 + Math.random() * 0.08, (Math.random() - 0.5) * 1.4);
      this.molcajeteContentsGroup.add(dot);
    }
  }

  // Trigger Pestle Mashing in Molcajete (3 Mashes Blends Everything!)
  public triggerMashAnimation(mashCount: number) {
    this.pestleMashAnim = 1.0;

    // Blend chunks down into the guacamole
    this.molcajeteContentsGroup.children.forEach((chunk) => {
      chunk.scale.multiplyScalar(0.72);
      chunk.position.y -= 0.04;
    });

    if (this.guacamoleFillMesh) {
      const targetScale = Math.min(1.0, 0.6 + mashCount * 0.15);
      this.guacamoleFillMesh.scale.set(targetScale, targetScale, targetScale);
    }

    if (mashCount >= 3) {
      // Turn into smooth creamy finished guacamole!
      if (this.guacamoleFillMesh) {
        (this.guacamoleFillMesh.material as THREE.MeshStandardMaterial).color.setHex(0x7CB342);
        this.guacamoleFillMesh.scale.set(1.05, 1.05, 1.05);
      }
    }
  }

  // Celebration Fountain Confetti
  private buildCelebrationAssets() {
    // High-visibility colorful voxel confetti cubes
    this.confettiGroup = new THREE.Group();
    this.confettiGroup.visible = false;
    const confettiColors = [0xFF1744, 0x00E676, 0xFFEA00, 0x2979FF, 0xF50057, 0x76FF03, 0xFF6D00];
    for (let i = 0; i < 80; i++) {
      const p = new THREE.Mesh(
        new THREE.BoxGeometry(0.32, 0.32, 0.32),
        new THREE.MeshBasicMaterial({ color: confettiColors[i % confettiColors.length] })
      );
      p.position.set((Math.random() - 0.5) * 8.5, 3.0 + Math.random() * 5.5, (Math.random() - 0.5) * 6.5);
      this.confettiGroup.add(p);
    }
    this.scene.add(this.confettiGroup);
  }

  // Trigger Victory: Molcajete turns to Guacamole, Confetti bursts, Chef jumps with smiling squint eyes!
  public triggerVictory() {
    this.isVictory = true;
    this.chefExcitedJump = true;
    this.confettiGroup.visible = true;
    this.saltShakerOverBowl.visible = false;
    this.limeOverBowl.visible = false;

    // Remove raw chunky cubes so smooth green guacamole is 100% visible!
    while (this.molcajeteContentsGroup.children.length > 0) {
      this.molcajeteContentsGroup.remove(this.molcajeteContentsGroup.children[0]);
    }

    // Rich smooth creamy guacamole filling
    if (this.guacamoleFillMesh) {
      (this.guacamoleFillMesh.material as THREE.MeshStandardMaterial).color.setHex(0x7CB342);
      this.guacamoleFillMesh.scale.set(1.15, 1.15, 1.15);
    }

    // Chef eyes squint into smiling happy slits (^ ^)
    if (this.leftEyeMesh && this.rightEyeMesh) {
      this.leftEyeMesh.scale.set(1.5, 0.22, 1.0);
      this.leftEyeMesh.rotation.z = -0.28; // smiling angle ^
      this.rightEyeMesh.scale.set(1.5, 0.22, 1.0);
      this.rightEyeMesh.rotation.z = 0.28; // smiling angle ^
    }

    // Position confetti bursting around table
    this.confettiGroup.children.forEach((c) => {
      c.position.set((Math.random() - 0.5) * 8.5, 3.5 + Math.random() * 5, (Math.random() - 0.5) * 6.5);
    });
  }

  public resetScene() {
    this.isVictory = false;
    this.chefExcitedJump = false;
    this.confettiGroup.visible = false;
    this.saltShakerOverBowl.visible = false;
    this.limeOverBowl.visible = false;
    this.setIngredientOnBoard(null);

    // Reset Chef eyes to normal open cubes
    if (this.leftEyeMesh && this.rightEyeMesh) {
      this.leftEyeMesh.scale.set(1.0, 1.0, 1.0);
      this.rightEyeMesh.scale.set(1.0, 1.0, 1.0);
      this.leftEyeMesh.rotation.z = 0;
      this.rightEyeMesh.rotation.z = 0;
    }

    while (this.molcajeteContentsGroup.children.length > 0) {
      this.molcajeteContentsGroup.remove(this.molcajeteContentsGroup.children[0]);
    }
    if (this.guacamoleFillMesh) {
      (this.guacamoleFillMesh.material as THREE.MeshStandardMaterial).color.setHex(0x689F38);
      this.guacamoleFillMesh.scale.set(0.1, 0.1, 0.1);
    }
  }

  // Pointer interaction
  private onPointerDown = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObjects(this.interactiveMeshes, true);
    if (intersects.length > 0) {
      const hit = intersects[0].object as any;
      if (hit.interactiveType === 'ingredient' && hit.ingredientId) {
        this.callbacks.onIngredientClick(hit.ingredientId);
      } else if (hit.interactiveType === 'cutting_board') {
        this.callbacks.onCuttingBoardClick();
      } else if (hit.interactiveType === 'molcajete') {
        this.callbacks.onMolcajeteClick();
      }
    }
  };

  private onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    const aspect = width / height;
    const d = 8.6;

    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  };

  // Main Render Loop
  private tick = () => {
    const delta = Math.min(this.clock.getDelta(), 0.1);
    const elapsed = this.clock.getElapsedTime();

    // 1. Chef Animation
    if (this.chefGroup) {
      if (this.chefExcitedJump) {
        // Joyful excited jumping up and down on victory!
        const jumpY = Math.abs(Math.sin(elapsed * 8)) * 0.45;
        this.chefGroup.position.y = 2.2 + jumpY;
        this.chefGroup.rotation.z = Math.sin(elapsed * 8) * 0.1;
      } else {
        // Idle gentle breathing bounce
        const idleY = Math.sin(elapsed * 2.8) * 0.04;
        this.chefGroup.position.y = 2.2 + idleY;
        if (this.chefBounceTime > 0) {
          this.chefBounceTime -= delta * 4;
          this.chefGroup.rotation.z = Math.sin(this.chefBounceTime * Math.PI) * 0.1;
        } else {
          this.chefGroup.rotation.z = 0;
        }
      }
    }

    // 2. Knife chopping animation (arcs from left resting position over board center and chops)
    if (this.knifeChopAnim > 0) {
      this.knifeChopAnim -= delta * 5;
      const progress = Math.sin(this.knifeChopAnim * Math.PI);
      this.knifeGroup.position.x = -2.3 + progress * 2.3;
      this.knifeGroup.position.y = 0.18 + progress * 0.55;
      this.knifeGroup.rotation.x = -progress * 0.7;
      this.knifeGroup.rotation.z = -progress * 0.25;
    } else {
      this.knifeGroup.position.set(-2.3, 0.18, 0.0);
      this.knifeGroup.rotation.set(0, 0, 0);
    }

    // 3. Salt shaking animation & hovering
    if (this.saltShakeAnim > 0) {
      this.saltShakeAnim -= delta * 4;
      const shakeOffset = Math.sin(this.saltShakeAnim * Math.PI * 4) * 0.2;
      this.saltShakerOverBowl.position.y = 4.2 + shakeOffset;

      this.saltParticlesGroup.children.forEach((p) => {
        p.position.y -= delta * 3.5;
        if (p.position.y < -1.8) {
          p.position.y = 0;
        }
      });
    } else {
      if (this.saltParticlesGroup.visible) {
        this.saltParticlesGroup.visible = false;
      }
      if (this.saltShakerOverBowl.visible) {
        // Continuous gentle floating hover while waiting for click
        this.saltShakerOverBowl.position.y = 4.2 + Math.sin(elapsed * 3.2) * 0.08;
      }
    }

    // 4. Lime bouncy squash & squish compression animation & continuous hover over molcajete
    if (this.limeSquashAnim > 0) {
      this.limeSquashAnim -= delta * 3.2;
      // Bouncy squash in Y and stretch in X/Z
      const squish = Math.sin(this.limeSquashAnim * Math.PI);
      this.limeOverBowl.scale.set(1.0 + squish * 0.35, 1.0 - squish * 0.5, 1.0 + squish * 0.35);
      this.limeOverBowl.position.y = 3.8 - squish * 0.15;

      this.limeJuiceParticles.children.forEach((d) => {
        d.position.y -= delta * 3.2;
        if (d.position.y < -1.5) {
          d.position.y = 0;
        }
      });
    } else {
      if (this.limeJuiceParticles.visible) {
        this.limeJuiceParticles.visible = false;
      }
      this.limeOverBowl.scale.set(1.0, 1.0, 1.0);
      if (this.limeOverBowl.visible) {
        // Continuous gentle floating hover over molcajete in steps 2 and 3, exactly like the salt!
        this.limeOverBowl.position.y = 3.8 + Math.sin(elapsed * 3.2) * 0.08;
      }
    }

    // 5. Pestle mashing animation
    if (this.tejoloteGroup && this.pestleMashAnim > 0) {
      this.pestleMashAnim -= delta * 4;
      const mashOffset = Math.sin(this.pestleMashAnim * Math.PI) * 0.4;
      this.tejoloteGroup.position.y = 1.4 - mashOffset;
    } else if (this.tejoloteGroup) {
      this.tejoloteGroup.position.y = 1.4;
    }

    // 6. Victory Fiesta Animation (celebratory falling confetti)
    if (this.isVictory) {
      this.confettiGroup.children.forEach((c) => {
        c.position.y -= delta * 1.6;
        c.rotation.x += delta * 2;
        c.rotation.y += delta * 1.5;
        if (c.position.y < 1.8) {
          c.position.y = 7 + Math.random() * 2;
        }
      });
    }

    this.renderer.render(this.scene, this.camera);
    this.frameId = requestAnimationFrame(this.tick);
  };

  public destroy() {
    cancelAnimationFrame(this.frameId);
    window.removeEventListener('resize', this.onResize);
    this.renderer.domElement.removeEventListener('pointerdown', this.onPointerDown);
    this.renderer.dispose();
    if (this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
