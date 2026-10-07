"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiCompass } from "react-icons/fi";
import { getSafeVideoSrc } from "@/lib/url";

const VIDEO_URL =
  "https://res.cloudinary.com/rh4jhmw7/video/upload/v1791377565/LivingHeroRoom.mp4";

export default function LivingExperienceShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "350px" }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="living-experience-heading"
      className="relative isolate overflow-hidden bg-[#081916] mt-4 sm:mt-6 lg:mt-8 py-12 sm:py-14 lg:py-16 border-y border-border/30"
    >
      {/* Continuous Autoplay Background Video */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
      >
        {inView && (
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover object-center scale-105"
          >
            <source src={getSafeVideoSrc(VIDEO_URL)} type="video/mp4" />
          </video>
        )}

        {/* Lighter, balanced cinematic gradient overlay (~30-35% opacity) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-black/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,25,22,0.45)_0%,transparent_75%)]" />
      </div>

      {/* Foreground Content inside site-container */}
      <div className="site-container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-3xl flex flex-col items-center"
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/15 px-4 py-1.5 backdrop-blur-md">
            <FiCompass className="h-3.5 w-3.5 text-accent animate-spin-slow" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              DESIGNING BETTER LIVING SPACES
            </span>
          </div>

          {/* Main Title */}
          <h2
            id="living-experience-heading"
            className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold tracking-tight text-[#F8F5EE] drop-shadow-md text-balance leading-tight sm:leading-tight"
          >
            Where Craftsmanship Meets Modern Living
          </h2>

          {/* Description */}
          <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF]/90 drop-shadow-xs text-balance">
            Explore our approach to creating refined interiors through thoughtful
            planning, premium materials, and expert craftsmanship.
          </p>

          {/* Call to Action Button */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center">
            <Link
              href="/projects"
              className="group btn bg-accent text-brand font-semibold shadow-lg hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 px-8 py-3.5 text-sm sm:text-base border border-accent inline-flex items-center gap-2.5"
            >
              <span>Explore Our Projects</span>
              <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
