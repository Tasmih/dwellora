"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiPhone } from "react-icons/fi";

const TEAM_WORKING_VIDEO =
  "https://res.cloudinary.com/rh4jhmw7/video/upload/v1791382624/teamworking.mp4";

export default function ServiceFinalCta() {
  return (
    <section
      aria-labelledby="service-final-cta-heading"
      className="relative w-full overflow-hidden bg-neutral-950 section-gap-top min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center justify-center"
    >
      {/* Background Video Layer (Autoplay, muted, loop, playsInline with subtle ~25-35% overlay) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover object-center scale-105"
        >
          <source src={TEAM_WORKING_VIDEO} type="video/mp4" />
        </video>

        {/* Subtle, light overlay (rgba 0.25 - 0.35) to keep the video bright and crystal clear */}
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,25,22,0.3)_0%,transparent_80%)]" />
      </div>

      {/* Gold Top and Bottom Rim Accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
      />

      {/* Centered Content Container */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-12 sm:py-14 lg:py-16 text-center flex flex-col items-center justify-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center w-full max-w-3xl"
        >
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/40 px-4 py-1.5 backdrop-blur-md shadow-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              GET STARTED TODAY
            </span>
          </div>

          {/* Heading */}
          <h2
            id="service-final-cta-heading"
            className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F8F5EE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] text-balance leading-tight"
          >
            Ready To Transform Your Space?
          </h2>

          {/* Description */}
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] font-normal">
            Discuss your renovation ideas with our experts and start creating your
            dream home.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            {/* Primary Gold CTA Button */}
            <Link
              href="/contact?type=quote"
              className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-8 py-3.5 text-base border border-accent inline-flex items-center justify-center gap-2.5"
            >
              <span>Request A Quote</span>
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 text-brand" />
            </Link>

            {/* Secondary Direct Phone Button */}
            <a
              href="tel:+15552345678"
              className="btn border border-white/60 bg-black/25 text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 shadow-md"
            >
              <FiPhone className="h-4 w-4 text-accent" />
              <span>+1 (555) 234-5678</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
