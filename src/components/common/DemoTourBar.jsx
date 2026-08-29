import React, { useState } from 'react';
import { useCivicLens } from '../../context/CivicLensContext';
import { DEMO_STEPS } from '../../data/seededData';

export const DemoTourBar = () => {
  const { currentDemoStep, jumpToDemoStep, resetDemoData } = useCivicLens();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentStepInfo = DEMO_STEPS.find(s => s.step === currentDemoStep) || DEMO_STEPS[0];

  return (
    <div className="fixed bottom-16 lg:bottom-4 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl">
      <div className="bg-surface-container-lowest/95 backdrop-blur-md border border-primary/30 rounded-2xl shadow-modal p-3 transition-all duration-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Step indicator and description */}
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="bg-primary text-white font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm shrink-0">
              <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span>DEMO FLOW {currentDemoStep}/20</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md bg-success-green/15 text-success-green border border-success-green/30 shrink-0">
              Local-safe
            </span>
            <div className="text-left truncate">
              <div className="text-label-md font-bold text-on-surface flex items-center gap-1.5">
                <span>{currentStepInfo.title}</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.2 bg-surface-container text-on-surface-variant rounded">
                  {currentStepInfo.role}
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant truncate hidden sm:block">
                {currentStepInfo.desc}
              </p>
            </div>
          </div>

          {/* Quick Step Buttons & Tools */}
          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => jumpToDemoStep(Math.max(1, currentDemoStep - 1))}
              disabled={currentDemoStep <= 1}
              className="px-2.5 py-1 text-label-sm font-semibold rounded-lg border border-border-subtle hover:bg-surface-variant disabled:opacity-40 text-on-surface flex items-center gap-1"
              title="Previous Step"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span className="hidden sm:inline">Prev</span>
            </button>

            <button
              onClick={() => jumpToDemoStep(Math.min(20, currentDemoStep + 1))}
              disabled={currentDemoStep >= 20}
              className="px-3 py-1 text-label-sm font-semibold rounded-lg bg-primary-container hover:bg-primary text-white flex items-center gap-1 shadow-sm"
              title="Next Demo Step"
            >
              <span>Next Step</span>
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-on-surface-variant hover:text-primary rounded-lg border border-border-subtle hover:bg-surface-variant"
              title="Toggle Step Selector"
            >
              <span className="material-symbols-outlined text-sm">
                {isExpanded ? 'expand_more' : 'list'}
              </span>
            </button>

            <button
              onClick={() => resetDemoData()}
              className="px-2.5 py-1 text-label-sm font-medium rounded-lg text-critical-red hover:bg-error-container/40 border border-border-subtle"
              title="Reset this device's demo view without changing shared data"
            >
              Reset view
            </button>
          </div>
        </div>

        {/* Expanded 20-Step Grid Picker for judges */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-border-subtle max-h-56 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-1.5 text-left text-[11px] animate-in fade-in duration-150">
            {DEMO_STEPS.map((s) => (
              <button
                key={s.step}
                onClick={() => {
                  jumpToDemoStep(s.step);
                  setIsExpanded(false);
                }}
                className={`p-2 rounded-lg border text-left transition-all ${
                  currentDemoStep === s.step
                    ? 'bg-primary-fixed border-primary text-on-primary-fixed font-bold'
                    : 'border-border-subtle bg-surface hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <div className="font-semibold truncate">{s.title}</div>
                <div className="text-[9px] opacity-75 capitalize">{s.role}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
