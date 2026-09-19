"use client";

import React, { useState, useEffect } from "react";

export interface FloatingWhatsAppProps {
  phoneNumber?: string;
  defaultMessage?: string;
}

export function FloatingWhatsApp({
  phoneNumber = "971501234567",
  defaultMessage = "Hello Desire Digital team, I would like to inquire about your services.",
}: FloatingWhatsAppProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if we are already scrolled down or if hero is not present (e.g. subpages or reload)
    const checkVisibility = () => {
      const hasHero = Boolean(document.getElementById("hero"));
      if (!hasHero) {
        setVisible(true);
        return;
      }

      if (window.scrollY > 50) {
        setVisible(true);
      } else {
        const isLocked = (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked;
        if (isLocked) {
          setVisible(false);
        }
      }
    };

    checkVisibility();

    // Event listeners for hero-to-process transition
    const handleShow = () => setVisible(true);
    const handleHide = () => setVisible(false);

    const handleScroll = () => {
      const hasHero = Boolean(document.getElementById("hero"));
      if (!hasHero) {
        setVisible(true);
        return;
      }
      if (window.scrollY > 50) {
        setVisible(true);
      } else {
        const isLocked = (window as unknown as { heroScrollLocked?: boolean }).heroScrollLocked;
        if (isLocked) {
          setVisible(false);
        }
      }
    };

    window.addEventListener("hero:fade-to-process", handleShow);
    window.addEventListener("hero:fade-to-hero", handleHide);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("hero:fade-to-process", handleShow);
      window.removeEventListener("hero:fade-to-hero", handleHide);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(defaultMessage)}`;

  return (
    <div
      className={`fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 transition-all duration-500 ease-out select-none ${
        visible
          ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
          : "opacity-0 scale-75 pointer-events-none translate-y-4"
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="group relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-[#00b5e2]/30 bg-[#06080d]/85 backdrop-blur-md text-[#00b5e2] shadow-lg shadow-black/50 transition-all duration-300 hover:bg-[#00b5e2] hover:text-black hover:border-[#00b5e2] hover:shadow-[0_0_18px_rgba(0,181,226,0.5)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
      >
        {/* Subtle brand tint inside */}
        <span className="absolute inset-0 rounded-full bg-[#00b5e2]/10 transition-opacity group-hover:opacity-0 pointer-events-none" />

        {/* Minimal WhatsApp Icon matching Footer */}
        <svg
          className="relative z-10 w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-300 group-hover:scale-105"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
        </svg>

        {/* Minimal Tooltip on Hover */}
        <span className="hidden sm:inline-block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-[#06080d]/95 border border-white/10 text-[11px] font-medium text-zinc-300 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl backdrop-blur-md translate-x-1 group-hover:translate-x-0">
          WhatsApp
        </span>
      </a>
    </div>
  );
}

export default FloatingWhatsApp;
