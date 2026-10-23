import { GameSpec } from '../types/gameDesign';

export interface DesignDocOutput {
  conceptSentence: string;
  coreLoopText: string;
  specTable: {
    playerGoal: string;
    mechanics: string;
    rules: string;
    winLoss: string;
    difficultyProgression: string;
    visualStyle: string;
    controls: string;
    ui: string;
    feedback: string;
    platform: string;
  };
  simplifications: {
    complexArea: string;
    whyTooComplex: string;
    recommendedSimplification: string;
  }[];
  techStackRecommendation: {
    stackName: string;
    plainEnglishReason: string;
    whyNoExternalAssets: string;
  };
}

export function generateDesignDoc(spec: GameSpec): DesignDocOutput {
  const conceptSentence = `${spec.title || 'The Game'} is a ${spec.visualStyle.toLowerCase().includes('retro') ? 'retro arcade' : 'sleek, accessible'} ${spec.theme || 'business game'} where the player must ${spec.playerGoal.toLowerCase().replace(/^win by\s*/, '')} through ${spec.coreAction.toLowerCase()}.`;

  const coreLoopText = `1. Player Action: ${spec.loopAction || 'Player interacts with game target or customer'}
2. Game Feedback: ${spec.loopResponse || 'Immediate visual animation and audio confirmation'}
3. Reward / Consequence: ${spec.loopReward || 'Earn points/capital or incur penalty strikes'}
4. Next Action (Repeat): ${spec.loopNext || 'Face an increased challenge or purchase an efficiency upgrade'}`;

  // Analyze potential complexities based on user selections
  const simplifications = [];

  if (spec.optionalFeatures.some(f => f.toLowerCase().includes('multiplayer'))) {
    simplifications.push({
      complexArea: 'Real-Time Multiplayer Server & Matchmaking',
      whyTooComplex: 'Requires real-time WebSockets, handling lag, network drops, and server hosting which slows down the first prototype.',
      recommendedSimplification: 'Start with Local High Scores or "Ghost AI" rivals on screen. Add real-time networking later once core gameplay is proven fun.',
    });
  }

  if (spec.perspective.toLowerCase().includes('3d') || spec.perspective.toLowerCase().includes('isometric')) {
    simplifications.push({
      complexArea: '3D Mesh Geometry & Complex Camera Coordinates',
      whyTooComplex: '3D models, textures, and depth collision detection require large external assets and heavy debugging.',
      recommendedSimplification: 'Use a crisp 2D stage or top-down Canvas view. It renders at a guaranteed 60 FPS, looks super sharp, and loads in milliseconds.',
    });
  }

  if (spec.controlScheme.toLowerCase().includes('drag and drop') && spec.platform.toLowerCase().includes('mobile')) {
    simplifications.push({
      complexArea: 'Simultaneous Multi-Touch Drag Precision',
      whyTooComplex: 'Dragging small items across mobile screens can cause touch scrolling glitches and finger occlusion.',
      recommendedSimplification: 'Use intuitive "Tap to Select -> Tap Destination" or large button hitboxes.',
    });
  }

  // Default helpful business student simplification
  if (simplifications.length === 0) {
    simplifications.push({
      complexArea: 'Excessive Inventory Menus & Sub-Screens',
      whyTooComplex: 'Having multi-layer nested menus pulls the player out of the flow of the game.',
      recommendedSimplification: 'Keep all vital actions (play area, score, 3 quick upgrade buttons) visible on a single unified screen without modal interruptions.',
    });
    simplifications.push({
      complexArea: 'External Audio/Image Asset Loading',
      whyTooComplex: 'External sound/image links can break (404 errors) or cause slow load times.',
      recommendedSimplification: 'Synthesize audio natively via the browser\'s built-in Web Audio API (instant chimes/beeps with 0 download) and render graphics with SVG/HTML5 Canvas.',
    });
  }

  return {
    conceptSentence,
    coreLoopText,
    specTable: {
      playerGoal: spec.playerGoal,
      mechanics: `${spec.coreAction}. Secondary: ${spec.secondaryActions.length ? spec.secondaryActions.join(', ') : 'None'}`,
      rules: `Win: ${spec.winCondition}. Loss: ${spec.lossCondition}.`,
      winLoss: `Win: ${spec.winCondition} | Loss: ${spec.lossCondition}`,
      difficultyProgression: `${spec.progressionType}. Unlocks: ${spec.unlocksAndUpgrades || 'Speed and efficiency boosters'}`,
      visualStyle: `${spec.visualStyle} (${spec.moodDescription})`,
      controls: spec.controlScheme,
      ui: spec.uiElements.join(', '),
      feedback: `${spec.soundStyle}. Success: ${spec.successFeedback.join(', ')}. Failure: ${spec.failureFeedback.join(', ')}`,
      platform: spec.platform,
    },
    simplifications,
    techStackRecommendation: {
      stackName: 'React 19 + HTML5 Canvas & Web Audio API (Single-Page App)',
      plainEnglishReason: 'React keeps track of your game state (cash, score, lives, upgrades) smoothly, while HTML5 Canvas draws smooth animations at 60 frames per second. Web Audio API generates audio tones directly with math—meaning your game never fails to load an audio file.',
      whyNoExternalAssets: '100% self-contained code. The entire game is runnable in Google AI Studio or any browser with zero external image/audio dependencies.',
    },
  };
}

