"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { HeroCards } from "./HeroCards";
import { ReviewMarquee } from "./ReviewMarquee";
import { VideoShowcase } from "./VideoShowcase";

gsap.registerPlugin(Observer);

// Desktop sequence: 127 frames @ 1920×1080, pause at frame 74
const DESKTOP = {
  frameCount: 127,
  fps: 24,
  width: 1920,
  height: 1080,
  pauseTime: 73 / 24, // frame 74 (0-indexed: 73) → ~3.042s
  pathTemplate: (i: number) => `/frames/frames_${i.toString().padStart(4, "0")}.webp`,
  videoPath: "/cloudmovingdesk.mp4",
  posterFrame: "/frames/frames_0001.webp",
};

// Mobile sequence: 162 frames @ 900×1600, pause at frame 118
const MOBILE = {
  frameCount: 162,
  fps: 24,
  width: 900,
  height: 1600,
  pauseTime: 100 / 24, // frame 101 (0-indexed: 100) → ~4.167s
  pathTemplate: (i: number) => `/frames_mob/frame_${i.toString().padStart(4, "0")}.webp`,
  videoPath: "/cloudmovingmob.mp4",
  posterFrame: "/frames_mob/frame_0001.webp",
};

const MOBILE_BREAKPOINT = 768;

