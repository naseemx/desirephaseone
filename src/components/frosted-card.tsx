"use client";

import React from "react";

interface FrostedCardProps {
  visible?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  subtitleClassName?: string;
}

export function FrostedCard({
  visible = true,
  title = "WEBGL & SHADER EFFECTS",
  subtitle = "Visual effects that feel impossible — and run in the browser.",
  description = "Custom GLSL shaders for transitions, distortions, particle systems, and post-processing effects. The kind of visual layer that separates a good site from one people send to each other.",
  className = "",
  subtitleClassName = "",
}: FrostedCardProps) {
  return (
    <div
      className={`pointer-events-none transition-all duration-700 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-4 scale-[0.98] invisible pointer-events-none"
      } ${className}`}
      style={{
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
        willChange: visible ? "transform, opacity" : "auto",
      }}
    >
      <div
        className={`pointer-events-auto relative overflow-hidden rounded-t-2xl rounded-b-none border-t border-x border-white/10 border-b-0 bg-black/55 px-3 pt-2.5 pb-6 sm:px-5 sm:pt-4 sm:pb-10 backdrop-blur-md ${
          !visible ? "pointer-events-none" : ""
        }`}
        style={{
          WebkitBackdropFilter: "blur(12px)",
          backdropFilter: "blur(12px)",
          isolation: "isolate",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 1) 55%, rgba(0, 0, 0, 0) 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 1) 55%, rgba(0, 0, 0, 0) 100%)",
        }}
      >
        {/* Subtle top edge glass hairline highlight */}
        <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* Title */}
        {title && (
          <h2 className="text-[9px] sm:text-sm font-bold tracking-tight text-white uppercase">
            {title}
          </h2>
        )}

        {/* Subtitle */}
        {subtitle && (
          <p className={`mt-0.5 sm:mt-1 text-[8px] sm:text-xs text-zinc-300 font-normal leading-snug ${subtitleClassName}`}>
            {subtitle}
          </p>
        )}

        {/* Description Body */}
        {description && (
          <p className="mt-1 sm:mt-1.5 text-[8px] sm:text-[11px] text-zinc-400 font-normal leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

export default FrostedCard;
