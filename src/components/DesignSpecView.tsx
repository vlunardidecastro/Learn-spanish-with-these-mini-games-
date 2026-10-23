import React from 'react';
import { GameSpec } from '../types/gameDesign';
import { generateDesignDoc } from '../utils/promptGenerator';
import { CoreLoopVisualizer } from './CoreLoopVisualizer';
import {
  FileText,
  Sparkles,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Copy,
  Check,
  Download,
} from 'lucide-react';

interface DesignSpecViewProps {
  spec: GameSpec;
  onProceedToPrompt: () => void;
  onReturnToInterview: () => void;
}

export const DesignSpecView: React.FC<DesignSpecViewProps> = ({
  spec,
  onProceedToPrompt,
  onReturnToInterview,
}) => {
  const [copied, setCopied] = React.useState(false);
  const designDoc = generateDesignDoc(spec);

  const handleCopyMarkdown = () => {
    const md = `# Game Design Specification: ${spec.title || 'Untitled Game'}

## A. One-Sentence Game Concept
${designDoc.conceptSentence}

## B. The Core Loop
${designDoc.coreLoopText}

## C. Game Design Specification
- **Player Goal:** ${designDoc.specTable.playerGoal}
- **Mechanics:** ${designDoc.specTable.mechanics}
- **Rules:** ${designDoc.specTable.rules}
- **Win / Loss:** ${designDoc.specTable.winLoss}
- **Difficulty / Progression:** ${designDoc.specTable.difficultyProgression}
- **Visual Style:** ${designDoc.specTable.visualStyle}
- **Controls:** ${designDoc.specTable.controls}
- **UI (HUD):** ${designDoc.specTable.ui}
- **Feedback & Game Feel:** ${designDoc.specTable.feedback}
- **Platform:** ${designDoc.specTable.platform}

## D. Complications & Recommended Simplifications
${designDoc.simplifications.map(s => `### ${s.complexArea}
- **Risk:** ${s.whyTooComplex}
- **Recommended Simplification:** ${s.recommendedSimplification}`).join('\n\n')}

## E. Technical Recommendation (Plain English)
**${designDoc.techStackRecommendation.stackName}**
${designDoc.techStackRecommendation.plainEnglishReason}
${designDoc.techStackRecommendation.whyNoExternalAssets}
`;
    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-2xl p-6 sm:p-8 shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
            <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-indigo-200 border border-white/10">
              Phase 2: Game Design Specification
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white rounded-xl text-xs font-semibold transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied Markdown' : 'Copy Spec (.md)'}
              </button>
              <button
                onClick={onProceedToPrompt}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
              >
                <span>Proceed to Prompt</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            {spec.title || 'Game Design Specification'}
          </h1>
          <p className="text-indigo-200 text-sm max-w-2xl leading-relaxed">
            Here is your synthesized design blueprint translated from business and player concepts into game architecture.
          </p>
        </div>
      </div>

      {/* Section A: One-Sentence Game Concept */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Section A: One-Sentence Game Concept
        </div>
        <blockquote className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border-l-4 border-indigo-600 text-slate-800 dark:text-slate-100 text-base sm:text-lg font-medium leading-relaxed italic">
          "{designDoc.conceptSentence}"
        </blockquote>
      </div>

      {/* Section B: Core Loop */}
      <CoreLoopVisualizer
        loopAction={spec.loopAction}
        loopResponse={spec.loopResponse}
        loopReward={spec.loopReward}
        loopNext={spec.loopNext}
      />

      {/* Section C: Short Game Design Specification */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Section C: Core Parameters
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              10-Point Game Design Specification
            </h3>
          </div>
          <button
            onClick={onReturnToInterview}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
          >
            Edit in Interview →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {[
            { label: '1. Player Goal', value: designDoc.specTable.playerGoal },
            { label: '2. Mechanics', value: designDoc.specTable.mechanics },
            { label: '3. Rules', value: designDoc.specTable.rules },
            { label: '4. Win/Loss Conditions', value: designDoc.specTable.winLoss },
            { label: '5. Difficulty & Progression', value: designDoc.specTable.difficultyProgression },
            { label: '6. Visual Style', value: designDoc.specTable.visualStyle },
            { label: '7. Controls', value: designDoc.specTable.controls },
            { label: '8. UI (HUD)', value: designDoc.specTable.ui },
            { label: '9. Feedback & Juice', value: designDoc.specTable.feedback },
            { label: '10. Platform', value: designDoc.specTable.platform },
          ].map((item, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
              <div className="sm:w-1/3 font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 shrink-0">
                {item.label}
              </div>
              <div className="sm:w-2/3 text-sm text-slate-800 dark:text-slate-200 font-medium">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section D: Scope & Simplifications */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Section D: Scope & Anti-Complication Analysis
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Identified Complications & Recommended Simplifications
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          Business students understand MVP (Minimum Viable Product). We eliminate friction so your game runs flawlessly in minutes rather than getting stuck in development hell.
        </p>

        <div className="grid grid-cols-1 gap-4">
          {designDoc.simplifications.map((simp, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-2"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  {simp.complexArea}
                </h4>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded">
                  Too Complex for V1
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Why to avoid:</span> {simp.whyTooComplex}
              </p>
              <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 rounded-lg border border-emerald-200/80 dark:border-emerald-900/40 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Recommended Simplification:</span>{' '}
                  {simp.recommendedSimplification}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section E: Technical Stack Recommendation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Section E: Plain English Tech Stack
            </span>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Recommended Tech Stack (Explained for Business Students)
            </h3>
          </div>
        </div>

        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/40 space-y-2">
          <div className="text-sm font-bold text-indigo-900 dark:text-indigo-200">
            {designDoc.techStackRecommendation.stackName}
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {designDoc.techStackRecommendation.plainEnglishReason}
          </p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
            <span className="font-bold text-slate-800 dark:text-slate-200">Zero Asset Dependency:</span> {designDoc.techStackRecommendation.whyNoExternalAssets}
          </p>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={onReturnToInterview}
          className="text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900"
        >
          ← Back to Interview
        </button>
        <button
          onClick={onProceedToPrompt}
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
        >
          <span>Generate Implementation Prompt (Phase 3)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
