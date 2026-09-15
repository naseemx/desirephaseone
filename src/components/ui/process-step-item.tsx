"use client";

import React, { forwardRef } from "react";

export interface ProcessStepData {
  id: string;
  title: string;
  description: string;
}

export interface ProcessStepItemProps {
  step: ProcessStepData;
  isActive?: boolean;
  onClick?: () => void;
}

/**
 * ProcessStepItem
 * Industry-standard UI component for the process track items.
 * Optimized for mobile GPUs with zero per-character layer allocations.
 */
export const ProcessStepItem = forwardRef<HTMLDivElement, ProcessStepItemProps>(
  ({ step, isActive = false, onClick }, ref) => {
    const titleWords = step.title.split(" ");
    const descWords = step.description.split(" ");

    return (
      <div
        ref={ref}
        onClick={onClick}
        data-active={isActive ? "true" : "false"}
        className={`process-step-item flex flex-col max-w-sm sm:max-w-md cursor-pointer select-none will-change-transform group transition-opacity duration-300 ${
          isActive ? "is-active" : ""
        }`}
      >
        {/* Step Number & Glowing Spark Indicator */}
        <div className="flex items-center gap-2 mb-1.5 sm:mb-3">
          <span className="step-num font-red-hat-display text-sm sm:text-base md:text-lg font-medium transition-colors duration-300 text-zinc-500 group-[.is-active]:text-white group-[.is-active]:font-semibold group-[[data-active=true]]:text-white group-[[data-active=true]]:font-semibold">
            {step.id}
          </span>

          {/* Active Sparkle Indicator with Brand Cyan Glow */}
          <span className="step-sparkle text-[var(--brand-cyan)] text-xs drop-shadow-[0_0_8px_var(--brand-cyan)] transition-opacity duration-300 opacity-0 group-[.is-active]:opacity-100 group-[[data-active=true]]:opacity-100">
            ✦
          </span>
        </div>

        {/* Step Title in Instrument Serif */}
        <h3 className="step-title font-instrument-serif text-2xl sm:text-3xl md:text-4xl font-normal leading-[1.15] mb-2 sm:mb-3 transition-all duration-300 text-zinc-400 group-[.is-active]:text-white group-[.is-active]:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] group-[[data-active=true]]:text-white group-[[data-active=true]]:drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]">
          {titleWords.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word}
              {wordIdx < titleWords.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </h3>

        {/* Step Description in Red Hat Display */}
        <p className="step-desc font-red-hat-display text-xs sm:text-sm md:text-base font-normal leading-relaxed transition-colors duration-300 text-zinc-500 group-[.is-active]:text-zinc-200 group-[[data-active=true]]:text-zinc-200">
          {descWords.map((word, wordIdx) => (
            <span key={wordIdx} className="inline-block whitespace-nowrap">
              {word}
              {wordIdx < descWords.length - 1 && <span>&nbsp;</span>}
            </span>
          ))}
        </p>
      </div>
    );
  }
);

ProcessStepItem.displayName = "ProcessStepItem";

export default ProcessStepItem;
