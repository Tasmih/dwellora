"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiCheck,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import SafeImage from "@/components/SafeImage";
import ContactForm from "@/components/ContactForm";

const CONTACT_HERO_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791322646/contactus.jpg";
const WORKSHOP_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791322735/workshop.jpg";
const TEAM_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791323183/teammate.jpg";

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

export default function ContactClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  const eyebrow = "INQUIRIES & CONSULTATIONS";
  const title = "Transform Your Vision";
  const highlightedTitle = "Into A Beautiful Living Space.";
  const description =
    "From complete home renovations to bespoke carpentry and interior transformations, Dwellora brings thoughtful design, skilled craftsmanship, and personalised solutions to every project.";

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
      {/* 1. Hero Section */}
      <section
        aria-labelledby="contact-hero-heading"
        className="relative isolate overflow-hidden bg-brand"
      >
        <SafeImage
          src={CONTACT_HERO_IMAGE}
          alt="Dwellora luxury architectural renovation consultation"
          fallbackTitle="Dwellora Consultations"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        {/* Overlay gradient */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-black/5"
        />

        <div className="site-container relative flex min-h-[440px] items-center py-12 sm:min-h-[480px] lg:min-h-[500px]">
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
              id="contact-hero-heading"
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
                href="#contact-form"
                className="btn btn-primary w-full sm:w-auto"
              >
                <span>Get Free Consultation</span>
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
                href="/services"
                className="btn btn-outline-light w-full sm:w-auto"
              >
                <span>Explore Our Services</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Inquiries & Form Section (Balanced 2-Column) */}
      <section
        id="contact-form"
        aria-label="Inquiry form and office details"
        className="site-container section-spacing scroll-mt-20"
      >
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Contact Information Cards & Direct Channels */}
          <div className="space-y-6 lg:col-span-5 animate-fade-up delay-100">
            {/* Quick Contact Info Card */}
            <div className="group rounded-3xl border border-border/90 bg-surface p-6 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.04)] hover:shadow-[0_12px_32px_rgba(25,53,50,0.08)] transition-all duration-300 hover:-translate-y-1">
              <h2 className="text-lg font-semibold tracking-tight text-brand">
                Contact Information
              </h2>
              <p className="mt-1 text-xs text-muted">
                Direct channels for residential and commercial architectural inquiries.
              </p>

              <div className="mt-6 space-y-5">
                {/* Phone */}
                <div className="group/item flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-brand transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-accent group-hover/item:text-brand">
                    <FiPhone className="h-5 w-5 text-accent group-hover/item:text-brand transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Phone Inquiries
                    </p>
                    <a
                      href="tel:+8801712345678"
                      className="mt-0.5 block text-base font-medium text-brand hover:text-accent transition-colors"
                    >
                      +880 1712-345678
                    </a>
                    <p className="text-xs text-muted">Sat – Thu, 9:00 AM – 6:00 PM</p>
                  </div>
                </div>

                {/* Email */}
                <div className="group/item flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-brand transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-accent group-hover/item:text-brand">
                    <FiMail className="h-5 w-5 text-accent group-hover/item:text-brand transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Email Correspondence
                    </p>
                    <a
                      href="mailto:hello@dwellora.com"
                      className="mt-0.5 block text-base font-medium text-brand hover:text-accent transition-colors"
                    >
                      hello@dwellora.com
                    </a>
                    <p className="text-xs text-muted">Direct response within 24 business hours</p>
                  </div>
                </div>

                {/* Location */}
                <div className="group/item flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-brand transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-accent group-hover/item:text-brand">
                    <FiMapPin className="h-5 w-5 text-accent group-hover/item:text-brand transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Studio &amp; Workshop
                    </p>
                    <p className="mt-0.5 text-base font-medium text-brand">
                      Dhaka, Bangladesh
                    </p>
                    <p className="text-xs text-muted">
                      Private design studio &amp; architectural workshop
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="group/item flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/15 text-brand transition-all duration-300 group-hover/item:scale-110 group-hover/item:bg-accent group-hover/item:text-brand">
                    <FiClock className="h-5 w-5 text-accent group-hover/item:text-brand transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                      Office Hours
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-brand">
                      Saturday – Thursday: <span className="font-normal text-muted">9:00 AM – 6:00 PM</span>
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      Friday: Closed (Site consultations by appointment)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fast Response Assurance */}
            <div className="rounded-3xl border border-brand/10 bg-brand/5 p-6 text-brand">
              <div className="flex items-center gap-3 text-brand">
                <FiShield className="h-5 w-5 text-accent shrink-0" />
                <h3 className="text-sm font-semibold">
                  Personalized Architectural Consultations
                </h3>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Every inquiry is reviewed directly by our principal designers and lead project engineers to provide accurate feasibility and timelines.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7 animate-fade-up delay-200">
            <ContactForm key={searchParams.toString()} />
          </div>
        </div>
      </section>

      {/* 3. Balanced Showcase Section ("Why Choose Dwellora") */}
      <section
        aria-label="Why choose Dwellora"
        className="border-t border-border/80 bg-background/50 section-spacing"
      >
        <div className="site-container grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Stacked Elegant Image Cards */}
          <div className="space-y-6 lg:col-span-6 animate-fade-up">
            {/* 1. Workshop Card */}
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/90 bg-surface shadow-[0_6px_28px_rgba(25,53,50,0.06)] hover:shadow-[0_12px_36px_rgba(25,53,50,0.12)] transition-all duration-500 hover:-translate-y-1">
              <SafeImage
                src={WORKSHOP_IMAGE}
                alt="Dhaka Carpentry & Bespoke Woodworking Mill"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  IN-HOUSE FACILITY
                </p>
                <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                  Dhaka Carpentry &amp; Bespoke Woodworking Mill
                </h3>
              </div>
            </div>

            {/* 2. Team Card */}
            <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl border border-border/90 bg-surface shadow-[0_6px_28px_rgba(25,53,50,0.06)] hover:shadow-[0_12px_36px_rgba(25,53,50,0.12)] transition-all duration-500 hover:-translate-y-1">
              <SafeImage
                src={TEAM_IMAGE}
                alt="Designers & Craftsmen Working Together"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent"
              />
              <div className="absolute bottom-5 left-5 right-5 text-white sm:bottom-6 sm:left-6 sm:right-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
                  OUR TEAM
                </p>
                <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                  Designers &amp; Craftsmen Working Together
                </h3>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Content Block aligned with top of images */}
          <div className="lg:col-span-6 animate-fade-up delay-200">
            <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span aria-hidden="true" className="h-px w-6 bg-accent" />
              <span>WHY CHOOSE DWELLORA</span>
            </p>

            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand sm:text-3xl lg:text-4xl lg:leading-tight">
              Crafted With Precision,
              <br />
              <span className="text-accent">Built Around Your Vision.</span>
            </h2>

            {/* Brand description paragraphs */}
            <div className="mt-5 space-y-4 text-base leading-7 text-muted">
              <p>
                Every Dwellora project begins with a clear understanding of how you
                live, work, and experience your space. We combine thoughtful design,
                skilled craftsmanship, and precise execution to transform ordinary
                interiors into timeless environments.
              </p>
              <p>
                From complete home renovations to bespoke woodworking solutions,
                our team focuses on quality materials, functional layouts, and
                refined finishing details that make every space uniquely yours.
              </p>
            </div>

            {/* Supporting Section: Our Commitment */}
            <div className="mt-8 border-t border-border/80 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
                Our Commitment
              </h3>

              <ul className="mt-4 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                {[
                  "Complete Home Renovation Solutions",
                  "Bespoke Woodworking & Custom Joinery",
                  "Professional Project Planning & Support",
                  "Premium Materials & Detailed Finishing",
                  "Dedicated Design Consultation & Guidance",
                  "Attention To Detail From Concept To Completion",
                  "Transparent Timelines & Milestone Updates",
                  "10-Year Craft Warranty",
                ].map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2.5 text-sm font-medium text-brand"
                  >
                    <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent">
                      <FiCheck className="h-3 w-3 stroke-[2.5]" />
                    </div>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA button */}
            <div className="mt-8">
              <Link
                href="#contact-form"
                className="btn btn-primary group inline-flex items-center gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300"
              >
                <span>Start Your Project</span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
