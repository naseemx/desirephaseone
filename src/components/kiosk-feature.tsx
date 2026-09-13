"use client";

import React from "react";

interface KioskFeatureProps {
  visible?: boolean;
  title?: React.ReactNode;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function KioskFeature({
  visible = true,
  title = "Custom exhibition booths, mall counters, & digital kiosks",
  description = "We bring your vision to life by crafting custom exhibition booths, mall counters, and kiosks in any material, fully integrated with customizable, interactive LED and LCD displays designed to captivate and engage your audience.",
  className = "",
  titleClassName = "",
  descriptionClassName = "",
}: KioskFeatureProps) {
  return (
    <div
      className={`pointer-events-none transition-all duration-700 ease-out select-none flex flex-col items-start text-left ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      } ${className}`}
    >
      {title && (
        <h3
          className={`text-base sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-300 leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${titleClassName}`}
        >
          {title}
        </h3>
      )}
      {description && (
        <p
          className={`mt-1.5 sm:mt-2 text-[10px] sm:text-sm text-zinc-300 font-normal leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] ${descriptionClassName}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export const HeroFeature = KioskFeature;
export default KioskFeature;
