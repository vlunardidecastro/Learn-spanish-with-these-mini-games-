import React from 'react';
import { ArrowRight, RotateCw, Sparkles, CheckCircle2 } from 'lucide-react';

interface CoreLoopVisualizerProps {
  loopAction: string;
  loopResponse: string;
  loopReward: string;
  loopNext: string;
  onEdit?: (step: 'action' | 'response' | 'reward' | 'next', val: string) => void;
}

export const CoreLoopVisualizer: React.FC<CoreLoopVisualizerProps> = ({
  loopAction,
  loopResponse,
  loopReward,
  loopNext,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Player Action',
      subtitle: 'What you click or do',
      text: loopAction || 'Click to brew coffee or serve waiting student',
      color: 'from-blue-500 to-indigo-600',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    },
    {
      num: 2,
      title: 'Game Response',
      subtitle: 'Instant sensory feedback',
      text: loopResponse || 'Customer smiles, cash sound plays, tip pop-up',
      color: 'from-indigo-500 to-purple-600',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    },
    {
      num: 3,
      title: 'Reward / Penalty',
      subtitle: 'The payoff or consequence',
      text: loopReward || '+$6.50 added to cash bank, build upgrade capital',
      color: 'from-amber-500 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    },
    {
      num: 4,
      title: 'Next Action (Loop)',
      subtitle: 'The new challenge',
      text: loopNext || 'Crowd grows larger, buy espresso machine upgrade',
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            Section B: Core Gameplay Engine
          </span>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            The 15-Second Core Loop
            <Sparkles className="w-5 h-5 text-amber-500" />
          </h3>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
          <RotateCw className="w-3.5 h-3.5 animate-spin text-indigo-500" />
          <span>Repeating Habit Loop</span>
        </div>
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
        Great games succeed when this simple 4-step sequence feels rewarding every time the player completes it.
      </p>

      {/* 4-Step Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className="flex flex-col justify-between bg-slate-50 dark:bg-slate-800/80 rounded-xl p-4 border border-slate-200/80 dark:border-slate-700 hover:border-indigo-400 transition-all shadow-xs relative group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${step.badgeBg}`}>
                  Step {step.num}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {step.subtitle}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1.5">
                {step.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                "{step.text}"
              </p>
            </div>

            {idx < steps.length - 1 ? (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-6 h-6 rounded-full items-center justify-center text-slate-400 shadow-xs">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            ) : (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-300 dark:border-indigo-700 w-6 h-6 rounded-full items-center justify-center text-indigo-600 shadow-xs">
                <RotateCw className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40 flex items-start gap-2.5">
        <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
        <p className="text-xs text-indigo-900 dark:text-indigo-200">
          <span className="font-semibold">Business Student Insight:</span> This loop mirrors a classic operational flywheel. Fast input leads to immediate feedback, building cash reserves to invest in operational capacity!
        </p>
      </div>
    </div>
  );
};
