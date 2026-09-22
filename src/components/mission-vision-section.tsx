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

      <div className="relative z-30 mx-auto max-w-3xl lg:max-w-4xl px-6 w-full flex flex-col items-center justify-center text-center my-auto">
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/10 px-3.5 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--brand-cyan)] mb-4 sm:mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
          <span>Our Vision &amp; Purpose</span>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-tight sm:leading-tight mb-4 sm:mb-6">
          Transforming Your <span className="text-[#00b5e2]">Desires</span> Into Reality
        </h2>

        {/* Subtle Glowing Accent Divider */}
        <div className="w-16 sm:w-24 h-[1.5px] bg-gradient-to-r from-transparent via-[#00b5e2]/60 to-transparent mb-6 sm:mb-8" />

        {/* Narrative Content */}
        <div className="space-y-4 sm:space-y-5 text-xs sm:text-sm md:text-base lg:text-[16.5px] text-zinc-300 font-light leading-relaxed sm:leading-relaxed max-w-2xl sm:max-w-3xl">
          <p>
            <span className="text-white font-medium">Desire Advertising LLC</span> stands as your comprehensive partner in visual communication, seamlessly bridging creative vision and technical execution. Specializing in end-to-end media and fabrication solutions, we bring bold concepts to life across every touchpoint. From cutting-edge digital display setups, interactive screens, and custom LED installations to high-impact physical signage, exhibition structures, and full-scale brand identity systems, our team delivers seamless craftsmanship. We blend artistic direction with engineering precision, ensuring your brand commands attention in today’s competitive market.
          </p>
          <p>
            By integrating traditional advertising assets with advanced digital experiences, <span className="text-white font-medium">Desire Advertising LLC</span> empowers businesses to a dynamic market presence. We remain dedicated to elevating client visibility through tailored design, precision manufacturing, and flawless installation, effectively translating your highest ambitions into tangible, high-performing reality.
          </p>
        </div>
      </div>
    </section>
  );
}

export default MissionVisionSection;
