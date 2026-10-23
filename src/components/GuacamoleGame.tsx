import React, { useEffect, useRef, useState, useCallback } from 'react';
import { KitchenScene } from '../three/KitchenScene';
import { INGREDIENTS, RECIPE_STEPS } from '../data/recipeData';
import { RecipeStep } from '../types/game';
import { soundController } from '../audio/soundEffects';
import {
  RotateCcw,
  Sparkles,
  Play,
  X,
} from 'lucide-react';

interface GuacamoleGameProps {
  onOpenDesignStudio: () => void;
}

export const GuacamoleGame: React.FC<GuacamoleGameProps> = ({ onOpenDesignStudio }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<KitchenScene | null>(null);

  // Gameplay State
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [subAction, setSubAction] = useState<'pick' | 'slice' | 'lime_squeeze' | 'shake_salt' | 'mash' | 'done'>('pick');
  const [sliceProgress, setSliceProgress] = useState<number>(0);
  const [limeClickProgress, setLimeClickProgress] = useState<number>(0);
  const [saltShakeProgress, setSaltShakeProgress] = useState<number>(0);
  const [mashProgress, setMashProgress] = useState<number>(0);
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState<boolean>(false);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  // Stale-closure elimination ref + click debounce lock
  const stateRef = useRef({
    currentStepIdx: 0,
    subAction: 'pick' as 'pick' | 'slice' | 'lime_squeeze' | 'shake_salt' | 'mash' | 'done',
    sliceProgress: 0,
    limeClickProgress: 0,
    saltShakeProgress: 0,
    mashProgress: 0,
    isTransitioning: false,
    hasStarted: false,
  });

  useEffect(() => {
    stateRef.current.currentStepIdx = currentStepIdx;
    stateRef.current.subAction = subAction;
    stateRef.current.sliceProgress = sliceProgress;
    stateRef.current.limeClickProgress = limeClickProgress;
    stateRef.current.saltShakeProgress = saltShakeProgress;
    stateRef.current.mashProgress = mashProgress;
    stateRef.current.hasStarted = hasStarted;
  }, [currentStepIdx, subAction, sliceProgress, limeClickProgress, saltShakeProgress, mashProgress, hasStarted]);

  const currentStep: RecipeStep = RECIPE_STEPS[currentStepIdx] || RECIPE_STEPS[0];
  const targetIngredient = INGREDIENTS[currentStep?.ingredientId] || INGREDIENTS['aguacate'];

  // Start the Game when player clicks the "¡JUGAR!" button
  const handleStartGame = () => {
    setHasStarted(true);
    stateRef.current.hasStarted = true;
    soundController.playStepSuccessChime();
    // Play first Spanish instruction automatically!
    soundController.speakSpanish('¡Bienvenido chef! Corta el aguacate en cubos.');
  };

  // Handle selecting an ingredient from crate or bottom dock
  const handleIngredientSelect = useCallback((selectedId: string) => {
    const s = stateRef.current;
    if (!s.hasStarted) return;
    if (s.isTransitioning) return;
    if (s.subAction !== 'pick') return;

    const step = RECIPE_STEPS[s.currentStepIdx];
    if (!step) return;

    const selected = INGREDIENTS[selectedId];
    const target = INGREDIENTS[step.ingredientId];
    if (!selected || !target) return;

    if (selectedId === step.ingredientId) {
      const correctMsg = `¡Correcto! ${selected.fullSpanish}`;
      setFeedbackMessage(correctMsg);
      soundController.speakSpanish(`¡${selected.fullSpanish}! ${target.actionSpanish} ${target.fullSpanish}.`);
      soundController.playStepSuccessChime();

      if (selectedId === 'sal') {
        sceneRef.current?.setIngredientOnBoard('sal');
        s.subAction = 'shake_salt';
        s.saltShakeProgress = 0;
        setSubAction('shake_salt');
        setSaltShakeProgress(0);
      } else if (selectedId === 'limon') {
        sceneRef.current?.setIngredientOnBoard('limon');
        s.subAction = 'slice';
        s.sliceProgress = 0;
        s.limeClickProgress = 0;
        setSubAction('slice');
        setSliceProgress(0);
        setLimeClickProgress(0);
      } else {
        sceneRef.current?.setIngredientOnBoard(selectedId);
        s.subAction = 'slice';
        s.sliceProgress = 0;
        setSubAction('slice');
        setSliceProgress(0);
      }

      setLearnedWords((prev) => (prev.includes(selected.fullSpanish) ? prev : [...prev, selected.fullSpanish]));
    } else {
      const wrongMsg = `¡Ese es ${selected.fullSpanish}! Busca ${target.fullSpanish}.`;
      setFeedbackMessage(wrongMsg);
      soundController.speakSpanish(wrongMsg);
      soundController.playGentleWrongSound();
    }
  }, []);

  // Handle cutting board clicks (slicing & lime sequence)
  const handleCuttingBoardClick = useCallback(() => {
    const s = stateRef.current;
    if (!s.hasStarted) return;
    if (s.isTransitioning) return;
    if (s.subAction !== 'slice') return;

    const step = RECIPE_STEPS[s.currentStepIdx];
    if (!step) return;
    const target = INGREDIENTS[step.ingredientId];
    if (!target) return;

    // LIME SPECIFIC SEQUENCE: Click 1 = slice on board, then hovers over molcajete for steps 2 & 3
    if (target.id === 'limon') {
      const nextSlice = s.sliceProgress + 1;
      s.sliceProgress = nextSlice;
      setSliceProgress(nextSlice);
      soundController.playChopSound();
      sceneRef.current?.triggerChopAnimation(1);

      // Immediately clear cutting board and hover lime halves over molcajete!
      setTimeout(() => {
        sceneRef.current?.showLimeOverBowl(true);
      }, 350);

      s.subAction = 'lime_squeeze';
      s.limeClickProgress = 1;
      setSubAction('lime_squeeze');
      setLimeClickProgress(1);
      soundController.speakSpanish('¡Exprime el limón sobre el molcajete!');
      return;
    }

    // ALL OTHER VEGETABLES: 3 CLICKS REQUIRED (Click 1: half, Click 2: quarter, Click 3: dice)
    const nextProg = s.sliceProgress + 1;
    if (nextProg > 3) return;

    s.sliceProgress = nextProg;
    setSliceProgress(nextProg);
    soundController.playChopSound();
    sceneRef.current?.triggerChopAnimation(nextProg);

    if (nextProg === 3) {
      s.isTransitioning = true;
      setTimeout(() => {
        soundController.playThudSound();
        sceneRef.current?.setIngredientOnBoard(null);
        sceneRef.current?.addIngredientToMolcajete(target.id, s.currentStepIdx, RECIPE_STEPS.length);

        if (s.currentStepIdx < RECIPE_STEPS.length - 1) {
          const nextIdx = s.currentStepIdx + 1;
          s.currentStepIdx = nextIdx;
          s.subAction = 'pick';
          s.sliceProgress = 0;
          s.isTransitioning = false;

          setCurrentStepIdx(nextIdx);
          setSubAction('pick');
          setSliceProgress(0);

          const nextStep = RECIPE_STEPS[nextIdx];
          const nextTarget = INGREDIENTS[nextStep.ingredientId];
          const nextMsg = `¡Muy bien! Ahora, busca ${nextTarget.fullSpanish}.`;
          setFeedbackMessage(nextMsg);
          // Automatically speak next instruction in Spanish!
          soundController.speakSpanish(nextStep.instructionAudioText);
        }
      }, 550);
    }
  }, []);

  // Handle Lime Squeezing over Molcajete (Clicks 2 & 3)
  const handleLimeSqueezeClick = useCallback(() => {
    const s = stateRef.current;
    if (!s.hasStarted) return;
    if (s.isTransitioning) return;
    if (s.subAction !== 'lime_squeeze') return;

    const nextClick = s.limeClickProgress + 1;
    if (nextClick > 3) return;

    s.limeClickProgress = nextClick;
    setLimeClickProgress(nextClick);

    soundController.playLimeSound();
    // Bouncy squeeze while lime continues hovering over molcajete
    sceneRef.current?.triggerLimeSqueeze(nextClick);
    if (nextClick === 2) {
      soundController.speakSpanish('¡Exprime el jugo de limón!');
    }

    if (nextClick === 3) {
      s.isTransitioning = true;
      setTimeout(() => {
        sceneRef.current?.showLimeOverBowl(false);
        const nextIdx = s.currentStepIdx + 1;
        s.currentStepIdx = nextIdx;
        s.subAction = 'pick';
        s.sliceProgress = 0;
        s.isTransitioning = false;

        setCurrentStepIdx(nextIdx);
        setSubAction('pick');
        setSliceProgress(0);

        const nextStep = RECIPE_STEPS[nextIdx];
        const nextTarget = INGREDIENTS[nextStep.ingredientId];
        setFeedbackMessage(`¡Jugo de limón listo! Ahora, ${nextTarget.fullSpanish}.`);
        // Automatically speak next instruction!
        soundController.speakSpanish(`¡Jugo listo! ${nextStep.instructionAudioText}`);
      }, 600);
    }
  }, []);

  // Handle shaking salt over molcajete
  const handleSaltShake = useCallback(() => {
    const s = stateRef.current;
    if (!s.hasStarted) return;
    if (s.isTransitioning) return;
    if (s.subAction !== 'shake_salt') return;

    const nextShake = s.saltShakeProgress + 1;
    if (nextShake > 2) return;

    s.saltShakeProgress = nextShake;
    setSaltShakeProgress(nextShake);

    soundController.playSaltSound();
    sceneRef.current?.triggerSaltShake(nextShake);
    if (nextShake === 1) {
      soundController.speakSpanish('¡Agita la sal!');
    }

    if (nextShake >= 2) {
      s.isTransitioning = true;
      setTimeout(() => {
        sceneRef.current?.setIngredientOnBoard(null);
        sceneRef.current?.addIngredientToMolcajete('sal', s.currentStepIdx, RECIPE_STEPS.length);

        s.subAction = 'mash';
        s.mashProgress = 0;
        s.isTransitioning = false;
        setSubAction('mash');
        setMashProgress(0);
        setFeedbackMessage('¡La sal está lista! Ahora machaca con el tejolote.');
        // Automatically speak mashing instruction!
        soundController.speakSpanish('¡Machaca con el tejolote!');
      }, 500);
    }
  }, []);

  // Handle clicking molcajete (mashing)
  const handleMolcajeteClick = useCallback(() => {
    const s = stateRef.current;
    if (!s.hasStarted) return;
    if (s.subAction === 'shake_salt') {
      handleSaltShake();
      return;
    }
    if (s.subAction === 'lime_squeeze') {
      handleLimeSqueezeClick();
      return;
    }
    if (s.subAction !== 'mash') return;
    if (s.isTransitioning) return;

    const nextMash = s.mashProgress + 1;
    if (nextMash > 3) return;

    s.mashProgress = nextMash;
    setMashProgress(nextMash);

    soundController.playMashSound();
    sceneRef.current?.triggerMashAnimation(nextMash);

    if (nextMash === 1) {
      soundController.speakSpanish('¡Machaca!');
    } else if (nextMash === 2) {
      soundController.speakSpanish('¡Casi listo, machaca una vez más!');
    } else if (nextMash >= 3) {
      s.subAction = 'done';
      setSubAction('done');

      // 1. Molcajete turns into smooth rich guacamole
      // 2. Confetti bursts in 3D
      // 3. Tortilla chips dip into the bowl
      // 4. Chef jumps up and down in excitement with smiling squint eyes (^ ^)
      sceneRef.current?.triggerVictory();
      soundController.playVictoryMariachiFanfare();
      soundController.speakSpanish('¡Felicidades! ¡El guacamole está delicioso!');
      setFeedbackMessage('');
    }
  }, [handleSaltShake, handleLimeSqueezeClick]);

  // Scene initialization
  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new KitchenScene(mountRef.current, {
      onIngredientClick: (id) => handleIngredientSelect(id),
      onCuttingBoardClick: () => {
        if (stateRef.current.subAction === 'lime_squeeze') {
          handleLimeSqueezeClick();
        } else {
          handleCuttingBoardClick();
        }
      },
      onMolcajeteClick: () => handleMolcajeteClick(),
    });
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, [handleIngredientSelect, handleCuttingBoardClick, handleLimeSqueezeClick, handleMolcajeteClick]);

  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.updateCallbacks({
        onIngredientClick: handleIngredientSelect,
        onCuttingBoardClick: () => {
          if (stateRef.current.subAction === 'lime_squeeze') {
            handleLimeSqueezeClick();
          } else {
            handleCuttingBoardClick();
          }
        },
        onMolcajeteClick: handleMolcajeteClick,
      });
    }
  }, [handleIngredientSelect, handleCuttingBoardClick, handleLimeSqueezeClick, handleMolcajeteClick]);

  const handleRestart = () => {
    stateRef.current.currentStepIdx = 0;
    stateRef.current.subAction = 'pick';
    stateRef.current.sliceProgress = 0;
    stateRef.current.limeClickProgress = 0;
    stateRef.current.saltShakeProgress = 0;
    stateRef.current.mashProgress = 0;
    stateRef.current.isTransitioning = false;

    setCurrentStepIdx(0);
    setSubAction('pick');
    setSliceProgress(0);
    setLimeClickProgress(0);
    setSaltShakeProgress(0);
    setMashProgress(0);
    setFeedbackMessage('');
    setIsVocabDrawerOpen(false);
    sceneRef.current?.resetScene();
    soundController.speakSpanish(RECIPE_STEPS[0].instructionAudioText);
  };

  return (
    <div className="relative w-full h-[88vh] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl bg-[#F4EBE1] select-none flex flex-col">
      {/* 3D Scene Viewport (100% Unobstructed Center View) */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-pointer" />

      {/* START SCREEN WITH PROMINENT "¡JUGAR!" BUTTON */}
      {!hasStarted && (
        <div className="absolute inset-0 z-40 bg-slate-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200">
            <span className="text-4xl block mb-2">🥑</span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Juego de Cocina y Español
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1 mb-6">
              Tiny Chef: Guacamole
            </h1>

            {/* THE JUGAR BUTTON */}
            <button
              onClick={handleStartGame}
              className="w-full py-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 border-2 border-white/30"
            >
              <Play className="w-6 h-6 fill-current" />
              <span>¡JUGAR! 🥑 (Play Game)</span>
            </button>
          </div>
        </div>
      )}

      {/* TOP SLIM COMPACT HUD: Pinned to the top edge, leaves chef and table 100% visible */}
      {hasStarted && (
        <div className="relative z-20 px-4 py-2.5 pointer-events-none flex items-center justify-between gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800 shadow-2xs">
          {/* Left: Spanish instruction with English subtitle & picture icon */}
          <div className="pointer-events-auto flex items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                  {subAction === 'done' ? '¡RECETA COMPLETADA! 🥑' : `Paso ${currentStepIdx + 1}/6 • ${targetIngredient?.icon} ${targetIngredient?.fullSpanish}`}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-tight">
                {subAction === 'pick' && currentStep?.instructionSpanish}
                {subAction === 'slice' && (
                  `¡${targetIngredient.actionSpanish} ${targetIngredient.fullSpanish}! (Corte ${sliceProgress}/3)`
                )}
                {subAction === 'lime_squeeze' && (
                  `¡Exprime el limón sobre el molcajete! (Exprimir ${limeClickProgress}/3) 🍋`
                )}
                {subAction === 'shake_salt' && (
                  `¡Agita la sal sobre el molcajete! (${saltShakeProgress}/2) 🧂`
                )}
                {subAction === 'mash' && (
                  `¡Machaca con el tejolote! (${mashProgress}/3) 🥣`
                )}
                {subAction === 'done' && (
                  '¡FIESTA! ¡Guacamole Perfecto y Delicioso! 🎉'
                )}
              </h2>
              {subAction === 'pick' && (
                <p className="text-[11px] text-slate-500 font-medium">
                  English: {currentStep?.instructionEnglish}
                </p>
              )}
            </div>
          </div>

          {/* Right Tools: Restart */}
          <div className="pointer-events-auto flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-lg transition-colors"
              title="Reiniciar receta"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ERGONOMIC BOTTOM DOCK: All controls placed at bottom center, leaving the 3D scene 100% open */}
      {hasStarted && (
        <div className="mt-auto relative z-20 p-4 pointer-events-none flex flex-col items-center gap-2">
          {/* Action Prompt Button directly above crate dock */}
          {subAction === 'slice' && (
            <button
              onClick={handleCuttingBoardClick}
              className="pointer-events-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 border border-emerald-400"
            >
              <span>
                🔪 {sliceProgress === 0 && 'Corte 1: Cortar por la mitad'}
                {sliceProgress === 1 && 'Corte 2: Cortar en cuartos'}
                {sliceProgress === 2 && 'Corte 3: Picar en cubos'}
                {sliceProgress >= 3 && '¡Picado listo!'}
              </span>
            </button>
          )}

          {subAction === 'lime_squeeze' && (
            <button
              onClick={handleLimeSqueezeClick}
              className="pointer-events-auto px-5 py-2.5 bg-lime-600 hover:bg-lime-500 text-white rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 border border-lime-400 animate-pulse"
            >
              <span>
                🍋 {limeClickProgress === 1 && 'Haz clic para exprimir el limón (Paso 2/3)'}
                {limeClickProgress === 2 && 'Exprimir una vez más (Paso 3/3)'}
                {limeClickProgress >= 3 && '¡Jugo listo!'}
              </span>
            </button>
          )}

          {subAction === 'shake_salt' && (
            <button
              onClick={handleSaltShake}
              className="pointer-events-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 border border-blue-400 animate-pulse"
            >
              <span>🧂 Agitar la sal sobre el molcajete ({saltShakeProgress}/2)</span>
            </button>
          )}

          {subAction === 'mash' && (
            <button
              onClick={handleMolcajeteClick}
              className="pointer-events-auto px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-black text-sm shadow-xl active:scale-95 transition-all flex items-center gap-2 border border-amber-400 animate-bounce"
            >
              <span>🥣 Machacar en el molcajete ({mashProgress}/3)</span>
            </button>
          )}

          {/* Victory Controls Dock: NO POPUP OBSCURING THE VIEW! */}
          {subAction === 'done' && (
            <div className="pointer-events-auto flex items-center gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400">
              <button
                onClick={handleRestart}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-black shadow-md transition-all flex items-center gap-2"
              >
                <span>🥑 Cocinar de Nuevo</span>
              </button>
              <button
                onClick={() => setIsVocabDrawerOpen(!isVocabDrawerOpen)}
                className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 rounded-xl text-xs font-bold transition-all"
              >
                {isVocabDrawerOpen ? 'Cerrar Vocabulario' : '📖 Ver Vocabulario'}
              </button>
              <button
                onClick={onOpenDesignStudio}
                className="px-4 py-2.5 text-slate-600 hover:text-slate-900 text-xs font-bold"
              >
                Prompt Studio →
              </button>
            </div>
          )}

          {/* Crate Selection Dock (during ingredient picking) */}
          {subAction !== 'done' && (
            <div className="pointer-events-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl p-2.5 shadow-xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto max-w-full no-scrollbar">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 hidden sm:inline">
                Cajas:
              </span>

              {Object.values(INGREDIENTS).map((ing) => {
                const isTarget = subAction === 'pick' && ing.id === currentStep?.ingredientId;
                return (
                  <button
                    key={ing.id}
                    onClick={() => handleIngredientSelect(ing.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shrink-0 border ${
                      isTarget
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-400 scale-105'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <span className="text-base">{ing.icon}</span>
                    <span>{ing.fullSpanish}</span>
                  </button>
                );
              })}

              <div className="border-l border-slate-200 dark:border-slate-700 pl-2 ml-1">
                <button
                  onClick={onOpenDesignStudio}
                  className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-colors shrink-0"
                >
                  Prompt Studio →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* OPTIONAL COMPACT VOCABULARY DRAWER (Never covers the chef or 3D scene) */}
      {isVocabDrawerOpen && (
        <div className="absolute right-4 bottom-24 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-xs w-full animate-in slide-in-from-right duration-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 dark:text-white">
              Vocabulario en Español
            </h4>
            <button
              onClick={() => setIsVocabDrawerOpen(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {Object.values(INGREDIENTS).map((item) => (
              <div
                key={item.id}
                className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-semibold flex items-center justify-between border border-slate-200 dark:border-slate-700"
              >
                <span>{item.icon} {item.fullSpanish}</span>
                <span className="text-[10px] text-emerald-600 font-bold uppercase">es</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
