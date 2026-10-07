"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiCheckCircle,
  FiHelpCircle,
  FiArrowRight,
  FiPlus,
} from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

type FAQItem = {
  id: string;
  number: string;
  category: string;
  question: string;
  answer: string;
  highlights: string[];
  image: string;
  ctaText?: string;
  ctaHref?: string;
};

const FAQ_ITEMS: FAQItem[] = [
  {
    id: "faq-1",
    number: "01",
    category: "Workflow & Stages",
    question: "How does the renovation process work?",
    answer:
      "We guide you through 4 clear phases: spatial assessment & 3D planning, itemized fixed-scope estimation, master joinery fabrication, and a 100-point inspection with a 10-year craft warranty.",
    highlights: [
      "Single project manager oversight",
      "Itemized fixed-scope pricing",
    ],
    image: "https://i.ibb.co/k63Kv661/complete-home-renovation.jpg",
    ctaText: "Explore Process",
    ctaHref: "/#process-heading",
  },
  {
    id: "faq-2",
    number: "02",
    category: "Timelines",
    question: "How long does a renovation project take?",
    answer:
      "Room and kitchen transformations typically take 3 to 5 weeks, while whole-home renovations range from 8 to 14 weeks with strict milestone schedules and zero unapproved delays.",
    highlights: [
      "Milestone-based progress tracking",
      "Pre-milled joinery speeds on-site fit",
    ],
    image: "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791309410/Complete_Home_Renovation.jpg",
    ctaText: "Plan Timeline",
    ctaHref: "/contact?type=quote",
  },
  {
    id: "faq-3",
    number: "03",
    category: "Bespoke Joinery",
    question: "Do you provide custom carpentry?",
    answer:
      "Yes, custom woodwork is our core specialty. Master joiners handcraft bespoke cabinetry, fluted wall paneling, and walk-in wardrobes using seasoned teak, walnut, and oak in our workshop.",
    highlights: [
      "100% in-house joinery workshop",
      "German Blum soft-close hardware",
    ],
    image: "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791311778/Craftsmanship.jpg",
    ctaText: "View Joinery",
    ctaHref: "/projects",
  },
  {
    id: "faq-4",
    number: "04",
    category: "Personalization",
    question: "Can I customize my home design?",
    answer:
      "Every project is bespoke. You collaborate directly with our interior architects to select tailored floor plans, material palettes, acoustic wood textures, and ambient lighting scenes.",
    highlights: [
      "Direct architect collaboration",
      "Custom material & lighting moodboards",
    ],
    image: "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791311064/Custom_Wardrobe_Design.jpg",
    ctaText: "Start Custom Design",
    ctaHref: "/contact?type=quote",
  },
  {
    id: "faq-5",
    number: "05",
    category: "Materiality",
    question: "What materials do you use?",
    answer:
      "We use architectural-grade marine plywood, sustainable solid hardwoods, non-porous quartz surfaces, and low-VOC polyurethane lacquers engineered for enduring beauty.",
    highlights: [
      "Moisture-tested solid hardwoods",
      "10-Year craftsmanship warranty",
    ],
    image: "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791311821/Wooden_Floor.jpg",
    ctaText: "Inquire Materials",
    ctaHref: "/contact",
  },
];

