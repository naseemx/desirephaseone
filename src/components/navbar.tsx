"use client";

import React, { useState } from "react";
import Image from "next/image";

interface NavbarProps {
  visible?: boolean;
}

export function Navbar({ visible = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <nav className="flex h-16 sm:h-20 w-full items-center justify-between px-4 sm:px-8 lg:px-10">
        {/* Left: Brand Logo & Company Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-3 transition-opacity hover:opacity-90 active:scale-[0.98]"
            aria-label="Home"
          >
            {/* companylogo.png (Desire Advertising) */}
            <div className="relative h-[28px] sm:h-[33px] w-[71px] sm:w-[84px] shrink-0">
              <Image
                src="/companylogo.png"
                alt="Company Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Subtle vertical divider */}
            <div className="h-[18px] sm:h-[20px] w-[1px] bg-white/25 shrink-0" />

            {/* brandlogo.png (dzyr digital) */}
            <div className="relative h-[18px] sm:h-[20px] w-[100px] sm:w-[115px] shrink-0">
              <Image
                src="/brandlogo.png"
                alt="Brand Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </a>
        </div>

        {/* Desktop: Text Links with Drop Shadow at the right-most side */}
        <div className="hidden sm:flex items-center gap-7 lg:gap-9">
          <a
            href="#hero"
            className="text-sm lg:text-[15px] font-medium text-white/90 transition-colors hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tracking-wide"
          >
            Home
          </a>
          <a
            href="#contact"
            className="text-sm lg:text-[15px] font-medium text-white/90 transition-colors hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tracking-wide"
          >
            Contact
          </a>
        </div>

        {/* Mobile: Hamburger Menu Button (hidden on desktop) */}
        <div className="sm:hidden flex items-center">
          {/* Minimal Hamburger Menu Button (2 clean horizontal lines matching design) */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            className="group flex h-9 w-9 items-center justify-center cursor-pointer transition-transform active:scale-90"
          >
            <div className="flex flex-col justify-center gap-1.5 w-6">
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${
                  menuOpen ? "rotate-45 translate-y-[4px]" : ""
                }`}
              />
              <span
                className={`block h-[1.5px] w-6 bg-white transition-all duration-300 ${
                  menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer (hidden on desktop) */}
      <div
        className={`sm:hidden absolute top-3 right-4 transition-all duration-300 ease-out origin-top-right ${
          menuOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className="relative w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#06060c]/90 px-6 pt-5 pb-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
          style={{
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Subtle top edge hairline glow */}
          <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Top header inside drawer: Two horizontal lines close button */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="cursor-pointer flex flex-col justify-center gap-1.5 w-6 items-end group"
            >
              <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-80" />
              <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-80" />
            </button>
          </div>

          {/* Navigation Links Right-Aligned */}
          <nav className="flex flex-col items-end space-y-3.5 text-right">
            <a
              href="#hero"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-normal text-zinc-300 transition-colors hover:text-white"
            >
              Home
            </a>
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="text-sm font-normal text-zinc-300 transition-colors hover:text-white"
            >
              Contact
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
