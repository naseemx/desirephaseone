"use client";

import React from "react";

export interface EdgeGlassCardProps {
  label?: string;
  category?: string;
  rowNumber?: 1 | 2;
  className?: string;
  style?: React.CSSProperties;
}

function toSentenceCase(str: string): string {
  if (!str) return "";
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
}

function splitLabelIntoLines(label: string): [string, string?] {
  const trimmed = toSentenceCase(label).trim();
  const words = trimmed.split(/\s+/);
  if (words.length <= 2) {
    return [trimmed];
  }
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(" ");
  const line2 = words.slice(mid).join(" ");
  return [line1, line2];
}

/**
 * EdgeGlassCard
 * A sleek, static glassmorphic tab card attached flush to the leftmost edge (left: 0).
 * Features:
 * - Rounded-right corners (rounded-r-xl sm:rounded-r-2xl, rounded-l-none) clinging to the viewport/container boundary
 * - Deep frosted glass blur (backdrop-blur-2xl bg-[#0c1622]/85)
 * - Brand Cyan subtle border glow & hairline
 * - Sentence-case vertical typography, guaranteed unclipped
 * - Static decorative badge: no hover action, no tap/click action
 */
export function EdgeGlassCard({
  label = "Specialized led solution display",
  lines,
  rowNumber = 1,
  className = "",
  style,
}: EdgeGlassCardProps & { lines?: [string, string?] }) {
  const formattedLabel = toSentenceCase(label);
  const [line1, line2] = lines ?? splitLabelIntoLines(label);

  return (
    <div
      className={`absolute left-0 z-40 pointer-events-none flex items-center select-none ${className}`}
      style={{
        transform: "translateY(-50%)",
        ...style,
      }}
      aria-label={`${formattedLabel} - Line ${rowNumber}`}
    >
      {/* ── Vertical Edge Tab (Clings flush to left edge: rounded-r-2xl, rounded-l-none) ── */}
      <div
        className="relative flex flex-col items-center justify-center py-3 sm:py-3.5 md:py-4 px-2 sm:px-2.5 md:px-3 rounded-r-xl sm:rounded-r-2xl rounded-l-none border-y border-r border-l-0 bg-[#0c1622]/85 backdrop-blur-2xl border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_16px_rgba(0,181,226,0.15)]"
        style={{
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Subtle Top Hairline Highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

        {/* Subtle Ambient Radial Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00b5e2]/10 via-transparent to-transparent" />

        {/* Vertical Text: perfectly unclipped, sentence-case single vertical line or lines */}
        <div className="relative z-10 flex items-center justify-center my-auto py-1 px-0.5">
          {lines ? (
            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
              {line1 && (
                <span className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium text-zinc-200 whitespace-nowrap leading-none select-none">
                  {line1}
                </span>
              )}
              {line2 && (
                <span className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium text-cyan-200/90 whitespace-nowrap leading-none select-none">
                  {line2}
                </span>
              )}
            </div>
          ) : (
            <span
              className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[9px] sm:text-[9.5px] md:text-[10px] lg:text-[10.5px] font-medium text-zinc-200 whitespace-nowrap leading-none select-none inline-block"
              style={{
                textShadow: "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {formattedLabel}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default EdgeGlassCard;
