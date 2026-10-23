import React, { useState } from 'react';
import { GameSpec, PresetGame } from './types/gameDesign';
import { PRESET_GAMES } from './data/presets';
import { InterviewWizard } from './components/InterviewWizard';
import { DesignSpecView } from './components/DesignSpecView';
import { PromptView } from './components/PromptView';
import { AiAssistantModal } from './components/AiAssistantModal';
import { GuacamoleGame } from './components/GuacamoleGame';
import {
  Gamepad2,
  ListChecks,
  FileText,
  Terminal,
  Sparkles,
  RotateCcw,
  BookOpen,
  Play,
  ChevronDown,
} from 'lucide-react';

const DEFAULT_SPEC: GameSpec = {
  ...PRESET_GAMES[0].spec as GameSpec,
  title: PRESET_GAMES[0].spec.title || 'Tiny Chef: Guacamole en Español',
};

export default function App() {
  const [currentTab, setCurrentTab] = useState<'game' | 'interview' | 'spec' | 'prompt'>('game');
  const [spec, setSpec] = useState<GameSpec>(DEFAULT_SPEC);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalContextPrompt, setAiModalContextPrompt] = useState<string>('');
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const handleLoadPreset = (preset: PresetGame) => {
    setSpec({
      ...DEFAULT_SPEC,
      ...(preset.spec as GameSpec),
    });
    setShowPresetsMenu(false);
  };

  const handleResetBlank = () => {
    setSpec({
      title: 'My Custom Game',
      theme: 'Business Strategy Simulation',
      inspiration: '',
      playerGoal: 'Maximize profit and reach the milestone target without going bankrupt',
      coreAction: 'Click to allocate resources, fulfill customer orders, and upgrade capacity',
      secondaryActions: ['Adjust pricing', 'Restock inventory', 'Hire helpers'],
      loopAction: 'Serve incoming customer or fulfill order ticket',
      loopResponse: 'Visual register chime and coin popup',
      loopReward: 'Earn cash to fund shop automation upgrades',
      loopNext: 'Higher volume rush arrives testing your new capacity',
      winCondition: 'Reach target milestone revenue before timer ends',
      lossCondition: 'Run out of cash or accumulate 3 customer strikes',
      sessionEndType: 'timer',
      progressionType: 'Customer volume accelerates 15% every 30 seconds with upgrade shop',
      unlocksAndUpgrades: 'Speed boosters, automation assistants, and premium inventory',
      visualStyle: 'Clean modern minimalist with vibrant accents and rounded cards',
      moodDescription: 'Fast-paced, satisfying, and strategic',
      colorPaletteIdea: 'Vibrant indigo, emerald green, and amber gold',
      perspective: 'Fixed 2D interactive stage with status dashboard',
      controlScheme: 'One-click mouse / touchscreen tap',
      successFeedback: ['Cha-ching cash chime', 'Floating score numbers', 'Confetti milestone particles'],
      failureFeedback: ['Buzzer strike sound', 'Red warning card flash'],
      soundStyle: 'Crisp Web Audio synthesized register chimes and victory fanfare',
      uiElements: ['Cash Balance', 'Round Timer', '3 Lives / Strikes', 'Goal Progress Bar'],
      targetAudience: 'Casual web players and business students looking for a 2-3 minute break',
      sessionDuration: '2 to 3 minutes',
      platform: 'Desktop and Mobile web browsers',
      optionalFeatures: ['Local high score board', 'Randomized customer orders'],
      techStackPreference: 'React with HTML5 Canvas / SVG and native Web Audio API sound synthesis',
      parameters: {
        gameSpeed: 5,
        spawnRateSeconds: 3.0,
        sessionLengthSeconds: 120,
        playerLives: 3,
        targetWinScore: 5000,
        difficultyRamp: 'moderate',
        soundEffectsEnabled: true,
      },
    });
    setShowPresetsMenu(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                  Game Design & Prompt Studio
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 rounded-md">
                  Assistant Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Turning rough business & gameplay ideas into AI Studio build prompts
              </p>
            </div>
          </div>

          {/* Phase Switcher Tabs */}
          <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setCurrentTab('game')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'game'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Jugar (3D Game)</span>
            </button>
            <button
              onClick={() => setCurrentTab('spec')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'spec'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Design Spec</span>
              <span className="sm:hidden">Spec</span>
            </button>
            <button
              onClick={() => setCurrentTab('prompt')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'prompt'
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-4 h-4" />
              <span className="hidden sm:inline">Build Prompt</span>
              <span className="sm:hidden">Prompt</span>
            </button>
            <button
              onClick={() => setCurrentTab('interview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                currentTab === 'interview'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ListChecks className="w-4 h-4" />
              <span className="hidden md:inline">Interview Wizard</span>
            </button>
          </nav>

          {/* Action Tools: Presets & AI Assistant */}
          <div className="flex items-center gap-2">
            {/* Presets Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPresetsMenu(!showPresetsMenu)}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 shadow-2xs transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden lg:inline">Templates</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showPresetsMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Business Student Templates
                  </div>
                  <div className="space-y-1">
                    {PRESET_GAMES.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleLoadPreset(p)}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-slate-800 text-xs transition-colors group"
                      >
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {p.pitch}
                        </div>
                      </button>
                    ))}
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1 pt-1">
                      <button
                        type="button"
                        onClick={handleResetBlank}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Start Fresh with Clean Draft</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* AI Co-Pilot Button */}
            <button
              onClick={() => {
                setAiModalContextPrompt('');
                setIsAiModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Co-Pilot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {currentTab === 'game' && (
          <GuacamoleGame onOpenDesignStudio={() => setCurrentTab('spec')} />
        )}

        {currentTab === 'interview' && (
          <InterviewWizard
            spec={spec}
            onChange={setSpec}
            onFinishToSpec={() => setCurrentTab('spec')}
            onFinishToPrompt={() => setCurrentTab('prompt')}
            onOpenAiAssist={(questionPrompt) => {
              setAiModalContextPrompt(questionPrompt);
              setIsAiModalOpen(true);
            }}
          />
        )}

        {currentTab === 'spec' && (
          <DesignSpecView
            spec={spec}
            onProceedToPrompt={() => setCurrentTab('prompt')}
            onReturnToInterview={() => setCurrentTab('interview')}
          />
        )}

        {currentTab === 'prompt' && (
          <PromptView
            spec={spec}
            onChangeParameters={(params) => setSpec({ ...spec, parameters: params })}
            onReturnToSpec={() => setCurrentTab('spec')}
            onReturnToInterview={() => setCurrentTab('interview')}
          />
        )}
      </main>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        spec={spec}
        initialPrompt={aiModalContextPrompt}
      />
    </div>
  );
}
