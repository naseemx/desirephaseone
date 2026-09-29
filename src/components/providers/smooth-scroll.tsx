"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis directly on the window
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      prevent: (node) => {
        if ((window as unknown as { serviceDrawerOpen?: boolean }).serviceDrawerOpen) {
          return true;
        }
        if (node instanceof HTMLElement && node.closest("[data-lenis-prevent]")) {
          return true;
        }
        // Prevent all Lenis scrolling when hero section is active / locked
        return (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked !== false;
      },
    });

    // If hero starts in locked state, immediately halt Lenis virtual scroll
    if ((window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked !== false) {
      lenis.stop();
    }

    // Expose lenis instance globally for scroll-lock coordination
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Synchronize Lenis scroll event with GSAP ScrollTrigger
    lenis.on("scroll", () => {
      ScrollTrigger.update();
    });

    // Drive Lenis raf through GSAP's ticker
    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);
    gsap.ticker.lagSmoothing(0);

    // Ensure ScrollTrigger is calculated properly
    ScrollTrigger.refresh();

    // Handle browser bfcache restoration (back/forward navigation)
    // When bfcache restores the page, stale overflow:hidden and scroll-lock flags
    // can leave the page stuck dark/unscrollable
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Reset stale global flags
        (window as unknown as { serviceDrawerOpen?: boolean }).serviceDrawerOpen = false;
        // Reset body overflow to allow scrolling
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        // Restart Lenis if it exists
        lenis.start();
        ScrollTrigger.refresh();
      }
    };

    window.addEventListener("pageshow", handlePageShow);

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

export default SmoothScroll;
