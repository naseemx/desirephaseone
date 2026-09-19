"use client";

import React from "react";
import { AmbientStars } from "@/components/ui/ambient-stars";

export interface MissionVisionSectionProps {
  isStageMode?: boolean;
}

export function MissionVisionSection({
  isStageMode = false,
}: MissionVisionSectionProps = {}) {
  return (
    <section
      id="mission-vision"
      className={`relative w-full overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center ${
        isStageMode
          ? "h-full min-h-screen py-8"
          : "min-h-screen py-20 sm:py-28"
      }`}
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 50%, rgba(0, 181, 226, 0.07) 0%, rgba(9, 9, 11, 0.85) 65%, #09090b 100%)",
        contain: "paint",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-20 sm:h-28 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-20" />

      {/* Atmospheric Starfield Particles */}
      <AmbientStars count={75} />

      <div className="relative z-30 mx-auto max-w-4xl px-6 w-full flex flex-col items-center justify-center text-center my-auto space-y-12 sm:space-y-16">
        {/* ── Mission ─────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Mission
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 font-light leading-relaxed sm:leading-relaxed">
            Pioneering bespoke digital LED displays and architectural visual environments,
            <br className="hidden sm:inline" />
            {" "}transforming physical spaces into dynamic experiences that captivate audiences.
          </p>
        </div>

        {/* Subtle Divider */}
        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#00b5e2]/40 to-transparent" />

        {/* ── Vision ──────────────────────────────────────────────────── */}
        <div className="flex flex-col items-center space-y-3 sm:space-y-4 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Vision
          </h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-zinc-300 font-light leading-relaxed sm:leading-relaxed">
            To redefine spatial branding through next-generation visual display technology,
            <br className="hidden sm:inline" />
            {" "}pushing the boundaries of modern design and architectural storytelling.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MissionVisionSection;
