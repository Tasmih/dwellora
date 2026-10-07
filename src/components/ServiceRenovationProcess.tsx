"use client";

import { motion } from "framer-motion";
import {
  FiMessageSquare,
  FiCompass,
  FiTool,
  FiCheckCircle,
  FiArrowRight,
} from "react-icons/fi";

const PROCESS_STEPS = [
  {
    step: "01",
    title: "Consultation & Planning",
    description:
      "Understanding your requirements, space, budget and renovation goals.",
    icon: FiMessageSquare,
  },
  {
    step: "02",
    title: "Design & Material Selection",
    description:
      "Creating the right design direction with quality materials.",
    icon: FiCompass,
  },
  {
    step: "03",
    title: "Professional Execution",
    description:
      "Our skilled craftsmen complete the renovation with attention to detail.",
    icon: FiTool,
  },
  {
    step: "04",
    title: "Final Quality Delivery",
    description:
      "Inspection, finishing touches and project handover.",
    icon: FiCheckCircle,
  },
];

export default function ServiceRenovationProcess() {
  return (
    <section
      aria-labelledby="renovation-process-heading"
      className="mt-20 lg:mt-28 overflow-hidden rounded-3xl border border-border/80 bg-surface p-8 sm:p-12 lg:p-16 shadow-[0_12px_40px_rgba(25,53,50,0.05)]"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          HOW WE WORK
        </p>

        <h2
          id="renovation-process-heading"
          className="mt-3 text-2xl font-bold tracking-tight text-brand sm:text-3xl lg:text-4xl"
        >
          Our Renovation Process
        </h2>

        <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
          From concept sketches to flawless handover, our transparent step-by-step
          methodology ensures your renovation progresses smoothly.
        </p>
      </div>

      {/* Process Steps Timeline */}
      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 relative">
        {PROCESS_STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative flex flex-col justify-between rounded-2xl border border-border/80 bg-background/60 p-6 sm:p-7 transition-all duration-300 hover:border-accent/50 hover:bg-background hover:shadow-lg group"
            >
              <div>
                {/* Header with Step Number & Icon */}
                <div className="flex items-center justify-between">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-accent/50 group-hover:text-accent transition-colors duration-300">
                    {item.step}
                  </span>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent group-hover:bg-accent group-hover:text-brand transition-all duration-300 shadow-xs">
                    <Icon className="h-5 w-5 stroke-[1.9]" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mt-5 text-base sm:text-lg font-bold tracking-tight text-brand">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="mt-2 text-xs sm:text-sm leading-6 text-muted font-normal">
                  {item.description}
                </p>
              </div>

              {/* Step indicator arrow for desktop sequence */}
              {idx < PROCESS_STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden lg:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 text-accent/40"
                >
                  <FiArrowRight className="h-5 w-5" />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
