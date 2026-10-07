import Link from "next/link";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

type CinematicCtaProps = {
  videoUrl?: string;
  fallbackImage?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  highlights?: string[];
};

const DEFAULT_VIDEO =
  "https://res.cloudinary.com/rh4jhmw7/video/upload/c_fill,w_1920,h_1080,q_auto/v1791299574/Modern_Kitchen_Renovation_Ideas.mp4";

const DEFAULT_IMAGE = "https://i.ibb.co/YByqgqvB/Kitchen-Hood-Renovation.jpg";

const DEFAULT_HIGHLIGHTS = [
  "Complimentary 3D Spatial Planning",
  "Transparent Fixed-Cost Estimates",
  "10-Year Craftsmanship Guarantee",
  "Dedicated Project Manager",
];

function isDirectVideoUrl(url?: string): boolean {
  if (!url) return false;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed.endsWith(".mp4") ||
    trimmed.endsWith(".webm") ||
    trimmed.endsWith(".ogg") ||
    trimmed.endsWith(".mov")
  ) {
    return true;
  }
  if (trimmed.includes("cloudinary.com") && trimmed.includes("/video/upload/")) {
    return true;
  }
  return false;
}

export default function CinematicCta({
  videoUrl = DEFAULT_VIDEO,
  fallbackImage = DEFAULT_IMAGE,
  eyebrow = "START YOUR RENOVATION JOURNEY",
  title = "Ready to Transform Your Home with Bespoke Craftsmanship?",
  description = "Book a complimentary design consultation with our senior interior architects and master joiners. We translate your lifestyle into timeless, functional spaces.",
  primaryLabel = "Request a Free Consultation",
  primaryHref = "/contact?type=quote",
  secondaryLabel = "Explore Portfolio",
  secondaryHref = "/projects",
  highlights = DEFAULT_HIGHLIGHTS,
}: CinematicCtaProps) {
  const isVideo = isDirectVideoUrl(videoUrl);
  const activeVideoUrl = isVideo ? videoUrl : DEFAULT_VIDEO;

  return (
    <section
      aria-labelledby="cinematic-cta-heading"
      className="relative w-full overflow-hidden bg-neutral-950 mt-0 mb-0 min-h-[480px] sm:min-h-[520px] lg:min-h-[560px] flex flex-col justify-between"
    >
      {/* Background Media Layer (~85% visibility, natural renovation video clarity) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {isVideo ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            poster={fallbackImage}
            src={activeVideoUrl}
            className="h-full w-full object-cover object-center animate-slow-zoom-loop"
          />
        ) : (
          <div className="relative h-full w-full animate-slow-zoom-loop">
            <SafeImage
              src={fallbackImage}
              alt="Dwellora bespoke architectural kitchen interior"
              fallbackTitle="Bespoke Kitchen"
              fill
              priority={false}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        )}

        {/* Directional Cinematic Gradient (Left: soft dark for text legibility, Center: transparent, Right: natural footage) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-black/10 pointer-events-none"
        />

        {/* Subtle Vertical Edge Vignette to preserve natural video brightness */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/15 pointer-events-none"
        />
      </div>

      {/* Subtle Gold Edge Accents */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10"
      />

      {/* Content Area with refined luxury spacing rhythm */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-6 sm:pt-8 lg:pt-10 xl:pt-12 pb-8 sm:pb-10 text-center flex flex-col items-center w-full">
        {/* Top: Eyebrow Badge */}
        <p className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-accent backdrop-blur-md animate-fade-up shadow-md">
          <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
          <span>{eyebrow}</span>
        </p>

        {/* Upper-Middle: Large Architectural Heading (Warm White #F8F5EE) */}
        <h2
          id="cinematic-cta-heading"
          className="mt-3.5 sm:mt-4 text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-[#F8F5EE] text-balance leading-snug sm:leading-tight lg:leading-tight animate-fade-up delay-100 drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)]"
        >
          {title}
        </h2>

        {/* Middle: Description (Light Cream #EDE8DF) */}
        <p className="mx-auto mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base leading-relaxed text-[#EDE8DF] font-normal animate-fade-up delay-200 drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)]">
          {description}
        </p>

        {/* Middle: CTA Action Buttons */}
        <div className="mt-6 sm:mt-7 flex flex-col items-center justify-center gap-3.5 sm:flex-row animate-fade-up delay-300 w-full sm:w-auto">
          {/* Primary CTA: Gold background, dark green text */}
          <Link
            href={primaryHref}
            className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-7 py-3 text-sm sm:text-base border border-accent"
          >
            <span>{primaryLabel}</span>
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          {/* Secondary CTA: Transparent background, white border, white text */}
          <Link
            href={secondaryHref}
            className="btn border border-white/60 bg-transparent text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3 text-sm sm:text-base shadow-md"
          >
            <span>{secondaryLabel}</span>
          </Link>
        </div>
      </div>

      {/* Bottom: Fully Visible Trust Indicators */}
      <div className="relative z-10 w-full border-t border-white/15 pt-3.5 pb-5 sm:pt-4 sm:pb-6">
        <div className="mx-auto max-w-4xl px-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-[#F8F5EE]/90 animate-fade-up delay-400 drop-shadow-[0_1px_6px_rgba(0,0,0,0.8)]">
          {highlights.map((point) => (
            <div key={point} className="flex items-center gap-1.5">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-accent/30 text-accent shrink-0">
                <FiCheck className="h-3 w-3" />
              </div>
              <span className="font-medium tracking-wide">{point}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
