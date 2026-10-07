"use client";

import { useEffect, useRef } from "react";
import SafeImage from "@/components/SafeImage";
import Link from "next/link";

export type HeroContent = {
  eyebrow: string;
  title: string;
  highlightedTitle: string;
  description: string;
  image: string;
  imageAlt: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

type HeroProps = {
  content: HeroContent;
};

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
          <span
            data-wave-word
            className="inline-block origin-bottom"
          >
            {word}
          </span>

          {index < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

export default function Hero({ content }: HeroProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;

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
        const words =
          group.querySelectorAll<HTMLElement>("[data-wave-word]");

        words.forEach((word, index) => {
          const animation = word.animate(
            [
              {
                opacity: 0,
                transform:
                  "translate3d(-12px, 24px, 0) rotate(-4deg)",
                offset: 0,
              },
              {
                opacity: 1,
                transform:
                  "translate3d(0, -6px, 0) rotate(1.5deg)",
                offset: 0.65,
              },
              {
                opacity: 1,
                transform:
                  "translate3d(0, 2px, 0) rotate(-0.5deg)",
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

        // Start the next text group as this group's last words enter.
        groupStart += Math.max(0, words.length - 1) * 65 + 180;
      });

    const buttons = container.querySelector<HTMLElement>(
      "[data-wave-buttons]"
    );

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
  }, [content.eyebrow, content.title, content.highlightedTitle, content.description]);

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-brand"
    >
      <SafeImage
        src={content.image}
        alt={content.imageAlt}
        fallbackTitle={content.title}
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/55 lg:bg-transparent lg:bg-gradient-to-r lg:from-black/75 lg:via-black/35 lg:to-black/5"
      />

      <div className="site-container relative flex min-h-[440px] items-center py-12 sm:min-h-[480px] lg:min-h-[500px]">
        <div ref={contentRef} className="w-full max-w-xl">
          {/* Eyebrow */}
          <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase leading-5 tracking-[0.16em] text-background/90 sm:text-xs">
            <span
              aria-hidden="true"
              className="h-px w-8 shrink-0 bg-accent"
            />

            <span className="sr-only">{content.eyebrow}</span>

            <span data-wave-group>
              <WaveWords text={content.eyebrow} />
            </span>
          </p>

          {/* Heading */}
          <h1
            id="hero-heading"
            className="text-3xl font-semibold leading-[1.15] tracking-tight text-background sm:text-4xl lg:text-5xl"
          >
            <span className="sr-only">
              {content.title} {content.highlightedTitle}
            </span>

            <span data-wave-group aria-hidden="true">
              <WaveWords text={content.title} />{" "}
              <WaveWords
                text={content.highlightedTitle}
                className="text-accent"
              />
            </span>
          </h1>

          {/* Description */}
          <p className="mt-6 max-w-md text-base leading-7 text-background/90">
            <span className="sr-only">{content.description}</span>

            <span data-wave-group>
              <WaveWords text={content.description} />
            </span>
          </p>

          {/* Buttons */}
          <div
            data-wave-buttons
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4"
          >
            <Link
              href={content.primaryHref}
              className="btn btn-primary w-full sm:w-auto"
            >
              {content.primaryLabel}

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
              href={content.secondaryHref}
              className="btn btn-outline-light w-full sm:w-auto"
            >
              {content.secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}