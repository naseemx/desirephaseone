"use client";

import React from "react";

interface FrostedCardProps {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export function FrostedCard({
  visible = true,
  title = "WEBGL & SHADER EFFECTS",
  subtitle = "Visual effects that feel impossible — and run in the browser.",
  description = "Custom GLSL shaders for transitions, distortions, particle systems, and post-processing effects. The kind of visual layer that separates a good site from one people send to each other.",
  className = "",
}: FrostedCardProps) {
  return (
    <div
      className={`pointer-events-none transition-all duration-700 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.98]"
      } ${className}`}
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 sm:px-5 sm:py-4 backdrop-blur-md shadow-[0_12px_32px_rgba(0,0,0,0.5)] ${
          !visible ? "pointer-events-none" : ""
        }`}
        style={{
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Subtle top edge glass hairline highlight */}
        <div className="pointer-events-none absolute inset-x-4 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Title */}
        <h2 className="text-xs sm:text-sm font-bold tracking-tight text-white uppercase">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="mt-1 text-[11px] sm:text-xs text-zinc-300 font-normal leading-snug">
          {subtitle}
        </p>

        {/* Description Body */}
        <p className="mt-1.5 text-[10px] sm:text-[11px] text-zinc-400 font-normal leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}

export default FrostedCard;
