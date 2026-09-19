"use client";

import React from "react";
import { Phone, Mail, ArrowUpRight, MapPin } from "lucide-react";
import { AmbientStars } from "@/components/ui/ambient-stars";

export interface GeoLocationSectionProps {
  isStageMode?: boolean;
}

export function GeoLocationSection({
  isStageMode = false,
}: GeoLocationSectionProps = {}) {
  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=25.1372,55.2345";
  const searchUrl =
    "https://www.google.com/maps/search/?api=1&query=25.1372,55.2345";

  return (
    <section
      id="location"
      className={`relative w-full overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center ${
        isStageMode
          ? "h-full min-h-screen py-4 sm:py-6"
          : "min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      }`}
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 50%, rgba(0, 181, 226, 0.06) 0%, rgba(9, 9, 11, 0.85) 60%, #09090b 100%)",
        contain: "paint",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-20" />

      {/* Atmospheric Star Particles */}
      <AmbientStars count={70} />

      {/* Main Card Container */}
      <div className="relative z-10 mx-auto max-w-4xl lg:max-w-5xl w-full px-4 sm:px-6 my-auto">
        <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0c12]/90 backdrop-blur-xl p-5 sm:p-7 lg:p-9 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Inner hairline cyan glow line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-cyan)]/35 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center">
            {/* Left: Studio & Contact Information (5 cols) */}
            <div className="md:col-span-5 flex flex-col justify-between space-y-5 sm:space-y-6 text-left">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--brand-cyan)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
                  Our Studio
                </div>

                <h2 className="mt-3.5 text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
                  Desire Advertising <br className="hidden sm:inline" />
                  <span className="text-zinc-400 font-medium">&amp; Dzyr Digital</span>
                </h2>

                <div className="mt-3 flex items-start gap-2 text-xs sm:text-sm text-zinc-400 font-light leading-relaxed">
                  <MapPin className="w-4 h-4 text-[var(--brand-cyan)] shrink-0 mt-0.5" />
                  <span>
                    Al Quoz Industrial Area 3<br />
                    Dubai, United Arab Emirates
                  </span>
                </div>
              </div>

              {/* Direct Inquiries / Contact Links */}
              <div className="pt-1 flex flex-col space-y-2.5">
                <a
                  href="tel:+971501234567"
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-[var(--brand-cyan)] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-[var(--brand-cyan)]/40 group-hover:bg-[var(--brand-cyan)]/10 flex items-center justify-center transition-all shrink-0">
                    <Phone className="w-3.5 h-3.5 text-[var(--brand-cyan)]" />
                  </div>
                  <span>+971 50 123 4567</span>
                </a>

                <a
                  href="mailto:info@dzyrdigital.com"
                  className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-[var(--brand-cyan)] transition-colors group"
                >
                  <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-[var(--brand-cyan)]/40 group-hover:bg-[var(--brand-cyan)]/10 flex items-center justify-center transition-all shrink-0">
                    <Mail className="w-3.5 h-3.5 text-[var(--brand-cyan)]" />
                  </div>
                  <span>info@dzyrdigital.com</span>
                </a>
              </div>

              {/* Action Button: Get Directions */}
              <div className="pt-1">
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-cyan)] px-5 py-2.5 text-xs sm:text-sm font-semibold text-black tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] shadow-[0_0_20px_rgba(0,181,226,0.35)] cursor-pointer"
                >
                  <span>Get Directions</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>

            {/* Right: Clean Framed Dark Map (7 cols) */}
            <div className="md:col-span-7 h-[220px] sm:h-[280px] lg:h-[320px] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#06080d]/90 relative group">
              <iframe
                title="Desire Advertising Office Location"
                src="https://maps.google.com/maps?q=25.1372,55.2345&hl=en&z=14&output=embed"
                className="w-full h-full border-0 filter invert-[90%] hue-rotate-180 brightness-90 contrast-125"
                loading="lazy"
              />
              {/* Subtle gradient vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#09090b]/40 via-transparent to-transparent" />

              {/* Corner Map Action */}
              <a
                href={searchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-2.5 right-2.5 text-[10.5px] font-medium text-zinc-300 hover:text-white bg-[#06060c]/85 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 transition-all hover:border-[var(--brand-cyan)]/40 hover:bg-[#06060c] shadow-md flex items-center gap-1.5"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--brand-cyan)]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GeoLocationSection;
