"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroCanvas } from "@/components/hero-canvas";
import { ProcessSection } from "@/components/process-section";
import { Preloader } from "@/components/preloader";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-cyan-500 selection:text-black">
      {/* Global Interactive Custom Cursor with Fluid Ribbon Trail across All Sections */}
      <CustomCursor />
      {/* SVG Circle Matrix Preloader */}
      <Preloader
        progress={loadingProgress}
        onComplete={() => setIsLoaded(true)}
      />

      {/* Fixed Header Navbar with Brand & Company Logos */}
      <Navbar visible={isLoaded} />

      {/* Fullscreen Hero Scroll Canvas (All 246 WebP Frames Preloaded Dynamically) */}
      <HeroCanvas
        onProgress={(pct) => setLoadingProgress((prev) => Math.max(prev, pct))}
        onLoaded={() => setLoadingProgress(100)}
      />

      {/* Unified Master Stage: Contact CTA -> Process Section -> Service Home -> Mission Vision -> Contact Form & Footer */}
      <ProcessSection />

      {/* Floating WhatsApp Quick Action Button (Visible after hero section scrolling) */}
      <FloatingWhatsApp />
    </div>
  );
}
