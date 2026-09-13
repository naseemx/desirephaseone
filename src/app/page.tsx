"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { HeroCanvas } from "@/components/hero-canvas";
import { ContactForm } from "@/components/contact-form";
import { Footer } from "@/components/footer";
import { Preloader } from "@/components/preloader";

export default function Home() {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#09090b] text-zinc-100 selection:bg-cyan-500 selection:text-black">
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

      {/* Modern Responsive Contact Form */}
      <ContactForm />

      {/* Modern High-Performance Footer placed immediately after Hero */}
      <Footer />
    </div>
  );
}
