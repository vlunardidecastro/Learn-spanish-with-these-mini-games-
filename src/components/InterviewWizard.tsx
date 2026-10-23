import React, { useState } from 'react';
import { GameSpec, QuestionStep } from '../types/gameDesign';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Check,
  CheckCircle2,
  FileText,
  Terminal,
  Bookmark,
  Lightbulb,
} from 'lucide-react';

interface InterviewWizardProps {
  spec: GameSpec;
  onChange: (updatedSpec: GameSpec) => void;
  onFinishToSpec: () => void;
  onFinishToPrompt: () => void;
  onOpenAiAssist: (contextQuestion: string) => void;
}

export const InterviewWizard: React.FC<InterviewWizardProps> = ({
  spec,
  onChange,
  onFinishToSpec,
  onFinishToPrompt,
  onOpenAiAssist,
}) => {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const currentQ: QuestionStep = INTERVIEW_QUESTIONS[currentStepIdx];
  const progressPercent = Math.round(((currentStepIdx + 1) / INTERVIEW_QUESTIONS.length) * 100);

  // Helper to read current value from spec
  const getCurrentValue = (): string => {
    switch (currentQ.field) {
      case 'theme':
        return spec.theme;
      case 'playerGoal':
        return spec.playerGoal;
      case 'coreAction':
        return spec.coreAction;
      case 'loopAction':
        return spec.loopAction;
      case 'winCondition':
        return spec.winCondition;
      case 'progressionType':
        return spec.progressionType;
      case 'visualStyle':
        return spec.visualStyle;
      case 'perspective':
        return spec.perspective;
      case 'controlScheme':
        return spec.controlScheme;
      case 'soundStyle':
        return spec.soundStyle;
      case 'uiElements':
        return spec.uiElements.join(', ');
      case 'sessionDuration':
        return spec.sessionDuration;
      case 'platform':
        return spec.platform;
      case 'optionalFeatures':
        return spec.optionalFeatures.join(', ');
      case 'techStackPreference':
        return spec.techStackPreference;
      default:
        return '';
    }
  };

  const handleSelectOption = (val: string) => {
    const nextSpec = { ...spec };
    switch (currentQ.field) {
      case 'theme':
        nextSpec.theme = val;
        break;
      case 'playerGoal':
        nextSpec.playerGoal = val;
        break;
      case 'coreAction':
        nextSpec.coreAction = val;
        break;
      case 'loopAction':
        nextSpec.loopAction = val;
        break;
      case 'winCondition':
        nextSpec.winCondition = val;
        break;
      case 'progressionType':
        nextSpec.progressionType = val;
        break;
      case 'visualStyle':
        nextSpec.visualStyle = val;
        break;
      case 'perspective':
        nextSpec.perspective = val;
        break;
      case 'controlScheme':
        nextSpec.controlScheme = val;
        break;
      case 'soundStyle':
        nextSpec.soundStyle = val;
        break;
      case 'uiElements':
        nextSpec.uiElements = [val];
        break;
      case 'sessionDuration':
        nextSpec.sessionDuration = val;
        break;
      case 'platform':
        nextSpec.platform = val;
        break;
      case 'optionalFeatures':
        nextSpec.optionalFeatures = [val];
        break;
      case 'techStackPreference':
        nextSpec.techStackPreference = val;
        break;
    }
    onChange(nextSpec);
  };

  const handleCustomTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    handleSelectOption(e.target.value);
  };

  const isSelected = (val: string) => {
    const current = getCurrentValue();
    return current === val || current.toLowerCase().includes(val.toLowerCase().slice(0, 20));
  };

  const handleNext = () => {
    if (currentStepIdx < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onFinishToSpec();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress & Stepper Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold tracking-wide">
              Interview Phase • Area {currentQ.areaNumber} of 15
            </span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {currentQ.areaTitle}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">
              {progressPercent}% Complete
            </span>
            <button
              onClick={() => onOpenAiAssist(`I'm currently at Question ${currentQ.areaNumber}: "${currentQ.question}". How should a business student approach this?`)}
              className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 hover:bg-purple-100 rounded-lg transition-colors border border-purple-200 dark:border-purple-800"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Ask AI Co-Pilot
            </button>
          </div>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick jump tabs (scrollable) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-3 mt-2 no-scrollbar">
          {INTERVIEW_QUESTIONS.map((q, idx) => {
            const isDone = idx < currentStepIdx;
            const isCurr = idx === currentStepIdx;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentStepIdx(idx)}
                className={`text-[11px] font-medium px-2.5 py-1 rounded-md shrink-0 transition-colors flex items-center gap-1 ${
                  isCurr
                    ? 'bg-indigo-600 text-white font-bold'
                    : isDone
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {isDone && <Check className="w-3 h-3 text-emerald-500" />}
                <span>{q.areaNumber}. {q.areaTitle.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-tight mb-2">
            {currentQ.question}
          </h2>

          {/* Plain English Explanation Box */}
          <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-sm flex items-start gap-3">
            <Lightbulb className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-0.5">
                Plain English Explanation (No Game-Dev Jargon Required)
              </span>
              <p className="leading-relaxed text-slate-700 dark:text-slate-300">
                {currentQ.plainEnglishExplanation}
              </p>
            </div>
          </div>
        </div>

        {/* 2-4 Simple Options */}
        <div className="space-y-3">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Choose One Option (or type your own below):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {currentQ.options.map((opt, i) => {
              const active = isSelected(opt.value);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSelectOption(opt.value)}
                  className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between relative group ${
                    active
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500 shadow-xs'
                      : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        {opt.label}
                      </span>
                      {active ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 shrink-0 group-hover:border-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {opt.description}
                    </p>
                  </div>

                  {opt.isRecommended && (
                    <div className="mt-3">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        {opt.recommendedBadge || 'Recommended'}
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Write-In Input */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Or Customize / Refine Your Answer:
          </label>
          <input
            type="text"
            value={getCurrentValue()}
            onChange={handleCustomTextChange}
            placeholder={currentQ.customPlaceholder || 'Type your customized answer here...'}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
          />
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentStepIdx === 0}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              currentStepIdx === 0
                ? 'opacity-40 cursor-not-allowed text-slate-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Area
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {currentStepIdx === INTERVIEW_QUESTIONS.length - 1 ? (
              <>
                <button
                  type="button"
                  onClick={onFinishToSpec}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <FileText className="w-4 h-4" />
                  View Design Spec (Phase 2)
                </button>
                <button
                  type="button"
                  onClick={onFinishToPrompt}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <Terminal className="w-4 h-4" />
                  Generate Prompt (Phase 3)
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <span>Save & Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
