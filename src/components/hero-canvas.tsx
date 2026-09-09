"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, Observer, useGSAP } from "@/lib/gsap";
import { FrostedCard } from "@/components/frosted-card";

interface HeroSequenceConfig {
  totalFrames: number;
  fps: number;
  folder: string;
  pauseTimes: number[];
  leadInTimes: number[];
  criticalCutoff: number;
  totalDuration: number;
}

const DESKTOP_CONFIG: HeroSequenceConfig = {
  totalFrames: 246,
  fps: 24,
  folder: "/frames_optimized",
  pauseTimes: [
    0,
    58 / 24,   // Phase 1 (Frame 59)
    117 / 24,  // Phase 2 (Frame 118)
    177 / 24,  // Phase 3 (Frame 178)
    245 / 24,  // Phase 4 (Frame 246)
  ],
  leadInTimes: [0, 0.85, 1.00, 1.10, 1.20],
  criticalCutoff: 58,
  totalDuration: (246 - 1) / 24,
};

const MOBILE_CONFIG: HeroSequenceConfig = {
  totalFrames: 170,
  fps: 24,
  folder: "/frames_mob",
  pauseTimes: [
    0,
    37 / 24,   // Phase 1 (Frame 38)
    81 / 24,   // Phase 2 (Frame 82)
    123 / 24,  // Phase 3 (Frame 124)
    169 / 24,  // Phase 4 (Frame 170)
  ],
  leadInTimes: [0, 0.60, 0.75, 0.85, 0.95],
  criticalCutoff: 37,
  totalDuration: (170 - 1) / 24,
};

// 200ms (0.2s) pause cooldown for rapid, instant response
const PAUSE_COOLDOWN_MS = 200;

interface HeroCanvasProps {
  onProgress?: (progress: number) => void;
  onLoaded?: () => void;
}

