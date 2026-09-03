"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { gsap, Observer, useGSAP } from "@/lib/gsap";
import { FrostedCard } from "@/components/frosted-card";

const TOTAL_FRAMES = 264;
const FPS = 24;

// Checkpoint times in seconds (frame index / FPS):
// Phase 0: Idle at start (0s)
// Phase 1 pause: Frame 76 (idx 75)   = 75/24 = 3.125s
// Phase 2 pause: Frame 130 (idx 129) = 129/24 = 5.375s
// Phase 3 pause: Frame 200 (idx 199) = 199/24 ≈ 8.2917s
// Phase 4 end:   Frame 264 (idx 263) = 263/24 ≈ 10.9583s
const PAUSE_TIMES = [
  0,                        // Phase 0: start
  75 / FPS,                 // Phase 1 target
  129 / FPS,                // Phase 2 target
  199 / FPS,                // Phase 3 target
  (TOTAL_FRAMES - 1) / FPS, // Phase 4 target / duration
];

const TOTAL_DURATION = (TOTAL_FRAMES - 1) / FPS;

// 800ms pause cooldown for a snappy, responsive feel while absorbing trackpad momentum
const PAUSE_COOLDOWN_MS = 800;

function getFramePath(index: number) {
  const frameNum = String(index + 1).padStart(4, "0");
  return `/frames/frame_${frameNum}.webp`;
}

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

  // ─── Resize canvas to fit viewport, capped at 1920x1080 ─────────────────
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      1.5
    );
    canvas.width = Math.min(Math.round(window.innerWidth * dpr), 1920);
    canvas.height = Math.min(Math.round(window.innerHeight * dpr), 1080);

    ctxRef.current = null;
    currentFrameRef.current = -1;
  }, []);

  // ─── Preload all 264 frames with priority strategy ─────────────────────
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const emitProgress = () => {
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / TOTAL_FRAMES) * 100));
      onProgress?.(pct);
      if (loadedCount >= TOTAL_FRAMES) {
        onProgress?.(100);
        onLoaded?.();
      }
    };

    const loadAndDecodeFrame = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (images[index]) return resolve();

        const img = new Image();
        img.src = getFramePath(index);

        img.onload = () => {
          if (isCancelled) return resolve();
          images[index] = img;

          if ("decode" in img) {
            img
              .decode()
              .catch(() => {})
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
      });
    };

    // 1. Initial frame 0
    loadAndDecodeFrame(0).then(() => {
      if (isCancelled) return;
      imagesRef.current = images;
      handleResize();
      drawFrame(0);

      // 2. Checkpoint keyframes
      const checkpoints = [75, 129, 199, 263];
      checkpoints.forEach((idx) => loadAndDecodeFrame(idx));

      // 3. Batched remaining frames in concurrent parallel streams
      (async () => {
        const CHUNK_SIZE = 12;
        for (let i = 1; i < TOTAL_FRAMES; i += CHUNK_SIZE) {
          if (isCancelled) break;
          const chunk = [];
          for (let j = i; j < Math.min(i + CHUNK_SIZE, TOTAL_FRAMES); j++) {
            if (!checkpoints.includes(j)) {
              chunk.push(loadAndDecodeFrame(j));
            }
          }
          await Promise.all(chunk);
        }
      })();
    });

    imagesRef.current = images;
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
    };
  }, [drawFrame, handleResize, onProgress, onLoaded]);

  // ─── Phase-Based GSAP Engine (Adopted from hero_another_project.md) ──────
  useGSAP(
    () => {
      if (typeof window === "undefined") return;

      // currentPhase:
      // 0 = at frame 0 (start)
      // 1 = scrubbing from 0 up to frame 75 (Checkpoint 1)
      // 2 = scrubbing from frame 75 up to frame 129 (Checkpoint 2)
      // 3 = scrubbing from frame 129 up to frame 199 (Checkpoint 3)
      // 4 = scrubbing from frame 199 up to frame 264 (Final frame)
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
        let frameIndex = Math.floor(virtualTime * FPS);
        if (frameIndex < 0) frameIndex = 0;
        if (frameIndex >= TOTAL_FRAMES) frameIndex = TOTAL_FRAMES - 1;
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
        virtualTime = TOTAL_DURATION;
        render();

        observer.enable();
      };

      // ── GSAP Ticker Loop ────────────────────────────────────────────────
      const tickerFunc = (_time: number, deltaTime: number) => {
        const deltaSec = deltaTime / 1000;

        if (playState === 1) {
          // Forward scrubbing
          virtualTime += deltaSec;

          const targetPauseTime = PAUSE_TIMES[currentPhase];

          if (virtualTime >= targetPauseTime) {
            virtualTime = targetPauseTime;
            playState = 0; // go idle, wait for next user action
            setActivePhase(currentPhase);

            if (currentPhase < 4) {
              triggerCooldown();
            }
          }
          render();
        } else if (playState === -1) {
          // Reverse scrubbing
          virtualTime -= deltaSec;

          const previousPauseTime = PAUSE_TIMES[Math.max(0, currentPhase - 1)];

          if (virtualTime <= previousPauseTime) {
            virtualTime = previousPauseTime;
            currentPhase = Math.max(0, currentPhase - 1);
            playState = 0; // go idle, wait for next user action
            setActivePhase(currentPhase);

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
          setActivePhase(-1);
          currentPhase = 1;
          playState = 1;
        } else if (currentPhase >= 1 && currentPhase <= 3) {
          // If idle at a pause checkpoint, advance to next phase
          if (playState === 0 && virtualTime >= PAUSE_TIMES[currentPhase] - 0.1) {
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
          setActivePhase(-1);
          currentPhase = 1;
          playState = 1;
          return;
        }

        // On mobile, ignore rapid gesture spamming during active playback
        if (playState !== 0) return;

        if (currentPhase >= 1 && currentPhase <= 3) {
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
          virtualTime = TOTAL_DURATION;
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
    { scope: containerRef }
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

      {/* Starting Checkpoint (Frame 0) Frosted Card Overlay (Bottom Left) */}
      <div className="absolute left-5 sm:left-8 lg:left-12 bottom-6 sm:bottom-10 z-30 pointer-events-none">
        <FrostedCard
          visible={showStartCard}
          title="WEBGL & SHADER EFFECTS"
          subtitle="Visual effects that feel impossible — and run in the browser."
          description="Custom GLSL shaders for transitions, distortions, particle systems, and post-processing effects. The kind of visual layer that separates a good site from one people send to each other."
          className="w-full max-w-xs sm:max-w-sm"
        />
      </div>

      {/* Starting Checkpoint (Frame 0) Right-most Center Heading & Title */}
      <div
        className={`absolute right-5 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-end text-right transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${
          showStartCard
            ? "opacity-100 translate-y-[-50%]"
            : "opacity-0 translate-y-[-45%] pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          IMMERSIVE LED ARCHITECTURE
        </span>
        <h1 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">ENGINEERED FOR</span>
          <span className="block">VISUAL DOMINANCE</span>
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Ultra-fine pixel pitch and real-time virtual production display ecosystems.
        </p>
      </div>

      {/* Checkpoint 1 (Curved Ribbon LED) Left-most Center Heading & Title */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[42%] -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${
          activePhase === 1
            ? "opacity-100 translate-y-[-50%]"
            : "opacity-0 translate-y-[-45%] pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          IMMERSIVE LED ARCHITECTURE
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">ENGINEERED FOR</span>
          <span className="block">VISUAL DOMINANCE</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Ultra-fine pixel pitch and real-time virtual production display ecosystems.
        </p>
      </div>

      {/* Checkpoint 1 (Curved Ribbon LED) Overlays at Bottom (Three Cards) */}
      <div
        className={`absolute inset-x-0 bottom-6 sm:bottom-10 z-30 pointer-events-none px-5 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-3 gap-3.5 lg:gap-4 transition-all duration-700 ease-out select-none ${
          activePhase === 1
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        {/* Card 1 */}
        <FrostedCard
          visible={activePhase === 1}
          title="ORGANIC RIBBON ARCHITECTURE"
          subtitle="Seamless continuous-twist structural LED curves."
          description="Engineered flexible sub-millimeter modules forming continuous free-form ribbons that wrap architectural atrium columns."
          className="w-full"
        />

        {/* Card 2 */}
        <FrostedCard
          visible={activePhase === 1}
          title="HIGH-DENSITY CHROMATICS"
          subtitle="True HDR10+ calibrated deep gamut immersion."
          description="Synchronized multi-angle color accuracy and 7680Hz refresh rate engineered for broadcast and high-speed motion capture."
          className="w-full"
        />

        {/* Card 3 */}
        <FrostedCard
          visible={activePhase === 1}
          title="DYNAMIC AMBIENT LUMINANCE"
          subtitle="Adaptive real-time environment luminance synchronization."
          description="Integrated light sensor feedback arrays dynamically adjusting nit output for crystal clarity day and night."
          className="w-full"
        />
      </div>

      {/* Checkpoint 2 (Free-standing Kiosk) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[42%] -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${
          activePhase === 2
            ? "opacity-100 translate-y-[-50%]"
            : "opacity-0 translate-y-[-45%] pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          IMMERSIVE LED ARCHITECTURE
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">ENGINEERED FOR</span>
          <span className="block">VISUAL DOMINANCE</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Ultra-fine pixel pitch and real-time virtual production display ecosystems.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-5 w-full">
          <FrostedCard
            visible={activePhase === 2}
            title="AUTONOMOUS KIOSK INTERFACE"
            subtitle="Precision touch-glass edge calibration."
            description="High-frequency capacitive interaction paired with architectural warm-glow perimeter accent lighting."
            className="w-full"
          />
        </div>
      </div>

      {/* Checkpoint 3 (Large Scale Lobby Wall Display) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[42%] -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${
          activePhase === 3
            ? "opacity-100 translate-y-[-50%]"
            : "opacity-0 translate-y-[-45%] pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          IMMERSIVE LED ARCHITECTURE
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">ENGINEERED FOR</span>
          <span className="block">VISUAL DOMINANCE</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Ultra-fine pixel pitch and real-time virtual production display ecosystems.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-5 w-full">
          <FrostedCard
            visible={activePhase === 3}
            title="CINEMATIC WALL DISPLAY"
            subtitle="Ultra-fine seamless monolithic canvas."
            description="Micro-LED surface planar alignment delivering infinite contrast ratios and zero-bezel expansive field of view."
            className="w-full"
          />
        </div>
      </div>

      {/* Checkpoint 4 (Transparent Glass Cube Studio) Left-most Center Heading, Description & Frosted Card */}
      <div
        className={`absolute left-5 sm:left-8 lg:left-12 top-[42%] -translate-y-1/2 z-30 pointer-events-none hidden sm:flex flex-col items-start text-left transition-all duration-700 ease-out select-none max-w-xs sm:max-w-sm lg:max-w-md ${
          activePhase === 4
            ? "opacity-100 translate-y-[-50%]"
            : "opacity-0 translate-y-[-45%] pointer-events-none"
        }`}
      >
        <span className="text-[11px] font-medium tracking-widest text-[var(--brand-cyan)] uppercase">
          IMMERSIVE LED ARCHITECTURE
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
          <span className="block">ENGINEERED FOR</span>
          <span className="block">VISUAL DOMINANCE</span>
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-zinc-300 font-normal leading-relaxed">
          Ultra-fine pixel pitch and real-time virtual production display ecosystems.
        </p>

        {/* Frosted Card directly below heading and description */}
        <div className="mt-5 w-full">
          <FrostedCard
            visible={activePhase === 4}
            title="HOLOGRAPHIC TRANSPARENT CUBE"
            subtitle="High-transparency film with 3D depth illusion."
            description="Over 85% light transmittance allowing ambient interior light while projecting ultra-vivid floating volumetric visuals."
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroCanvas;