export function generateImplementationPrompt(spec: GameSpec): string {
  const p = spec.parameters;

  return `# Complete Implementation Prompt for AI Coding Agent

Please build a complete, fully functional, polished web game based on the following detailed specification:

## 1. Objective
Build an engaging, responsive web game titled "${spec.title || 'Game Prototype'}" in React and TypeScript.
Core Concept: ${spec.playerGoal}
Theme & Setting: ${spec.theme || 'Business and management simulation'}

## 2. Player Experience
- Target Audience: ${spec.targetAudience || 'Casual players and business students'}
- Session Length: Approximately ${p.sessionLengthSeconds} seconds (${spec.sessionDuration || '2-3 minutes'})
- Mood & Feel: ${spec.moodDescription || 'Satisfying, fast-paced, and intuitive'}
- Core Loop: ${spec.loopAction} -> ${spec.loopResponse} -> ${spec.loopReward} -> ${spec.loopNext}

## 3. Core Gameplay
- Primary Action: ${spec.coreAction}
- Secondary Mechanics: ${spec.secondaryActions.length > 0 ? spec.secondaryActions.join(', ') : 'Upgrades and resource management'}
- Flow: Entities/customers/hazards spawn dynamically on screen; player must react and execute timely decisions to maximize efficiency and score.

## 4. Game Rules
- Win Condition: ${spec.winCondition} (Target Score/Revenue: ${p.targetWinScore.toLocaleString()})
- Loss / Game Over Condition: ${spec.lossCondition} (Starting Lives / Strikes: ${p.playerLives})
- Session Timer: ${p.sessionLengthSeconds} seconds countdown with visual urgency pulse in the last 15 seconds.
- Replayability: Upon Game Over or Victory, display an end-game summary modal with final score, rating, statistics, and a prominent "Play Again" button that cleanly resets all state.

## 5. Progression and Difficulty
- Difficulty Scaling: ${spec.progressionType}
- Ramp Speed: Initial spawn rate is 1 entity every ${p.spawnRateSeconds.toFixed(1)}s; acceleration scales by 10% every 30 seconds.
- Upgrades & Unlocks: ${spec.unlocksAndUpgrades || 'Player can invest earnings in automated helpers or speed boosters'}.

## 6. Visual Style
- Aesthetic: ${spec.visualStyle}
- Color Palette: ${spec.colorPaletteIdea || 'Vibrant modern palette with high contrast and dark or clean light background'}
- Layout: High visual polish, rounded badges, clean card containers, and smooth CSS or Canvas transitions.

## 7. Camera / Layout
- Viewpoint: ${spec.perspective}
- Playfield: Centered responsive game arena with a 16:9 or 4:3 aspect container that adapts cleanly to mobile and desktop screens.
- Zero clutter: Key information is anchored in a fixed Heads-Up Display (HUD) at the top of the container.

## 8. Controls
- Primary Scheme: ${spec.controlScheme}
- Mobile Support: Full touch compatibility (touch taps and swipe gestures mapped identically to mouse clicks).
- Keyboard Shortcuts: Spacebar to pause/resume or activate main action; number keys [1, 2, 3] for quick upgrade purchases.

## 9. UI and Feedback
- Top HUD: Display ${spec.uiElements.join(', ')}.
- Visual Juice / Feedback:
  * Floating score popups (e.g. "+$50" in green floating upward and fading)
  * Confetti particle burst upon achieving milestone or victory
  * Gentle screen-shake or red border pulse on penalty/mistake
  * High-score badge saved to localStorage
- Sound Effects: Synthesize audio natively via Web Audio API (pure code, zero external mp3 files):
  * Crisp coin/cha-ching bell on success
  * Gentle warning click/buzzer on penalty
  * Upbeat victory fanfare on win
  * Mute/Unmute toggle button in UI header

## 10. Technical Requirements
- Single-page application written in React with TypeScript and Tailwind CSS.
- Completely self-contained: Use HTML5 Canvas or Lucide icons / SVG for all graphics. No external image URLs that can fail or break.
- No external audio files: Use native browser AudioContext oscillator nodes for immediate, zero-latency sound effects.
- Clean state machine: Start Screen -> Playing State -> Paused State -> Game Over / Victory Modal.
- Fully responsive on desktop and mobile browsers.

## 11. Testing Requirements
- Verify that clicking/tapping executes the core action immediately with zero lag.
- Verify that the timer counts down correctly and triggers Game Over / Victory when conditions are met.
- Verify that scores accumulate properly and persist high score to localStorage.
- Verify that restarting the game properly resets all timers, entities, score, lives, and upgrades without page reload.
- Verify audio plays crisply after first user gesture (respecting browser autoplay policies) and can be muted.

---

## Easy Things You Can Change
Here are the key parameters in the game code you can modify anytime to customize the feel and difficulty:

1. **GAME_SPEED** (default: ${p.gameSpeed}):
   - Controls entity motion speed or overall clock rate (range: 1 for relaxed to 10 for hyper-fast).
2. **SPAWN_RATE_SECONDS** (default: ${p.spawnRateSeconds.toFixed(1)}s):
   - How often new customers, orders, or obstacles appear on screen (lower = more chaotic).
3. **SESSION_LENGTH_SECONDS** (default: ${p.sessionLengthSeconds}s):
   - Total round duration (e.g. 60s for a lightning blitz, 180s for a strategic coffee break).
4. **PLAYER_LIVES** (default: ${p.playerLives}):
   - Number of mistakes or angry customers allowed before "Bankrupt / Game Over".
5. **TARGET_WIN_SCORE** (default: ${p.targetWinScore}):
   - The revenue or score milestone required to unlock the victory screen.
6. **DIFFICULTY_RAMP** (default: "${p.difficultyRamp}"):
   - How aggressively speed and frequency scale up over time ('gentle', 'moderate', or 'intense').
7. **SOUND_EFFECTS_ENABLED** (default: ${p.soundEffectsEnabled}):
   - Toggle synthesized audio on or off by default.
8. **ACCENT_COLOR_THEME** (default: "Emerald & Amber"):
   - Can easily change Tailwind accent classes (e.g., from \`emerald-500\` to \`indigo-500\` or \`amber-500\`) to match any brand mood.
`;
}