export function HeroCanvas({ onProgress, onLoaded }: HeroCanvasProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef<number>(-1);

  // Mobile / portrait viewport detection
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768 || window.innerHeight > window.innerWidth;
  });

  useEffect(() => {
    const handleViewportChange = () => {
      const mob = window.innerWidth < 768 || window.innerHeight > window.innerWidth;
      setIsMobile((prev) => (prev !== mob ? mob : prev));
    };
    window.addEventListener("resize", handleViewportChange);
    return () => window.removeEventListener("resize", handleViewportChange);
  }, []);

  // Card visibility state at checkpoints
  const [showStartCard, setShowStartCard] = useState(true);
  const [activePhase, setActivePhase] = useState(0);
  const forwardTriggerRef = useRef<(() => void) | null>(null);

  // ─── Draw a single frame to the canvas (cover mode) ─────────────────────
  const drawFrame = useCallback((frameIndex: number) => {
    if (frameIndex === currentFrameRef.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext("2d", {
        alpha: false,
        desynchronized: true,
      });
      if (ctxRef.current) {
        ctxRef.current.imageSmoothingEnabled = true;
        ctxRef.current.imageSmoothingQuality = "medium";
      }
    }
    const ctx = ctxRef.current;
    if (!ctx) return;

    let img = imagesRef.current[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = frameIndex - 1; i >= 0; i--) {
        if (imagesRef.current[i]?.complete && imagesRef.current[i]?.naturalWidth > 0) {
          img = imagesRef.current[i];
          break;
        }
      }
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const nw = iw * scale;
    const nh = ih * scale;
    const nx = (cw - nw) / 2;
    const ny = (ch - nh) / 2;

    ctx.drawImage(img, nx, ny, nw, nh);
    currentFrameRef.current = frameIndex;
  }, []);

  // ─── Resize canvas to fit viewport, capped at 1920x1920 ─────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      1.5
    );
    canvas.width = Math.min(Math.round(window.innerWidth * dpr), 1920);
    canvas.height = Math.min(Math.round(window.innerHeight * dpr), 1920);

    ctxRef.current = null;
    currentFrameRef.current = -1;
  }, []);

  // ─── Preload with 16-Worker Sliding Pool + Parallel In-Worker Decode ────
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
    const { totalFrames, folder, criticalCutoff } = config;
    const READY_THRESHOLD = Math.round(totalFrames * 0.5);
    const images: HTMLImageElement[] = new Array(totalFrames);

    const emitProgress = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / READY_THRESHOLD) * 100));
      onProgress?.(pct);
      if (loadedCount >= READY_THRESHOLD) {
        onLoaded?.();
      }
    };

    const loadFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (images[index]) return resolve();

        const img = new Image();

        if ("fetchPriority" in img) {
          (img as HTMLImageElement & { fetchPriority: string }).fetchPriority =
            index <= criticalCutoff ? "high" : "auto";
        }

        img.onload = () => {
          if (isCancelled) return resolve();
          images[index] = img;

          // Parallel in-worker decode await:
          // Guarantees bitmap is rasterized in GPU texture memory before resolving & counting
          if ("decode" in img) {
            img
              .decode()
              .catch(() => { })
              .finally(() => {
                if (!isCancelled) {
                  if (currentFrameRef.current === index) {
                    drawFrame(index);
                  }
                  emitProgress();
                }
                resolve();
              });
          } else {
            emitProgress();
            resolve();
          }
        };

        img.onerror = () => {
          emitProgress();
          resolve();
        };

        const frameNum = String(index + 1).padStart(4, "0");
        img.src = `${folder}/frame_${frameNum}.webp`;
      });
    };

    // 1. Initial critical frame 0 — drawn immediately once ready
    loadFrame(0).then(() => {
      if (isCancelled) return;
      imagesRef.current = images;
      handleResize();
      drawFrame(0);
    });

    // 2. 16-worker sliding pool (zero idle time, zero barrier stalls)
    const CONCURRENCY = 16;
    let nextIndex = 1;

    const worker = async (): Promise<void> => {
      while (!isCancelled) {
        const idx = nextIndex++;
        if (idx >= totalFrames) break;
        await loadFrame(idx);
      }
    };

    Promise.all(
      Array.from({ length: CONCURRENCY }, () => worker())
    );

    imagesRef.current = images;
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [isMobile, drawFrame, handleResize, onProgress, onLoaded]);

  // ─── Phase-Based GSAP Engine (Adopted from hero_another_project.md) ──────
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      const config = isMobile ? MOBILE_CONFIG : DESKTOP_CONFIG;
      const { totalFrames, fps, totalDuration, pauseTimes, leadInTimes } = config;

      // currentPhase:
      // 0 = at frame 0 (start)
      // 1 = scrubbing from 0 up to Checkpoint 1
      // 2 = scrubbing from Checkpoint 1 up to Checkpoint 2
      // 3 = scrubbing from Checkpoint 2 up to Checkpoint 3
      // 4 = scrubbing from Checkpoint 3 up to Final frame
      let currentPhase = 0;

      // playState:
      // -1 = reverse playback
      //  0 = idle / paused
      //  1 = forward playback
      let playState = 0;
      let scrollLocked = true;
      let virtualTime = 0;

      let pauseCooldown = false;
      let cooldownTimer: ReturnType<typeof setTimeout> | null = null;

      const triggerCooldown = () => {
        pauseCooldown = true;
        if (cooldownTimer) clearTimeout(cooldownTimer);
        cooldownTimer = setTimeout(() => {
          pauseCooldown = false;
          cooldownTimer = null;
        }, PAUSE_COOLDOWN_MS);
      };

      // Initial scroll lock
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = true;
      (window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();

      const render = () => {
        let frameIndex = Math.floor(virtualTime * fps);
        if (frameIndex < 0) frameIndex = 0;
        if (frameIndex >= totalFrames) frameIndex = totalFrames - 1;
        drawFrame(frameIndex);
      };

      // ── Touch Re-Entry for Mobile (detect swipe-down at scrollY <= 0) ──
      let reentryTouchStartY = 0;
      const onReentryTouchStart = (e: TouchEvent) => {
        if (e.touches?.[0]) {
          reentryTouchStartY = e.touches[0].clientY;
        }
      };

      const onReentryTouchMove = (e: TouchEvent) => {
        if (window.scrollY <= 0 && e.touches?.[0]) {
          const deltaY = e.touches[0].clientY - reentryTouchStartY;
          if (deltaY > 20) {
            // Dragged finger down at top of page -> user wants to scroll back into hero
            if (e.cancelable) e.preventDefault();
            removeReentryListeners();
            lockScroll();
            currentPhase = 4;
            playState = 0;
            handleScrollReverse();
          }
        }
      };

      const addReentryListeners = () => {
        window.addEventListener("touchstart", onReentryTouchStart, { passive: true });
        window.addEventListener("touchmove", onReentryTouchMove, { passive: false });
      };

      const removeReentryListeners = () => {
        window.removeEventListener("touchstart", onReentryTouchStart);
        window.removeEventListener("touchmove", onReentryTouchMove);
      };

      // ── Unlock & Lock Methods (Height Pinning + Input Decoupling) ──
      const unlockScroll = () => {
        scrollLocked = false;
        observer.disable();

        if (cooldownTimer) {
          clearTimeout(cooldownTimer);
          cooldownTimer = null;
        }
        pauseCooldown = false;

        // Pin the hero container to its exact rendered pixel height before unlocking,
        // preventing 100dvh recalculation jumps
        const container = containerRef.current;
        if (container) {
          const currentHeight = container.getBoundingClientRect().height;
          container.style.height = `${currentHeight}px`;
        }

        // Release document overflow
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";

        // Release Lenis
        (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = false;
        const lenis = (window as unknown as { lenis?: { start: () => void; scrollTo: (t: number, o?: object) => void } }).lenis;
        lenis?.start();

        addReentryListeners();

        // Smoothly transition down into the next section (Footer)
        requestAnimationFrame(() => {
          if (lenis) {
            lenis.scrollTo(window.innerHeight, { duration: 1.2 });
          } else {
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
          }
        });
      };

      const lockScroll = () => {
        scrollLocked = true;

        // Stop Lenis
        (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = true;
        (window as unknown as { lenis?: { stop: () => void } }).lenis?.stop();

        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";

        // Restore dynamic viewport sizing
        const container = containerRef.current;
        if (container) {
          container.style.height = "";
        }

        if (window.scrollY > 0) {
          window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        }

        removeReentryListeners();

        // Re-enter at the final frame
        currentPhase = 4;
        virtualTime = totalDuration;
        currentActivePhase = 4;
        setActivePhase(4);
        render();

        observer.enable();
      };

      let currentActivePhase = 0;

      // ── GSAP Ticker Loop ────────────────────────────────────────────────
      const tickerFunc = (_time: number, deltaTime: number) => {
        const deltaSec = deltaTime / 1000;

        if (playState === 1) {
          // Forward scrubbing
          virtualTime += deltaSec;

          const targetPauseTime = pauseTimes[currentPhase];
          const leadIn = leadInTimes[currentPhase] ?? 1.2;

          // Animate title & cards in earlier before reaching the checkpoint
          if (virtualTime >= targetPauseTime - leadIn && currentActivePhase !== currentPhase) {
            currentActivePhase = currentPhase;
            setActivePhase(currentPhase);
          }

          if (virtualTime >= targetPauseTime) {
            virtualTime = targetPauseTime;
            playState = 0; // go idle, wait for next user action
            if (currentActivePhase !== currentPhase) {
              currentActivePhase = currentPhase;
              setActivePhase(currentPhase);
            }

            if (currentPhase < 4) {
              triggerCooldown();
            }
          }
          render();
        } else if (playState === -1) {
          // Reverse scrubbing
          virtualTime -= deltaSec;

          const targetPhase = Math.max(0, currentPhase - 1);
          const previousPauseTime = pauseTimes[targetPhase];
          const reverseLeadIn = leadInTimes[targetPhase] ?? 1.2;

          // Animate title & cards in earlier before reaching the previous checkpoint in reverse
          if (virtualTime <= previousPauseTime + reverseLeadIn && currentActivePhase !== targetPhase) {
            currentActivePhase = targetPhase;
            setActivePhase(targetPhase);
            if (targetPhase === 0) {
              setShowStartCard(true);
            }
          }

          if (virtualTime <= previousPauseTime) {
            virtualTime = previousPauseTime;
            currentPhase = targetPhase;
            playState = 0; // go idle, wait for next user action
            if (currentActivePhase !== currentPhase) {
              currentActivePhase = currentPhase;
              setActivePhase(currentPhase);
            }

            if (currentPhase === 0) {
              setShowStartCard(true);
            }

            if (currentPhase > 0) {
              triggerCooldown();
            }
          }
          render();
        }
      };

      gsap.ticker.add(tickerFunc);

      // ── Scroll Forward Handler ──────────────────────────────────────────
      const handleScrollForward = () => {
        if (!scrollLocked) return;

        // Block input during inertia absorption cooldown
        if (pauseCooldown) return;

        if (currentPhase === 0) {
          // From idle at start, hide start card and advance to Phase 1 (Frame 75)
          setShowStartCard(false);
          currentActivePhase = -1;
          setActivePhase(-1);
          currentPhase = 1;
          playState = 1;
        } else if (currentPhase >= 1 && currentPhase <= 3) {
          // If idle at a pause checkpoint, advance to next phase
          if (playState === 0 && virtualTime >= pauseTimes[currentPhase] - 0.1) {
            currentActivePhase = -1;
            setActivePhase(-1);
            currentPhase += 1;
            playState = 1;
          } else {
            playState = 1;
          }
        } else if (currentPhase === 4) {
          // Already at final frame — user wants to continue to next section (Footer)!
          if (playState === 0) {
            unlockScroll();
          } else {
            playState = 1;
          }
        }
      };

      // Expose forward trigger to the card's explore button
      forwardTriggerRef.current = handleScrollForward;

      // ── Scroll Reverse Handler ──────────────────────────────────────────
      const handleScrollReverse = () => {
        if (!scrollLocked) return;

        // Block input during inertia absorption cooldown
        if (pauseCooldown) return;

        if (currentPhase > 0) {
          // Start reverse scrubbing
          currentActivePhase = -1;
          setActivePhase(-1);
          playState = -1;
        }
      };

      // ── Mobile Touch Click / Tap Mappings ───────────────────────────────
      const isMobileDevice = window.innerWidth < 768;

      const handleMobileScrollForward = () => {
        if (!scrollLocked) return;
        if (pauseCooldown) return;

        if (currentPhase === 0) {
          setShowStartCard(false);
          currentActivePhase = -1;
          setActivePhase(-1);
          currentPhase = 1;
          playState = 1;
          return;
        }

        // On mobile, ignore rapid gesture spamming during active playback
        if (playState !== 0) return;

        if (currentPhase >= 1 && currentPhase <= 3) {
          currentActivePhase = -1;
          setActivePhase(-1);
          currentPhase += 1;
          playState = 1;
        } else if (currentPhase === 4) {
          unlockScroll();
        }
      };

      const handleMobileScrollReverse = () => {
        if (!scrollLocked || playState !== 0) return;
        if (pauseCooldown) return;
        currentActivePhase = -1;
        setActivePhase(-1);
        handleScrollReverse();
      };

      // ── GSAP Observer (Input Virtualization) ─────────────────────────────
      // Touch: onUp (swipe up) = scroll down = forward
      // Touch: onDown (swipe down) = scroll up = reverse
      // Desktop: onDown (wheel down) = forward
      // Desktop: onUp (wheel up) = reverse
      const observer = Observer.create({
        target: window,
        type: "wheel,touch,pointer",
        preventDefault: !isMobileDevice,
        onDown: (self) => {
          const isTouch = Boolean(
            Observer.isTouch === 1 ||
            (self as unknown as { isTouch?: boolean }).isTouch ||
            self?.event?.type?.startsWith("touch") ||
            (self.event as PointerEvent)?.pointerType === "touch"
          );
          if (isTouch) {
            handleMobileScrollReverse();
          } else {
            handleScrollForward();
          }
        },
        onUp: (self) => {
          const isTouch = Boolean(
            Observer.isTouch === 1 ||
            (self as unknown as { isTouch?: boolean }).isTouch ||
            self?.event?.type?.startsWith("touch") ||
            (self.event as PointerEvent)?.pointerType === "touch"
          );
          if (isTouch) {
            handleMobileScrollForward();
          } else {
            handleScrollReverse();
          }
        },
      });

      // ── Native Re-Entry Listener (when user scrolls back to Y <= 0) ─────
      const onNativeScroll = () => {
        if (!scrollLocked && window.scrollY <= 0) {
          lockScroll();
        }
      };

      // Desktop wheel re-entry at scrollY <= 0
      const onWindowWheel = (e: WheelEvent) => {
        if (!scrollLocked && window.scrollY <= 0 && e.deltaY < 0) {
          lockScroll();
          handleScrollReverse();
        }
      };

      window.addEventListener("scroll", onNativeScroll, { passive: true });
      window.addEventListener("wheel", onWindowWheel, { passive: true });

      // ── Keyboard Navigation ─────────────────────────────────────────────
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!scrollLocked) return;

        if (["ArrowDown", "PageDown", " "].includes(e.key)) {
          e.preventDefault();
          handleScrollForward();
        } else if (["ArrowUp", "PageUp"].includes(e.key)) {
          e.preventDefault();
          handleScrollReverse();
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      // ── Browser Back / Mid-Page Restoration Handler ─────────────────────
      const checkScrollPosition = () => {
        if (window.scrollY > 50) {
          scrollLocked = false;
          (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = false;
          (window as unknown as { lenis?: { start: () => void } }).lenis?.start();
          document.body.style.overflow = "auto";
          document.documentElement.style.overflow = "auto";
          observer.disable();

          const container = containerRef.current;
          if (container) {
            const currentHeight = container.getBoundingClientRect().height;
            container.style.height = `${currentHeight}px`;
          }

          currentPhase = 4;
          virtualTime = totalDuration;
          playState = 0;
          render();
          addReentryListeners();
        }
      };

      checkScrollPosition();
      const t1 = setTimeout(checkScrollPosition, 50);
      const t2 = setTimeout(checkScrollPosition, 150);

      // ── Cleanup ─────────────────────────────────────────────────────────
      return () => {
        gsap.ticker.remove(tickerFunc);
        observer.kill();
        removeReentryListeners();
        window.removeEventListener("scroll", onNativeScroll);
        window.removeEventListener("wheel", onWindowWheel);
        window.removeEventListener("keydown", handleKeyDown);

        if (cooldownTimer) {
          clearTimeout(cooldownTimer);
        }
        clearTimeout(t1);
        clearTimeout(t2);

        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
        (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked = false;
        (window as unknown as { lenis?: { start: () => void } }).lenis?.start();

        if (containerRef.current) {
          containerRef.current.style.height = "";
        }
      };
    },
    { scope: containerRef, dependencies: [isMobile] }
  );

  return (
    <div
      id="hero"
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-black select-none"
    >
      {/* 24FPS Pre-rendered Frame Sequence Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover block"
      />

      {/* Starting Checkpoint (Frame 0) Right-most Center Heading, Description & Content */}
      <div
        className={`absolute right-5 sm:right-8 lg:right-12 bottom-6 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-30 pointer-events-none flex flex-col items-start sm:items-end text-left sm:text-right transition-all duration-700 ease-out select-none max-w-sm sm:max-w-md lg:max-w-xl ${showStartCard
          ? "opacity-100 translate-y-0 sm:translate-y-[-50%]"
          : "opacity-0 translate-y-4 sm:translate-y-[-45%] pointer-events-none"
          }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          DOMINATING OUTDOOR SPACES
        </span>
        <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">CUSTOM DYNAMIC</span>
          <span className="block">OUTDOOR LED SCREENS</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          We engineer high-brightness, weatherproof display screens designed to command maximum commercial visibility in any environment.
        </p>

        {/* Content placed below the current title with the same design element */}
        <div className="mt-6 sm:mt-8 flex flex-col items-start sm:items-end text-left sm:text-right">
          <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
            Sign into the future
          </span>
          <h2 className="mt-1.5 text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white leading-tight whitespace-normal sm:whitespace-nowrap">
            Trusted partner for advertising and LED display in UAE
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed max-w-md sm:max-w-lg">
            The UAE’s destination for custom indoor and outdoor LED displays, digital kiosks, AV integration, signage, exhibits, branding, and precision structural fabrication.
          </p>
        </div>
      </div>

      {/* Checkpoint 1 (Curved Ribbon LED) Left-most Center Heading & Title */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[42%] -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${activePhase === 1
          ? "opacity-100 translate-y-[-50%]"
          : "opacity-0 translate-y-[-45%] pointer-events-none"
          }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          Engineered for impact
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">SPECIALIZED IN</span>
          <span className="block">CUSTOM LED DISPLAY</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Turning your display dreams into reality with customized indoor and outdoor screens, interactive kiosks, and signature audiovisual solutions designed for your brand.
        </p>
      </div>

      {/* Checkpoint 1 (Curved Ribbon LED) Overlays at Bottom (Three Cards) */}
      <div
        className={`absolute inset-x-0 bottom-6 sm:bottom-10 z-30 pointer-events-none px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-4 transition-all duration-700 ease-out select-none ${activePhase === 1
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
          }`}
      >
        {/* Card 1 */}
        <FrostedCard
          visible={activePhase === 1}
          title="Structures for Every Screen Concept"
          subtitle="Engineered Without Limits"
          description="We design and fabricate custom mounting structures to bring any complex visual idea to life."
          className="w-full"
        />

        {/* Card 2 */}
        <FrostedCard
          visible={activePhase === 1}
          title="Straight and Curved Displays"
          subtitle="Unlimited Shape Flexibility"
          description="Build high-impact displays with limitless dimension options, including smooth curved or flat screen configurations."
          className="w-full"
        />

        {/* Card 3 */}
        <FrostedCard
          visible={activePhase === 1}
          title="Portable Screens for Dynamic Multi-Events"
          subtitle="Transportable Visual Power"
          description="Compact, foldable LED systems offer effortless transportation, rapid assembly, and setup for flexible event deployment."
          className="w-full"
        />
      </div>

      {/* Checkpoint 2 (Free-standing Kiosk) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[56%] -translate-y-1/2 z-30 pointer-events-none flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${activePhase === 2
          ? "opacity-100 translate-y-[-50%]"
          : "opacity-0 translate-y-[-45%] pointer-events-none"
          }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          INTERACTIVE DIGITAL INNOVATION
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">SPECIALIZED CREATORS</span>
          <span className="block">OF CUSTOM BUILT KIOSKS</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          We engineer tailored interactive kiosks with high-resolution LED screens designed to elevate modern brand engagement.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-12 sm:mt-16 lg:mt-20 w-full">
          <FrostedCard
            visible={activePhase === 2}
            title="Custom Exhibition Booths, Mall Counters, & Digital Kiosks"
            subtitle=""
            description="We bring your vision to life by crafting custom exhibition booths, mall counters, and kiosks in any material, fully integrated with customizable, interactive LED and LCD displays designed to captivate and engage your audience."
            className="w-full"
          />
        </div>
      </div>

      {/* Checkpoint 3 (Large Scale Lobby Wall Display) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[56%] -translate-y-1/2 z-30 pointer-events-none flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${activePhase === 3
          ? "opacity-100 translate-y-[-50%]"
          : "opacity-0 translate-y-[-45%] pointer-events-none"
          }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          Vibrant. Seamless. Unmatched.
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">Ultra clear indoor</span>
          <span className="block">LED screen displays.</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          We create dynamic indoor screens delivering vibrant high-resolution visuals tailored for modern spaces and environments.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-12 sm:mt-16 lg:mt-20 w-full">
          <FrostedCard
            visible={activePhase === 3}
            title="Your One-Stop Destination for Display Solutions"
            subtitle=""
            description="From traditional flexface, high-impact banners, and precision vinyl graphics to cutting-edge LED walls and interactive LCD screens, we provide end-to-end indoor advertising and media display solutions tailored to showcase your brand with maximum visual power."
            className="w-full"
          />
        </div>
      </div>

      {/* Checkpoint 4 (Transparent Glass Cube Studio) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[56%] -translate-y-1/2 z-30 pointer-events-none flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${activePhase === 4
          ? "opacity-100 translate-y-[-50%]"
          : "opacity-0 translate-y-[-45%] pointer-events-none"
          }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          See through innovation.
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">High-impact indoor and</span>
          <span className="block"> outdoor mesh displays</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Engineered for ultimate transparency and brightness, our mesh screens turn glass facades into vibrant dynamic visuals.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-12 sm:mt-16 lg:mt-20 w-full">
          <FrostedCard
            visible={activePhase === 4}
            title="Complete Audio-Visual Solutions for Modern Spaces"
            subtitle=""
            description="We design, supply, and integrate high-performance audio-visual systems—combining immersive sound, high-definition video, and seamless control setup to deliver clear, dynamic, and high-impact multimedia experiences tailored precisely to your commercial or corporate environment"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroCanvas;
