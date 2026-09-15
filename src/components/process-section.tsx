"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import {
  CharacterReveal,
  MaskedLinesReveal,
  StrokeButton,
  AmbientStars,
  CenterStarDivider,
  ProcessStepItem,
  ProcessStepData,
} from "@/components/ui";

const PROCESS_STEPS: ProcessStepData[] = [
  {
    id: "01",
    title: "Discovery",
    description:
      "Understanding your goals, audience, and constraints before touching a single pixel.",
  },
  {
    id: "02",
    title: "Concept & Design",
    description:
      "Visual direction, interaction design, and prototyping. You see it before I build it.",
  },
  {
    id: "03",
    title: "Development",
    description:
      "Pixel-perfect implementation with performance and attention to detail built in.",
  },
  {
    id: "04",
    title: "Launch & Beyond",
    description:
      "Deployment, testing, and support. I don't disappear after the handoff.",
  },
];

// Split lines definition for Title matching Ricardo Chance's structure
const TITLE_LINES = [
  { words: ["A", "process", "built", "around"] },
  { words: ["clarity", "and", "craft."] },
];

// Split lines definition for Description matching Ricardo Chance's masked lines
const DESC_LINES = [
  "No surprises, no handoff chaos.",
  "Just a clear path from the first conversation",
  "to a product that works.",
];

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);

  // Left narrative refs (desktop)
  const narrativeWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const descLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);
  const rectBorderRef = useRef<SVGRectElement>(null);

  // Right side track and steps (desktop)
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const activeStepRef = useRef<number>(-1);

  // GSAP Responsive Media Query Choreography
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ─────────────────────────────────────────────────────────────────────────
      // DESKTOP (min-width: 768px): 100% UNTOUCHED ORIGINAL PINNED SCROLL EFFECT
      // ─────────────────────────────────────────────────────────────────────────
      mm.add("(min-width: 768px)", () => {
        if (
          !sectionRef.current ||
          !centerLineRef.current ||
          !starRef.current ||
          !headingRef.current ||
          !descriptionRef.current ||
          !ctaRef.current ||
          !rightTrackRef.current
        )
          return;

        const section = sectionRef.current;
        const centerLine = centerLineRef.current;
        const star = starRef.current;
        const heading = headingRef.current;
        const cta = ctaRef.current;
        const ctaText = ctaTextRef.current;
        const rectBorder = rectBorderRef.current;
        const rightTrack = rightTrackRef.current;
        const stepEls = stepRefs.current.filter(Boolean) as HTMLDivElement[];
        const descLines = descLinesRef.current.filter(Boolean) as HTMLDivElement[];

        // Query all character spans for the headline
        const titleChars = Array.from(
          heading.querySelectorAll<HTMLSpanElement>(".char-item")
        );

        const viewportHeight = window.innerHeight;
        const centerTarget = viewportHeight / 2;

        // Measure vertical center of each step inside right track
        const stepCenters = stepEls.map(
          (el) => el.offsetTop + el.offsetHeight / 2
        );

        // Initial state: Step 01 starts near bottom
        const startY = viewportHeight * 0.95 - (stepCenters[0] ?? 0);

        // Final state: Step 04 is past center
        const endY =
          centerTarget - (stepCenters[stepCenters.length - 1] ?? 0) - 120;

        // ─────────────────────────────────────────────────────────────────────
        // INITIAL STATES AT START (Progress = 0)
        // ─────────────────────────────────────────────────────────────────────
        gsap.set(centerLine, {
          scaleY: 0,
          transformOrigin: "bottom center",
          force3D: true,
        });

        gsap.set(star, { scale: 0, opacity: 0, force3D: true });

        if (titleChars.length > 0) {
          gsap.set(titleChars, { opacity: 0 });
        }

        if (descLines.length > 0) {
          gsap.set(descLines, {
            yPercent: 320,
            rotate: 10,
            transformOrigin: "top left",
            force3D: true,
          });
        }

        if (rectBorder) {
          gsap.set(rectBorder, {
            strokeDasharray: 100,
            strokeDashoffset: 100,
          });
        }
        gsap.set(cta, { backgroundColor: "rgba(0, 181, 226, 0)" });
        if (ctaText) {
          gsap.set(ctaText, {
            opacity: 0.5,
            y: 4,
          });
        }

        gsap.set(rightTrack, { y: startY, force3D: true });

        stepEls.forEach((el) => {
          gsap.set(el, { opacity: 0.25, scale: 0.98, force3D: true });
        });

        // Master scrubbed timeline: 2800px provides silky progressive storytelling
        const scrollDistance = 2800;

        const tl = gsap.timeline({
          defaults: { immediateRender: false },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${scrollDistance}`,
            pin: true,
            scrub: true,
            anticipatePin: 1,
            fastScrollEnd: true,
            preventOverlaps: true,
            onUpdate: (self) => {
              const currentY = startY + self.progress * (endY - startY);

              let newClosest = -1;
              if (self.progress >= 0.12) {
                let minDiff = Infinity;
                stepCenters.forEach((center, idx) => {
                  const stepViewportY = currentY + center;
                  const diff = Math.abs(stepViewportY - centerTarget);
                  if (diff < minDiff) {
                    minDiff = diff;
                    newClosest = idx;
                  }
                });
              }

              if (newClosest !== activeStepRef.current) {
                activeStepRef.current = newClosest;
                stepEls.forEach((el, idx) => {
                  const isActive = idx === newClosest;
                  el.setAttribute("data-active", isActive ? "true" : "false");
                  if (isActive) {
                    el.classList.add("is-active");
                  } else {
                    el.classList.remove("is-active");
                  }
                });
              }
            },
          },
        });

        timelineRef.current = tl;

        // 1. Center hairline shoots up quickly (t = 0.0 -> 0.7)
        tl.fromTo(
          centerLine,
          { scaleY: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 0.7,
            ease: "power2.out",
            force3D: true,
          },
          0
        );

        // 2. Star blooms at center as line reaches it (t = 0.25 -> 0.75)
        tl.fromTo(
          star,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            force3D: true,
          },
          0.25
        );

        // 3. Title typewriter glow
        if (titleChars.length > 0) {
          tl.fromTo(
            titleChars,
            { opacity: 0 },
            {
              opacity: 1,
              stagger: 0.028,
              duration: 0.35,
              ease: "power1.inOut",
            },
            0.25
          );
        }

        // 4. Description lines rising from mask
        if (descLines.length > 0) {
          tl.fromTo(
            descLines,
            { yPercent: 320, rotate: 10 },
            {
              yPercent: 0,
              rotate: 0,
              stagger: 0.16,
              duration: 0.65,
              ease: "power2.out",
              force3D: true,
            },
            0.6
          );
        }

        // 5. CTA button border draw + text illumination (in sync with description)
        if (rectBorder) {
          tl.fromTo(
            rectBorder,
            { strokeDashoffset: 100 },
            {
              strokeDashoffset: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            0.6
          );
        }

        tl.fromTo(
          cta,
          { backgroundColor: "rgba(0, 181, 226, 0)" },
          {
            backgroundColor: "rgba(0, 181, 226, 0.08)",
            duration: 0.65,
            ease: "power2.out",
          },
          0.6
        );

        if (ctaText) {
          tl.fromTo(
            ctaText,
            { opacity: 0.5, y: 4 },
            {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
              clearProps: "transform",
            },
            0.6
          );
        }

        // 6. Right track moves continuously from startY to endY (t = 0.4 -> 10.0)
        tl.to(
          rightTrack,
          {
            y: endY,
            duration: 9.6,
            ease: "none",
            force3D: true,
          },
          0.4
        );

        // 7. Step blooming & dimming
        stepEls.forEach((el, idx) => {
          const stepTargetY = centerTarget - stepCenters[idx];
          const fraction = (stepTargetY - startY) / (endY - startY);
          const centerTime = Math.max(1.8, Math.min(9.6, 0.4 + fraction * 9.6));

          tl.fromTo(
            el,
            { opacity: 0.25, scale: 0.98, force3D: true },
            {
              opacity: 1,
              scale: 1,
              duration: 0.9,
              ease: "power2.out",
              force3D: true,
            },
            Math.max(0.4, centerTime - 0.9)
          );

          if (idx < stepEls.length - 1) {
            tl.to(
              el,
              {
                opacity: 0.25,
                scale: 0.98,
                duration: 0.9,
                ease: "power2.in",
                force3D: true,
              },
              centerTime + 0.5
            );
          }
        });
      });

      // ─────────────────────────────────────────────────────────────────────────
      // MOBILE (max-width: 767px): AUTHENTIC RICARDO CHANCE EDITORIAL SCROLL
      // Dynamic illumination as each step passes the sticky glowing center star
      // ─────────────────────────────────────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        const mobileSteps =
          sectionRef.current?.querySelectorAll<HTMLDivElement>(
            ".mobile-step-item"
          );
        if (mobileSteps && mobileSteps.length > 0) {
          mobileSteps.forEach((stepEl) => {
            ScrollTrigger.create({
              trigger: stepEl,
              start: "top center+=120",
              end: "bottom center-=120",
              toggleClass: { targets: stepEl, className: "is-active" },
              onEnter: () => {
                gsap.to(stepEl, {
                  opacity: 1,
                  duration: 0.45,
                  ease: "power2.out",
                });
              },
              onLeave: () => {
                gsap.to(stepEl, {
                  opacity: 0.35,
                  duration: 0.45,
                  ease: "power2.out",
                });
              },
              onEnterBack: () => {
                gsap.to(stepEl, {
                  opacity: 1,
                  duration: 0.45,
                  ease: "power2.out",
                });
              },
              onLeaveBack: () => {
                gsap.to(stepEl, {
                  opacity: 0.35,
                  duration: 0.45,
                  ease: "power2.out",
                });
              },
            });
          });
        }
      });

      ScrollTrigger.refresh();

      return () => {
        mm.revert();
      };
    },
    { scope: sectionRef }
  );

  // Smooth scroll to a specific step when clicked (Desktop)
  const scrollToStep = (idx: number) => {
    const st = timelineRef.current?.scrollTrigger;
    if (!st || typeof window === "undefined") return;

    const stepProgressBenchmarks = [0.26, 0.5, 0.74, 0.95];
    const targetScroll =
      st.start + stepProgressBenchmarks[idx] * (st.end - st.start);

    const lenis = (
      window as unknown as { lenis?: { scrollTo: (target: number) => void } }
    ).lenis;

    if (lenis && typeof lenis.scrollTo === "function") {
      lenis.scrollTo(targetScroll);
    } else {
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative w-full h-auto md:h-screen overflow-visible md:overflow-hidden select-none bg-[#09090b] text-zinc-100 md:[contain:paint]"
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-10" />

      {/* Atmospheric Brand Glows & Celestial Star Particles */}
      <AmbientStars />

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* DESKTOP VIEWPORT (hidden md:block): 100% UNTOUCHED ORIGINAL SCROLL */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative z-10 mx-auto max-w-7xl h-full px-5 sm:px-10 lg:px-16">
        {/* Center Vertical Divider Line & Pinned Glowing 4-Point Star */}
        <CenterStarDivider lineRef={centerLineRef} starRef={starRef} />

        <div className="relative md:grid md:grid-cols-2 h-full">
          {/* LEFT SIDE: Narrative */}
          <div
            ref={narrativeWrapperRef}
            className="relative md:h-full flex items-center justify-end -translate-y-16 lg:-translate-y-20 z-10"
          >
            <div className="flex flex-col items-end justify-center gap-6 pr-12 lg:pr-16 text-right">
              {/* Heading in Instrument Serif */}
              <CharacterReveal
                ref={headingRef}
                lines={TITLE_LINES}
                className="font-instrument-serif text-4xl md:text-5xl lg:text-[54px] font-normal leading-[1.08] text-zinc-100 tracking-tight max-w-md lg:max-w-lg"
              />

              {/* Description in Red Hat Display */}
              <MaskedLinesReveal
                ref={descriptionRef}
                lines={DESC_LINES}
                className="font-red-hat-display text-base text-zinc-400 font-normal leading-relaxed max-w-sm lg:max-w-md"
                setLineRef={(el, idx) => {
                  descLinesRef.current[idx] = el;
                }}
              />

              {/* Call to Action Button */}
              <StrokeButton
                ref={ctaRef}
                rectRef={rectBorderRef}
                textRef={ctaTextRef}
                href="#footer"
                text="Let's build something"
              />
            </div>
          </div>

          {/* RIGHT SIDE: Smooth Scroll-Driven Moving Steps Track */}
          <div className="relative h-full overflow-visible flex items-start pl-12 lg:pl-16 pointer-events-auto">
            <div
              ref={rightTrackRef}
              className="flex flex-col gap-52 will-change-transform w-full"
            >
              {PROCESS_STEPS.map((step, idx) => (
                <ProcessStepItem
                  key={step.id}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  step={step}
                  onClick={() => scrollToStep(idx)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* MOBILE VIEWPORT (block md:hidden): AUTHENTIC RICARDO CHANCE FLOW   */}
      {/* Narrative at top, followed by editorial steps & sticky center star */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="block md:hidden relative z-10 w-full px-6 sm:px-10 py-16 sm:py-24 max-w-2xl mx-auto">
        {/* Top Narrative Block */}
        <div className="flex flex-col items-start text-left mb-16 sm:mb-24">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 font-medium">
              Our Process
            </span>
          </div>

          {/* Headline */}
          <h2 className="font-instrument-serif text-3xl sm:text-4xl text-zinc-100 font-normal leading-[1.1] tracking-tight">
            A process built around<br />
            <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 via-zinc-200 to-[var(--brand-cyan)]">
              clarity and craft.
            </span>
          </h2>

          {/* Description */}
          <p className="font-red-hat-display text-sm sm:text-base text-zinc-400 font-normal leading-relaxed mt-3.5 max-w-md">
            No surprises, no handoff chaos. Just a clear path from the first
            conversation to a product that works.
          </p>

          {/* CTA */}
          <div className="mt-6">
            <StrokeButton href="#footer" text="Let's build something" />
          </div>
        </div>

        {/* Steps Container with Continuous Left Hairline and Sticky Center Star */}
        <div className="relative pl-8 sm:pl-12 flex flex-col gap-28 sm:gap-36 pb-16">
          {/* Full-height Vertical Hairline with Sticky Star pinned at screen center */}
          <div className="absolute top-0 bottom-0 left-0 w-px pointer-events-none">
            {/* Hairline gradient */}
            <div className="absolute inset-0 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0" />

            {/* Sticky 4-Point Star pinned at viewport center (top-1/2) during mobile scroll */}
            <div className="sticky top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 flex items-center justify-center pointer-events-none z-20">
              <div className="relative flex items-center justify-center">
                {/* Star Ambient Halo & Cyan Blur */}
                <div className="absolute w-10 h-10 rounded-full bg-white/25 blur-md animate-pulse" />
                <div className="absolute w-16 h-16 rounded-full bg-[var(--brand-cyan)]/30 blur-xl pointer-events-none" />

                {/* 4-Point Star SVG (exact Ricardo Chance geometry) */}
                <svg
                  className="relative w-6 h-6 sm:w-7 sm:h-7 text-white drop-shadow-[0_0_14px_rgba(255,255,255,0.95)] drop-shadow-[0_0_24px_rgba(0,181,226,0.7)]"
                  viewBox="0 0 57 57"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M28.2842 -0.000976562C28.2867 0.0402974 29.1893 15.0456 35.3555 21.2119C41.5178 27.3743 56.5082 28.2796 56.5684 28.2832C56.5082 28.2868 41.5178 29.1922 35.3555 35.3545C29.1893 41.5208 28.2867 56.5261 28.2842 56.5674C28.2816 56.5236 27.3786 41.5202 21.2129 35.3545C15.0381 29.1798 0 28.2832 0 28.2832C0 28.2832 15.0381 27.3866 21.2129 21.2119C27.3786 15.0462 28.2816 0.0428417 28.2842 -0.000976562Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 4 Process Steps in Authentic Editorial Layout */}
          {PROCESS_STEPS.map((step) => (
            <div
              key={step.id}
              className="mobile-step-item flex flex-col opacity-35 transition-all duration-500 will-change-transform ease-out group"
            >
              {/* Step Number & Sparkle */}
              <div className="flex items-center gap-2 mb-2">
                <span className="mobile-step-num font-mono text-sm sm:text-base font-medium tracking-wider text-zinc-500 transition-colors duration-500 group-[.is-active]:text-[var(--brand-cyan)] group-[.is-active]:font-semibold">
                  {step.id}
                </span>
                <span className="mobile-step-sparkle text-[var(--brand-cyan)] text-xs opacity-0 transition-opacity duration-500 group-[.is-active]:opacity-100 drop-shadow-[0_0_8px_var(--brand-cyan)]">
                  ✦
                </span>
              </div>

              {/* Step Title in Instrument Serif */}
              <h3 className="mobile-step-title font-instrument-serif text-3xl sm:text-4xl font-normal leading-[1.12] text-zinc-400 transition-all duration-500 mb-3 group-[.is-active]:text-white group-[.is-active]:drop-shadow-[0_0_24px_rgba(255,255,255,0.6)] group-[.is-active]:translate-x-1">
                {step.title}
              </h3>

              {/* Step Description in Red Hat Display */}
              <p className="mobile-step-desc font-red-hat-display text-sm sm:text-base font-normal leading-relaxed text-zinc-500 transition-colors duration-500 max-w-md group-[.is-active]:text-zinc-200">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
