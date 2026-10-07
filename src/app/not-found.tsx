"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiHome,
  FiArrowRight,
  FiCompass,
  FiLayers,
  FiPhoneCall,
  FiGrid,
} from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />

      <main className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center overflow-hidden bg-gradient-to-b from-[#faf6ef] via-[#f7f1e6] to-[#f2eae0] px-4 py-16 sm:py-24">
        {/* Subtle Architectural Blueprint Grid Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(15, 47, 42, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(15, 47, 42, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* Ambient Warm Architectural Lighting Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,163,101,0.18),transparent_65%)]"
        />

        {/* Floating Architectural Blueprint Graphic Elements */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Top Left Blueprint Crosshair */}
          <div className="absolute top-20 left-10 hidden sm:block opacity-25 text-brand">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <path d="M20 0V40M0 20H40" stroke="currentColor" strokeWidth="1" />
              <circle cx="20" cy="20" r="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
          </div>

          {/* Bottom Right Architectural Dimension Line */}
          <div className="absolute bottom-24 right-12 hidden lg:block opacity-20 text-brand">
            <svg width="120" height="30" viewBox="0 0 120 30" fill="none">
              <path d="M10 15H110M10 5V25M110 5V25" stroke="currentColor" strokeWidth="1" />
              <text x="60" y="11" textAnchor="middle" fill="currentColor" fontSize="10" fontFamily="sans-serif">
                404.00 mm
              </text>
            </svg>
          </div>
        </div>

        <div className="site-container relative z-10 max-w-3xl text-center">
          {/* Floating Architectural Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center mb-6"
          >
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-md"
            >
              <FiCompass className="h-4 w-4 text-accent animate-spin-slow" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
                PAGE NOT FOUND
              </span>
            </motion.div>
          </motion.div>

          {/* Main 404 Visual Architectural Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="select-none text-8xl font-extrabold tracking-tight text-[#0F2F2A] sm:text-9xl md:text-[140px] leading-none drop-shadow-xs">
              4
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-br from-accent via-[#dfbe89] to-accent">
                0
                {/* Architectural compass ring inside the 0 */}
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-60">
                  <span className="h-10 w-10 sm:h-14 sm:w-14 rounded-full border border-dashed border-accent" />
                </span>
              </span>
              4
            </h1>

            {/* Decorative Gold Baseline */}
            <div className="mx-auto mt-2 h-0.5 w-16 sm:w-24 rounded-full bg-gradient-to-r from-transparent via-accent to-transparent" />
          </motion.div>

          {/* Main Error Message & Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 sm:mt-8 space-y-3"
          >
            <h2 className="text-2xl font-bold tracking-tight text-[#0F2F2A] sm:text-3xl md:text-4xl">
              The space you are looking for doesn&apos;t exist.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#686b63] sm:text-base md:text-lg">
              Like every great renovation, sometimes a new direction is needed.
              Let us guide you back home.
            </p>
          </motion.div>

          {/* Navigation Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-md mx-auto"
          >
            {/* Primary Action Button */}
            <Link
              href="/"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl bg-[#0F2F2A] px-7 py-3.5 text-sm font-semibold text-[#faf6ef] shadow-md transition-all duration-300 hover:bg-[#1b453e] hover:shadow-[0_10px_25px_rgba(15,47,42,0.25)] hover:-translate-y-0.5 focus-visible:outline-accent active:translate-y-0"
            >
              <FiHome className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-110" />
              <span>Back to Home</span>
              <FiArrowRight className="h-4 w-4 text-accent transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            {/* Secondary Action Button */}
            <Link
              href="/services"
              className="group relative flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-xl border border-[#0F2F2A]/20 bg-white/80 px-7 py-3.5 text-sm font-semibold text-[#0F2F2A] shadow-xs backdrop-blur-md transition-all duration-300 hover:border-accent hover:bg-white hover:text-[#0F2F2A] hover:shadow-md hover:-translate-y-0.5 focus-visible:outline-accent active:translate-y-0"
            >
              <FiLayers className="h-4 w-4 text-accent transition-transform duration-300 group-hover:scale-110" />
              <span>Explore Services</span>
              <FiArrowRight className="h-4 w-4 text-[#0F2F2A]/60 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-accent" />
            </Link>
          </motion.div>

          {/* Quick Helpful Navigation Hub */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="mt-12 sm:mt-16 pt-8 border-t border-[#0F2F2A]/10"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-[#686b63]/80 mb-4">
              Or explore other popular destinations
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm font-medium text-[#0F2F2A]/80">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <FiGrid className="h-3.5 w-3.5 text-accent/70 transition-transform group-hover:scale-110" />
                <span>Featured Projects</span>
              </Link>
              <span aria-hidden="true" className="text-[#0F2F2A]/20">
                •
              </span>
              <Link
                href="/blogs"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <FiCompass className="h-3.5 w-3.5 text-accent/70 transition-transform group-hover:scale-110" />
                <span>Vlogs &amp; Insights</span>
              </Link>
              <span aria-hidden="true" className="text-[#0F2F2A]/20">
                •
              </span>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                <FiPhoneCall className="h-3.5 w-3.5 text-accent/70 transition-transform group-hover:scale-110" />
                <span>Contact Studio</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
