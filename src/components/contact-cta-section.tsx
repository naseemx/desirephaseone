"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { AmbientStars } from "@/components/ui/ambient-stars";

export interface ContactCtaSectionProps {
  email?: string;
  isStageMode?: boolean;
  visible?: boolean;
}

/**
 * ContactCtaSection
 * Middle-aligned editorial typography placed after the last checkpoint frame:
 * - Text:
 *     "Sign in"
 *     "to future with"
 *     "dzyr digital visuals"
 * - Animation:
 *     1. Section transition: fade in when entering, fade out when scrolling to exit.
 *     2. Text animation: slides in from alternating sides (left / right / left) to the center,
 *        holds in the middle, and fades out as you scroll to exit.
 */
export function ContactCtaSection({
  isStageMode = false,
  visible,
}: ContactCtaSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const line0Ref = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);

  // Controlled mode: triggered when visible prop is explicitly passed
  useGSAP(
    () => {
      if (isStageMode || typeof visible !== "boolean") return;

      const content = contentRef.current;
      const l0 = line0Ref.current;
      const l1 = line1Ref.current;
      const l2 = line2Ref.current;

      if (!content || !l0 || !l1 || !l2) return;

      if (visible) {
        // Section fades in from center
        gsap.to(content, {
          opacity: 1,
          scale: 1,
          duration: 0.9,
          ease: "power2.out",
          force3D: true,
        });

        // Line 1: slides in from left to middle
        gsap.fromTo(
          l0,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            delay: 0.15,
            force3D: true,
          }
        );

        // Line 2: slides in from right to middle
        gsap.fromTo(
          l1,
          { xPercent: 100, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            delay: 0.35,
            force3D: true,
          }
        );

        // Line 3: slides in from left to middle
        gsap.fromTo(
          l2,
          { xPercent: -100, opacity: 0 },
          {
            xPercent: 0,
            opacity: 1,
            duration: 1.1,
            ease: "power2.out",
            delay: 0.55,
            force3D: true,
          }
        );
      } else {
        // Text lines slide outwards and fade out
        gsap.to(l0, {
          xPercent: -40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(l1, {
          xPercent: 40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(l2, {
          xPercent: -40,
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(content, {
          opacity: 0,
          scale: 0.95,
          duration: 0.6,
          ease: "power2.inOut",
          force3D: true,
        });
      }
    },
    { scope: sectionRef, dependencies: [visible, isStageMode] }
  );

  // Standalone ScrollTrigger mode (if rendered as a standalone page section)
  useGSAP(
    () => {
      if (
        typeof window === "undefined" ||
        !sectionRef.current ||
        isStageMode ||
        typeof visible === "boolean"
      )
        return;

      const section = sectionRef.current;
      const content = contentRef.current;
      const l0 = line0Ref.current;
      const l1 = line1Ref.current;
      const l2 = line2Ref.current;

      if (!content || !l0 || !l1 || !l2) return;

      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 768px)",
          isMobile: "(max-width: 767px)",
        },
        (context) => {
          const { isMobile } = (context.conditions || {}) as { isMobile?: boolean };
          const scrollDistance = isMobile ? 1200 : 1800;

          gsap.set(l0, { xPercent: -100, opacity: 0, force3D: true });
          gsap.set(l1, { xPercent: 100, opacity: 0, force3D: true });
          gsap.set(l2, { xPercent: -100, opacity: 0, force3D: true });
          gsap.set(content, { opacity: 0, scale: 0.95, force3D: true });

          const tl = gsap.timeline({
            defaults: { immediateRender: false },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${scrollDistance}`,
              pin: true,
              scrub: 1,
              anticipatePin: 1,
              fastScrollEnd: true,
              preventOverlaps: true,
            },
          });

          // Phase 1: Section fades in and text lines slide from sides to middle
          tl.to(content, { opacity: 1, scale: 1, ease: "power2.out", duration: 1.2, force3D: true }, 0);
          tl.to(l0, { xPercent: 0, opacity: 1, ease: "power2.out", duration: 1.4, force3D: true }, 0.1);
          tl.to(l1, { xPercent: 0, opacity: 1, ease: "power2.out", duration: 1.4, force3D: true }, 0.35);
          tl.to(l2, { xPercent: 0, opacity: 1, ease: "power2.out", duration: 1.4, force3D: true }, 0.6);

          // Phase 2: Middle aligned hold moment
          tl.to({}, { duration: 1.8 }, 2.0);

          // Phase 3: Text animation fades out & slides outwards
          tl.to(l0, { xPercent: -40, opacity: 0, ease: "power2.in", duration: 1.2, force3D: true }, 3.8);
          tl.to(l1, { xPercent: 40, opacity: 0, ease: "power2.in", duration: 1.2, force3D: true }, 3.9);
          tl.to(l2, { xPercent: -40, opacity: 0, ease: "power2.in", duration: 1.2, force3D: true }, 4.0);

          // Phase 4: Section fades out completely
          tl.to(content, { opacity: 0, scale: 0.94, ease: "power2.inOut", duration: 1.4, force3D: true }, 4.1);
          tl.to({}, { duration: 0.6 }, 5.5);
        }
      );

      ScrollTrigger.refresh();
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="brand-intro"
      className={`relative w-full ${
        isStageMode ? "h-full" : "h-full min-h-screen"
      } overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center`}
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
        contain: "paint",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10" />

      {/* Atmospheric Brand Glows & Celestial Star Particles */}
      <AmbientStars />

      {/* Editorial Content Container - Centered */}
      <div
        ref={contentRef}
        className="cta-content-wrapper relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 flex flex-col items-center justify-center will-change-transform"
        style={{ transformOrigin: "50% 50%" }}
      >
        <div className="w-full flex flex-col items-center text-center font-red-hat-display font-black italic uppercase tracking-tighter leading-[0.88] text-4xl sm:text-6xl md:text-7xl lg:text-[94px] xl:text-[118px] 2xl:text-[136px] text-zinc-100">
          
          {/* LINE 1: Sign in (centered, slides in from left) */}
          <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center">
            <div
              ref={line0Ref}
              className="cta-line-inner cta-line-0 will-change-transform inline-block text-center"
            >
              Sign in
            </div>
          </div>

          {/* LINE 2: to future with (centered, slides in from right) */}
          <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center">
            <div
              ref={line1Ref}
              className="cta-line-inner cta-line-1 will-change-transform inline-block text-center"
            >
              to future with
            </div>
          </div>

          {/* LINE 3: dzyr digital visuals (centered, slides in from left) */}
          <div className="w-full overflow-hidden py-1 sm:py-2 flex justify-center text-center">
            <div
              ref={line2Ref}
              className="cta-line-inner cta-line-2 will-change-transform inline-block text-center"
            >
              <span className="text-[#00b5e2]">dzyr</span> digital visuals
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactCtaSection;