export default function FAQSection() {
  const [activeId, setActiveId] = useState<string>(FAQ_ITEMS[0].id);

  return (
    <section
      aria-labelledby="faq-section-heading"
      className="site-container section-spacing"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          Frequently Asked Questions
        </p>

        <h2
          id="faq-section-heading"
          className="section-title text-balance"
        >
          Answers to Your Renovation Inquiries
        </h2>

        <p className="section-description text-balance">
          Clear answers on our architectural planning workflow, custom carpentry standards, project timelines, and warranty commitments.
        </p>
      </div>

      {/* Desktop Horizontal Expandable Cards (~25-30% more compact height: 320px/340px) */}
      <div
        onMouseLeave={() => setActiveId("")}
        className="mt-7 hidden lg:flex lg:h-[320px] xl:h-[340px] gap-3 xl:gap-3.5"
      >
        {FAQ_ITEMS.map((item) => {
          const isActive = activeId === item.id;

          return (
            <motion.div
              key={item.id}
              layout
              transition={{
                layout: { duration: 0.42, ease: [0.25, 1, 0.5, 1] },
              }}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveId(item.id);
                }
              }}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 cursor-pointer select-none ${
                isActive
                  ? "flex-[3.2] xl:flex-[3.5] border-accent/60 shadow-[0_10px_28px_rgba(15,47,42,0.12)]"
                  : "flex-1 min-w-[68px] border-border/80 bg-surface hover:border-accent/40 hover:shadow-sm"
              }`}
            >
              {/* Card Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <SafeImage
                  src={item.image}
                  alt={item.question}
                  fallbackTitle={item.question}
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={`object-cover object-center transition-transform duration-700 ease-out ${
                    isActive ? "scale-105" : "scale-100 opacity-60 grayscale-[30%]"
                  }`}
                />

                {/* Dark Luxury Gradient Overlays */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    isActive
                      ? "bg-gradient-to-t from-black/95 via-black/65 to-black/35"
                      : "bg-gradient-to-t from-black/85 via-black/55 to-black/30 opacity-90"
                  }`}
                />
              </div>

              {/* Active State Content (Compact Padding & Tight Spacing) */}
              <AnimatePresence mode="wait">
                {isActive ? (
                  <motion.div
                    key={`active-${item.id}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.22, delay: 0.05 }}
                    className="relative z-10 flex h-full flex-col justify-between p-5 xl:p-6 text-white"
                  >
                    {/* Top: Badges */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-brand font-bold text-[11px] shadow-xs">
                          {item.number}
                        </span>
                        <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>

                      <div className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/40 bg-accent/15 text-accent">
                        <FiHelpCircle className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Middle: Question & Preview Answer */}
                    <div className="space-y-1.5 my-auto max-w-xl">
                      <h3 className="text-lg xl:text-[1.35rem] font-bold tracking-tight text-[#F8F5EE] leading-snug">
                        {item.question}
                      </h3>

                      <p className="text-xs sm:text-[13px] leading-relaxed text-[#EDE8DF]/90 font-normal line-clamp-2 sm:line-clamp-3">
                        {item.answer}
                      </p>

                      {/* Compact Key Highlights */}
                      <div className="pt-1 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        {item.highlights.map((highlight, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5 rounded-md bg-black/40 px-2 py-0.5 border border-white/10 backdrop-blur-xs text-[11px] text-[#F8F5EE]/90"
                          >
                            <FiCheckCircle className="h-3 w-3 text-accent shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Action Row */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/15">
                      <Link
                        href={item.ctaHref || "/contact?type=quote"}
                        className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-semibold text-brand shadow-xs hover:bg-white hover:text-brand transition-all duration-300"
                      >
                        <span>{item.ctaText || "Inquire About This"}</span>
                        <FiArrowRight className="h-3 w-3" />
                      </Link>

                      <span className="text-[10px] font-normal text-white/60">
                        Hover card to preview
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* Compact / Inactive State Content */
                  <motion.div
                    key={`inactive-${item.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="relative z-10 flex h-full flex-col justify-between items-center py-4 px-2 text-white text-center"
                  >
                    {/* Top: Number Badge */}
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-accent/50 bg-black/60 text-accent font-mono text-[11px] font-bold shadow-xs">
                      {item.number}
                    </span>

                    {/* Center: Vertical Question Snippet */}
                    <div className="my-auto py-1">
                      <p className="text-[11px] font-semibold tracking-wide text-[#F8F5EE]/90 [writing-mode:vertical-lr] rotate-180 line-clamp-1">
                        {item.question}
                      </p>
                    </div>

                    {/* Bottom: Plus Indicator */}
                    <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-black/40 text-accent/80 transition-transform duration-300 group-hover:scale-110 group-hover:border-accent group-hover:text-accent">
                      <FiPlus className="h-3 w-3" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Mobile & Tablet Vertical Accordion */}
      <div className="mt-6 grid grid-cols-1 gap-3 lg:hidden">
        {FAQ_ITEMS.map((item) => {
          const isOpen = activeId === item.id;

          return (
            <div
              key={item.id}
              className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                isOpen
                  ? "border-accent/60 bg-surface shadow-md"
                  : "border-border bg-surface hover:border-accent/40"
              }`}
            >
              {/* Header Button */}
              <button
                type="button"
                onClick={() => setActiveId(isOpen ? "" : item.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 p-3.5 sm:p-4 text-left transition-colors"
              >
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold transition-colors ${
                      isOpen
                        ? "bg-accent text-brand"
                        : "border border-border bg-background text-muted"
                    }`}
                  >
                    {item.number}
                  </span>

                  <div>
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-accent">
                      {item.category}
                    </span>
                    <h3 className="mt-0.5 text-xs sm:text-sm font-bold tracking-tight text-brand">
                      {item.question}
                    </h3>
                  </div>
                </div>

                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                    isOpen
                      ? "border-accent bg-accent text-brand rotate-180"
                      : "border-border bg-background text-muted"
                  }`}
                >
                  <FiChevronRight className="h-3 w-3 transform transition-transform" />
                </div>
              </button>

              {/* Accordion Body */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-border/70 p-3.5 sm:p-4 pt-2.5 space-y-2.5">
                      {/* Image Preview */}
                      <div className="relative aspect-[16/9] w-full max-h-40 overflow-hidden rounded-xl border border-border bg-background">
                        <SafeImage
                          src={item.image}
                          alt={item.question}
                          fallbackTitle={item.question}
                          fill
                          sizes="100vw"
                          className="object-cover object-center"
                        />
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                        />
                      </div>

                      {/* Concise Answer */}
                      <p className="text-xs leading-relaxed text-muted">
                        {item.answer}
                      </p>

                      {/* Highlights */}
                      <div className="space-y-1 pt-0.5">
                        {item.highlights.map((highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-brand/90"
                          >
                            <FiCheckCircle className="h-3 w-3 text-accent shrink-0" />
                            <span>{highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* CTA */}
                      <div className="pt-1.5">
                        <Link
                          href={item.ctaHref || "/contact?type=quote"}
                          className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-semibold text-brand shadow-xs hover:bg-brand hover:text-white transition-all duration-300"
                        >
                          <span>{item.ctaText || "Inquire About This"}</span>
                          <FiArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
