"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCheck, FiArrowRight, FiPhone, FiMail } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

const WOOD_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791381733/wood.jpg";
const TEAM_DISCUSS_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791381745/teamdiscuss.jpg";

type ServiceOverviewShowcaseProps = {
  serviceTitle: string;
  description: string;
};

export default function ServiceOverviewShowcase({
  serviceTitle,
  description,
}: ServiceOverviewShowcaseProps) {
  return (
    <section
      aria-labelledby="service-overview-heading"
      className="mt-16 grid items-stretch gap-10 lg:mt-24 lg:grid-cols-12 lg:gap-12"
    >
      {/* Left Column: Service Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col justify-between rounded-3xl border border-border/90 bg-surface p-6 sm:p-10 lg:col-span-7 shadow-[0_12px_40px_rgba(25,53,50,0.05)]"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Design &amp; Execution
          </p>

          <h2
            id="service-overview-heading"
            className="mt-2 text-2xl font-bold tracking-tight text-brand sm:text-3xl lg:text-4xl"
          >
            Service Overview
          </h2>

          <div className="mt-6 whitespace-pre-line text-base leading-8 text-foreground/90 font-normal">
            {description}
          </div>

          {/* Value points */}
          <div className="mt-8 grid grid-cols-1 gap-3.5 sm:grid-cols-2 text-sm text-brand/90">
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium">Tailored Architectural Plan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium">Direct In-House Joinery</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium">Premium Selected Hardwood</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand shrink-0">
                <FiCheck className="h-3.5 w-3.5 text-brand font-bold" />
              </div>
              <span className="font-medium">10-Year Craft Warranty</span>
            </div>
          </div>
        </div>

        {/* Quick Consultation CTA Action */}
        <div className="mt-10 pt-6 border-t border-border/70 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/contact?type=quote"
            className="group btn btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <span>Book Consultation</span>
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium text-muted">
            <a
              href="tel:+15552345678"
              className="flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <FiPhone className="h-3.5 w-3.5 text-accent" />
              <span>+1 (555) 234-5678</span>
            </a>
            <span className="text-border">|</span>
            <a
              href={`mailto:contact@dwellora.com?subject=Inquiry%20-%20${encodeURIComponent(
                serviceTitle
              )}`}
              className="flex items-center gap-1.5 hover:text-brand transition-colors"
            >
              <FiMail className="h-3.5 w-3.5 text-accent" />
              <span>contact@dwellora.com</span>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Right Column: Premium Visual Showcase with Wood Craftsmanship & Floating Team Card */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className="relative flex flex-col lg:col-span-5 min-h-[380px] sm:min-h-[460px] lg:min-h-full"
      >
        {/* Main Wood Craftsmanship Image Container */}
        <div className="relative h-full w-full min-h-[360px] sm:min-h-[440px] overflow-hidden rounded-3xl border-2 border-white/80 bg-surface shadow-[0_20px_50px_rgba(15,47,42,0.14)]">
          <SafeImage
            src={WOOD_IMAGE}
            alt="Master timber selection and precision carpentry craft"
            fallbackTitle="Wood Craftsmanship"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover object-center transition-transform duration-700 hover:scale-105"
          />

          {/* Directional Cinematic Gradient */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />

          {/* Bottom Badge inside main frame */}
          <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white drop-shadow-md">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-accent">
                Master Woodwork
              </p>
              <p className="text-sm font-semibold text-[#F8F5EE]">
                Architectural Joinery
              </p>
            </div>
            <span className="rounded-full bg-accent/90 px-3 py-1 text-[10px] font-bold text-brand uppercase tracking-wider">
              Hand Finished
            </span>
          </div>
        </div>

        {/* Floating Card: Team Discussion */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-5 -left-4 sm:-top-6 sm:-left-6 z-20 flex items-center gap-3 rounded-2xl border border-white/90 bg-white/95 p-2 sm:p-3 shadow-[0_16px_36px_rgba(15,47,42,0.18)] backdrop-blur-md max-w-[230px] sm:max-w-[270px]"
        >
          <div className="relative h-12 w-12 sm:h-14 sm:w-14 shrink-0 overflow-hidden rounded-xl border border-border/60">
            <SafeImage
              src={TEAM_DISCUSS_IMAGE}
              alt="Design consultation team discussion"
              fill
              sizes="56px"
              className="object-cover object-center"
            />
          </div>
          <div className="pr-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-accent">
              Expert Team
            </p>
            <p className="text-xs sm:text-sm font-bold text-brand leading-tight">
              Design Discussion
            </p>
            <p className="text-[10px] text-muted leading-tight mt-0.5">
              Personalized Spatial Plan
            </p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
