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
          ? "h-full min-h-screen py-4 sm:py-6"
          : "min-h-screen px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      }`}
      style={{
        backgroundColor: "#09090b",
        backgroundImage:
          "radial-gradient(ellipse 85% 60% at 50% 40%, rgba(0, 181, 226, 0.08) 0%, rgba(9, 9, 11, 0.7) 55%, #09090b 100%)",
        contain: "paint",
      }}
    >
      {/* Top & Bottom seamless gradient blending */}
      <div className="absolute top-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-b from-[#09090b] to-transparent pointer-events-none z-20" />
      <div className="absolute bottom-0 inset-x-0 h-16 sm:h-24 bg-gradient-to-t from-[#09090b] to-transparent pointer-events-none z-20" />

      {/* Atmospheric Brand Glows & Celestial Star Particles */}
      <AmbientStars count={80} />

      {/* ── Form Card Container ───────────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-2xl w-full px-4 sm:px-6">
        <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-[#0c0c12]/90 p-5 sm:p-8 lg:p-10 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          {/* Inner hairline cyan glow line */}
          <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--brand-cyan)]/35 to-transparent" />

          <div className="mb-6 sm:mb-8 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-cyan)]/30 bg-[var(--brand-cyan)]/10 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-[var(--brand-cyan)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand-cyan)] animate-pulse" />
              Contact Us
            </div>
            <h3 className="mt-3 text-xl sm:text-3xl font-bold tracking-tight text-white">
              Send us an inquiry
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
              Fill out the details below and our team will get in touch with you.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
            {/* 2-Column Responsive Inputs on Desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Name Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="name"
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <User className="h-3 w-3 text-[var(--brand-cyan)]" />
                  Name <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  required
                  placeholder="Your name or company"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
                />
              </div>

              {/* Phone Field */}
              <div className="space-y-1.5 text-left">
                <label
                  htmlFor="phone"
                  className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
                >
                  <Phone className="h-3 w-3 text-[var(--brand-cyan)]" />
                  Phone <span className="text-[var(--brand-cyan)]">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  required
                  placeholder="+971 50 123 4567"
                  disabled={status === "loading"}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                <Mail className="h-3 w-3 text-[var(--brand-cyan)]" />
                Email <span className="text-[var(--brand-cyan)]">*</span>
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                placeholder="name@company.com"
                disabled={status === "loading"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all disabled:opacity-60"
              />
            </div>

            {/* Remark Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="remark"
                className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium uppercase tracking-wider text-zinc-300"
              >
                <MessageSquare className="h-3 w-3 text-[var(--brand-cyan)]" />
                Remark <span className="text-[var(--brand-cyan)]">*</span>
              </label>
              <textarea
                name="remark"
                id="remark"
                required
                rows={4}
                placeholder="Write your remark or requirements here..."
                disabled={status === "loading"}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder:text-zinc-600 focus:border-[var(--brand-cyan)] focus:bg-white/[0.06] focus:outline-none focus:ring-1 focus:ring-[var(--brand-cyan)] transition-all resize-none disabled:opacity-60"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={status === "loading"}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--brand-cyan)] px-8 py-3.5 text-sm font-semibold text-black tracking-wide transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(0,181,226,0.35)] cursor-pointer"
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

            {/* Result Feedback Banner */}
            {result && (
              <div
                className={`mt-4 flex items-start gap-3 rounded-xl p-4 text-xs sm:text-sm transition-all ${
                  status === "success"
                    ? "border border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                    : "border border-rose-500/30 bg-rose-500/10 text-rose-300"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
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
