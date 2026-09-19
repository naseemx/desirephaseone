"use client";

import React from "react";
import Image from "next/image";
import { ArrowUp, Mail, Phone } from "lucide-react";

export function Footer() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      if (lenis) {
        lenis.scrollTo(0);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "YouTube",
      href: "https://youtube.com",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
    {
      name: "Twitter",
      href: "https://x.com",
      icon: (
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: "WhatsApp",
      href: "https://wa.me/971501234567?text=Hello%20Desire%20Digital%20team,%20I%20would%20like%20to%20inquire%20about%20your%20services.",
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.4-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.38 1 2.55c.13.17 1.73 2.64 4.19 3.7.59.25 1.05.4 1.41.51.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.07-.1-.23-.17-.48-.29" />
        </svg>
      ),
    },
    {
      name: "Call Us",
      href: "tel:+971501234567",
      icon: <Phone className="w-4 h-4" />,
    },
  ];

  return (
    <footer
      id="footer"
      className="relative border-t border-white/10 bg-[#06080d] text-zinc-400 select-none overflow-hidden"
    >
      {/* Top subtle brand glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#00b5e2]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:px-10">
        {/* Main Grid: Brand & Contact Info, Quick Navigation, Social & Call */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 pb-12 border-b border-white/[0.08]">
          {/* Col 1: Brand & Logos (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col items-start space-y-4">
            <a
              href="#hero"
              className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 active:scale-[0.98]"
              aria-label="Home"
            >
              <div className="relative h-[24px] sm:h-[28px] w-[62px] sm:w-[72px] shrink-0">
                <Image
                  src="/companylogo.png"
                  alt="Desire Advertising"
                  fill
                  className="object-contain"
                />
              </div>

              <div className="h-3.5 sm:h-4 w-[1px] bg-white/20 shrink-0" />

              <div className="relative h-[15px] sm:h-[17px] w-[85px] sm:w-[98px] shrink-0">
                <Image
                  src="/brandlogo.png"
                  alt="Dzyr Digital"
                  fill
                  className="object-contain"
                />
              </div>
            </a>

            <p className="text-xs sm:text-[13px] text-zinc-400 leading-relaxed max-w-sm font-normal">
              Innovative digital LED displays, interactive visual systems, and bespoke turnkey fabrication solutions across the UAE and GCC.
            </p>

            {/* Quick Links: Email & Phone Number */}
            <div className="pt-2 flex flex-col space-y-2.5">
              <a
                href="mailto:info@dzyrdigital.com"
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-[#00b5e2] transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-[#00b5e2]/40 group-hover:bg-[#00b5e2]/10 flex items-center justify-center transition-all">
                  <Mail className="w-3.5 h-3.5 text-[#00b5e2]" />
                </div>
                <span>info@dzyrdigital.com</span>
              </a>

              <a
                href="tel:+971501234567"
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-zinc-300 hover:text-[#00b5e2] transition-colors group"
              >
                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/10 group-hover:border-[#00b5e2]/40 group-hover:bg-[#00b5e2]/10 flex items-center justify-center transition-all">
                  <Phone className="w-3.5 h-3.5 text-[#00b5e2]" />
                </div>
                <span>+971 50 123 4567</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Navigation (3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col space-y-3">
            <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
              Quick Links
            </span>
            <nav className="flex flex-col space-y-2 text-xs sm:text-[13px]">
              <a
                href="#hero"
                className="text-zinc-400 hover:text-white transition-colors py-0.5"
              >
                Home
              </a>
              <a
                href="#servicehome"
                className="text-zinc-400 hover:text-white transition-colors py-0.5"
              >
                Specialized Services
              </a>
              <a
                href="#contact"
                className="text-zinc-400 hover:text-white transition-colors py-0.5"
              >
                Contact Us
              </a>
            </nav>
          </div>

          {/* Col 3: Social Profile Icons in Brand Color & Call Button (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Connect With Us
              </span>
              <p className="text-xs text-zinc-400 mt-1">
                Reach out directly via our social channels or quick call.
              </p>
            </div>

            {/* Social Icons in Brand Color (#00B5E2) */}
            <div className="flex items-center flex-wrap gap-2.5 pt-1">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  aria-label={social.name}
                  title={social.name}
                  className="w-10 h-10 rounded-full border border-[#00b5e2]/30 bg-[#00b5e2]/10 text-[#00b5e2] flex items-center justify-center transition-all duration-300 hover:bg-[#00b5e2] hover:text-black hover:border-[#00b5e2] hover:shadow-[0_0_18px_rgba(0,181,226,0.5)] hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} Desire Advertising LLC & Dzyr Digital. All rights reserved.</p>

          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs text-zinc-400 transition-all hover:border-[#00b5e2]/50 hover:bg-white/[0.06] hover:text-white active:scale-95 cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="h-3.5 w-3.5 text-[#00b5e2] transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
