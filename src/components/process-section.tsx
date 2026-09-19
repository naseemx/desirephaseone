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
import { ContactCtaSection } from "@/components/contact-cta-section";
import { ServiceHome } from "@/components/service-home";
import { MissionVisionSection } from "@/components/mission-vision-section";
import { ContactForm } from "@/components/contact-form";
import { GeoLocationSection } from "@/components/geo-location-section";

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
  const ctaLayerRef = useRef<HTMLDivElement>(null);
  const processContentRef = useRef<HTMLDivElement>(null);
  const serviceLayerRef = useRef<HTMLDivElement>(null);
  const missionLayerRef = useRef<HTMLDivElement>(null);
  const contactLayerRef = useRef<HTMLDivElement>(null);
  const locationLayerRef = useRef<HTMLDivElement>(null);
  const centerLineRef = useRef<HTMLDivElement>(null);
  const starRef = useRef<HTMLDivElement>(null);
  const desktopServiceScrollRef = useRef<number>(0);

  // Left narrative refs (desktop)
  const narrativeWrapperRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const descLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const ctaTextRef = useRef<HTMLSpanElement>(null);
  const rectBorderRef = useRef<SVGRectElement>(null);

  // Mobile narrative and track refs
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const mobileNarrativeRef = useRef<HTMLDivElement>(null);
  const mobileBadgeRef = useRef<HTMLDivElement>(null);
  const mobileHeadingRef = useRef<HTMLHeadingElement>(null);
  const mobileDescriptionRef = useRef<HTMLDivElement>(null);
  const mobileDescLinesRef = useRef<(HTMLDivElement | null)[]>([]);
  const mobileCtaRef = useRef<HTMLAnchorElement>(null);
  const mobileCtaTextRef = useRef<HTMLSpanElement>(null);
  const mobileRectBorderRef = useRef<SVGRectElement>(null);

  // Right side track and steps (desktop)
  const rightTrackRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const activeStepRef = useRef<number>(-1);
  const mobileActiveStepRef = useRef<number>(-1);
  const mobileActiveColRef = useRef<number>(-1);

  // GSAP Responsive Media Query Choreography
  useGSAP(
    () => {
      if (!sectionRef.current) return;

      const mm = gsap.matchMedia();

      // ─────────────────────────────────────────────────────────────────────────
      // DESKTOP (min-width: 768px): STAGED CTA INTRO & IN-PLACE PROCESS FADE-IN
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
        const ctaLayer = ctaLayerRef.current;
        const processContent = processContentRef.current;
        const serviceLayer = serviceLayerRef.current;
        const missionLayer = missionLayerRef.current;
        const contactLayer = contactLayerRef.current;
        const locationLayer = locationLayerRef.current;
        const centerLine = centerLineRef.current;
        const star = starRef.current;
        const heading = headingRef.current;
        const cta = ctaRef.current;
        const ctaText = ctaTextRef.current;
        const rectBorder = rectBorderRef.current;
        const rightTrack = rightTrackRef.current;
        const stepEls = stepRefs.current.filter(Boolean) as HTMLDivElement[];
        const descLines = descLinesRef.current.filter(Boolean) as HTMLDivElement[];

        const ctaContent = ctaLayer?.querySelector<HTMLDivElement>(".cta-content-wrapper");
        const ctaLine0 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-0");
        const ctaLine1 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-1");
        const ctaLine2 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-2");

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

        if (ctaLine0 && ctaLine1 && ctaLine2 && ctaContent) {
          gsap.set(ctaLine0, { x: () => getLeftOffscreenX(ctaLine0), opacity: 0, force3D: true });
          gsap.set(ctaLine1, { x: () => getRightOffscreenX(ctaLine1), opacity: 0, force3D: true });
          gsap.set(ctaLine2, { x: () => getLeftOffscreenX(ctaLine2), opacity: 0, force3D: true });
          gsap.set(ctaContent, { opacity: 0, scale: 0.95, force3D: true });
        }

        let ctaState: "hidden" | "visible" = "hidden";
        const playAutoCtaIntro = () => {
          if (ctaState === "visible") return;
          ctaState = "visible";
          if (ctaContent && ctaLine0 && ctaLine1 && ctaLine2) {
            gsap.killTweensOf([ctaContent, ctaLine0, ctaLine1, ctaLine2]);
            gsap.to(ctaContent, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", force3D: true });
            gsap.fromTo(
              ctaLine0,
              { x: () => getLeftOffscreenX(ctaLine0), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.08, force3D: true }
            );
            gsap.fromTo(
              ctaLine1,
              { x: () => getRightOffscreenX(ctaLine1), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.24, force3D: true }
            );
            gsap.fromTo(
              ctaLine2,
              { x: () => getLeftOffscreenX(ctaLine2), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.15, ease: "power3.out", delay: 0.40, force3D: true }
            );
          }
        };

        const playAutoCtaOutro = () => {
          if (ctaState === "hidden") return;
          ctaState = "hidden";
          if (ctaContent && ctaLine0 && ctaLine1 && ctaLine2) {
            gsap.killTweensOf([ctaContent, ctaLine0, ctaLine1, ctaLine2]);
            gsap.to(ctaLine0, { x: () => getLeftOffscreenX(ctaLine0) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaLine1, { x: () => getRightOffscreenX(ctaLine1) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaLine2, { x: () => getLeftOffscreenX(ctaLine2) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaContent, {
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
              ease: "power2.inOut",
              force3D: true,
              onComplete: () => {
                if (ctaState === "hidden") {
                  gsap.set(ctaLine0, { x: () => getLeftOffscreenX(ctaLine0), opacity: 0, force3D: true });
                  gsap.set(ctaLine1, { x: () => getRightOffscreenX(ctaLine1), opacity: 0, force3D: true });
                  gsap.set(ctaLine2, { x: () => getLeftOffscreenX(ctaLine2), opacity: 0, force3D: true });
                  gsap.set(ctaContent, { opacity: 0, scale: 0.95, force3D: true });
                }
              },
            });
          }
        };

        // Initial visibility of ProcessSection:
        // When user lands at top of page, start hidden with pointerEvents: none so HeroCanvas is visible & interactive.
        // If reloading mid-page (scrollY > 50), show immediately.
        if (typeof window !== "undefined") {
          if (window.scrollY > 50) {
            gsap.set(section, { opacity: 1, pointerEvents: "auto", force3D: true });
          } else {
            gsap.set(section, { opacity: 0, pointerEvents: "none", force3D: true });
          }
        }

        if (ctaLayer) {
          gsap.set(ctaLayer, { opacity: 1, pointerEvents: "auto", force3D: true });
        }
        if (processContent) {
          gsap.set(processContent, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (serviceLayer) {
          gsap.set(serviceLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (missionLayer) {
          gsap.set(missionLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (contactLayer) {
          gsap.set(contactLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (locationLayer) {
          gsap.set(locationLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        desktopServiceScrollRef.current = 0;

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

        // Master scrubbed timeline: 9600px provides snappy, responsive progressive storytelling
        // Phase 1-3: CTA Intro & Crossfade into Process (0 -> 3.8s)
        // Phase 4: Process Storytelling (3.8 -> 11.0s)
        // Phase 4.5: Step 04 reading hold (11.0 -> 11.5s)
        // Phase 5a: ProcessSection clean fade-out (11.5 -> 12.3s)
        // Phase 5b: ServiceHome smooth fade-in after Process completely dissolves (12.4 -> 13.3s)
        // Phase 6: ServiceHome scroll-driven cards showcase (13.3 -> 18.8s)
        // Phase 6b: Final cards reading hold (18.8 -> 19.5s)
        // Phase 7a: ServiceHome clean fade-out (19.5 -> 20.3s)
        // Phase 7b: MissionVision smooth fade-in after ServiceHome completely dissolves (20.4 -> 21.3s)
        // Phase 7c: MissionVision reading hold (21.3 -> 23.8s)
        // Phase 7d: MissionVision clean fade-out (23.8 -> 24.6s)
        // Phase 7e: ContactForm smooth fade-in after MissionVision completely dissolves (24.7 -> 25.6s)
        // Phase 8a: ContactForm reading & interaction hold (25.6 -> 28.1s)
        // Phase 8b: ContactForm clean fade-out (28.1 -> 28.9s)
        // Phase 9a: GeoLocationSection smooth fade-in (29.0 -> 29.9s)
        // Phase 9b: GeoLocationSection reading hold (29.9 -> 32.4s)
        // Phase 10: Buffer before Footer unpin (32.4 -> 32.8s)
        const scrollDistance = 12000;

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
              if (typeof window !== "undefined" && window.scrollY > 50) {
                playAutoCtaIntro();
              }
            },
            onLeaveBack: () => {
              playAutoCtaOutro();
            },
            onUpdate: (self) => {
              if (self.progress >= 0.12 && self.direction === 1) {
                playAutoCtaOutro();
              } else if (self.progress < 0.08 && self.direction === -1) {
                playAutoCtaIntro();
              }
              if (ctaLayer && processContent && serviceLayer && missionLayer && contactLayer && locationLayer) {
                if (self.progress < 0.12) {
                  ctaLayer.style.pointerEvents = "auto";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.12 && self.progress < 0.38) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "auto";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.38 && self.progress < 0.62) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "auto";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.62 && self.progress < 0.75) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "auto";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.75 && self.progress < 0.88) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "auto";
                  locationLayer.style.pointerEvents = "none";
                } else {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "auto";
                }
              }

              if (self.progress >= 0.12 && self.progress <= 0.38) {
                const trackStartProgress = 4.2 / 32.8; // 0.1280
                const trackEndProgress = 11.0 / 32.8;   // 0.3354
                const trackProgress = Math.max(
                  0,
                  Math.min(1, (self.progress - trackStartProgress) / (trackEndProgress - trackStartProgress))
                );
                const currentY = startY + trackProgress * (endY - startY);

                let newClosest = -1;
                let minDiff = Infinity;
                stepCenters.forEach((center, idx) => {
                  const stepViewportY = currentY + center;
                  const diff = Math.abs(stepViewportY - centerTarget);
                  if (diff < minDiff) {
                    minDiff = diff;
                    newClosest = idx;
                  }
                });

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
              }
            },
          },
        });

        timelineRef.current = tl;

        // ─────────────────────────────────────────────────────────────────
        // PHASE 1-2: CTA reading hold window while revealed automatically (t = 0.0 -> 2.8)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 2.8 }, 0);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 3: Immediate Crossfade: As CTA fades out, ProcessSection immediately fades in (t = 2.8 -> 3.8)
        // ─────────────────────────────────────────────────────────────────
        if (ctaLayer) {
          tl.to(ctaLayer, { opacity: 0, scale: 0.92, duration: 1.0, ease: "power2.inOut", force3D: true }, 2.8);
        }

        // ProcessSection immediately starts fading in in-place as CTA fades out!
        if (processContent) {
          tl.fromTo(
            processContent,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out", force3D: true },
            2.8
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 4: Process Storytelling Timeline (t = 3.8 -> 11.0)
        // ─────────────────────────────────────────────────────────────────
        // 1. Center hairline shoots up quickly (t = 3.8 -> 4.5)
        tl.fromTo(
          centerLine,
          { scaleY: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 0.7,
            ease: "power2.out",
            force3D: true,
          },
          3.8
        );

        // 2. Star blooms at center as line reaches it (t = 4.05 -> 4.55)
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
          4.05
        );

        // 3. Title typewriter glow (t = 4.05 -> 4.6)
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
            4.05
          );
        }

        // 4. Description lines rising from mask (t = 4.4 -> 5.05)
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
            4.4
          );
        }

        // 5. CTA button border draw + text illumination (t = 4.4 -> 5.05)
        if (rectBorder) {
          tl.fromTo(
            rectBorder,
            { strokeDashoffset: 100 },
            {
              strokeDashoffset: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            4.4
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
          4.4
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
            4.4
          );
        }

        // 6. Right track moves continuously from startY to endY (t = 4.2 -> 11.0)
        tl.to(
          rightTrack,
          {
            y: endY,
            duration: 6.8,
            ease: "none",
            force3D: true,
          },
          4.2
        );

        // 7. Step blooming & dimming
        stepEls.forEach((el, idx) => {
          const stepTargetY = centerTarget - stepCenters[idx];
          const fraction = (stepTargetY - startY) / (endY - startY);
          const centerTime = Math.max(5.0, Math.min(10.8, 4.2 + fraction * 6.8));

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
            Math.max(4.2, centerTime - 0.9)
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

        // ─────────────────────────────────────────────────────────────────
        // PHASE 4.5: Step 04 reading hold (t = 11.0 -> 11.5)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 0.5 }, 11.0);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 5a: ProcessSection cleanly & smoothly fades out (t = 11.5 -> 12.3)
        // ─────────────────────────────────────────────────────────────────
        if (processContent) {
          tl.to(
            processContent,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            11.5
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 5b: ServiceHome smoothly fades in ONLY AFTER Process completely fades out (t = 12.4 -> 13.3)
        // ─────────────────────────────────────────────────────────────────
        if (serviceLayer) {
          tl.fromTo(
            serviceLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
            12.4
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 6: Desktop ServiceHome horizontal cards move right-to-left as user scrolls down (t = 13.3 -> 18.8)
        // ─────────────────────────────────────────────────────────────────
        const desktopServiceProxy = { progress: 0 };
        tl.fromTo(
          desktopServiceProxy,
          { progress: 0 },
          {
            progress: 1,
            duration: 5.5,
            ease: "none",
            onUpdate: () => {
              desktopServiceScrollRef.current = desktopServiceProxy.progress;
            },
          },
          13.3
        );

        // 8b. Reading hold on the final cards (t = 18.8 -> 19.5)
        tl.to({}, { duration: 0.7 }, 18.8);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 7a: ServiceHome cleanly & smoothly fades out after all cards are shown (t = 19.5 -> 20.3)
        // ─────────────────────────────────────────────────────────────────
        if (serviceLayer) {
          tl.to(
            serviceLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            19.5
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 7b: MissionVision smoothly fades in ONLY AFTER ServiceHome completely fades out (t = 20.4 -> 21.3)
        // ─────────────────────────────────────────────────────────────────
        if (missionLayer) {
          tl.fromTo(
            missionLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
            20.4
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 7c: MissionVision reading hold (t = 21.3 -> 23.8)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 2.5 }, 21.3);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 7d: MissionVision cleanly & smoothly fades out (t = 23.8 -> 24.6)
        // ─────────────────────────────────────────────────────────────────
        if (missionLayer) {
          tl.to(
            missionLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            23.8
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 7e: ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 24.7 -> 25.6)
        // ─────────────────────────────────────────────────────────────────
        if (contactLayer) {
          tl.fromTo(
            contactLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
            24.7
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 8a: ContactForm reading & interaction hold (t = 25.6 -> 28.1)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 2.5 }, 25.6);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 8b: ContactForm cleanly & smoothly fades out (t = 28.1 -> 28.9)
        // ─────────────────────────────────────────────────────────────────
        if (contactLayer) {
          tl.to(
            contactLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            28.1
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 9a: GeoLocationSection smoothly fades in ONLY AFTER ContactForm completely dissolves (t = 29.0 -> 29.9)
        // ─────────────────────────────────────────────────────────────────
        if (locationLayer) {
          tl.fromTo(
            locationLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
            29.0
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 9b: GeoLocationSection reading hold (t = 29.9 -> 32.4)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 2.5 }, 29.9);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 10: Buffer before smooth unpinning directly to Footer (t = 32.4 -> 32.8)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 0.4 }, 32.4);

        // Trigger auto reveal immediately ONLY if actually active on mount (e.g. reload or anchor)
        if (typeof window !== "undefined" && section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 50 && rect.bottom > 200 && window.scrollY > 100) {
            playAutoCtaIntro();
          }
        }

        // ── Custom Crossfade Handlers (Handoff with HeroCanvas) ───────────
        const handleFadeToProcess = () => {
          if (!section) return;
          gsap.killTweensOf(section);
          section.style.pointerEvents = "auto";
          gsap.to(section, {
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            force3D: true,
            onComplete: () => {
              document.body.style.overflow = "auto";
              document.documentElement.style.overflow = "auto";
              (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = false;
              const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
              lenis?.start();
              ScrollTrigger.refresh();
            },
          });

          // Delay the text intro slightly so the section background and stars fade in first over the last frame,
          // allowing the editorial text lines to glide in cleanly and visibly
          gsap.delayedCall(0.45, () => {
            playAutoCtaIntro();
          });
        };

        const handleFadeToHero = () => {
          if (!section) return;
          playAutoCtaOutro();
          gsap.killTweensOf(section);
          gsap.to(section, {
            opacity: 0,
            duration: 0.6,
            ease: "power2.inOut",
            force3D: true,
            onComplete: () => {
              section.style.pointerEvents = "none";
            },
          });
        };

        window.addEventListener("hero:fade-to-process", handleFadeToProcess);
        window.addEventListener("hero:fade-to-hero", handleFadeToHero);

        return () => {
          window.removeEventListener("hero:fade-to-process", handleFadeToProcess);
          window.removeEventListener("hero:fade-to-hero", handleFadeToHero);
        };
      });

      // ─────────────────────────────────────────────────────────────────────────
      // MOBILE (max-width: 767px): STAGED CTA INTRO & IN-PLACE PROCESS FADE-IN
      // ─────────────────────────────────────────────────────────────────────────
      mm.add("(max-width: 767px)", () => {
        const section = sectionRef.current;
        const ctaLayer = ctaLayerRef.current;
        const processContent = processContentRef.current;
        const serviceLayer = serviceLayerRef.current;
        const missionLayer = missionLayerRef.current;
        const contactLayer = contactLayerRef.current;
        const locationLayer = locationLayerRef.current;
        const mobileTrack = mobileTrackRef.current;
        const heading = mobileHeadingRef.current;
        const badge = mobileBadgeRef.current;
        const cta = mobileCtaRef.current;
        const ctaText = mobileCtaTextRef.current;
        const rectBorder = mobileRectBorderRef.current;
        const descLines = mobileDescLinesRef.current.filter(Boolean) as HTMLDivElement[];

        const ctaContent = ctaLayer?.querySelector<HTMLDivElement>(".cta-content-wrapper");
        const ctaLine0 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-0");
        const ctaLine1 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-1");
        const ctaLine2 = ctaLayer?.querySelector<HTMLDivElement>(".cta-line-2");

        const titleChars = heading
          ? Array.from(heading.querySelectorAll<HTMLSpanElement>(".char-item"))
          : [];

        const mobileSteps = Array.from(
          section?.querySelectorAll<HTMLDivElement>(".mobile-step-item") ?? []
        );

        // Computes mobile offscreen X position past the left edge of the viewport
        const getMobileLeftOffscreenX = (el: HTMLElement | null) => {
          if (typeof window === "undefined") return -600;
          const vw = window.innerWidth;
          const elW = el?.offsetWidth || 200;
          return -(vw / 2 + elW / 2 + 40);
        };

        // Computes mobile offscreen X position past the right edge of the viewport
        const getMobileRightOffscreenX = (el: HTMLElement | null) => {
          if (typeof window === "undefined") return 600;
          const vw = window.innerWidth;
          const elW = el?.offsetWidth || 200;
          return (vw / 2 + elW / 2 + 40);
        };

        // Initial setup for CTA lines
        if (ctaLine0 && ctaLine1 && ctaLine2 && ctaContent) {
          gsap.set(ctaLine0, { x: () => getMobileLeftOffscreenX(ctaLine0), opacity: 0, force3D: true });
          gsap.set(ctaLine1, { x: () => getMobileRightOffscreenX(ctaLine1), opacity: 0, force3D: true });
          gsap.set(ctaLine2, { x: () => getMobileLeftOffscreenX(ctaLine2), opacity: 0, force3D: true });
          gsap.set(ctaContent, { opacity: 0, scale: 0.95, force3D: true });
        }

        let mobileCtaState: "hidden" | "visible" = "hidden";
        const playMobileAutoCtaIntro = () => {
          if (mobileCtaState === "visible") return;
          mobileCtaState = "visible";
          if (ctaContent && ctaLine0 && ctaLine1 && ctaLine2) {
            gsap.killTweensOf([ctaContent, ctaLine0, ctaLine1, ctaLine2]);
            gsap.to(ctaContent, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out", force3D: true });
            gsap.fromTo(
              ctaLine0,
              { x: () => getMobileLeftOffscreenX(ctaLine0), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.08, force3D: true }
            );
            gsap.fromTo(
              ctaLine1,
              { x: () => getMobileRightOffscreenX(ctaLine1), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.24, force3D: true }
            );
            gsap.fromTo(
              ctaLine2,
              { x: () => getMobileLeftOffscreenX(ctaLine2), opacity: 0 },
              { x: 0, opacity: 1, duration: 1.1, ease: "power3.out", delay: 0.40, force3D: true }
            );
          }
        };

        const playMobileAutoCtaOutro = () => {
          if (mobileCtaState === "hidden") return;
          mobileCtaState = "hidden";
          if (ctaContent && ctaLine0 && ctaLine1 && ctaLine2) {
            gsap.killTweensOf([ctaContent, ctaLine0, ctaLine1, ctaLine2]);
            gsap.to(ctaLine0, { x: () => getMobileLeftOffscreenX(ctaLine0) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaLine1, { x: () => getMobileRightOffscreenX(ctaLine1) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaLine2, { x: () => getMobileLeftOffscreenX(ctaLine2) * 0.45, opacity: 0, duration: 0.5, ease: "power2.in", force3D: true });
            gsap.to(ctaContent, {
              opacity: 0,
              scale: 0.95,
              duration: 0.5,
              ease: "power2.inOut",
              force3D: true,
              onComplete: () => {
                if (mobileCtaState === "hidden") {
                  gsap.set(ctaLine0, { x: () => getMobileLeftOffscreenX(ctaLine0), opacity: 0, force3D: true });
                  gsap.set(ctaLine1, { x: () => getMobileRightOffscreenX(ctaLine1), opacity: 0, force3D: true });
                  gsap.set(ctaLine2, { x: () => getMobileLeftOffscreenX(ctaLine2), opacity: 0, force3D: true });
                  gsap.set(ctaContent, { opacity: 0, scale: 0.95, force3D: true });
                }
              },
            });
          }
        };

        // Initial visibility of ProcessSection on Mobile
        if (typeof window !== "undefined") {
          if (window.scrollY > 50) {
            gsap.set(section, { opacity: 1, pointerEvents: "auto", force3D: true });
          } else {
            gsap.set(section, { opacity: 0, pointerEvents: "none", force3D: true });
          }
        }

        if (ctaLayer) {
          gsap.set(ctaLayer, { opacity: 1, pointerEvents: "auto", force3D: true });
        }
        if (processContent) {
          gsap.set(processContent, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (serviceLayer) {
          gsap.set(serviceLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (missionLayer) {
          gsap.set(missionLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (contactLayer) {
          gsap.set(contactLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }
        if (locationLayer) {
          gsap.set(locationLayer, { opacity: 0, scale: 0.96, pointerEvents: "none", force3D: true });
        }

        // Set initial states for mobile narrative
        if (badge) {
          gsap.set(badge, { opacity: 0, y: 12 });
        }
        if (titleChars.length > 0) {
          gsap.set(titleChars, { opacity: 0 });
        }
        if (descLines.length > 0) {
          gsap.set(descLines, {
            yPercent: 140,
            opacity: 0,
            force3D: true,
          });
        }
        if (rectBorder) {
          gsap.set(rectBorder, {
            strokeDasharray: 100,
            strokeDashoffset: 100,
          });
        }
        if (cta) {
          gsap.set(cta, { backgroundColor: "rgba(0, 181, 226, 0)" });
        }
        if (ctaText) {
          gsap.set(ctaText, {
            opacity: 0.4,
            y: 4,
          });
        }

        const stepsWindow = mobileTrack?.parentElement;
        const stepsWindowH = stepsWindow?.clientHeight || 340;
        const centerTarget = stepsWindowH / 2;

        const mobileStepCenters = mobileSteps.map(
          (el) => el.offsetTop + el.offsetHeight / 2
        );
        const startY = centerTarget - (mobileStepCenters[0] ?? 0);
        const lastStepCenter =
          mobileStepCenters[mobileStepCenters.length - 1] ?? (mobileStepCenters[0] ?? 0) + 360;
        const mobileEndY = centerTarget - lastStepCenter;

        if (mobileTrack) {
          gsap.set(mobileTrack, { y: startY, force3D: true });
        }

        mobileSteps.forEach((step) => {
          gsap.set(step, { opacity: 0.3, force3D: true });
        });

        const mobileServiceTrack = serviceLayer?.querySelector<HTMLDivElement>(".mobile-service-cards-track");
        const mobileTopCards = serviceLayer?.querySelectorAll<HTMLElement>(".mobile-card-top");
        const mobileBottomCards = serviceLayer?.querySelectorAll<HTMLElement>(".mobile-card-bottom");
        const totalServiceCols = mobileTopCards?.length || 8;

        // Computes the exact track X position to place column `colIdx` dead-center in the viewport
        const getColumnCenterTrackX = (colIdx: number) => {
          if (!mobileServiceTrack) return 0;
          const parentW = mobileServiceTrack.parentElement?.clientWidth || window.innerWidth;
          const firstCard = mobileTopCards?.[0];
          const secondCard = mobileTopCards?.[1];
          const cardW = firstCard?.offsetWidth || 270;
          const gap =
            secondCard && firstCard && secondCard.offsetLeft > firstCard.offsetLeft
              ? secondCard.offsetLeft - (firstCard.offsetLeft + cardW)
              : 14;
          const trackX0 = (parentW - cardW) / 2;
          return trackX0 - colIdx * (cardW + gap);
        };

        if (mobileServiceTrack) {
          gsap.set(mobileServiceTrack, { x: () => getColumnCenterTrackX(0), force3D: true });
        }

        if (mobileTopCards && mobileBottomCards) {
          mobileTopCards.forEach((c, idx) => {
            if (idx === 0) c.classList.add("is-active");
            else c.classList.remove("is-active");
          });
          mobileBottomCards.forEach((c, idx) => {
            if (idx === 0) c.classList.add("is-active");
            else c.classList.remove("is-active");
          });
        }

        // Master pinned mobile stage: CTA intro -> Process narrative & steps track -> Process clean fade-out -> ServiceHome smooth fade-in -> ServiceHome cards move and stop in center -> ServiceHome clean fade-out -> MissionVision smooth fade-in -> MissionVision hold & clean fade-out -> ContactForm smooth fade-in -> ContactForm fade-out -> GeoLocationSection smooth fade-in -> GeoLocationSection unpin to Footer
        const mobileScrollDist = 10200;
        // Reset dirty-check refs on mobile init
        mobileActiveStepRef.current = -1;
        mobileActiveColRef.current = -1;

        const mobileTl = gsap.timeline({
          defaults: { immediateRender: false },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${mobileScrollDist}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            fastScrollEnd: true,
            onEnter: () => {
              if (typeof window !== "undefined" && window.scrollY > 50) {
                playMobileAutoCtaIntro();
              }
            },
            onLeaveBack: () => {
              playMobileAutoCtaOutro();
            },
            onUpdate: (self) => {
              if (self.progress >= 0.12 && self.direction === 1) {
                playMobileAutoCtaOutro();
              } else if (self.progress < 0.08 && self.direction === -1) {
                playMobileAutoCtaIntro();
              }
              if (ctaLayer && processContent && serviceLayer && missionLayer && contactLayer && locationLayer) {
                if (self.progress < 0.10) {
                  ctaLayer.style.pointerEvents = "auto";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.10 && self.progress < 0.35) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "auto";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.35 && self.progress < 0.61) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "auto";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.61 && self.progress < 0.74) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "auto";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "none";
                } else if (self.progress >= 0.74 && self.progress < 0.87) {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "auto";
                  locationLayer.style.pointerEvents = "none";
                } else {
                  ctaLayer.style.pointerEvents = "none";
                  processContent.style.pointerEvents = "none";
                  serviceLayer.style.pointerEvents = "none";
                  missionLayer.style.pointerEvents = "none";
                  contactLayer.style.pointerEvents = "none";
                  locationLayer.style.pointerEvents = "auto";
                }
              }

              // Mobile step highlighting with dirty-check guard
              if (self.progress >= 0.12 && self.progress <= 0.35) {
                const trackStartProgress = 3.6 / 31.0; // ~0.1161
                const trackEndProgress = 8.8 / 31.0;   // ~0.2839
                const trackProgress = Math.max(
                  0,
                  Math.min(1, (self.progress - trackStartProgress) / (trackEndProgress - trackStartProgress))
                );
                const currentY = startY + trackProgress * (mobileEndY - startY);

                let newClosest = -1;
                let minDiff = Infinity;
                for (let idx = 0; idx < mobileStepCenters.length; idx++) {
                  const stepViewportY = currentY + mobileStepCenters[idx];
                  const diff = Math.abs(stepViewportY - centerTarget);
                  if (diff < minDiff) {
                    minDiff = diff;
                    newClosest = idx;
                  }
                }

                // Only toggle classes when active step actually changed
                if (newClosest !== mobileActiveStepRef.current) {
                  mobileActiveStepRef.current = newClosest;
                  for (let idx = 0; idx < mobileSteps.length; idx++) {
                    if (idx === newClosest) {
                      mobileSteps[idx].classList.add("is-active");
                    } else {
                      mobileSteps[idx].classList.remove("is-active");
                    }
                  }
                }
              }

              // Dynamic 2-card column active color focus on mobile ServiceHome
              if (
                self.progress >= 0.37 &&
                self.progress <= 0.77 &&
                mobileTopCards &&
                mobileBottomCards &&
                mobileTopCards.length > 0 &&
                mobileServiceTrack
              ) {
                const currentTrackX = gsap.getProperty(mobileServiceTrack, "x") as number;
                let closestCol = 0;
                let minDiff = Infinity;
                for (let i = 0; i < totalServiceCols; i++) {
                  const diff = Math.abs(currentTrackX - getColumnCenterTrackX(i));
                  if (diff < minDiff) {
                    minDiff = diff;
                    closestCol = i;
                  }
                }

                // Only toggle classes when active column actually changed
                if (closestCol !== mobileActiveColRef.current) {
                  mobileActiveColRef.current = closestCol;
                  for (let idx = 0; idx < mobileTopCards.length; idx++) {
                    if (idx === closestCol) {
                      mobileTopCards[idx].classList.add("is-active");
                    } else {
                      mobileTopCards[idx].classList.remove("is-active");
                    }
                  }
                  for (let idx = 0; idx < mobileBottomCards.length; idx++) {
                    if (idx === closestCol) {
                      mobileBottomCards[idx].classList.add("is-active");
                    } else {
                      mobileBottomCards[idx].classList.remove("is-active");
                    }
                  }
                }
              } else if (self.progress < 0.37) {
                if (mobileActiveColRef.current !== 0 && mobileTopCards && mobileBottomCards) {
                  mobileActiveColRef.current = 0;
                  for (let idx = 0; idx < mobileTopCards.length; idx++) {
                    if (idx === 0) mobileTopCards[idx].classList.add("is-active");
                    else mobileTopCards[idx].classList.remove("is-active");
                  }
                  for (let idx = 0; idx < mobileBottomCards.length; idx++) {
                    if (idx === 0) mobileBottomCards[idx].classList.add("is-active");
                    else mobileBottomCards[idx].classList.remove("is-active");
                  }
                }
              }
            },
          },
        });

        // 1-2. Hold moment while text intro is revealed automatically (t = 0 to 2.4)
        mobileTl.to({}, { duration: 2.4 }, 0);

        // 3. Immediate Crossfade: As CTA fades out, ProcessSection immediately fades in (t = 2.4 -> 3.4)
        if (ctaLayer) {
          mobileTl.to(ctaLayer, { opacity: 0, scale: 0.92, duration: 1.0, ease: "power2.inOut", force3D: true }, 2.4);
        }

        // Mobile Process Narrative immediately starts fading in in-place as CTA fades out!
        if (processContent) {
          mobileTl.fromTo(
            processContent,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 1.0, ease: "power2.out", force3D: true },
            2.4
          );
        }

        // 4. Mobile narrative element reveals (badge, title, desc, cta) (t = 3.2 -> 3.8)
        if (badge) {
          mobileTl.fromTo(badge, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 3.2);
        }
        if (titleChars.length > 0) {
          mobileTl.fromTo(titleChars, { opacity: 0 }, { opacity: 1, stagger: 0.024, duration: 0.35, ease: "power1.inOut" }, 3.3);
        }
        if (descLines.length > 0) {
          mobileTl.fromTo(descLines, { yPercent: 140, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.12, duration: 0.55, ease: "power2.out" }, 3.5);
        }
        if (rectBorder) {
          mobileTl.fromTo(rectBorder, { strokeDashoffset: 100 }, { strokeDashoffset: 0, duration: 0.65, ease: "power2.out" }, 3.6);
        }
        if (cta) {
          mobileTl.fromTo(cta, { backgroundColor: "rgba(0, 181, 226, 0)" }, { backgroundColor: "rgba(0, 181, 226, 0.08)", duration: 0.65, ease: "power2.out" }, 3.6);
        }
        if (ctaText) {
          mobileTl.fromTo(ctaText, { opacity: 0.4, y: 4 }, { opacity: 1, y: 0, duration: 0.65, ease: "power2.out", clearProps: "transform" }, 3.6);
        }

        // 5. Mobile Track movement (t = 3.8 -> 7.8) - ONLY the steps move up!
        if (mobileTrack) {
          mobileTl.fromTo(
            mobileTrack,
            { y: startY },
            {
              y: mobileEndY,
              duration: 4.0,
              ease: "none",
              force3D: true,
            },
            3.8
          );
        }

        // 6. Mobile Steps blooming & dimming
        mobileSteps.forEach((stepEl, idx) => {
          const stepY = mobileStepCenters[idx] ?? 0;
          const fraction =
            (stepY - (mobileStepCenters[0] ?? 0)) /
            Math.max(1, lastStepCenter - (mobileStepCenters[0] ?? 0));
          const centerTime = 3.8 + fraction * 4.0;

          mobileTl.fromTo(
            stepEl,
            { opacity: 0.3 },
            {
              opacity: 1,
              duration: 0.5,
              ease: "power1.out",
              onStart: () => {
                stepEl.classList.add("is-active");
              },
              onReverseComplete: () => {
                stepEl.classList.remove("is-active");
              },
            },
            Math.max(3.6, centerTime - 0.5)
          );

          if (idx < mobileSteps.length - 1) {
            mobileTl.to(
              stepEl,
              {
                opacity: 0.3,
                duration: 0.5,
                ease: "power1.in",
                onComplete: () => {
                  stepEl.classList.remove("is-active");
                },
                onReverseComplete: () => {
                  stepEl.classList.add("is-active");
                },
              },
              centerTime + 0.3
            );
          }
        });

        // Step 04 reading hold on mobile (t = 7.8 -> 8.3)
        mobileTl.to({}, { duration: 0.5 }, 7.8);

        // 7a. Phase 5a: Mobile ProcessSection cleanly & smoothly fades out (t = 8.3 -> 9.0)
        if (processContent) {
          mobileTl.to(
            processContent,
            { opacity: 0, scale: 0.94, duration: 0.7, ease: "power1.inOut", force3D: true },
            8.3
          );
        }

        // 7b. Phase 5b: Mobile ServiceHome smoothly fades in ONLY AFTER Process completely fades out (t = 9.1 -> 9.9)
        if (serviceLayer) {
          mobileTl.fromTo(
            serviceLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
            9.1
          );
        }

        // 8. Phase 6: Mobile ServiceHome horizontal cards track - stepped movement where each card stops in the center (t = 9.9 -> 18.0)
        if (mobileServiceTrack) {
          const moveDuration = 0.55;
          const normalHold = 0.5;
          const finalHold = 0.75;
          let currentT = 9.9;

          // Initial hold for Column 0 (already centered on fade-in)
          mobileTl.to({}, { duration: normalHold }, currentT);
          currentT += normalHold;

          // Step through columns 1 to totalServiceCols - 1
          for (let col = 1; col < totalServiceCols; col++) {
            const isLast = col === totalServiceCols - 1;
            const holdTime = isLast ? finalHold : normalHold;

            mobileTl.to(
              mobileServiceTrack,
              {
                x: () => getColumnCenterTrackX(col),
                duration: moveDuration,
                ease: "power2.inOut",
                force3D: true,
              },
              currentT
            );
            currentT += moveDuration;

            // Reading pause while column `col` is centered
            mobileTl.to({}, { duration: holdTime }, currentT);
            currentT += holdTime;
          }
        }

        // 9a. Phase 7a: Mobile ServiceHome cleanly & smoothly fades out after the end of the cards (t = 18.0 -> 18.8)
        if (serviceLayer) {
          mobileTl.to(
            serviceLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            18.0
          );
        }

        // 9b. Phase 7b: Mobile MissionVision smoothly fades in ONLY AFTER ServiceHome completely fades out (t = 18.9 -> 19.7)
        if (missionLayer) {
          mobileTl.fromTo(
            missionLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
            18.9
          );
        }

        // 9c. Phase 7c: Mobile MissionVision reading hold (t = 19.7 -> 22.2)
        mobileTl.to({}, { duration: 2.5 }, 19.7);

        // 9d. Phase 7d: Mobile MissionVision cleanly & smoothly fades out (t = 22.2 -> 23.0)
        if (missionLayer) {
          mobileTl.to(
            missionLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            22.2
          );
        }

        // 9e. Phase 7e: Mobile ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 23.1 -> 23.9)
        if (contactLayer) {
          mobileTl.fromTo(
            contactLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
            23.1
          );
        }

        // 9f. Phase 8a: Mobile ContactForm reading & interaction hold (t = 23.9 -> 26.4)
        mobileTl.to({}, { duration: 2.5 }, 23.9);

        // 9g. Phase 8b: Mobile ContactForm cleanly & smoothly fades out (t = 26.4 -> 27.2)
        if (contactLayer) {
          mobileTl.to(
            contactLayer,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            26.4
          );
        }

        // 10a. Phase 9a: Mobile GeoLocationSection smoothly fades in ONLY AFTER ContactForm completely dissolves (t = 27.3 -> 28.1)
        if (locationLayer) {
          mobileTl.fromTo(
            locationLayer,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
            27.3
          );
        }

        // 10b. Phase 9b: Mobile GeoLocationSection reading hold (t = 28.1 -> 30.6)
        mobileTl.to({}, { duration: 2.5 }, 28.1);

        // 11. Phase 10: Mobile buffer before smooth unpinning to Footer (t = 30.6 -> 31.0)
        mobileTl.to({}, { duration: 0.4 }, 30.6);

        // Trigger auto reveal immediately ONLY if actually active on mount
        if (typeof window !== "undefined" && section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 50 && rect.bottom > 200 && window.scrollY > 100) {
            playMobileAutoCtaIntro();
          }
        }

        // ── Custom Crossfade Handlers for Mobile (Handoff with HeroCanvas) ───────────
        const handleFadeToProcessMobile = () => {
          if (!section) return;
          gsap.killTweensOf(section);
          section.style.pointerEvents = "auto";
          gsap.to(section, {
            opacity: 1,
            duration: 0.75,
            ease: "power2.out",
            force3D: true,
            onComplete: () => {
              document.body.style.overflow = "auto";
              document.documentElement.style.overflow = "auto";
              (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = false;
              const lenis = (window as unknown as { lenis?: { start: () => void } }).lenis;
              lenis?.start();
              ScrollTrigger.refresh();
            },
          });

          // Delay the text intro slightly on mobile as well
          gsap.delayedCall(0.35, () => {
            playMobileAutoCtaIntro();
          });
        };

        const handleFadeToHeroMobile = () => {
          if (!section) return;
          playMobileAutoCtaOutro();
          gsap.killTweensOf(section);
          gsap.to(section, {
            opacity: 0,
            duration: 0.55,
            ease: "power2.inOut",
            force3D: true,
            onComplete: () => {
              section.style.pointerEvents = "none";
            },
          });
        };

        window.addEventListener("hero:fade-to-process", handleFadeToProcessMobile);
        window.addEventListener("hero:fade-to-hero", handleFadeToHeroMobile);

        return () => {
          window.removeEventListener("hero:fade-to-process", handleFadeToProcessMobile);
          window.removeEventListener("hero:fade-to-hero", handleFadeToHeroMobile);
        };
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

    const stepProgressBenchmarks = [0.19, 0.27, 0.35, 0.42];
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
      className="relative z-10 w-full h-screen overflow-hidden select-none bg-[#09090b] text-zinc-100 [contain:paint]"
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-30" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-30" />

      {/* Atmospheric Brand Glows & Celestial Star Particles */}
      <AmbientStars />

      {/* Pinned Contact CTA Layer - Centered on top of Process Content */}
      <div
        ref={ctaLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-auto h-screen"
      >
        <ContactCtaSection isStageMode />
      </div>

      {/* Process Content Wrapper (both Desktop and Mobile) */}
      <div
        ref={processContentRef}
        className="relative w-full h-full will-change-transform pointer-events-none"
        style={{ opacity: 0, transformOrigin: "50% 50%" }}
      >
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
            className="relative md:h-full flex items-center justify-end z-10"
          >
            <div className="flex flex-col items-end justify-center gap-6 pr-12 lg:pr-16 text-right">
              {/* Heading in Project Font */}
              <CharacterReveal
                ref={headingRef}
                lines={TITLE_LINES}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-bold leading-[1.12] text-zinc-100 tracking-tight max-w-md lg:max-w-lg"
              />

              {/* Description in Project Font */}
              <MaskedLinesReveal
                ref={descriptionRef}
                lines={DESC_LINES}
                className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-sm lg:max-w-md"
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
              className="flex flex-col gap-12 will-change-transform w-full"
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
      {/* MOBILE VIEWPORT (block md:hidden): PINNED TOP NARRATIVE + SCROLLING STEPS */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <div className="block md:hidden relative z-10 w-full h-full flex flex-col pt-16 sm:pt-20 pb-4 px-9 sm:px-10 max-w-lg mx-auto overflow-hidden">
        {/* Pinned Top Narrative Block: Always visible at top */}
        <div
          ref={mobileNarrativeRef}
          className="flex-shrink-0 flex flex-col items-start text-left z-20 pb-2"
        >
          {/* Eyebrow badge */}
          <div
            ref={mobileBadgeRef}
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/10 mb-2.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-300 font-semibold">
              Our Process
            </span>
          </div>

          {/* Headline with Character Reveal */}
          <CharacterReveal
            ref={mobileHeadingRef}
            lines={TITLE_LINES}
            className="text-2xl sm:text-3xl font-bold leading-[1.12] text-zinc-100 tracking-tight"
          />

          {/* Description with Masked Lines Reveal */}
          <MaskedLinesReveal
            ref={mobileDescriptionRef}
            lines={DESC_LINES}
            className="text-xs sm:text-sm text-zinc-400 font-normal leading-relaxed mt-1.5 max-w-sm"
            setLineRef={(el, idx) => {
              mobileDescLinesRef.current[idx] = el;
            }}
          />

          {/* Animated Stroke CTA Button */}
          <div className="mt-3">
            <StrokeButton
              ref={mobileCtaRef}
              rectRef={mobileRectBorderRef}
              textRef={mobileCtaTextRef}
              href="#footer"
              text="Let's build something"
            />
          </div>
        </div>

        {/* Dynamic Scrolling Steps Window below the pinned top narrative */}
        <div className="relative flex-1 min-h-0 w-full overflow-hidden mt-2 pt-2">
          {/* Top & Bottom soft gradient masks to dissolve steps smoothly */}
          <div className="absolute top-0 inset-x-0 h-6 sm:h-8 bg-gradient-to-b from-[#09090b] to-transparent z-20 pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-8 sm:h-10 bg-gradient-to-t from-[#09090b] to-transparent z-20 pointer-events-none" />

          {/* Full-height Vertical Hairline with Pinned Center Glowing Star */}
          <div className="absolute top-0 bottom-0 left-3 sm:left-4 w-px pointer-events-none z-10">
            <div className="absolute inset-0 w-px bg-gradient-to-b from-white/0 via-white/20 to-white/0" />

            {/* Glowing 4-Point Star pinned at vertical center of steps window */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 flex items-center justify-center pointer-events-none">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-white/25 blur-md animate-pulse" />
                <div className="absolute w-12 h-12 rounded-full bg-[var(--brand-cyan)]/30 blur-lg pointer-events-none" />
                <svg
                  className="relative w-5 h-5 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] drop-shadow-[0_0_20px_rgba(0,181,226,0.7)]"
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

          {/* Moving Steps Track (Only steps move!) */}
          <div
            ref={mobileTrackRef}
            className="relative pl-8 sm:pl-11 flex flex-col gap-14 sm:gap-18 will-change-transform py-4"
          >
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.id}
                className="mobile-step-item flex flex-col opacity-30 transition-all duration-500 will-change-transform ease-out group"
              >
                {/* Step Number & Sparkle */}
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="mobile-step-num text-xs sm:text-sm font-semibold tracking-wider text-zinc-500 transition-colors duration-500 group-[.is-active]:text-[var(--brand-cyan)]">
                    {step.id}
                  </span>
                  <span className="mobile-step-sparkle text-[var(--brand-cyan)] text-[10px] opacity-0 transition-opacity duration-500 group-[.is-active]:opacity-100 drop-shadow-[0_0_8px_var(--brand-cyan)]">
                    ✦
                  </span>
                </div>

                {/* Step Title in Project Font */}
                <h3 className="mobile-step-title text-xl sm:text-2xl font-bold leading-snug text-zinc-400 transition-all duration-500 mb-1 group-[.is-active]:text-white group-[.is-active]:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-[.is-active]:translate-x-1">
                  {step.title}
                </h3>

                {/* Step Description in Project Font */}
                <p className="mobile-step-desc text-xs sm:text-sm font-normal leading-relaxed text-zinc-500 transition-colors duration-500 max-w-sm group-[.is-active]:text-zinc-200">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      </div>

      {/* Pinned Service Home Layer - In-place center crossfade */}
      <div
        ref={serviceLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        <ServiceHome isStageMode scrollProgressRef={desktopServiceScrollRef} />
      </div>

      {/* Pinned Mission Vision Layer - In-place center crossfade */}
      <div
        ref={missionLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        <MissionVisionSection isStageMode />
      </div>

      {/* Pinned Contact Form Layer - In-place center crossfade */}
      <div
        ref={contactLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        <ContactForm isStageMode />
      </div>

      {/* Pinned Geo Location Layer - In-place center crossfade */}
      <div
        ref={locationLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        <GeoLocationSection isStageMode />
      </div>
    </section>
  );
}

export default ProcessSection;
