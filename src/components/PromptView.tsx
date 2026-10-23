import React, { useState } from 'react';
import { GameSpec } from '../types/gameDesign';
import { generateImplementationPrompt } from '../utils/promptGenerator';
import {
  Copy,
  Check,
  Download,
  Sliders,
  Terminal,
  FileCheck2,
  Sparkles,
  ArrowLeft,
  Volume2,
  Clock,
  Heart,
  Zap,
  Target,
} from 'lucide-react';

interface PromptViewProps {
  spec: GameSpec;
  onChangeParameters: (params: GameSpec['parameters']) => void;
  onReturnToSpec: () => void;
  onReturnToInterview: () => void;
}

export const PromptView: React.FC<PromptViewProps> = ({
  spec,
  onChangeParameters,
  onReturnToSpec,
  onReturnToInterview,
}) => {
  const [copied, setCopied] = useState(false);
  const promptText = generateImplementationPrompt(spec);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const blob = new Blob([promptText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(spec.title || 'game').toLowerCase().replace(/\s+/g, '-')}-prompt.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateParam = (key: keyof GameSpec['parameters'], val: any) => {
    onChangeParameters({
      ...spec.parameters,
      [key]: val,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-200 border border-white/10">
            Phase 3: Prompt Engineering Output
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-xl text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download .md
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-900 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied Prompt!' : 'Copy Implementation Prompt'}
            </button>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
          Production-Ready AI Studio Build Prompt
        </h1>
        <p className="text-emerald-100 text-sm max-w-2xl leading-relaxed">
          Copy and paste this prompt directly into Google AI Studio Build mode or an AI coding agent to generate your playable web game in minutes.
        </p>
      </div>

      {/* Interactive Parameter Sandbox ("Easy Things You Can Change") */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Interactive Parameter Sandbox
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                "Easy Things You Can Change" (Live Tuner)
              </h3>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Updating sliders updates the prompt below in real-time
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          As a business student, you don't need to rewrite code to adjust the game balance. These 6 key levers can be tuned before or after generation:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {/* Game Speed */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                1. Game Speed
              </span>
              <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 rounded font-mono">
                {spec.parameters.gameSpeed}/10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={spec.parameters.gameSpeed}
              onChange={(e) => updateParam('gameSpeed', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
            <p className="text-[11px] text-slate-500">Controls entity pace & reaction window</p>
          </div>

          {/* Spawn Rate */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                2. Spawn Interval
              </span>
              <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 rounded font-mono">
                {spec.parameters.spawnRateSeconds.toFixed(1)}s
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={spec.parameters.spawnRateSeconds}
              onChange={(e) => updateParam('spawnRateSeconds', parseFloat(e.target.value))}
              className="w-full accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
            <p className="text-[11px] text-slate-500">How often new orders/hazards arrive</p>
          </div>

          {/* Session Length */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-500" />
                3. Session Length
              </span>
              <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 rounded font-mono">
                {spec.parameters.sessionLengthSeconds}s
              </span>
            </div>
            <input
              type="range"
              min="30"
              max="300"
              step="15"
              value={spec.parameters.sessionLengthSeconds}
              onChange={(e) => updateParam('sessionLengthSeconds', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
            <p className="text-[11px] text-slate-500">Total duration before round finishes</p>
          </div>

          {/* Player Lives */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                4. Starting Lives
              </span>
              <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 rounded font-mono">
                {spec.parameters.playerLives} {spec.parameters.playerLives === 1 ? 'Life' : 'Lives'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={spec.parameters.playerLives}
              onChange={(e) => updateParam('playerLives', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
            <p className="text-[11px] text-slate-500">Allowed mistakes before Game Over</p>
          </div>

          {/* Target Win Score */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                5. Target Win Score
              </span>
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 rounded font-mono">
                {spec.parameters.targetWinScore.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="20000"
              step="500"
              value={spec.parameters.targetWinScore}
              onChange={(e) => updateParam('targetWinScore', parseInt(e.target.value, 10))}
              className="w-full accent-indigo-600 h-1.5 rounded-lg cursor-pointer bg-slate-200 dark:bg-slate-700"
            />
            <p className="text-[11px] text-slate-500">Revenue or score needed for Victory</p>
          </div>

          {/* Difficulty Curve */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                6. Difficulty Curve
              </span>
              <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 rounded font-mono capitalize">
                {spec.parameters.difficultyRamp}
              </span>
            </div>
            <div className="flex gap-1.5 pt-1">
              {(['gentle', 'moderate', 'intense'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => updateParam('difficultyRamp', mode)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded capitalize transition-all ${
                    spec.parameters.difficultyRamp === mode
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">Rate of speed acceleration over time</p>
          </div>
        </div>
      </div>

      {/* Complete Implementation Prompt Display */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500/80" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
            </div>
            <span className="text-xs font-mono text-slate-400 ml-2">
              implementation-prompt.md
            </span>
          </div>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy Full Prompt'}
          </button>
        </div>

        <pre className="p-6 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[600px] overflow-y-auto selection:bg-indigo-600 selection:text-white">
          {promptText}
        </pre>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onReturnToSpec}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Design Spec</span>
        </button>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copied Prompt to Clipboard!' : 'Copy & Build in AI Studio'}</span>
        </button>
      </div>
    </div>
  );
};
