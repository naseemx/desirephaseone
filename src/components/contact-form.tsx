"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  User,
  MessageSquare,
} from "lucide-react";
import { AmbientStars } from "@/components/ui/ambient-stars";

export interface ContactFormProps {
  isStageMode?: boolean;
}

export function ContactForm({ isStageMode = false }: ContactFormProps = {}) {
  const [result, setResult] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const sectionRef = useRef<HTMLElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setResult("");

    const form = event.currentTarget;
    const formData = new FormData(form);

    // Web3Forms configuration
    formData.append("access_key", "82d9e6a4-f488-48a4-97de-3952ac7e7361");
    formData.append("subject", "New Display Inquiry from Desire Website");
    formData.append("from_name", "Desire Digital Website");

    // Ensure message key is populated from remark for Web3Forms email delivery
    const remarkValue = formData.get("remark") as string;
    if (remarkValue && !formData.has("message")) {
      formData.append("message", remarkValue);
    }

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setStatus("success");
        setResult("Thank you! Your message has been sent successfully. Our team will get back to you shortly.");
        form.reset();
      } else {
        setStatus("error");
        setResult(data.message || "Something went wrong. Please check your details and try again.");
      }
    } catch {
      setStatus("error");
      setResult("Network error. Please check your connection and try again.");
    }
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className={`relative w-full overflow-hidden select-none bg-[#09090b] text-zinc-100 flex flex-col items-center justify-center ${
        isStageMode
          ? "w-full py-2 sm:py-3 lg:py-0 bg-transparent"
          : "min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      }`}
      style={
        isStageMode
          ? undefined
          : {
              backgroundColor: "#09090b",
              backgroundImage:
                "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
              contain: "paint",
            }
      }
    >
      {/* Top & Bottom seamless gradient blending (standalone mode only) */}
      {!isStageMode && (
        <>
          <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-20" />
          <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-20" />
          <AmbientStars count={80} />
        </>
      )}

      {/* ── Form Card Container: High Width & Low Height Landscape Rectangle ── */}
      <div className="relative z-10 mx-auto max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0c12]/95 p-5 sm:p-7 lg:px-10 lg:py-6 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Inner hairline cyan glow line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-cyan)]/35 to-transparent" />

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 mb-4 sm:mb-5 text-left">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-[var(--brand-cyan)] shrink-0">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
                Contact Us
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight text-white">
                Send us an inquiry
              </h3>
            </div>
            <p className="text-xs sm:text-[13px] text-zinc-400 font-normal">
              Fill out the details below and our team will get in touch with you promptly.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-3.5 sm:space-y-4">
            {/* ROW 1: Name, Phone, Email (3 equal columns on desktop) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-5">
              {/* Name Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="name"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <User className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
                  Name <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name or company"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--brand-cyan)] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60 h-11"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="phone"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <Phone className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
                  Phone <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  placeholder="+971 50 123 4567"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--brand-cyan)] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60 h-11"
                />
              </div>

              {/* Email Field */}
              <div className="space-y-1.5 text-left sm:col-span-2 lg:col-span-1">
                <label
                  htmlFor="email"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <Mail className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
                  Email <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="name@company.com"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--brand-cyan)] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60 h-11"
                />
              </div>
            </div>

            {/* ROW 2: Remark (wider, 9 cols) + Submit Button (3 cols) on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-4 lg:gap-5 items-end">
              <div className="lg:col-span-9 space-y-1.5 text-left">
                <label
                  htmlFor="remark"
                  className="inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-[var(--brand-cyan)]" />
                  Remark <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="text"
                  name="remark"
                  id="remark"
                  required
                  placeholder="Write your remark or requirements here..."
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 sm:py-3 text-sm text-white placeholder:text-zinc-500 focus:border-[var(--brand-cyan)] focus:bg-white/[0.07] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60 h-11"
                />
              </div>

              <div className="lg:col-span-3">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="group relative w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--brand-cyan)] px-6 py-2.5 text-sm font-semibold text-black tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_22px_rgba(0,181,226,0.38)] cursor-pointer h-11"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Feedback Banner */}
            {result && (
              <div
                className={`mt-2 flex items-start gap-2.5 rounded-lg p-2.5 sm:p-3 text-xs sm:text-sm transition-all ${
                  status === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                ) : (
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                )}
                <p className="leading-relaxed">{result}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default ContactForm;
