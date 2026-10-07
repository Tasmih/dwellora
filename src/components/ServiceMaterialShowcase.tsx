"use client";

import { motion } from "framer-motion";
import { FiShield, FiFeather, FiCheck } from "react-icons/fi";

const MATERIAL_VIDEO =
  "https://res.cloudinary.com/rh4jhmw7/video/upload/v1791381697/bestmaterial.mp4";

export default function ServiceMaterialShowcase() {
  return (
    <section
      aria-labelledby="material-showcase-heading"
      className="relative section-gap-top overflow-hidden rounded-3xl bg-[#081916] py-12 sm:py-14 lg:py-16 border border-border/30 shadow-[0_20px_50px_rgba(8,25,22,0.25)]"
    >
      {/* Background Autoplay Video Layer (~30-35% overlay, highly visible material details) */}
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
          <source src={MATERIAL_VIDEO} type="video/mp4" />
        </video>

        {/* Lighter, balanced cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,25,22,0.4)_0%,transparent_80%)]" />
      </div>

      {/* Gold Rim Lines */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
      />

      {/* Content Container */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/40 px-4 py-1.5 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              QUALITY MATERIALS
            </span>
          </div>

          {/* Heading */}
          <h2
            id="material-showcase-heading"
            className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-[#F8F5EE] drop-shadow-md text-balance leading-tight"
          >
            Built With Materials That Last
          </h2>

          {/* Description */}
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF]/95 drop-shadow-sm font-normal">
            We carefully select premium materials to ensure durability, beauty and
            long-lasting performance across every residential build.
          </p>

          {/* 3 Material Value Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-[#F8F5EE]/95">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm shadow-sm">
              <FiCheck className="h-4 w-4 text-accent" />
              <span className="font-medium">Solid Hardwoods &amp; Natural Veneers</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm shadow-sm">
              <FiCheck className="h-4 w-4 text-accent" />
              <span className="font-medium">Heavy-Duty Concealed Hardware</span>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-sm shadow-sm">
              <FiCheck className="h-4 w-4 text-accent" />
              <span className="font-medium">Low-VOC Eco-Friendly Finishes</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
