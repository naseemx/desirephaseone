"use client";

import React, { useState } from "react";

export interface EdgeGlassCardProps {
  label?: string;
  category?: string;
  rowNumber?: 1 | 2;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
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
 * A sleek, high-end glassmorphic tab card attached flush to the leftmost edge (left: 0).
 * Features:
 * - Rounded-right corners (rounded-r-2xl, rounded-l-none) clinging to the viewport/container boundary
 * - Deep frosted glass blur (backdrop-blur-xl bg-[#070b10]/90)
 * - Brand Cyan (#00b5e2) subtle border glow
 * - Dual vertical typography columns side-by-side in sentence case so text is NEVER clipped and cards NEVER overlap
 * - Hover tooltip / expansion displaying the full title horizontally
 */
export function EdgeGlassCard({
  label = "Specialized led solution display",
  lines,
  category = "Display Solutions",
  rowNumber = 1,
  className = "",
  style,
  onClick,
}: EdgeGlassCardProps & { lines?: [string, string?] }) {
  const [isHovered, setIsHovered] = useState(false);
  const formattedLabel = toSentenceCase(label);
  const [line1, line2] = lines ?? splitLabelIntoLines(label);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group absolute left-0 z-40 pointer-events-auto flex items-center select-none transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        transform: "translateY(-50%)",
        ...style,
      }}
      aria-label={`${formattedLabel} - Line ${rowNumber}`}
    >
      {/* ── Vertical Edge Tab (Clings flush to left edge: rounded-r-2xl, rounded-l-none) ── */}
      <div
        className={`relative flex flex-col items-center justify-center py-3 sm:py-3.5 md:py-4 px-2 sm:px-2.5 md:px-3 rounded-r-xl sm:rounded-r-2xl rounded-l-none border-y border-r border-l-0 bg-[#0c1622]/85 backdrop-blur-2xl transition-all duration-300 ${
          isHovered
            ? "border-[#00b5e2]/80 shadow-[0_10px_35px_rgba(0,0,0,0.8),0_0_24px_rgba(0,181,226,0.3)] translate-x-1"
            : "border-white/25 shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_16px_rgba(0,181,226,0.15)]"
        }`}
        style={{
          WebkitBackdropFilter: "blur(20px)",
          backdropFilter: "blur(20px)",
        }}
      >
        {/* Subtle Top Hairline Highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />

        {/* Ambient Radial Glow on Hover */}
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-r from-[#00b5e2]/20 via-[#00b5e2]/5 to-transparent transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Vertical Text: perfectly unclipped, sentence-case single vertical line or lines */}
        <div className="relative z-10 flex items-center justify-center my-auto py-1 px-0.5">
          {lines ? (
            <div className="flex items-center justify-center gap-1 sm:gap-1.5">
              {line1 && (
                <span
                  className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium text-zinc-200 group-hover:text-white transition-colors duration-200 whitespace-nowrap leading-none select-none"
                  style={{
                    textShadow: isHovered ? "0 0 10px rgba(0, 181, 226, 0.5)" : "none",
                  }}
                >
                  {line1}
                </span>
              )}
              {line2 && (
                <span
                  className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[8.5px] sm:text-[9.5px] md:text-[10px] font-medium text-cyan-200/90 group-hover:text-cyan-200 transition-colors duration-200 whitespace-nowrap leading-none select-none"
                  style={{
                    textShadow: isHovered ? "0 0 10px rgba(0, 181, 226, 0.5)" : "none",
                  }}
                >
                  {line2}
                </span>
              )}
            </div>
          ) : (
            <span
              className="[writing-mode:vertical-rl] rotate-180 tracking-wide text-[9px] sm:text-[9.5px] md:text-[10px] lg:text-[10.5px] font-medium text-zinc-200 group-hover:text-white transition-colors duration-200 whitespace-nowrap leading-none select-none inline-block"
              style={{
                textShadow: isHovered
                  ? "0 0 12px rgba(0, 181, 226, 0.6)"
                  : "0 1px 2px rgba(0, 0, 0, 0.8)",
              }}
            >
              {formattedLabel}
            </span>
          )}
        </div>
      </div>

      {/* ── Slide-Out Tooltip Card on Hover (Desktop Only) ── */}
      <div
        className={`hidden md:block absolute left-full ml-2 z-50 pointer-events-none transition-all duration-300 ease-out ${
          isHovered
            ? "opacity-100 translate-x-0 scale-100"
            : "opacity-0 -translate-x-2 scale-95 invisible"
        }`}
      >
        <div className="min-w-[200px] max-w-[240px] rounded-xl border border-[#00b5e2]/30 bg-[#090e14]/95 p-3 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(0,181,226,0.18)]">
          <div className="text-[9px] uppercase tracking-wider text-[#00b5e2] font-semibold mb-1">
            {category}
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-white leading-snug">
            {formattedLabel}
          </h4>
          <p className="text-[10px] text-zinc-400 mt-1 leading-relaxed">
            High-performance display engineering tailored to architectural & commercial environments.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EdgeGlassCard;