type HeroConfig = typeof DESKTOP;

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const vid0Ref = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [config, setConfig] = useState<HeroConfig | null>(null);
  const [activeArrows, setActiveArrows] = useState<"none" | "forward" | "backward" | "both">("none");
  const [showNavbar, setShowNavbar] = useState(true);
  const triggerForwardRef = useRef<(() => void) | null>(null);
  const triggerBackwardRef = useRef<(() => void) | null>(null);
  const arrowsRef = useRef<HTMLDivElement>(null);

  // ── Scroll guidance state ──
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [showContinueHint, setShowContinueHint] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [showPauseCards, setShowPauseCards] = useState(false);
  const [showFinalOverlay, setShowFinalOverlay] = useState(false);
  const scrollHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const continueHintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressTickRef = useRef(0);
  const pauseCooldownRef = useRef(false);

  // Detect device once on mount — nothing loads until this runs
  useEffect(() => {
    const isMobile = window.innerWidth < MOBILE_BREAKPOINT;
    setConfig(isMobile ? MOBILE : DESKTOP);
  }, []);

  // Preload the correct image set whenever config changes
  useEffect(() => {
    if (!config) return; // Don't preload until device detected
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= config.frameCount; i++) {
      const img = new Image();
      img.src = config.pathTemplate(i);
      images.push(img);
    }
    imagesRef.current = images;
  }, [config]);

  // Resize canvas to match the chosen config
  useEffect(() => {
    if (!config) return;
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = config.width;
      canvas.height = config.height;
    }
  }, [config]);

  const duration = config ? config.frameCount / config.fps : 0;
  const pauseTime = config ? config.pauseTime : 0;

  // Don't run animation until config is set
  const configReady = config !== null;

  useGSAP(() => {
    if (!configReady || !config) return; // Skip until device detected
    // currentPhase:
    // 0 = cloud loop
    // 1 = frames playing up to pauseTime
    // 2 = frames playing from pauseTime to end
    let currentPhase = 0;

    // playState: 0 = idle/paused, 1 = playing forward, -1 = playing reverse
    let playState = 0;
    let scrollLocked = true; // Start locked at the top

    document.body.style.overflow = "hidden";

    // ── Hint helpers ──
    const clearAllHints = () => {
      if (scrollHintTimerRef.current) {
        clearTimeout(scrollHintTimerRef.current);
        scrollHintTimerRef.current = null;
      }
      if (continueHintTimerRef.current) {
        clearTimeout(continueHintTimerRef.current);
        continueHintTimerRef.current = null;
      }
      setShowScrollHint(false);
      setShowContinueHint(false);
      setActiveArrows("none");
    };

    const startPhase0IdleTimer = () => {
      if (scrollHintTimerRef.current) clearTimeout(scrollHintTimerRef.current);
      scrollHintTimerRef.current = setTimeout(() => {
        setShowScrollHint(true);
        if (isMobileDeviceRef.current) setActiveArrows("forward");
      }, 3000);
    };

    const startPhase1IdleTimer = () => {
      if (continueHintTimerRef.current) clearTimeout(continueHintTimerRef.current);
      continueHintTimerRef.current = setTimeout(() => {
        setShowContinueHint(true);
        if (isMobileDeviceRef.current) setActiveArrows("both");
      }, 2000);
    };

    // Start Phase 0 idle timer immediately
    startPhase0IdleTimer();

    const vid0 = vid0Ref.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    let virtualTime = 0;

    const renderFrame = () => {
      if (!ctx || !canvas || imagesRef.current.length === 0) return;
      let frameIndex = Math.floor(virtualTime * config.fps);
      if (frameIndex < 0) frameIndex = 0;
      if (frameIndex >= config.frameCount) frameIndex = config.frameCount - 1;

      const img = imagesRef.current[frameIndex];
      if (img && img.complete && img.naturalWidth !== 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    };

    const transitionToMain = () => {
      if (!vid0 || !canvas) return;
      gsap.killTweensOf([vid0, canvas]);
      gsap.set(canvas, { zIndex: 10, opacity: 1 });
      gsap.set(vid0, { zIndex: 20 }); // Keep current opacity, will animate from it
      gsap.to(vid0, { opacity: 0, duration: 0.5 });
    };

    const transitionToCloud = () => {
      if (!vid0 || !canvas) return;
      gsap.killTweensOf([vid0, canvas]);
      gsap.set(vid0, { zIndex: 10, opacity: 1 });
      gsap.set(canvas, { zIndex: 20 }); // Keep current opacity, will animate from it
      gsap.to(canvas, { opacity: 0, duration: 0.5 });
    };


    // Detect device type for scroll direction handling
    const isMobileDevice = window.innerWidth < MOBILE_BREAKPOINT;

    if (isMobileDevice) {
      // arrows will appear together with the scroll hint via the idle timer
    }
    const isMobileDeviceRef = { current: isMobileDevice };
    setShowNavbar(true);

    // Touch re-entry for mobile: detect swipe-down (scroll up) at scrollY=0
    let reentryTouchStartY = 0;
    const onReentryTouchStart = (e: TouchEvent) => {
      reentryTouchStartY = e.touches[0].clientY;
    };
    const onReentryTouchMove = (e: TouchEvent) => {
      if (window.scrollY <= 0) {
        const deltaY = e.touches[0].clientY - reentryTouchStartY;
        if (deltaY > 20) { // finger dragged down → user wants to scroll up
          e.preventDefault();
          removeReentryListeners();
          lockScroll();
          currentPhase = 2;
          playState = 0; // remain idle at the end, waiting for click
          setActiveArrows("none");
          startPhase1IdleTimer();
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

    const unlockScroll = () => {
      scrollLocked = false;
      observer.disable();

      // Pin the hero container to its current pixel height BEFORE unlocking.
      // This prevents mobile browser chrome changes from recalculating 100dvh
      // and causing a visible layout jump / expansion in the TrustedBy section.
      const container = containerRef.current;
      if (container) {
        const currentHeight = container.getBoundingClientRect().height;
        container.style.height = `${currentHeight}px`;
      }

      // Delay the overflow change by one frame so the pinned height is in place first
      requestAnimationFrame(() => {
        document.body.style.overflow = "auto";
        if (isMobileDevice) addReentryListeners();
      });
    };

    const lockScroll = () => {
      scrollLocked = true;
      document.body.style.overflow = "hidden";

      // Restore the hero container to dvh-based height when re-entering
      const container = containerRef.current;
      if (container) {
        container.style.height = "";
      }

      // Use smooth scroll to prevent the jarring jump on re-entry
      if (window.scrollY > 0) {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      if (isMobileDevice) removeReentryListeners();
      observer.enable();
    };

    const playSafe = (vid: HTMLVideoElement) => {
      if (vid.paused) {
        const playPromise = vid.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Silently handle DOMException AbortError
          });
        }
      }
    };

    const tickerFunc = (time: number, deltaTime: number) => {
      if (!vid0 || !canvas) return;

      const deltaSec = deltaTime / 1000;

      if (playState === 1) {
        // Forward Playback
        if (currentPhase === 0) {
          playSafe(vid0);
        } else if (currentPhase === 1) {
          virtualTime += deltaSec;
          if (virtualTime >= pauseTime) {
            virtualTime = pauseTime;
            playState = 0; // go idle, wait for next click/scroll
            if (isMobileDevice) {
              // arrows will appear with the continue hint via startPhase1IdleTimer
            }
            // Show cards and start 2-second cooldown
            setShowPauseCards(true);
            setShowNavbar(true); // Show Navbar when hitting first pause
            pauseCooldownRef.current = true;
            setTimeout(() => { pauseCooldownRef.current = false; }, 2000);
            // Start Phase 1 pause idle timer
            startPhase1IdleTimer();
          }
          renderFrame();
        } else if (currentPhase === 2) {
          virtualTime += deltaSec;
          if (virtualTime >= duration - 0.1) {
            virtualTime = duration - 0.1;
            playState = 0;
            // Show Navbar first so it renders in solid state before scroll unlocks
            setShowNavbar(true);
            setShowProgress(false);
            setShowFinalOverlay(true);
            if (isMobileDevice) {
              setActiveArrows("none");
            }
            // Small delay before unlocking scroll to let Navbar settle
            if (scrollLocked) {
              setTimeout(() => {
                unlockScroll();
              }, 50);
            }
          }
          renderFrame();
        }
      } else if (playState === -1) {
        // Reverse Playback
        if (currentPhase === 0) {
          playState = 1; // back to forward loop
        } else if (currentPhase === 1) {
          virtualTime -= deltaSec;

          if (virtualTime <= 0) {
            virtualTime = 0;
            currentPhase = 0;
            transitionToCloud();
            playState = 1; // loop cloud
            setShowNavbar(true);
            setShowProgress(false);
            setShowPauseCards(false);
            startPhase0IdleTimer();
            if (isMobileDevice) {
              // arrows will appear with the scroll hint via startPhase0IdleTimer
            }
          }
          renderFrame();
        } else if (currentPhase === 2) {
          setShowFinalOverlay(false);
          virtualTime -= deltaSec;

          if (virtualTime <= pauseTime) {
            virtualTime = pauseTime;
            currentPhase = 1;
            playState = 0; // stop at the pause point when going back up
            setShowPauseCards(true);
            setShowNavbar(true); // Show Navbar when reverse scroll hits the pause point
            pauseCooldownRef.current = true;
            setTimeout(() => { pauseCooldownRef.current = false; }, 2000);
            startPhase1IdleTimer();
            if (isMobileDevice) {
              // arrows will appear with the continue hint via startPhase1IdleTimer
            }
          }
          renderFrame();
        }
      }
    };

    // ── Throttled scroll progress update ──
    const updateProgress = () => {
      progressTickRef.current++;
      if (progressTickRef.current % 3 === 0 && currentPhase > 0) {
        setScrollProgress(virtualTime / duration);
      }
    };

    const tickerWithProgress = (time: number, deltaTime: number) => {
      tickerFunc(time, deltaTime);
      updateProgress();
    };

    gsap.ticker.add(tickerWithProgress);

    const handleScrollForward = () => {
      if (!scrollLocked) return;

      if (currentPhase === 0) {
        currentPhase = 1;
        transitionToMain();
        playState = 1;
        setShowNavbar(false);
        clearAllHints();
        setShowProgress(true);
      } else if (currentPhase === 1) {
        // Block scroll during 2-second cooldown
        if (pauseCooldownRef.current) return;
        // We are at the pause point, trigger phase 2
        if (playState === 0 && virtualTime >= pauseTime - 0.1) {
          currentPhase = 2;
          playState = 1;
          setShowPauseCards(false);
          setShowNavbar(false); // Hide Navbar when resuming forward scroll
          clearAllHints();
        } else {
          playState = 1;
          setShowNavbar(false); // Hide Navbar when scroll is active
        }
      } else if (currentPhase === 2) {
        playState = 1;
      }
    };

    const handleScrollReverse = () => {
      if (!scrollLocked) return;
      // Block scroll during 2-second cooldown
      if (currentPhase === 1 && pauseCooldownRef.current) return;

      if (currentPhase > 0) {
        playState = -1; // Trigger reverse
        setShowPauseCards(false);
        setShowNavbar(false);
        clearAllHints();
      }
    };

    // Mobile click handlers mapped to the same animation transitions
    const handleForwardClick = () => {
      if (!scrollLocked) return;

      if (currentPhase === 0) {
        currentPhase = 1;
        transitionToMain();
        playState = 1;
        setActiveArrows("none");
        setShowNavbar(false);
        clearAllHints();
        setShowProgress(true);
      } else if (currentPhase === 1) {
        // Block during 2-second cooldown
        if (pauseCooldownRef.current) return;
        if (playState === 0 && virtualTime >= pauseTime - 0.1) {
          currentPhase = 2;
          playState = 1;
          setActiveArrows("none");
          setShowPauseCards(false);
          setShowNavbar(false); // Hide Navbar when mobile forward tap resumes scroll
          clearAllHints();
        }
      } else if (currentPhase === 2) {
        // Already at the end — just unlock scroll to let user continue
        if (playState === 0) {
          unlockScroll();
          setActiveArrows("none");
        }
      }
    };

    const handleBackwardClick = () => {
      if (!scrollLocked) return;
      // Block during 2-second cooldown
      if (currentPhase === 1 && pauseCooldownRef.current) return;

      if (currentPhase > 0) {
        playState = -1;
        setActiveArrows("none");
        setShowPauseCards(false);
        setShowNavbar(false);
        clearAllHints();
      }
    };

    triggerForwardRef.current = handleForwardClick;
    triggerBackwardRef.current = handleBackwardClick;

    // Mobile scroll handlers: same as clicks but ignore input during animation
    const handleMobileScrollForward = () => {
      if (!scrollLocked) return;
      // Block during 2-second cooldown
      if (currentPhase === 1 && pauseCooldownRef.current) return;
      // Phase 0 (cloud loop): always allow transition
      if (currentPhase === 0) {
        currentPhase = 1;
        transitionToMain();
        playState = 1;
        setActiveArrows("none");
        setShowNavbar(false);
        clearAllHints();
        setShowProgress(true);
        return;
      }
      // All other phases: only respond when idle (at a stop point)
      if (playState !== 0) return;
      handleForwardClick();
    };

    const handleMobileScrollReverse = () => {
      if (!scrollLocked || playState !== 0) return;
      // Block during 2-second cooldown
      if (currentPhase === 1 && pauseCooldownRef.current) return;
      handleBackwardClick();
    };

    const observer = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      preventDefault: !isMobileDevice,
      // Touch: onUp (finger swipes up) = scroll down = forward
      // Touch: onDown (finger swipes down) = scroll up = reverse
      onDown: (self: any) => {
        const isTouchGesture = Boolean(
          self?.isTouch ||
          (self?.event && (self.event.type?.startsWith("touch") || self.event?.pointerType === "touch"))
        );
        if (isTouchGesture) {
          handleMobileScrollReverse();
        } else {
          handleScrollForward();
        }
      },
      onUp: (self: any) => {
        const isTouchGesture = Boolean(
          self?.isTouch ||
          (self?.event && (self.event.type?.startsWith("touch") || self.event?.pointerType === "touch"))
        );
        if (isTouchGesture) {
          handleMobileScrollForward();
        } else {
          handleScrollReverse();
        }
      },
    });

    const onNativeScroll = () => {
      if (!scrollLocked && window.scrollY <= 0) {
        lockScroll();
        setShowFinalOverlay(false);
        currentPhase = 2; // We are re-entering from the bottom
        playState = 0;
        if (isMobileDevice) {
          setActiveArrows("none");
          startPhase1IdleTimer();
        }
      }
    };
    const onResetHeroStart = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
      lockScroll();
      currentPhase = 0;
      virtualTime = 0;
      playState = 1;
      setShowPauseCards(false);
      setShowFinalOverlay(false);
      setShowNavbar(true);
      setShowProgress(false);
      setScrollProgress(0);
      observer.enable();

      if (vid0 && canvas) {
        gsap.killTweensOf([vid0, canvas]);
        vid0.style.opacity = "1";
        vid0.style.zIndex = "20";
        vid0.currentTime = 0;
        vid0.play().catch(() => {});
        canvas.style.opacity = "0";
        canvas.style.zIndex = "10";
      }
      renderFrame();
      startPhase0IdleTimer();
    };

    window.addEventListener("scroll", onNativeScroll);
    window.addEventListener("reset-hero-start", onResetHeroStart);

    // Initial styling setup
    if (vid0) vid0.style.opacity = "1";
    if (vid0) vid0.style.zIndex = "20";
    if (canvas) canvas.style.opacity = "0";
    if (canvas) canvas.style.zIndex = "10";
    playState = 1;

    // Initial frame render
    renderFrame();

    // Check scroll position to handle page re-entry / back navigation scroll restoration
    const checkScrollPosition = () => {
      if (window.scrollY > 50) {
        scrollLocked = false;
        document.body.style.overflow = "auto";
        observer.disable();

        // Pin hero height for consistency (prevents dvh shifts on back-nav)
        const container = containerRef.current;
        if (container) {
          const currentHeight = container.getBoundingClientRect().height;
          container.style.height = `${currentHeight}px`;
        }
        
        currentPhase = 2;
        virtualTime = duration - 0.1;
        playState = 0;
        
        setShowPauseCards(false);
        setShowFinalOverlay(true);
        setShowNavbar(true);
        setShowProgress(false);
        setScrollProgress(1);
        
        if (isMobileDevice) {
          setActiveArrows("none");
          addReentryListeners();
        }
        
        if (vid0 && canvas) {
          gsap.killTweensOf([vid0, canvas]);
          canvas.style.opacity = "1";
          canvas.style.zIndex = "10";
          vid0.style.opacity = "0";
          vid0.style.zIndex = "20";
        }
        renderFrame();
      }
    };

    checkScrollPosition();
    const t1 = setTimeout(checkScrollPosition, 50);
    const t2 = setTimeout(checkScrollPosition, 150);

    return () => {
      gsap.ticker.remove(tickerWithProgress);
      observer.kill();
      removeReentryListeners();
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("reset-hero-start", onResetHeroStart);
      clearAllHints();
      clearTimeout(t1);
      clearTimeout(t2);

      document.body.style.overflow = "auto";
      // Clear any pinned height
      if (containerRef.current) {
        containerRef.current.style.height = "";
      }
      triggerForwardRef.current = null;
      triggerBackwardRef.current = null;
    };
  }, { scope: containerRef, dependencies: [config, configReady, duration, pauseTime] });

  // Show loading placeholder until device is detected
  if (!config) {
    return (
      <section className="relative w-full h-[100dvh] bg-white" />
    );
  }

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full h-[100dvh] bg-white"
    >
      {/* Navbar visible on both Desktop and Mobile */}
      {config && <Navbar visible={showNavbar} />}

      <div
        ref={innerRef}
        className="absolute inset-0 overflow-hidden"
      >
        {/* Static first frame as fallback while video loads */}
        <img
          src={config.posterFrame}
          alt=""
          className="absolute top-0 left-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        />

        <video
          ref={vid0Ref}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-100"
          style={{ zIndex: 2 }}
          src={config.videoPath}
          autoPlay
          loop
          muted
          playsInline
        />

        <canvas
          ref={canvasRef}
          width={config.width}
          height={config.height}
          className="absolute top-0 left-0 w-full h-full object-cover opacity-0"
        />

        {/* ── Phase 1 Pause: Featured Property Cards Overlay ── */}
        <HeroCards visible={showPauseCards} isMobile={config === MOBILE} />

        {/* ── Final Frame: Review Marquee & Video Showcase Overlays ── */}
        <ReviewMarquee visible={showFinalOverlay} isMobile={config === MOBILE} />
        <VideoShowcase visible={showFinalOverlay} isMobile={config === MOBILE} />
      </div>

      {config === MOBILE && (
        <div
          ref={arrowsRef}
          className="absolute right-5 z-50 flex items-center gap-3"
          style={{ bottom: '96px' }}
        >
          <button
            onClick={() => triggerBackwardRef.current?.()}
            aria-label="Previous Phase"
            className={`w-11 h-11 rounded-full bg-white/[0.02] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-white transition-all duration-300 ${activeArrows === "backward" || activeArrows === "both"
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-75 pointer-events-none"
              }`}
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          >
            <ChevronLeft size={22} strokeWidth={2.5} />
          </button>
          <button
            onClick={() => triggerForwardRef.current?.()}
            aria-label="Next Phase"
            className={`w-11 h-11 rounded-full bg-white/[0.02] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-white transition-all duration-300 ${activeArrows === "forward" || activeArrows === "both"
              ? "opacity-100 scale-100 pointer-events-auto"
              : "opacity-0 scale-75 pointer-events-none"
              }`}
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          >
            <ChevronRight size={22} strokeWidth={2.5} />
          </button>
        </div>
      )}

      {/* ── Phase 0: Scroll-down hint ── */}
      <div
        className="absolute z-50 flex flex-col pointer-events-none select-none transition-all duration-700 ease-in-out"
        style={
          config === MOBILE
            ? {
                bottom: '156px',
                right: '20px',
                alignItems: 'flex-end',
                visibility: showScrollHint ? 'visible' as const : 'hidden' as const,
                transform: `translateY(${showScrollHint ? 0 : 16}px)`,
              }
            : {
                bottom: '48px',
                left: '50%',
                alignItems: 'center',
                visibility: showScrollHint ? 'visible' as const : 'hidden' as const,
                transform: `translateX(-50%) translateY(${showScrollHint ? 0 : 16}px)`,
              }
        }
      >
          <div
            className={
              config === MOBILE
                ? "px-4 py-2 rounded-full bg-white/[0.02] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] whitespace-nowrap"
                : "px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] whitespace-nowrap"
            }
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          >
            <span
              className="text-white font-medium tracking-wide"
              style={{ fontSize: config === MOBILE ? '14px' : '14px' }}
            >
              {config === MOBILE ? 'Scroll or tap' : 'Scroll to explore'}
            </span>
          </div>
          {/* Animated double-chevron SVG (Desktop only) */}
          {config !== MOBILE && (
            <svg
              width="28"
              height="32"
              viewBox="0 0 28 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: '8px' }}
            >
              <polyline
                points="6,4 14,12 22,4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  animation: 'scroll-bounce 1.6s ease-in-out infinite',
                }}
              />
              <polyline
                points="6,16 14,24 22,16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  animation: 'scroll-bounce-delayed 1.6s ease-in-out infinite 0.2s',
                }}
              />
            </svg>
          )}
        </div>
      {/* ── Phase 1 Pause: Continue-scroll hint ── */}
      <div
        className="absolute z-50 flex flex-col pointer-events-none select-none transition-all duration-700 ease-in-out"
        style={
          config === MOBILE
            ? {
                bottom: '156px',
                right: '20px',
                alignItems: 'flex-end',
                visibility: showContinueHint ? 'visible' as const : 'hidden' as const,
                transform: `translateY(${showContinueHint ? 0 : 16}px)`,
              }
            : {
                bottom: '48px',
                left: '50%',
                alignItems: 'center',
                visibility: showContinueHint ? 'visible' as const : 'hidden' as const,
                transform: `translateX(-50%) translateY(${showContinueHint ? 0 : 16}px)`,
              }
        }
      >
          <div
            className={
              config === MOBILE
                ? "px-4 py-2 rounded-full bg-white/[0.02] border border-white/15 shadow-[0_10px_30px_rgba(0,0,0,0.12)] whitespace-nowrap"
                : "px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] whitespace-nowrap"
            }
            style={{
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)"
            }}
          >
            <span
              className="text-white font-medium tracking-wide"
              style={{ fontSize: config === MOBILE ? '14px' : '14px' }}
            >
              {config === MOBILE ? 'Scroll or tap' : 'Continue scrolling'}
            </span>
          </div>
          {/* Animated double-chevron SVG (Desktop only) */}
          {config !== MOBILE && (
            <svg
              width="28"
              height="32"
              viewBox="0 0 28 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ marginTop: '8px' }}
            >
              <polyline
                points="6,4 14,12 22,4"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  animation: 'scroll-bounce 1.6s ease-in-out infinite',
                }}
              />
              <polyline
                points="6,16 14,24 22,16"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                style={{
                  animation: 'scroll-bounce-delayed 1.6s ease-in-out infinite 0.2s',
                }}
              />
            </svg>
          )}
        </div>
      {/* ── Vertical scroll progress bar ── */}
      {showProgress && (
        <div
          className="absolute z-50 pointer-events-none"
          style={{
            ...(config === MOBILE
              ? { right: '12px', height: '80px' }
              : { right: '16px', height: '100px' }),
            top: '50%',
            transform: 'translateY(-50%)',
            width: '3px',
            borderRadius: '2px',
            background: 'rgba(255,255,255,0.15)',
            overflow: 'hidden',
            transition: 'opacity 0.4s ease',
          }}
        >
          <div
            style={{
              width: '100%',
              height: `${Math.min(scrollProgress * 100, 100)}%`,
              background: 'rgba(255,255,255,0.7)',
              borderRadius: '2px',
              transition: 'height 0.1s linear',
              animation: 'progress-pulse 2s ease-in-out infinite',
            }}
          />
        </div>
      )}
    </section>
  );
}
