"use client";

import React from "react";

export interface FloatingContactProps {
  /** Phone number for direct phone calls (tel link) - defaults to +971 56 990 5842 */
  callNumber?: string;
  /** Phone number alias */
  phoneNumber?: string;
  /** WhatsApp phone number with country code - defaults to 971569905842 */
  whatsappNumber?: string;
  /** Pre-filled WhatsApp message */
  defaultMessage?: string;
  /** Optional additional CSS class */
  className?: string;
}

export function FloatingContact({
  callNumber,
  phoneNumber,
  whatsappNumber = "971569905842",
  defaultMessage = "Hello Desire Digital team, I would like to inquire about your services.",
  className = "",
}: FloatingContactProps) {
  const activeCallNumber = callNumber || phoneNumber || "+971569905842";
  const activeWhatsappNumber = whatsappNumber || "971569905842";
  const cleanWhatsappNumber = activeWhatsappNumber.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(defaultMessage)}`;
  const callUrl = `tel:${activeCallNumber.replace(/\s+/g, "")}`;

  return (
    <aside
      aria-label="Quick contact actions"
      className={`fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 flex flex-col items-center gap-3 sm:gap-3.5 select-none ${className}`}
    >
      {/* 1. Quick Call Action Button (Positioned above WhatsApp) */}
      <a
        href={callUrl}
        aria-label={`Call us at ${activeCallNumber}`}
        title="Call Us"
        className="group relative flex h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] items-center justify-center rounded-full border border-[#00b5e2]/40 bg-[#06080d]/90 backdrop-blur-xl text-[#00b5e2] shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(0,181,226,0.25)] transition-all duration-300 hover:bg-[#00b5e2] hover:text-black hover:border-[#00b5e2] hover:shadow-[0_0_26px_rgba(0,181,226,0.65)] hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0"
      >
        {/* Subtle brand tint inside */}
        <span className="absolute inset-0 rounded-full bg-[#00b5e2]/15 transition-opacity group-hover:opacity-0 pointer-events-none" />

        {/* Call / Phone Icon */}
        <svg
          className="relative z-10 w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-2.2 2.2a15.053 15.053 0 0 1-6.59-6.59l2.2-2.21a.96.96 0 0 0 .25-1A11.36 11.36 0 0 1 8.57 3.99c0-.55-.45-1-1-1H4.01c-.55 0-1 .45-1 1 0 9.39 7.63 17.02 17.02 17.02.55 0 1-.45 1-1v-3.57c0-.56-.45-1.06-1.02-1.06z" />
        </svg>

        {/* Minimal Desktop Tooltip on Hover */}
        <span className="hidden sm:inline-block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#06080d]/95 border border-white/15 text-xs font-medium text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl backdrop-blur-md translate-x-1 group-hover:translate-x-0">
          Call Us
        </span>
      </a>

      {/* 2. WhatsApp Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        title="Chat with us on WhatsApp"
        className="group relative flex h-[50px] w-[50px] sm:h-[58px] sm:w-[58px] items-center justify-center rounded-full border border-[#00b5e2]/40 bg-[#06080d]/90 backdrop-blur-xl text-[#00b5e2] shadow-[0_8px_30px_rgba(0,0,0,0.7),0_0_20px_rgba(0,181,226,0.25)] transition-all duration-300 hover:bg-[#00b5e2] hover:text-black hover:border-[#00b5e2] hover:shadow-[0_0_26px_rgba(0,181,226,0.65)] hover:-translate-y-0.5 active:scale-95 cursor-pointer shrink-0"
      >
        {/* Subtle brand tint inside */}
        <span className="absolute inset-0 rounded-full bg-[#00b5e2]/15 transition-opacity group-hover:opacity-0 pointer-events-none" />

        {/* WhatsApp Icon */}
        <svg
          className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 group-hover:scale-110"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
        </svg>

        {/* Minimal Desktop Tooltip on Hover */}
        <span className="hidden sm:inline-block absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-[#06080d]/95 border border-white/15 text-xs font-medium text-zinc-200 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-2xl backdrop-blur-md translate-x-1 group-hover:translate-x-0">
          WhatsApp
        </span>
      </a>
    </aside>
  );
}

// Aliases for compatibility
export const FloatingWhatsApp = FloatingContact;
export default FloatingContact;
