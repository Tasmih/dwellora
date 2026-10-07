"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  FiCompass,
  FiTarget,
  FiMessageSquare,
  FiLayers,
  FiBox,
  FiTool,
  FiCheckCircle,
  FiShield,
  FiAward,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

const HERO_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791325031/premiun-interior.jpg";
const STORY_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791325042/livingroom.jpg";
const CRAFTSMANSHIP_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791325002/craftmanship1.jpg";
const TEAM_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791325059/team2.jpg";

type WaveWordsProps = {
  text: string;
  className?: string;
};

function WaveWords({ text, className = "" }: WaveWordsProps) {
  const words = text.trim().split(/\s+/).filter(Boolean);

  return (
    <span aria-hidden="true" className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span data-wave-word className="inline-block origin-bottom">
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default function AboutClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLElement>(null);
  const purposeRef = useRef<HTMLElement>(null);
  const processRef = useRef<HTMLElement>(null);
  const craftRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);

  const [heroMounted, setHeroMounted] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [purposeVisible, setPurposeVisible] = useState(false);
  const [processVisible, setProcessVisible] = useState(false);
  const [craftVisible, setCraftVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);

  const eyebrow = "ABOUT DWELLORA";
  const title = "Thoughtfully Crafted Spaces.";
  const highlightedTitle = "Built With Purpose.";
  const description =
    "Founded on the principles of architectural balance and master joinery, Dwellora transforms residential living spaces with timeless craft, premium materials, and personal care.";

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const frame = requestAnimationFrame(() => {
        setHeroMounted(true);
        setStoryVisible(true);
        setPurposeVisible(true);
        setProcessVisible(true);
        setCraftVisible(true);
        setTeamVisible(true);
        setCtaVisible(true);
      });
      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => setHeroMounted(true));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target === storyRef.current) setStoryVisible(true);
            if (entry.target === purposeRef.current) setPurposeVisible(true);
            if (entry.target === processRef.current) setProcessVisible(true);
            if (entry.target === craftRef.current) setCraftVisible(true);
            if (entry.target === teamRef.current) setTeamVisible(true);
            if (entry.target === ctaRef.current) setCtaVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    if (storyRef.current) observer.observe(storyRef.current);
    if (purposeRef.current) observer.observe(purposeRef.current);
    if (processRef.current) observer.observe(processRef.current);
    if (craftRef.current) observer.observe(craftRef.current);
    if (teamRef.current) observer.observe(teamRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  // Staggered wave entrance animation matching Home hero
  useEffect(() => {
    const container = heroRef.current;

    if (
      !container ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const animations: Animation[] = [];
    let groupStart = 0;

    container
      .querySelectorAll<HTMLElement>("[data-wave-group]")
      .forEach((group) => {
        const words = group.querySelectorAll<HTMLElement>("[data-wave-word]");

        words.forEach((word, index) => {
          const animation = word.animate(
            [
              {
                opacity: 0,
                transform: "translate3d(-12px, 24px, 0) rotate(-4deg)",
                offset: 0,
              },
              {
                opacity: 1,
                transform: "translate3d(0, -6px, 0) rotate(1.5deg)",
                offset: 0.65,
              },
              {
                opacity: 1,
                transform: "translate3d(0, 2px, 0) rotate(-0.5deg)",
                offset: 0.85,
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) rotate(0deg)",
                offset: 1,
              },
            ],
            {
              duration: 750,
              delay: groupStart + index * 65,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "backwards",
            }
          );

          animations.push(animation);
        });

        groupStart += Math.max(0, words.length - 1) * 65 + 180;
      });

    const buttons = container.querySelector<HTMLElement>("[data-wave-buttons]");

    if (buttons) {
      animations.push(
        buttons.animate(
          [
            {
              opacity: 0,
              transform: "translateY(16px)",
            },
            {
              opacity: 1,
              transform: "translateY(0)",
            },
          ],
          {
            duration: 600,
            delay: groupStart,
            easing: "ease-out",
            fill: "backwards",
          }
        )
      );
    }

    return () => {
      animations.forEach((animation) => animation.cancel());
    };
  }, [eyebrow, title, highlightedTitle, description]);

  return (
    <>
      {/* 1. About Hero */}
      <section
        aria-labelledby="about-hero-heading"
        className="relative isolate overflow-hidden bg-brand"
      >
        <SafeImage
          src={HERO_IMAGE}
          alt="Dwellora architectural studio and bespoke carpentry team"
          fallbackTitle="About Dwellora"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 ease-out"
        />

        {/* Overlay gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-black/5"
        />

        <div
          className={`site-container relative flex min-h-[440px] items-center py-12 sm:min-h-[480px] lg:min-h-[500px] transition-opacity duration-700 ease-out ${
            heroMounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <div ref={heroRef} className="w-full max-w-2xl">
            {/* Eyebrow */}
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase leading-5 tracking-[0.16em] text-background/90 sm:text-xs">
              <span aria-hidden="true" className="h-px w-8 shrink-0 bg-accent" />
              <span className="sr-only">{eyebrow}</span>
              <span data-wave-group>
                <WaveWords text={eyebrow} />
              </span>
            </p>

            {/* Heading */}
            <h1
              id="about-hero-heading"
              className="text-3xl font-semibold leading-[1.15] tracking-tight text-background sm:text-4xl lg:text-5xl"
            >
              <span className="sr-only">
                {title} {highlightedTitle}
              </span>

              <span data-wave-group aria-hidden="true">
                <WaveWords text={title} />{" "}
                <WaveWords text={highlightedTitle} className="text-accent" />
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 max-w-xl text-base leading-7 text-background/90">
              <span className="sr-only">{description}</span>
              <span data-wave-group>
                <WaveWords text={description} />
              </span>
            </p>

            {/* Buttons */}
            <div
              data-wave-buttons
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
            >
              <Link
                href="#our-story"
                className="btn btn-primary w-full sm:w-auto shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Explore Our Story</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </Link>

              <Link
                href="/contact?type=quote"
                className="btn btn-outline-light w-full sm:w-auto hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>Get a Quote</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Our Story */}
      <section
        id="our-story"
        ref={storyRef}
        aria-label="Our story"
        className="site-container section-spacing scroll-mt-20 overflow-hidden"
      >
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12 xl:gap-16">
          <div
            className={`lg:col-span-6 transition-all duration-800 ease-out ${
              storyVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <div className="max-w-xl">
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                <span>OUR STORY</span>
              </p>

              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand sm:text-3xl lg:text-4xl lg:leading-tight">
                From Craftsmanship To Complete Home Transformations.
              </h2>

              <div className="mt-6 space-y-4 text-base leading-7 text-muted">
                <p>
                  Dwellora began with a passion for creating meaningful living spaces that combine beauty, comfort, and functionality.
                </p>
                <p>
                  What started as a dedication to skilled woodworking has grown into a complete home renovation practice where thoughtful design, quality materials, and expert craftsmanship come together.
                </p>
                <p>
                  We believe every home has its own story. Our team works closely with homeowners to understand their lifestyle, needs, and vision, creating spaces that are not only visually impressive but also designed for everyday living.
                </p>
              </div>

              {/* Stats Row */}
              <div className="mt-8 border-t border-border pt-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-6">
                  <div
                    className={`transition-all duration-500 ease-out delay-300 ${
                      storyVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <p className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
                      100%
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                      In-House Millwork
                    </p>
                  </div>

                  <div
                    className={`border-t border-border/70 pt-4 sm:border-t-0 sm:border-l sm:border-border sm:pt-0 sm:pl-6 transition-all duration-500 ease-out delay-400 ${
                      storyVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <p className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
                      10-Year
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                      Craft Warranty
                    </p>
                  </div>

                  <div
                    className={`border-t border-border/70 pt-4 sm:border-t-0 sm:border-l sm:border-border sm:pt-0 sm:pl-6 transition-all duration-500 ease-out delay-500 ${
                      storyVisible
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-4"
                    }`}
                  >
                    <p className="text-2xl font-bold tracking-tight text-brand sm:text-3xl">
                      Dhaka
                    </p>
                    <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
                      Studio &amp; Workshop
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`lg:col-span-6 transition-all duration-800 ease-out delay-150 ${
              storyVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <div className="group relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-[0_12px_40px_rgba(25,53,50,0.08)]">
              <SafeImage
                src={STORY_IMAGE}
                alt="Dwellora bespoke living room interior architecture"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"
              />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  CURATED LIVING SPACES
                </p>
                <p className="mt-1 text-sm font-medium text-white/95">
                  Handcrafted joinery, precision machinery, and sustainable timber sourcing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Our Vision & Mission Section */}
      <section
        ref={purposeRef}
        aria-label="Our vision and mission"
        className="border-y border-border/80 bg-background/50 section-spacing scroll-mt-20 overflow-hidden"
      >
        <div className="site-container">
          <div
            className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
              purposeVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              <span>CORE PURPOSE</span>
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
              Our Vision &amp; Mission
            </h2>
            <p className="mt-3 text-base text-muted">
              The guiding principles that shape every blueprint, joint, and interior finish.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-10">
            {/* Card 1: Our Vision */}
            <div
              className={`group relative flex flex-col justify-between rounded-3xl border border-border/90 bg-surface p-8 lg:p-10 shadow-[0_4px_24px_rgba(25,53,50,0.04)] hover:shadow-[0_16px_40px_rgba(25,53,50,0.09)] hover:border-accent/40 transition-all duration-500 hover:-translate-y-2 ${
                purposeVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-[0.98]"
              } delay-100`}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                  <FiCompass className="h-6 w-6 stroke-[1.8]" />
                </div>

                <div className="my-5 h-0.5 w-10 bg-accent transition-all duration-300 group-hover:w-16" />

                <h3 className="text-2xl font-semibold tracking-tight text-brand">
                  Our Vision
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Our vision is to redefine home renovation by creating spaces that are beautiful, functional, and meaningful. We aim to become a trusted renovation partner where creativity, craftsmanship, and quality come together to transform everyday living spaces into inspiring environments.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <span>Inspiring Living</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>

            {/* Card 2: Our Mission */}
            <div
              className={`group relative flex flex-col justify-between rounded-3xl border border-border/90 bg-surface p-8 lg:p-10 shadow-[0_4px_24px_rgba(25,53,50,0.04)] hover:shadow-[0_16px_40px_rgba(25,53,50,0.09)] hover:border-accent/40 transition-all duration-500 hover:-translate-y-2 ${
                purposeVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-[0.98]"
              } delay-200`}
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                  <FiTarget className="h-6 w-6 stroke-[1.8]" />
                </div>

                <div className="my-5 h-0.5 w-10 bg-accent transition-all duration-300 group-hover:w-16" />

                <h3 className="text-2xl font-semibold tracking-tight text-brand">
                  Our Mission
                </h3>

                <p className="mt-4 text-base leading-7 text-muted">
                  Our mission is to deliver personalised renovation solutions through thoughtful design, skilled craftsmanship, and reliable project execution. We focus on understanding every client&apos;s needs and turning their ideas into spaces that reflect their lifestyle and personality.
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                <span>Purposeful Craft</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How We Work Section */}
      <section
        ref={processRef}
        aria-label="How we work process"
        className="site-container section-spacing scroll-mt-20 overflow-hidden"
      >
        <div
          className={`max-w-2xl transition-all duration-700 ease-out ${
            processVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            <span>OUR PROCESS</span>
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            How We Work
          </h2>
          <p className="mt-3 text-base text-muted sm:text-lg">
            A simple and transparent process designed to bring your dream space to life.
          </p>
        </div>

        {/* 5 Process Steps: Timeline Layout */}
        <div className="mt-14">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                number: "01",
                icon: FiMessageSquare,
                title: "Consultation & Understanding",
                description:
                  "We begin by listening to your ideas, requirements, lifestyle needs, and renovation goals to understand your vision clearly.",
              },
              {
                number: "02",
                icon: FiLayers,
                title: "Design & Planning",
                description:
                  "Our team develops thoughtful design concepts, material selections, and project plans that balance beauty, functionality, and budget.",
              },
              {
                number: "03",
                icon: FiBox,
                title: "Material Selection & Preparation",
                description:
                  "We carefully select quality materials and prepare every detail before starting the renovation process.",
              },
              {
                number: "04",
                icon: FiTool,
                title: "Craftsmanship & Execution",
                description:
                  "Our skilled craftsmen bring the design to life with precision, attention to detail, and professional workmanship.",
              },
              {
                number: "05",
                icon: FiCheckCircle,
                title: "Final Inspection & Handover",
                description:
                  "We review every detail, ensure quality standards are met, and deliver a finished space ready to enjoy.",
              },
            ].map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className={`group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-surface p-6 shadow-[0_4px_20px_rgba(25,53,50,0.03)] hover:shadow-[0_14px_36px_rgba(25,53,50,0.08)] hover:border-accent/40 transition-all duration-500 hover:-translate-y-2 ${
                    processVisible
                      ? "opacity-100 translate-y-0 scale-100"
                      : "opacity-0 translate-y-8 scale-[0.98]"
                  }`}
                  style={{ transitionDelay: `${idx * 80}ms` }}
                >
                  <div>
                    {/* Step Top Bar */}
                    <div className="flex items-center justify-between border-b border-border/70 pb-4">
                      <span className="text-xl font-bold tracking-tight text-accent">
                        {step.number}
                      </span>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <h3 className="mt-5 text-base font-semibold text-brand">
                      {step.title}
                    </h3>

                    <p className="mt-2.5 text-xs leading-relaxed text-muted">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 h-1 w-full rounded-full bg-border/50 overflow-hidden">
                    <div className="h-full w-0 bg-accent transition-all duration-500 group-hover:w-full" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Craftsmanship That Defines Every Detail */}
      <section
        ref={craftRef}
        aria-label="Craftsmanship details"
        className="border-y border-border/80 bg-brand text-white section-spacing scroll-mt-20 overflow-hidden"
      >
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
            <div
              className={`lg:col-span-6 transition-all duration-800 ease-out ${
                craftVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-[0.98]"
              }`}
            >
              <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                <span aria-hidden="true" className="h-px w-6 bg-accent" />
                <span>ARCHITECTURAL INTEGRITY</span>
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:leading-tight">
                Craftsmanship That Defines Every Detail.
              </h2>

              <p className="mt-5 text-base leading-7 text-white/80">
                True architectural luxury resides in the invisible joints, exact alignment of wood grains, smooth drawer glides, and bespoke cabinetry engineered specifically for your home.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                    <FiShield className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Sustainable Hardwood &amp; Veneers
                    </h3>
                    <p className="mt-0.5 text-xs text-white/70">
                      Responsibly harvested hardwoods treated for lasting durability and termite resistance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-accent">
                    <FiAward className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      Master Mortise &amp; Tenon Joinery
                    </h3>
                    <p className="mt-0.5 text-xs text-white/70">
                      Traditional cabinetry engineering fused with modern German hardware fittings.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`lg:col-span-6 transition-all duration-800 ease-out delay-150 ${
                craftVisible
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-8 scale-[0.98]"
              }`}
            >
              <div className="group relative aspect-[16/11] w-full overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-2xl">
                <SafeImage
                  src={CRAFTSMANSHIP_IMAGE}
                  alt="Dwellora master carpenter measuring bespoke woodwork"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"
                />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-accent">
                    ARTISAN PRECISION
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/95">
                    Zero-tolerance measurements and custom millwork tailored to your floorplan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. People Behind Dwellora */}
      <section
        ref={teamRef}
        aria-label="People behind Dwellora"
        className="site-container section-spacing scroll-mt-20 overflow-hidden"
      >
        <div
          className={`mx-auto max-w-2xl text-center transition-all duration-700 ease-out ${
            teamVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <p className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
            <span>OUR TEAM</span>
            <span aria-hidden="true" className="h-px w-6 bg-accent" />
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            People Behind Dwellora
          </h2>
          <p className="mt-3 text-base text-muted">
            A dedicated collective of architects, interior specialists, master carpenters, and site directors working in unison.
          </p>
        </div>

        <div
          className={`group mt-12 overflow-hidden rounded-3xl border border-border/90 bg-surface shadow-[0_6px_30px_rgba(25,53,50,0.05)] hover:shadow-[0_16px_40px_rgba(25,53,50,0.09)] transition-all duration-800 ease-out delay-150 ${
            teamVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-8 scale-[0.98]"
          }`}
        >
          <div className="relative aspect-[21/9] w-full overflow-hidden bg-brand/5 sm:aspect-[24/9]">
            <SafeImage
              src={TEAM_IMAGE}
              alt="The Dwellora team of craftsmen and designers"
              fill
              sizes="100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand/85 via-brand/30 to-transparent"
            />
            <div className="absolute bottom-6 left-6 right-6 text-white sm:bottom-8 sm:left-8 sm:right-8">
              <div className="flex items-center gap-2 text-accent">
                <FiUsers className="h-5 w-5" />
                <span className="text-xs font-semibold uppercase tracking-wider">
                  The Dwellora Collective
                </span>
              </div>
              <p className="mt-1 text-lg font-semibold text-white sm:text-2xl">
                Collaborative Excellence Across Architecture &amp; Joinery
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-y-0 sm:divide-x p-6 sm:p-8">
            <div className="py-3 sm:py-0 sm:px-4">
              <h3 className="text-base font-semibold text-brand">Architectural Design</h3>
              <p className="mt-1 text-xs text-muted">
                Spatial planning, 3D visualizations, structural assessments, and bespoke drawings.
              </p>
            </div>
            <div className="py-3 sm:py-0 sm:px-4">
              <h3 className="text-base font-semibold text-brand">Master Carpentry</h3>
              <p className="mt-1 text-xs text-muted">
                Handcrafted furniture, custom kitchen cabinetry, architectural doors, and millwork.
              </p>
            </div>
            <div className="py-3 sm:py-0 sm:px-4">
              <h3 className="text-base font-semibold text-brand">Project Management</h3>
              <p className="mt-1 text-xs text-muted">
                On-site quality supervision, schedule coordination, and transparent communication.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose Dwellora (Full-Width Cinematic Video Hero CTA) */}
      <section
        ref={ctaRef}
        aria-label="Why choose Dwellora CTA"
        className="relative w-full overflow-hidden bg-neutral-950 min-h-[550px] lg:min-h-[600px] xl:min-h-[650px] flex items-center justify-center scroll-mt-20 mt-16 sm:mt-20 lg:mt-24"
      >
        {/* Background Autoplay Video */}
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
            <source
              src="https://res.cloudinary.com/rh4jhmw7/video/upload/v1791376864/Hero.mp4"
              type="video/mp4"
            />
          </video>

          {/* Lighter, balanced cinematic overlay (~30-35% opacity) keeping video clearly visible */}
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,25,22,0.35)_0%,transparent_80%)]" />
        </div>

        {/* Gold Rim Accents */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
        />

        {/* Centered Content */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20 text-center flex flex-col items-center justify-center w-full">
          <div
            className={`flex flex-col items-center w-full max-w-3xl transition-all duration-800 ease-out ${
              ctaVisible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-8 scale-[0.98]"
            }`}
          >
            {/* Eyebrow Badge */}
            <p className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>WHY CHOOSE DWELLORA</span>
            </p>

            {/* Heading */}
            <h2 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[52px] font-bold tracking-tight text-[#F8F5EE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] text-balance leading-tight sm:leading-tight">
              Ready to Transform Your Living Space?
            </h2>

            {/* Description */}
            <p className="mx-auto mt-4 max-w-2xl text-base sm:text-lg leading-relaxed text-[#EDE8DF] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] text-balance font-normal">
              Whether you are planning a whole-home renovation or custom woodwork, we invite you to experience the Dwellora difference with a free architectural consultation.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/contact"
                className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-8 py-3.5 text-base border border-accent inline-flex items-center justify-center gap-2.5"
              >
                <span>Book a Consultation</span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-brand" />
              </Link>

              <Link
                href="/projects"
                className="btn border border-white/60 bg-black/25 text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-8 py-3.5 text-base shadow-md inline-flex items-center justify-center"
              >
                <span>View Our Portfolio</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
