"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCheck, FiPhone, FiCompass } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

const MAIN_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791379705/getQuota.jpg";
const CALL_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791379892/call.jpg";
const MEET_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791379836/meet.jpg";

type ServiceConsultationCtaProps = {
  serviceTitle?: string;
};

export default function ServiceConsultationCta({
  serviceTitle,
}: ServiceConsultationCtaProps) {
  return (
    <section
      aria-labelledby="service-consultation-heading"
      className="relative section-gap-top overflow-hidden rounded-3xl border border-[#E5DEC9]/80 bg-gradient-to-br from-[#FAF6EF] via-[#F6EFE2] to-[#ECE2D0] p-6 sm:p-10 lg:p-14 shadow-[0_16px_50px_rgba(15,47,42,0.08)]"
    >
      {/* Subtle Architectural Glow Background Accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-brand/10 blur-3xl"
      />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        {/* Left Column: Consultation Content */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:col-span-7"
        >
          {/* Eyebrow */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              START YOUR PROJECT
            </span>
          </div>

          {/* Heading */}
          <h2
            id="service-consultation-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-brand sm:text-4xl lg:text-[44px] lg:leading-[1.15]"
          >
            Ready to Transform Your Space?
          </h2>

          {/* Description */}
          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted max-w-xl">
            Discuss your renovation requirements with our experts and receive a
            personalised consultation for your home{serviceTitle ? ` and ${serviceTitle.toLowerCase()}` : ""}.
          </p>

          {/* Value Highlights */}
          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm text-brand/90">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium text-brand">Direct Master Joiner Advice</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium text-brand">Transparent Fixed Estimates</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium text-brand">Custom 3D Spatial Layout</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium text-brand">No-Obligation Walkthrough</span>
            </div>
          </div>

          {/* CTA Actions */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/contact?type=quote"
              className="group btn bg-brand text-[#FAF6EF] font-semibold hover:bg-brand/90 hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3.5 text-base inline-flex items-center justify-center gap-2.5 border border-brand"
            >
              <span>Request a Quote</span>
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-accent" />
            </Link>

            <a
              href="tel:+15552345678"
              className="btn border border-[#D5CAAF] bg-white/80 hover:bg-white text-brand font-medium hover:scale-[1.02] transition-all duration-300 px-6 py-3.5 text-sm inline-flex items-center justify-center gap-2 shadow-xs"
            >
              <FiPhone className="h-4 w-4 text-accent" />
              <span>+1 (555) 234-5678</span>
            </a>
          </div>
        </motion.div>

        {/* Right Column: Layered Architectural Visual Showcase */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="relative lg:col-span-5 flex items-center justify-center pt-4 pb-4 sm:py-6"
        >
          {/* Main Visual Frame */}
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-white/80 bg-surface shadow-[0_20px_50px_rgba(15,47,42,0.16)] aspect-[4/3] sm:h-[380px] lg:h-[400px]">
            <SafeImage
              src={MAIN_IMAGE}
              alt="Dwellora bespoke renovation consultation and quote process"
              fallbackTitle="Renovation Consultation"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle Gradient Rim */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow-md">
              <span className="text-xs font-semibold tracking-wider uppercase text-[#F8F5EE]">
                Bespoke Interior Planning
              </span>
              <span className="text-[11px] rounded-full bg-accent px-2.5 py-0.5 font-bold text-brand">
                Dwellora Studio
              </span>
            </div>
          </div>

          {/* Floating Card 1: Expert Call */}
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -left-3 sm:-top-6 sm:-left-6 z-20 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/95 p-2 sm:p-2.5 shadow-[0_14px_35px_rgba(15,47,42,0.18)] backdrop-blur-md max-w-[220px] sm:max-w-[250px]"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border border-border/60">
              <SafeImage
                src={CALL_IMAGE}
                alt="Expert renovation call discussion"
                fill
                sizes="56px"
                className="object-cover object-center"
              />
            </div>
            <div className="pr-1.5 sm:pr-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Expert Advice
              </p>
              <p className="text-xs sm:text-sm font-bold text-brand leading-tight">
                Personalized Call
              </p>
              <p className="text-[10px] text-muted leading-tight mt-0.5">
                Clear Scope &amp; Budget
              </p>
            </div>
          </motion.div>

          {/* Floating Card 2: 1-on-1 Consultation Session */}
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
            className="absolute -bottom-4 -right-3 sm:-bottom-6 sm:-right-6 z-20 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/95 p-2 sm:p-2.5 shadow-[0_14px_35px_rgba(15,47,42,0.18)] backdrop-blur-md max-w-[220px] sm:max-w-[260px]"
          >
            <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border border-border/60">
              <SafeImage
                src={MEET_IMAGE}
                alt="1-on-1 interior design and carpentry meeting"
                fill
                sizes="56px"
                className="object-cover object-center"
              />
            </div>
            <div className="pr-1.5 sm:pr-2">
              <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
                Studio &amp; On-Site
              </p>
              <p className="text-xs sm:text-sm font-bold text-brand leading-tight">
                1-on-1 Consultation
              </p>
              <p className="text-[10px] text-muted leading-tight mt-0.5">
                Material &amp; Wood Choice
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
