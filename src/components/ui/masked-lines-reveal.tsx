"use client";

import React, { forwardRef } from "react";

export interface MaskedLinesRevealProps {
  lines: string[];
  className?: string;
  maskClassName?: string;
  lineClassName?: string;
  setLineRef?: (el: HTMLDivElement | null, idx: number) => void;
}

/**
 * MaskedLinesReveal
 * Industry-standard UI component for masked line-by-line editorial reveal.
 * Wraps each line in an overflow-hidden mask container, enabling smooth
 * slide-up and rotation-unfolding transforms without overflowing container boundaries.
 */
export const MaskedLinesReveal = forwardRef<HTMLDivElement, MaskedLinesRevealProps>(
  (
    {
      lines,
      className = "",
      maskClassName = "",
      lineClassName = "",
      setLineRef,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={`flex flex-col gap-1 overflow-visible ${className}`}
      >
        {lines.map((lineText, idx) => (
          <div
            key={idx}
            className={`overflow-hidden block py-0.5 ${maskClassName}`}
          >
            <div
              ref={(el) => setLineRef?.(el, idx)}
              className={`desc-line block will-change-transform origin-top-left ${lineClassName}`}
            >
              {lineText}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

MaskedLinesReveal.displayName = "MaskedLinesReveal";
