"use client";

import React, { forwardRef } from "react";

export interface CenterStarDividerProps {
  lineRef?: React.RefObject<HTMLDivElement | null>;
  starRef?: React.RefObject<HTMLDivElement | null>;
  className?: string;
}

/**
 * CenterStarDivider
 * Central vertical hairline divider and glowing 4-point star emblem.
 */
export const CenterStarDivider = forwardRef<
  HTMLDivElement,
  CenterStarDividerProps
>(({ lineRef, starRef, className = "" }, ref) => {
  return (
    <div
      ref={ref}
      className={`absolute top-0 bottom-0 left-8 md:left-1/2 -translate-x-1/2 w-px pointer-events-none z-20 ${className}`}
      aria-hidden="true"
    >
      {/* Continuous Hairline Divider - Shoots up from bottom */}
      <div
        ref={lineRef}
        className="absolute inset-0 w-px bg-gradient-to-b from-white/0 via-white/15 to-white/0 will-change-transform"
      />

      {/* Central 4-Point Star Emblem - Fades in at Viewport Center */}
      <div
        ref={starRef}
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <div className="relative flex items-center justify-center">
          {/* Star Halo & Ambient Glow */}
          <div className="absolute w-14 h-14 rounded-full bg-white/35 blur-lg animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full bg-[var(--brand-cyan)]/25 blur-2xl pointer-events-none" />

          <svg
            className="relative w-9 h-9 sm:w-11 sm:h-11 drop-shadow-[0_0_20px_rgba(255,255,255,0.95)] drop-shadow-[0_0_36px_rgba(0,181,226,0.65)]"
            viewBox="0 0 57 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.2842 -0.000976562C28.2867 0.0402974 29.1893 15.0456 35.3555 21.2119C41.5178 27.3743 56.5082 28.2796 56.5684 28.2832C56.5082 28.2868 41.5178 29.1922 35.3555 35.3545C29.1893 41.5208 28.2867 56.5261 28.2842 56.5674C28.2816 56.5236 27.3786 41.5202 21.2129 35.3545C15.0381 29.1798 0 28.2832 0 28.2832C0 28.2832 15.0381 27.3866 21.2129 21.2119C27.3786 15.0462 28.2816 0.0428417 28.2842 -0.000976562Z"
              fill="white"
            />
          </svg>
        </div>
      </div>
    </div>
  );
});

CenterStarDivider.displayName = "CenterStarDivider";
