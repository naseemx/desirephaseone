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
import { Footer } from "@/components/footer";

const PROCESS_STEPS: ProcessStepData[] = [
  {
    id: "01",
    title: "Audience Identification",
    description:
      "We pinpoint key businesses needing premium LED displays, custom signage, and immersive exhibition structures to maximize exposure.",
  },
  {
    id: "02",
    title: "Concept Creation",
    description:
      "We design visually striking, client-focused concepts tailored to captivate targeted audiences and elevate overall brand presence.",
  },
  {
    id: "03",
    title: "Flawless Execution",
    description:
      "We expertly manufacture, install, and turn artistic concepts into high-performing, physical advertising products and services.",
  },
  {
    id: "04",
    title: "Enduring Connection",
    description:
      "We build lasting partnerships by delivering exceptional post-installation maintenance, reliable long-term service, and ongoing technical support.",
  },
];

// Split lines definition for Title
const TITLE_LINES = [
  { words: ["Elevating", "Brands"] },
  { words: ["Through", "Impactful"] },
  { words: ["Visual", "Experiences"] },
];

// Split lines definition for Description
const DESC_LINES = [
  "We are a premier UAE-based advertising and",
  "LED screen specialist, transforming bold vision into",
  "reality through seamlessly integrated, end-to-end",
  "design, installation, and long-term support solutions.",
];

