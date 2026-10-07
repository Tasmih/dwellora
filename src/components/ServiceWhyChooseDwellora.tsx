"use client";

import { motion } from "framer-motion";
import { FiCheck, FiAward, FiShield, FiTrendingUp, FiEye } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

const BEST_PROJECT_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791381721/bestproject_1.jpg";

const PILLARS = [
  {
    title: "Skilled Craftsmanship",
    description:
      "Hand-finished joinery, precision miters, and structural integrity built by seasoned carpentry masters.",
    icon: FiAward,
  },
  {
    title: "Premium Quality Materials",
    description:
      "Carefully sourced sustainably harvested hardwoods, architectural veneers, and heavy-duty hardware.",
  },
  {
    title: "Transparent Project Management",
    description:
      "Detailed timelines, clear milestones, and strict budget adherence with zero hidden surprises.",
  },
  {
    title: "Attention To Every Detail",
    description:
      "From flush seamless alignments to dust-controlled installations and rigorous quality inspections.",
  },
];

export default function ServiceWhyChooseDwellora() {
  return (
    <section
      aria-labelledby="why-choose-heading"
      className="mt-20 lg:mt-28 overflow-hidden rounded-3xl border border-border/80 bg-gradient-to-br from-[#FAF6EF] via-[#F6EFE2] to-[#ECE2D0] p-8 sm:p-12 lg:p-16 shadow-[0_16px_50px_rgba(15,47,42,0.06)]"
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
        {/* Left Column: Value Pillars Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:col-span-7"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/50 bg-accent/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-brand">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              THE DWELLORA STANDARD
            </span>
          </div>

          <h2
            id="why-choose-heading"
            className="mt-4 text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-brand leading-tight"
          >
            Why Homeowners Choose Dwellora
          </h2>

          <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-xl">
            We merge timeless carpentry craftsmanship with modern interior architecture,
            delivering spaces that elevate everyday living.
          </p>

          {/* 4 Pillars Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PILLARS.map((pillar, idx) => (
              <div
                key={idx}
                className="flex flex-col rounded-2xl border border-white/80 bg-white/85 p-5 shadow-sm transition-all hover:bg-white hover:shadow-md"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-brand shrink-0">
                    <FiCheck className="h-4 w-4 stroke-[2.5]" />
                  </div>
                  <h3 className="text-sm font-bold text-brand">{pillar.title}</h3>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted font-normal">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right Column: Best Project Showcase Frame */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="relative lg:col-span-5 flex items-center justify-center"
        >
          {/* Main Frame */}
          <div className="relative w-full overflow-hidden rounded-2xl border-2 border-white/80 bg-surface shadow-[0_20px_50px_rgba(15,47,42,0.14)] aspect-[4/3] sm:h-[400px] lg:h-[420px]">
            <SafeImage
              src={BEST_PROJECT_IMAGE}
              alt="Dwellora award-winning luxury residential renovation project"
              fallbackTitle="Bespoke Residential Project"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white drop-shadow-md">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  Featured Masterwork
                </p>
                <p className="text-xs sm:text-sm font-semibold text-[#F8F5EE]">
                  Architectural Residence
                </p>
              </div>
              <span className="rounded-full bg-brand/90 border border-accent/40 px-2.5 py-1 text-[10px] font-bold text-accent uppercase">
                100% Verified
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
