"use client";

import { motion } from "framer-motion";
import { FiCheck, FiAward, FiShield } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

type IncludedItem = {
  title: string;
  description: string;
};

type ServiceWhatsIncludedProps = {
  serviceTitle: string;
  serviceImage?: string;
  includedItems: IncludedItem[];
};

const FALLBACK_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791379705/getQuota.jpg";

export default function ServiceWhatsIncluded({
  serviceTitle,
  serviceImage,
  includedItems,
}: ServiceWhatsIncludedProps) {
  const activeImage = serviceImage && serviceImage.trim().length > 0 ? serviceImage : FALLBACK_IMAGE;

  return (
    <section
      aria-labelledby="whats-included-heading"
      className="section-gap-top overflow-hidden rounded-3xl border border-border/90 bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(25,53,50,0.05)]"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12 items-stretch">
        {/* Left Side: Scope & Feature Cards */}
        <div className="flex flex-col justify-between lg:col-span-7">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Scope of Work
            </p>

            <h2
              id="whats-included-heading"
              className="mt-2 text-2xl font-bold tracking-tight text-brand sm:text-3xl lg:text-4xl"
            >
              What&apos;s Included
            </h2>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted max-w-xl">
              We provide transparent, end-to-end craftsmanship with no hidden surprises.
              Every milestone is handled with meticulous attention to detail.
            </p>

            {/* Feature Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {includedItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="flex gap-3.5 rounded-xl border border-border/80 bg-background/60 p-4 sm:p-5 transition-colors hover:border-accent/50 hover:bg-background"
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand">
                    <FiCheck className="h-4 w-4 text-accent" />
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold text-brand">
                      {item.title}
                    </h3>

                    {item.description && (
                      <p className="mt-1 text-xs leading-5 text-muted">
                        {item.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom Quality Guarantee Micro-Bar */}
          <div className="mt-8 pt-6 border-t border-border/70 flex flex-wrap items-center gap-4 sm:gap-8 text-xs font-medium text-brand/80">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              100% Custom Joinery
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Architectural Oversight
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Direct Fixed Pricing
            </span>
          </div>
        </div>

        {/* Right Side: Premium Visual Showcase with Floating Badges */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5 flex flex-col min-h-[340px] sm:min-h-[420px] lg:min-h-full"
        >
          {/* Main Visual Container */}
          <div className="relative h-full w-full min-h-[340px] sm:min-h-[400px] overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_16px_40px_rgba(15,47,42,0.12)]">
            <SafeImage
              src={activeImage}
              alt={`${serviceTitle} craftsmanship showcase`}
              fallbackTitle={serviceTitle}
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover object-center transition-transform duration-700 hover:scale-105"
            />

            {/* Subtle Gradient Overlay */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
            />

            {/* Floating Top Badge: Quality Assured */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 rounded-xl border border-white/80 bg-white/95 px-3 py-1.5 text-xs font-semibold text-brand shadow-lg backdrop-blur-md"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/25 text-brand">
                <FiShield className="h-3.5 w-3.5 text-brand" />
              </div>
              <span>Quality Assured</span>
            </motion.div>

            {/* Floating Bottom Card: Premium Craftsmanship */}
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="absolute bottom-4 left-4 right-4 z-10 rounded-xl border border-white/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-md flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-accent shrink-0">
                  <FiAward className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-accent">
                    Dwellora Standard
                  </p>
                  <p className="text-xs sm:text-sm font-semibold text-brand">
                    Premium Craftsmanship
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-block text-[11px] font-medium text-muted bg-surface px-2.5 py-1 rounded-md border border-border">
                10-Yr Guarantee
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