const HIDE_SERVICE_SECTION = false;

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const ctaLayerRef = useRef<HTMLDivElement>(null);
  const processContentRef = useRef<HTMLDivElement>(null);
  const serviceLayerRef = useRef<HTMLDivElement>(null);
  const missionLayerRef = useRef<HTMLDivElement>(null);
  const contactLayerRef = useRef<HTMLDivElement>(null);
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
          !rightTrackRef.current
        )
          return;

        const section = sectionRef.current;
        const ctaLayer = ctaLayerRef.current;
        const processContent = processContentRef.current;
        const serviceLayer = serviceLayerRef.current;
        const missionLayer = missionLayerRef.current;
        const contactLayer = contactLayerRef.current;
        const centerLine = centerLineRef.current;
        const star = starRef.current;
        const heading = headingRef.current;
        const cta = ctaRef.current;
        const ctaText = ctaTextRef.current;
        const rectBorder = rectBorderRef.current;
        const rightTrack = rightTrackRef.current;
        const stepEls = stepRefs.current.filter(Boolean) as HTMLDivElement[];
        const descLines = descriptionRef.current
          ? Array.from(descriptionRef.current.querySelectorAll<HTMLDivElement>(".desc-line"))
          : (descLinesRef.current.filter(Boolean) as HTMLDivElement[]);

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

        // Initial state: Step 01 starts directly centered at the star
        const startY = centerTarget - (stepCenters[0] ?? 0);

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
        desktopServiceScrollRef.current = 0;

        gsap.set(centerLine, {
          scaleY: 1,
          transformOrigin: "bottom center",
          force3D: true,
        });

        gsap.set(star, { scale: 1, opacity: 1, force3D: true });

        if (titleChars.length > 0) {
          gsap.set(titleChars, { opacity: 1 });
        }

        if (descLines.length > 0) {
          gsap.set(descLines, {
            yPercent: 0,
            opacity: 1,
            clearProps: "transform",
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

        stepEls.forEach((el, idx) => {
          if (idx === 0) {
            el.setAttribute("data-active", "true");
            el.classList.add("is-active");
            gsap.set(el, { opacity: 1, scale: 1, force3D: true });
          } else {
            el.setAttribute("data-active", "false");
            el.classList.remove("is-active");
            gsap.set(el, { opacity: 0.25, scale: 0.98, force3D: true });
          }
        });
        activeStepRef.current = 0;

        // Master scrubbed timeline: Snappy, responsive progressive storytelling
        // Phase 1-2: ContactCtaSection reading hold (0.0 -> 0.35s)
        // Phase 3: Immediate Crossfade to ProcessSection (0.35 -> 1.15s)
        // Phase 4: Step 01 reading hold at the star (1.15 -> 2.55s)
        // Phase 4.1: Step 01 moves up & dims; Step 02 moves up to the star & blooms (2.55 -> 3.45s)
        // Phase 4.2: Step 02 reading hold at the star (3.45 -> 4.75s)
        // Phase 4.3: Step 02 moves up & dims; Step 03 moves up to the star & blooms (4.75 -> 5.65s)
        // Phase 4.4: Step 03 reading hold at the star (5.65 -> 6.95s)
        // Phase 4.5: Step 03 moves up & dims; Step 04 moves up to the star & blooms (6.95 -> 7.85s)
        // Phase 4.6: Step 04 reading hold (7.85 -> 8.85s)
        // Phase 5a: ProcessSection clean fade-out (8.85 -> 9.65s)
        // Phase 5b: ServiceHome smooth fade-in after Process completely dissolves (9.75 -> 10.65s)
        // Phase 6: ServiceHome scroll-driven cards showcase (10.65 -> 16.15s)
        // Phase 6b: Final cards reading hold (16.15 -> 16.85s)
        // Phase 7a: ServiceHome clean fade-out (16.85 -> 17.65s)
        // Phase 7b: MissionVision smooth fade-in after ServiceHome completely dissolves (17.75 -> 18.65s)
        // Phase 7c: MissionVision reading hold (18.65 -> 21.15s)
        // Phase 7d: MissionVision clean fade-out (21.15 -> 21.95s)
        // Phase 7e: ContactForm smooth fade-in after MissionVision completely dissolves
        // Phase 8: ContactForm reading & interaction hold until unpinning to Footer
        // Phase 9: Buffer before Footer unpin
        const scrollDistance = HIDE_SERVICE_SECTION ? 6650 : 9550;

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
              if (self.progress >= 0.015 && self.direction === 1) {
                playAutoCtaOutro();
              } else if (self.progress < 0.010 && self.direction === -1) {
                playAutoCtaIntro();
              }
              if (HIDE_SERVICE_SECTION) {
                if (ctaLayer && processContent && missionLayer && contactLayer) {
                  if (self.progress < 0.04) {
                    ctaLayer.style.pointerEvents = "auto";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.04 && self.progress < 0.53) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "auto";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.53 && self.progress < 0.77) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "auto";
                    contactLayer.style.pointerEvents = "none";
                  } else {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "auto";
                  }
                }

                if (self.progress < 0.04 || self.progress > 0.52) {
                  if (activeStepRef.current !== -1) {
                    activeStepRef.current = -1;
                    stepEls.forEach((el) => {
                      el.setAttribute("data-active", "false");
                      el.classList.remove("is-active");
                    });
                  }
                } else {
                  const currentY = Number(gsap.getProperty(rightTrack, "y")) || 0;
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

                  const stepThreshold = 160;
                  if (minDiff < stepThreshold) {
                    if (newClosest !== -1 && newClosest !== activeStepRef.current) {
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
                  } else if (activeStepRef.current !== -1) {
                    activeStepRef.current = -1;
                    stepEls.forEach((el) => {
                      el.setAttribute("data-active", "false");
                      el.classList.remove("is-active");
                    });
                  }
                }
              } else {
                if (ctaLayer && processContent && serviceLayer && missionLayer && contactLayer) {
                  if (self.progress < 0.04) {
                    ctaLayer.style.pointerEvents = "auto";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.04 && self.progress < 0.37) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "auto";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.37 && self.progress < 0.67) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "auto";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.67 && self.progress < 0.84) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "auto";
                    contactLayer.style.pointerEvents = "none";
                  } else {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "auto";
                  }
                }

                if (self.progress < 0.04 || self.progress > 0.36) {
                  if (activeStepRef.current !== -1) {
                    activeStepRef.current = -1;
                    stepEls.forEach((el) => {
                      el.setAttribute("data-active", "false");
                      el.classList.remove("is-active");
                    });
                  }
                } else {
                  const currentY = Number(gsap.getProperty(rightTrack, "y")) || 0;
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

                  const stepThreshold = 160;
                  if (minDiff < stepThreshold) {
                    if (newClosest !== -1 && newClosest !== activeStepRef.current) {
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
                  } else if (activeStepRef.current !== -1) {
                    activeStepRef.current = -1;
                    stepEls.forEach((el) => {
                      el.setAttribute("data-active", "false");
                      el.classList.remove("is-active");
                    });
                  }
                }
              }
            },
          },
        });

        timelineRef.current = tl;

        // ─────────────────────────────────────────────────────────────────
        // PHASE 1-2: CTA reading hold window while revealed automatically (t = 0.0 -> 0.35)
        // ─────────────────────────────────────────────────────────────────
        tl.to({}, { duration: 0.35 }, 0);

        // ─────────────────────────────────────────────────────────────────
        // PHASE 3: Immediate Crossfade: As CTA fades out, ProcessSection immediately fades in (t = 0.35 -> 1.15)
        // ─────────────────────────────────────────────────────────────────
        if (ctaLayer) {
          tl.to(ctaLayer, { opacity: 0, scale: 0.92, duration: 0.8, ease: "power2.inOut", force3D: true }, 0.35);
        }

        // ProcessSection immediately starts fading in in-place as CTA fades out!
        if (processContent) {
          tl.fromTo(
            processContent,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.8, ease: "power2.out", force3D: true },
            0.35
          );
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 4: Process Storytelling Timeline (t = 3.8 -> 11.5)
        // ─────────────────────────────────────────────────────────────────
        // The left narrative, central hairline, and glowing star are already fully visible
        // when ProcessSection fades in (t = 2.8 -> 3.8), appearing immediately without scroll delays.
        //
        // Right track: Step 01 is ALREADY centered at the star from the start.
        // Hold 0: Step 01 reading pause at the star (t = 3.8 -> 5.2)
        // Move 1: Step 01 scrolls up & dims; Step 02 scrolls up to the star & blooms (t = 5.2 -> 6.1)
        // Hold 1: Step 02 reading pause at the star (t = 6.1 -> 7.4)
        // Move 2: Step 02 scrolls up & dims; Step 03 scrolls up to the star & blooms (t = 7.4 -> 8.3)
        // Hold 2: Step 03 reading pause at the star (t = 8.3 -> 9.6)
        // Move 3: Step 03 scrolls up & dims; Step 04 scrolls up to the star & blooms (t = 9.6 -> 10.5)
        // Hold 3: Step 04 reading pause at the star (t = 10.5 -> 11.5)
        const stepTargetPositions = stepCenters.map(
          (center) => centerTarget - center
        );

        let stepTime = 1.15;
        const initialHoldDuration = 1.4; // Generous reading pause for Step 01 at the star
        const moveStepDuration = 0.9;
        const holdDuration = 1.3;

        // Step 01 reading hold at the star
        tl.to({}, { duration: initialHoldDuration }, stepTime);
        stepTime += initialHoldDuration;

        // Steps 02, 03, 04 movements and holds
        for (let idx = 1; idx < stepEls.length; idx++) {
          const targetY = stepTargetPositions[idx] ?? 0;
          const prevEl = stepEls[idx - 1];
          const currEl = stepEls[idx];

          tl.to(
            rightTrack,
            {
              y: targetY,
              duration: moveStepDuration,
              ease: "power2.inOut",
              force3D: true,
            },
            stepTime
          );

          if (prevEl) {
            tl.to(
              prevEl,
              {
                opacity: 0.25,
                scale: 0.98,
                duration: moveStepDuration * 0.85,
                ease: "power2.inOut",
                force3D: true,
              },
              stepTime
            );
          }

          if (currEl) {
            tl.to(
              currEl,
              {
                opacity: 1,
                scale: 1,
                duration: moveStepDuration * 0.85,
                ease: "power2.inOut",
                force3D: true,
              },
              stepTime + moveStepDuration * 0.15
            );
          }

          stepTime += moveStepDuration;

          const currentHold = idx === stepEls.length - 1 ? 1.0 : holdDuration;
          tl.to({}, { duration: currentHold }, stepTime);
          stepTime += currentHold;
        }

        // ─────────────────────────────────────────────────────────────────
        // PHASE 5a: ProcessSection cleanly & smoothly fades out (t = 8.85 -> 9.65)
        // ─────────────────────────────────────────────────────────────────
        if (processContent) {
          tl.to(
            processContent,
            { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
            8.85
          );
        }

        if (!HIDE_SERVICE_SECTION) {
          // PHASE 5b: ServiceHome smoothly fades in ONLY AFTER Process completely fades out (t = 9.75 -> 10.65)
          if (serviceLayer) {
            tl.fromTo(
              serviceLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
              9.75
            );
          }

          // PHASE 6: Desktop ServiceHome horizontal cards move right-to-left as user scrolls down (t = 10.65 -> 16.15)
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
            10.65
          );

          // 8b. Reading hold on the final cards (t = 16.15 -> 16.85)
          tl.to({}, { duration: 0.7 }, 16.15);

          // PHASE 7a: ServiceHome cleanly & smoothly fades out after all cards are shown (t = 16.85 -> 17.65)
          if (serviceLayer) {
            tl.to(
              serviceLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              16.85
            );
          }

          // PHASE 7b: MissionVision smoothly fades in ONLY AFTER ServiceHome completely fades out (t = 17.75 -> 18.65)
          if (missionLayer) {
            tl.fromTo(
              missionLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
              17.75
            );
          }

          // PHASE 7c: MissionVision reading hold (t = 18.65 -> 21.15)
          tl.to({}, { duration: 2.5 }, 18.65);

          // PHASE 7d: MissionVision cleanly & smoothly fades out (t = 21.15 -> 21.95)
          if (missionLayer) {
            tl.to(
              missionLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              21.15
            );
          }

          // PHASE 7e: ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 22.05 -> 22.95)
          if (contactLayer) {
            tl.fromTo(
              contactLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
              22.05
            );
          }

          // PHASE 8: ContactForm reading & interaction hold (t = 22.95 -> 25.85)
          tl.to({}, { duration: 2.9 }, 22.95);

          // PHASE 9: Buffer before smooth unpinning directly to Footer (t = 25.85 -> 26.25)
          tl.to({}, { duration: 0.4 }, 25.85);
        } else {
          // PHASE 7b: MissionVision smoothly fades in directly after ProcessSection completely dissolves (t = 9.75 -> 10.65)
          if (missionLayer) {
            tl.fromTo(
              missionLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
              9.75
            );
          }

          // PHASE 7c: MissionVision reading hold (t = 10.65 -> 13.15)
          tl.to({}, { duration: 2.5 }, 10.65);

          // PHASE 7d: MissionVision cleanly & smoothly fades out (t = 13.15 -> 13.95)
          if (missionLayer) {
            tl.to(
              missionLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              13.15
            );
          }

          // PHASE 7e: ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 14.05 -> 14.95)
          if (contactLayer) {
            tl.fromTo(
              contactLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.9, ease: "power1.inOut", force3D: true },
              14.05
            );
          }

          // PHASE 8: ContactForm reading & interaction hold (t = 14.95 -> 17.85)
          tl.to({}, { duration: 2.9 }, 14.95);

          // PHASE 9: Buffer before smooth unpinning directly to Footer (t = 17.85 -> 18.25)
          tl.to({}, { duration: 0.4 }, 17.85);
        }

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
        const mobileTrack = mobileTrackRef.current;
        const heading = mobileHeadingRef.current;
        const badge = mobileBadgeRef.current;
        const cta = mobileCtaRef.current;
        const ctaText = mobileCtaTextRef.current;
        const rectBorder = mobileRectBorderRef.current;
        const descLines = mobileDescriptionRef.current
          ? Array.from(mobileDescriptionRef.current.querySelectorAll<HTMLDivElement>(".desc-line"))
          : (mobileDescLinesRef.current.filter(Boolean) as HTMLDivElement[]);

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

        // Set initial states for mobile narrative
        if (badge) {
          gsap.set(badge, { opacity: 1, y: 0 });
        }
        if (titleChars.length > 0) {
          gsap.set(titleChars, { opacity: 1 });
        }
        if (descLines.length > 0) {
          gsap.set(descLines, {
            yPercent: 0,
            opacity: 1,
            clearProps: "transform",
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

        if (mobileTrack) {
          gsap.set(mobileTrack, { y: startY, force3D: true });
        }

        mobileSteps.forEach((step, idx) => {
          if (idx === 0) {
            step.classList.add("is-active");
            gsap.set(step, { opacity: 1, force3D: true });
          } else {
            step.classList.remove("is-active");
            gsap.set(step, { opacity: 0.3, force3D: true });
          }
        });
        mobileActiveStepRef.current = 0;

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

        // Master pinned mobile stage: CTA intro -> Process -> ServiceHome -> MissionVision -> ContactForm (holds until Footer unpin)
        const mobileScrollDist = HIDE_SERVICE_SECTION ? 4860 : 8100;
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
              if (self.progress >= 0.015 && self.direction === 1) {
                playMobileAutoCtaOutro();
              } else if (self.progress < 0.010 && self.direction === -1) {
                playMobileAutoCtaIntro();
              }
              if (HIDE_SERVICE_SECTION) {
                if (ctaLayer && processContent && missionLayer && contactLayer) {
                  if (self.progress < 0.035) {
                    ctaLayer.style.pointerEvents = "auto";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.035 && self.progress < 0.44) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "auto";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.44 && self.progress < 0.73) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "auto";
                    contactLayer.style.pointerEvents = "none";
                  } else {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "auto";
                  }
                }

                if (self.progress < 0.035 || self.progress > 0.44) {
                  if (mobileActiveStepRef.current !== -1) {
                    mobileActiveStepRef.current = -1;
                    for (let idx = 0; idx < mobileSteps.length; idx++) {
                      mobileSteps[idx].classList.remove("is-active");
                    }
                  }
                } else {
                  const currentY = Number(gsap.getProperty(mobileTrack, "y")) || 0;
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

                  if (minDiff < 100) {
                    if (newClosest !== -1 && newClosest !== mobileActiveStepRef.current) {
                      mobileActiveStepRef.current = newClosest;
                      for (let idx = 0; idx < mobileSteps.length; idx++) {
                        if (idx === newClosest) {
                          mobileSteps[idx].classList.add("is-active");
                        } else {
                          mobileSteps[idx].classList.remove("is-active");
                        }
                      }
                    }
                  } else if (mobileActiveStepRef.current !== -1) {
                    mobileActiveStepRef.current = -1;
                    for (let idx = 0; idx < mobileSteps.length; idx++) {
                      mobileSteps[idx].classList.remove("is-active");
                    }
                  }
                }
              } else {
                if (ctaLayer && processContent && serviceLayer && missionLayer && contactLayer) {
                  if (self.progress < 0.035) {
                    ctaLayer.style.pointerEvents = "auto";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.035 && self.progress < 0.26) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "auto";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.26 && self.progress < 0.66) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "auto";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "none";
                  } else if (self.progress >= 0.66 && self.progress < 0.83) {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "auto";
                    contactLayer.style.pointerEvents = "none";
                  } else {
                    ctaLayer.style.pointerEvents = "none";
                    processContent.style.pointerEvents = "none";
                    serviceLayer.style.pointerEvents = "none";
                    missionLayer.style.pointerEvents = "none";
                    contactLayer.style.pointerEvents = "auto";
                  }
                }

                // Mobile step highlighting with dirty-check guard
                if (self.progress < 0.035 || self.progress > 0.25) {
                  if (mobileActiveStepRef.current !== -1) {
                    mobileActiveStepRef.current = -1;
                    for (let idx = 0; idx < mobileSteps.length; idx++) {
                      mobileSteps[idx].classList.remove("is-active");
                    }
                  }
                } else {
                  const currentY = Number(gsap.getProperty(mobileTrack, "y")) || 0;
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

                  if (minDiff < 100) {
                    if (newClosest !== -1 && newClosest !== mobileActiveStepRef.current) {
                      mobileActiveStepRef.current = newClosest;
                      for (let idx = 0; idx < mobileSteps.length; idx++) {
                        if (idx === newClosest) {
                          mobileSteps[idx].classList.add("is-active");
                        } else {
                          mobileSteps[idx].classList.remove("is-active");
                        }
                      }
                    }
                  } else if (mobileActiveStepRef.current !== -1) {
                    mobileActiveStepRef.current = -1;
                    for (let idx = 0; idx < mobileSteps.length; idx++) {
                      mobileSteps[idx].classList.remove("is-active");
                    }
                  }
                }

                // Dynamic 2-card column active color focus on mobile ServiceHome
                if (
                  self.progress >= 0.29 &&
                  self.progress <= 0.65 &&
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
                } else if (self.progress < 0.29) {
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
              }
            },
          },
        });

        // 1-2. Hold moment while text intro is revealed automatically (t = 0 to 0.25)
        mobileTl.to({}, { duration: 0.25 }, 0);

        // 3. Immediate Crossfade: As CTA fades out, ProcessSection immediately fades in (t = 0.25 -> 0.90)
        if (ctaLayer) {
          mobileTl.to(ctaLayer, { opacity: 0, scale: 0.92, duration: 0.65, ease: "power2.inOut", force3D: true }, 0.25);
        }

        // Mobile Process Narrative immediately starts fading in in-place as CTA fades out!
        if (processContent) {
          mobileTl.fromTo(
            processContent,
            { opacity: 0, scale: 0.96 },
            { opacity: 1, scale: 1.0, duration: 0.65, ease: "power2.out", force3D: true },
            0.25
          );
        }

        // 5. Stepped mobile track movement & reading holds at the star
        // Step 01 is ALREADY centered at the star from the start.
        const mobileStepTargetPositions = mobileStepCenters.map(
          (center) => centerTarget - center
        );

        let mobileStepTime = 0.90;
        const initialMobileHold = 1.0;
        const mobileMoveDuration = 0.5;
        const mobileHoldDuration = 0.8;

        // Step 01 reading hold at the star
        mobileTl.to({}, { duration: initialMobileHold }, mobileStepTime);
        mobileStepTime += initialMobileHold;

        for (let idx = 1; idx < mobileSteps.length; idx++) {
          const targetY = mobileStepTargetPositions[idx] ?? 0;
          const prevEl = mobileSteps[idx - 1];
          const currEl = mobileSteps[idx];

          mobileTl.to(
            mobileTrack,
            {
              y: targetY,
              duration: mobileMoveDuration,
              ease: "power2.inOut",
              force3D: true,
            },
            mobileStepTime
          );

          if (prevEl) {
            mobileTl.to(
              prevEl,
              {
                opacity: 0.3,
                duration: mobileMoveDuration * 0.85,
                ease: "power2.inOut",
                force3D: true,
              },
              mobileStepTime
            );
          }

          if (currEl) {
            mobileTl.to(
              currEl,
              {
                opacity: 1,
                duration: mobileMoveDuration * 0.85,
                ease: "power2.inOut",
                force3D: true,
              },
              mobileStepTime + mobileMoveDuration * 0.15
            );
          }

          mobileStepTime += mobileMoveDuration;

          const currentHold = idx === mobileSteps.length - 1 ? 0.8 : mobileHoldDuration;
          mobileTl.to({}, { duration: currentHold }, mobileStepTime);
          mobileStepTime += currentHold;
        }

        // 7a. Phase 5a: Mobile ProcessSection cleanly & smoothly fades out (t = 5.8 -> 6.5)
        if (processContent) {
          mobileTl.to(
            processContent,
            { opacity: 0, scale: 0.94, duration: 0.7, ease: "power1.inOut", force3D: true },
            5.8
          );
        }

        if (!HIDE_SERVICE_SECTION) {
          // 7b. Phase 5b: Mobile ServiceHome smoothly fades in ONLY AFTER Process completely fades out (t = 6.6 -> 7.4)
          if (serviceLayer) {
            mobileTl.fromTo(
              serviceLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
              6.6
            );
          }

          // 8. Phase 6: Mobile ServiceHome horizontal cards track - stepped movement where each card stops in the center (t = 7.4 -> 15.5)
          if (mobileServiceTrack) {
            // Explicitly lock x to Column 0 when ServiceHome fades in so Column 0 is centered from the start
            mobileTl.set(
              mobileServiceTrack,
              { x: () => getColumnCenterTrackX(0), force3D: true },
              6.6
            );

            const moveDuration = 0.55;
            const normalHold = 0.5;
            const finalHold = 0.75;
            let currentT = 7.4;

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

          // 9a. Phase 7a: Mobile ServiceHome cleanly & smoothly fades out after the end of the cards (t = 15.5 -> 16.3)
          if (serviceLayer) {
            mobileTl.to(
              serviceLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              15.5
            );
          }

          // 9b. Phase 7b: Mobile MissionVision smoothly fades in ONLY AFTER ServiceHome completely fades out (t = 16.4 -> 17.2)
          if (missionLayer) {
            mobileTl.fromTo(
              missionLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
              16.4
            );
          }

          // 9c. Phase 7c: Mobile MissionVision reading hold (t = 17.2 -> 19.7)
          mobileTl.to({}, { duration: 2.5 }, 17.2);

          // 9d. Phase 7d: Mobile MissionVision cleanly & smoothly fades out (t = 19.7 -> 20.5)
          if (missionLayer) {
            mobileTl.to(
              missionLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              19.7
            );
          }

          // 9e. Phase 7e: Mobile ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 20.6 -> 21.4)
          if (contactLayer) {
            mobileTl.fromTo(
              contactLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
              20.6
            );
          }

          // 9f. Phase 8: Mobile ContactForm reading & interaction hold (t = 21.4 -> 24.1)
          // ContactForm remains visible and interactive without fading out
          mobileTl.to({}, { duration: 2.7 }, 21.4);

          // 10. Phase 9: Mobile buffer before smooth unpinning to Footer (t = 24.1 -> 24.5)
          mobileTl.to({}, { duration: 0.4 }, 24.1);
        } else {
          // Phase 7b: Mobile MissionVision smoothly fades in directly after Mobile Process completely dissolves (t = 6.6 -> 7.4)
          if (missionLayer) {
            mobileTl.fromTo(
              missionLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
              6.6
            );
          }

          // Phase 7c: Mobile MissionVision reading hold (t = 7.4 -> 9.9)
          mobileTl.to({}, { duration: 2.5 }, 7.4);

          // Phase 7d: Mobile MissionVision cleanly & smoothly fades out (t = 9.9 -> 10.7)
          if (missionLayer) {
            mobileTl.to(
              missionLayer,
              { opacity: 0, scale: 0.94, duration: 0.8, ease: "power1.inOut", force3D: true },
              9.9
            );
          }

          // Phase 7e: Mobile ContactForm smoothly fades in ONLY AFTER MissionVision completely fades out (t = 10.8 -> 11.6)
          if (contactLayer) {
            mobileTl.fromTo(
              contactLayer,
              { opacity: 0, scale: 0.96 },
              { opacity: 1, scale: 1.0, duration: 0.8, ease: "power1.inOut", force3D: true },
              10.8
            );
          }

          // Phase 8: Mobile ContactForm reading & interaction hold (t = 11.6 -> 14.3)
          mobileTl.to({}, { duration: 2.7 }, 11.6);

          // Phase 9: Mobile buffer before smooth unpinning to Footer (t = 14.3 -> 14.7)
          mobileTl.to({}, { duration: 0.4 }, 14.3);
        }

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

    // Midpoint of each step hold at the star on master 26.25s timeline
    const stepProgressBenchmarks = [
      1.85 / 26.25,  // Step 01 pause center at the star
      4.10 / 26.25,  // Step 02 pause center at the star
      6.30 / 26.25,  // Step 03 pause center at the star
      8.35 / 26.25,  // Step 04 pause center at the star
    ];
    const targetScroll =
      st.start + (stepProgressBenchmarks[idx] ?? 0.19) * (st.end - st.start);

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
                className="text-3xl sm:text-4xl md:text-5xl lg:text-[50px] font-semibold leading-[1.12] text-zinc-100 tracking-tight max-w-md lg:max-w-lg"
              />

              {/* Description in Project Font */}
              <MaskedLinesReveal
                ref={descriptionRef}
                lines={DESC_LINES}
                className="text-sm sm:text-base text-zinc-400 font-normal leading-relaxed max-w-md lg:max-w-lg"
                setLineRef={(el, idx) => {
                  descLinesRef.current[idx] = el;
                }}
              />

            </div>
          </div>

          {/* RIGHT SIDE: Smooth Scroll-Driven Moving Steps Track */}
          <div className="relative h-full overflow-visible flex items-start pl-12 lg:pl-16 pointer-events-auto">
            <div
              ref={rightTrackRef}
              className="relative flex flex-col gap-12 will-change-transform w-full"
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
            className="text-2xl sm:text-3xl font-semibold leading-[1.12] text-zinc-100 tracking-tight"
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
                <h3 className="mobile-step-title text-xl sm:text-2xl font-semibold leading-snug text-zinc-400 transition-all duration-500 mb-1 group-[.is-active]:text-white group-[.is-active]:drop-shadow-[0_0_20px_rgba(255,255,255,0.6)] group-[.is-active]:translate-x-1">
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
      {!HIDE_SERVICE_SECTION && (
        <div
          ref={serviceLayerRef}
          className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
          style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
        >
          <ServiceHome isStageMode scrollProgressRef={desktopServiceScrollRef} />
        </div>
      )}

      {/* Pinned Mission Vision Layer - In-place center crossfade */}
      <div
        ref={missionLayerRef}
        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none h-screen w-full overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        <MissionVisionSection isStageMode />
      </div>

      {/* Pinned Contact Form & Footer Layer - Seen simultaneously on desktop screen */}
      <div
        ref={contactLayerRef}
        className="absolute inset-0 z-20 flex flex-col justify-between pointer-events-none h-screen w-full select-none overflow-y-auto lg:overflow-hidden"
        style={{ opacity: 0, transformOrigin: "50% 50%", willChange: "transform, opacity" }}
      >
        {/* Upper Region: Contact Form (centered in upper area, red box in diagram) */}
        <div className="w-full flex-1 flex flex-col items-center justify-center pt-14 sm:pt-16 lg:pt-14 pb-2 px-3 sm:px-6 relative z-20">
          <ContactForm isStageMode />
        </div>

        {/* Lower Region: Footer (anchored at bottom, green marking in diagram) */}
        <div className="w-full relative z-20">
          <Footer isStageMode />
        </div>
      </div>
    </section>
  );
}

export default ProcessSection;
