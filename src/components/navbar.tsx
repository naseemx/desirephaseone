"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getLine1Services, getLine2Services } from "@/data/service";

const SHOW_SERVICES = false;

interface NavbarProps {
  visible?: boolean;
}

export function Navbar({ visible = true }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileServiceOpen, setMobileServiceOpen] = useState(false);
  const [serviceDropdownOpen, setServiceDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const line1Services = SHOW_SERVICES ? getLine1Services() : [];
  const line2Services = SHOW_SERVICES ? getLine2Services() : [];

  const handleMouseEnter = () => {
    if (!SHOW_SERVICES) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setServiceDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    if (!SHOW_SERVICES) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setServiceDropdownOpen(false);
    }, 150);
  };

  const handleServiceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!SHOW_SERVICES) return;
    setServiceDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!SHOW_SERVICES) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServiceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out select-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <nav className="flex h-16 sm:h-24 w-full items-center justify-between px-9 sm:px-10 lg:px-12">
        {/* Left: Brand Logo & Company Logo */}
        <div className="flex items-center gap-3 sm:gap-4">
          <a
            href="#hero"
            className="flex items-center gap-2.5 sm:gap-4 transition-opacity hover:opacity-90 active:scale-[0.98]"
            aria-label="Home"
          >
            {/* companylogo.png (Desire Advertising) */}
            <div className="relative h-[28px] sm:h-[50px] w-[71px] sm:w-[126px] shrink-0">
              <Image
                src="/companylogo.png"
                alt="Company Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Subtle vertical divider */}
            <div className="h-[18px] sm:h-[30px] w-[1px] bg-white/25 shrink-0" />

            {/* brandlogo.png (dzyr digital) */}
            <div className="relative h-[18px] sm:h-[30px] w-[100px] sm:w-[173px] shrink-0">
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

          {/* Service Link with Minimal Card Layout Dropdown on Hover or Click */}
          {SHOW_SERVICES && (
            <div
              ref={dropdownRef}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="relative py-2"
            >
              <button
                type="button"
                onClick={handleServiceClick}
                className="text-sm lg:text-[15px] font-medium text-white/90 transition-colors hover:text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)] tracking-wide cursor-pointer focus:outline-none"
              >
                Service
              </button>

              {/* Minimal Card Dropdown on Hover or Click (Matching Mobile Card Style) */}
              <div
                className={`absolute top-full -right-16 sm:-right-20 lg:-right-24 pt-2 transition-all duration-300 ease-out z-50 origin-top-right ${
                  serviceDropdownOpen
                    ? "opacity-100 scale-100 pointer-events-auto"
                    : "opacity-0 scale-95 pointer-events-none"
                }`}
              >
                <div
                  className="relative w-[480px] sm:w-[520px] lg:w-[540px] overflow-hidden rounded-2xl border border-white/10 bg-[#06060c]/90 px-6 pt-5 pb-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)]"
                  style={{
                    WebkitBackdropFilter: "blur(24px)",
                  }}
                >
                  {/* Subtle top edge hairline glow */}
                  <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                  {/* Top header inside card: Title on left, Two horizontal lines close button on right */}
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
                    <span className="text-xs font-normal text-zinc-400">Services</span>
                    <button
                      type="button"
                      onClick={() => setServiceDropdownOpen(false)}
                      aria-label="Close menu"
                      className="cursor-pointer flex flex-col justify-center gap-1.5 w-6 items-end group"
                    >
                      <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-70" />
                      <span className="block h-[1.5px] w-6 bg-white transition-opacity group-hover:opacity-70" />
                    </button>
                  </div>

                  {/* 2-Column Grid: First Line & Second Line Services */}
                  <div className="grid grid-cols-2 gap-x-8">
                    {/* Column 1: First Line */}
                    <div className="flex flex-col">
                      <div className="text-xs font-normal text-zinc-400 pb-1.5 mb-2 border-b border-white/10">
                        First Line
                      </div>
                      <div className="flex flex-col space-y-2">
                        {line1Services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/servicepage/${service.id}`}
                            onClick={() => setServiceDropdownOpen(false)}
                            className="text-[13px] font-normal text-zinc-300 transition-colors hover:text-white truncate block py-0.5"
                          >
                            {service.navbarTitle || service.title}
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Column 2: Second Line */}
                    <div className="flex flex-col">
                      <div className="text-xs font-normal text-zinc-400 pb-1.5 mb-2 border-b border-white/10">
                        Second Line
                      </div>
                      <div className="flex flex-col space-y-2">
                        {line2Services.map((service) => (
                          <Link
                            key={service.id}
                            href={`/servicepage/${service.id}`}
                            onClick={() => setServiceDropdownOpen(false)}
                            className="text-[13px] font-normal text-zinc-300 transition-colors hover:text-white truncate block py-0.5"
                          >
                            {service.navbarTitle || service.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

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
        className={`sm:hidden absolute top-3 right-8 sm:right-10 transition-all duration-300 ease-out origin-top-right ${
          menuOpen
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <div
          className={`relative overflow-hidden rounded-2xl border border-white/10 bg-[#06060c]/90 px-6 pt-5 pb-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-300 ${
            mobileServiceOpen && SHOW_SERVICES ? "w-56 max-h-[80vh] overflow-y-auto" : "w-44"
          }`}
          style={{
            WebkitBackdropFilter: "blur(24px)",
          }}
        >
          {/* Subtle top edge hairline glow */}
          <div className="pointer-events-none absolute inset-x-5 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* Top header inside drawer: Two horizontal lines close button */}
          <div className="flex justify-end mb-5">
            <button
              onClick={() => {
                setMenuOpen(false);
                setMobileServiceOpen(false);
              }}
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
            {SHOW_SERVICES && (
              <>
                <button
                  type="button"
                  onClick={() => setMobileServiceOpen(!mobileServiceOpen)}
                  className="text-sm font-normal text-zinc-300 transition-colors hover:text-white cursor-pointer"
                >
                  Service
                </button>

                {/* Mobile Expanded Services Submenu */}
                {mobileServiceOpen && (
                  <div className="flex flex-col items-end space-y-2 pr-1 pt-1 pb-2 max-h-56 overflow-y-auto w-full border-y border-white/10 my-1">
                    <span className="text-[11px] font-normal text-zinc-500">First Line</span>
                    {line1Services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/servicepage/${service.id}`}
                        onClick={() => {
                          setMobileServiceOpen(false);
                          setMenuOpen(false);
                        }}
                        className="text-xs text-zinc-400 hover:text-white truncate max-w-[170px]"
                      >
                        {service.navbarTitle || service.title}
                      </Link>
                    ))}
                    <span className="text-[11px] font-normal text-zinc-500 pt-1">Second Line</span>
                    {line2Services.map((service) => (
                      <Link
                        key={service.id}
                        href={`/servicepage/${service.id}`}
                        onClick={() => {
                          setMobileServiceOpen(false);
                          setMenuOpen(false);
                        }}
                        className="text-xs text-zinc-400 hover:text-white truncate max-w-[170px]"
                      >
                        {service.navbarTitle || service.title}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}

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
