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

  // Computes offscreen X position past the left edge of the viewport
  const getLeftOffscreenX = (el: HTMLElement | null) => {
    if (typeof window === "undefined") return -1200;
    const vw = window.innerWidth;
    const elW = el?.offsetWidth || 300;
    return -(vw / 2 + elW / 2 + 60);
  };

  // Computes offscreen X position past the right edge of the viewport
  const getRightOffscreenX = (el: HTMLElement | null) => {
    if (typeof window === "undefined") return 1200;
    const vw = window.innerWidth;
    const elW = el?.offsetWidth || 300;
    return (vw / 2 + elW / 2 + 60);
  };

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

        // Line 1: slides in from left edge to middle
        gsap.fromTo(
          l0,
          { x: () => getLeftOffscreenX(l0), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
            delay: 0.1,
            force3D: true,
          }
        );

        // Line 2: slides in from right edge to middle
        gsap.fromTo(
          l1,
          { x: () => getRightOffscreenX(l1), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
            delay: 0.28,
            force3D: true,
          }
        );

        // Line 3: slides in from left edge to middle
        gsap.fromTo(
          l2,
          { x: () => getLeftOffscreenX(l2), opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.15,
            ease: "power3.out",
            delay: 0.46,
            force3D: true,
          }
        );
      } else {
        // Text lines slide outwards toward their edges and fade out
        gsap.to(l0, {
          x: () => getLeftOffscreenX(l0) * 0.45,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(l1, {
          x: () => getRightOffscreenX(l1) * 0.45,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(l2, {
          x: () => getLeftOffscreenX(l2) * 0.45,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          force3D: true,
        });
        gsap.to(content, {
          opacity: 0,
          scale: 0.95,
          duration: 0.5,
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
          const scrollDistance = isMobile ? 450 : 650;

          gsap.set(l0, { x: () => getLeftOffscreenX(l0), opacity: 0, force3D: true });
          gsap.set(l1, { x: () => getRightOffscreenX(l1), opacity: 0, force3D: true });
          gsap.set(l2, { x: () => getLeftOffscreenX(l2), opacity: 0, force3D: true });
          gsap.set(content, { opacity: 0, scale: 0.95, force3D: true });

          let ctaState: "hidden" | "visible" = "hidden";

          const playAutoReveal = () => {
            if (ctaState === "visible") return;
            ctaState = "visible";
            gsap.killTweensOf([content, l0, l1, l2]);
            gsap.to(content, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", force3D: true });
            gsap.fromTo(
              l0,
              { x: () => getLeftOffscreenX(l0), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.08, force3D: true }
            );
            gsap.fromTo(
              l1,
              { x: () => getRightOffscreenX(l1), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.24, force3D: true }
            );
            gsap.fromTo(
              l2,
              { x: () => getLeftOffscreenX(l2), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.40, force3D: true }
            );
          };

          const playAutoOutro = () => {
            if (ctaState === "hidden") return;
            ctaState = "hidden";
            gsap.killTweensOf([content, l0, l1, l2]);
            gsap.to(l0, { x: () => getLeftOffscreenX(l0) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(l1, { x: () => getRightOffscreenX(l1) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(l2, { x: () => getLeftOffscreenX(l2) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(content, {
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
              ease: "power2.inOut",
              force3D: true,
              onComplete: () => {
                if (ctaState === "hidden") {
                  gsap.set(l0, { x: () => getLeftOffscreenX(l0), opacity: 0, force3D: true });
                  gsap.set(l1, { x: () => getRightOffscreenX(l1), opacity: 0, force3D: true });
                  gsap.set(l2, { x: () => getLeftOffscreenX(l2), opacity: 0, force3D: true });
                  gsap.set(content, { opacity: 0, scale: 0.95, force3D: true });
                }
              },
            });
          };

          const tl = gsap.timeline({
            defaults: { immediateRender: false },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: `+=${scrollDistance}`,
              pin: true,
              scrub: 0.5,
              anticipatePin: 1,
              fastScrollEnd: true,
              preventOverlaps: true,
              onEnter: () => {
                playAutoReveal();
              },
              onLeaveBack: () => {
                playAutoOutro();
              },
              onUpdate: (self) => {
                if (self.progress >= 0.12 && self.direction === 1) {
                  playAutoOutro();
                } else if (self.progress < 0.08 && self.direction === -1) {
                  playAutoReveal();
                }
              },
            },
          });

          // Phase 1: Brief hold moment while revealed automatically (t = 0.0 -> 0.3)
          tl.to({}, { duration: 0.3 }, 0);

          // Phase 2: Section fades out promptly as user scrolls to exit (t = 0.3 -> 0.9)
          tl.to(content, { opacity: 0, scale: 0.94, ease: "power2.inOut", duration: 0.6, force3D: true }, 0.3);
          tl.to({}, { duration: 0.1 }, 0.9);

          // Trigger immediately ONLY if already active on mount (e.g. page reload)
          if (typeof window !== "undefined" && section) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 50 && rect.bottom > 200 && window.scrollY > 100) {
              playAutoReveal();
            }
          }
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
        className="cta-content-wrapper relative z-10 w-full flex flex-col items-center justify-center will-change-transform"
        style={{ transformOrigin: "50% 50%" }}
      >
        <div className="w-full flex flex-col items-center text-center font-quicksand font-semibold not-italic tracking-normal leading-[1.08] sm:leading-[1.1] lg:leading-[1.12] text-3xl sm:text-5xl md:text-6xl lg:text-[84px] xl:text-[104px] 2xl:text-[124px] text-zinc-100">
          
          {/* LINE 1: Sign in (centered, slides in from left edge) */}
          <div className="w-full overflow-visible py-2 sm:py-3 lg:py-4 flex justify-center text-center">
            <div
              ref={line0Ref}
              className="cta-line-inner cta-line-0 will-change-transform inline-block text-center whitespace-nowrap px-3 sm:px-4 pb-2 sm:pb-3 lg:pb-4"
            >
              Sign in
            </div>
          </div>

          {/* LINE 2: to future with (centered, slides in from right edge) */}
          <div className="w-full overflow-visible py-2 sm:py-3 lg:py-4 flex justify-center text-center">
            <div
              ref={line1Ref}
              className="cta-line-inner cta-line-1 will-change-transform inline-block text-center whitespace-nowrap px-3 sm:px-4 pb-2 sm:pb-3 lg:pb-4"
            >
              to future with
            </div>
          </div>

          {/* LINE 3: dzyr digital visuals (centered, slides in from left edge) */}
          <div className="w-full overflow-visible py-2 sm:py-3 lg:py-4 flex justify-center text-center">
            <div
              ref={line2Ref}
              className="cta-line-inner cta-line-2 will-change-transform inline-block text-center whitespace-nowrap px-3 sm:px-4 pb-2 sm:pb-3 lg:pb-4"
            >
              <span className="text-[#00b5e2]">dzyr digital</span> visuals
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default ContactCtaSection;
