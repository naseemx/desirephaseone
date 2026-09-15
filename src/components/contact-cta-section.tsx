"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AmbientStars } from "@/components/ui/ambient-stars";

interface ContactCtaSectionProps {
  email?: string;
}

/**
 * ContactCtaSection
 * Reverse-engineered from ricardochance.com:
 * - 5-line asymmetric editorial typography (.display-140)
 * - Overflow-masked scroll-driven tilt reveal (yPercent: 320, rotate: 10 -> 0)
 * - Deep celestial background with AmbientStars and purple radial glow
 */
export function ContactCtaSection({
  email = "info@desireadvertising.com",
}: ContactCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const lineWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const lineInnersRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      lineInnersRef.current.forEach((inner, idx) => {
        const wrapper = lineWrappersRef.current[idx];
        if (!inner || !wrapper) return;

        // Exact Ricardo Chance animation:
        // yPercent: 320, rotate: 10 -> yPercent: 0, rotate: 0
        // trigger: wrapper, start: "top 92%", end: "bottom 62%", scrub: 1
        gsap.fromTo(
          inner,
          {
            yPercent: 320,
            rotate: 10,
            transformOrigin: "left bottom",
            opacity: 0.2,
          },
          {
            yPercent: 0,
            rotate: 0,
            opacity: 1,
            ease: "power3.out",
            force3D: true,
            scrollTrigger: {
              trigger: wrapper,
              start: "top 92%",
              end: "bottom 62%",
              scrub: 1,
            },
          }
        );
      });

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  const handleContactClick = () => {
    if (typeof window !== "undefined") {
      const footer = document.querySelector("footer");
      if (footer) {
        const lenis = (
          window as unknown as { lenis?: { scrollTo: (target: HTMLElement | string) => void } }
        ).lenis;
        if (lenis && typeof lenis.scrollTo === "function") {
          lenis.scrollTo(footer);
        } else {
          footer.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        window.location.href = `mailto:${email}`;
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact-cta"
      className="relative w-full overflow-hidden select-none bg-[#09090b] text-zinc-100 py-28 sm:py-36 md:py-48 lg:py-56"
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
        contain: "paint",
      }}
    >
      {/* Top & Bottom seamless gradient blending into adjacent sections */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10" />

      {/* Atmospheric Brand Glows & Celestial Star Particles */}
      <AmbientStars />

      {/* Editorial Content Container */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center">
        <div className="w-full flex flex-col items-center font-red-hat-display font-black italic uppercase tracking-tighter leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-[94px] xl:text-[118px] 2xl:text-[140px] text-zinc-100">
          
          {/* LINE 1: INTERESTED IN (offset left) */}
          <div
            ref={(el) => {
              lineWrappersRef.current[0] = el;
            }}
            className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center"
          >
            <div
              ref={(el) => {
                lineInnersRef.current[0] = el;
              }}
              className="will-change-transform inline-block sm:-ml-10 md:-ml-20 lg:-ml-28 xl:-ml-[80px]"
            >
              Interested in
            </div>
          </div>

          {/* LINE 2: WORKING TOGETHER? (centered) */}
          <div
            ref={(el) => {
              lineWrappersRef.current[1] = el;
            }}
            className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center"
          >
            <div
              ref={(el) => {
                lineInnersRef.current[1] = el;
              }}
              className="will-change-transform inline-block"
            >
              working together?
            </div>
          </div>

          {/* LINE 3: DROP A LINE (offset right, link with hover underline) */}
          <div
            ref={(el) => {
              lineWrappersRef.current[2] = el;
            }}
            className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center"
          >
            <div
              ref={(el) => {
                lineInnersRef.current[2] = el;
              }}
              className="will-change-transform inline-block sm:ml-10 md:ml-20 lg:ml-28 xl:ml-[80px]"
            >
              <a
                href={`mailto:${email}`}
                className="underline underline-offset-[8px] sm:underline-offset-[14px] decoration-white/70 hover:decoration-[#00b5e2] hover:text-[#00b5e2] transition-colors duration-300 cursor-pointer"
              >
                Drop a line
              </a>
            </div>
          </div>

          {/* LINE 4: OR SIMPLY (offset left) */}
          <div
            ref={(el) => {
              lineWrappersRef.current[3] = el;
            }}
            className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center"
          >
            <div
              ref={(el) => {
                lineInnersRef.current[3] = el;
              }}
              className="will-change-transform inline-block sm:-ml-24 md:-ml-48 lg:-ml-72 xl:-ml-[320px]"
            >
              or simply
            </div>
          </div>

          {/* LINE 5: GET IN TOUCH (offset left, interactive underline) */}
          <div
            ref={(el) => {
              lineWrappersRef.current[4] = el;
            }}
            className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center"
          >
            <div
              ref={(el) => {
                lineInnersRef.current[4] = el;
              }}
              className="will-change-transform inline-block sm:-ml-28 md:-ml-56 lg:-ml-80 xl:-ml-[360px]"
            >
              <button
                type="button"
                onClick={handleContactClick}
                className="underline underline-offset-[8px] sm:underline-offset-[14px] decoration-white/70 hover:decoration-[#00b5e2] hover:text-[#00b5e2] transition-colors duration-300 cursor-pointer uppercase font-black italic tracking-tighter"
              >
                GET IN TOUCH
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactCtaSection;
