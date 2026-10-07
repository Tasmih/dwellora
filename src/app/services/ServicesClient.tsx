"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiPhone } from "react-icons/fi";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";
import Loading from "@/components/common/Loading";
import SafeImage from "@/components/SafeImage";
import { apiFetch } from "@/lib/api";

const MEET_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791379836/meet.jpg";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export default function ServicesClient() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || "";

  const [services, setServices] = useState<PublicService[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchServicesData() {
      try {
        setLoading(true);
        setError(null);

        const endpoint = selectedCategory
          ? `/api/services?category=${encodeURIComponent(selectedCategory)}`
          : "/api/services";

        const [catRes, data] = await Promise.all([
          apiFetch("/api/categories").catch(() => ({ categories: [] })),
          apiFetch(endpoint),
        ]);

        if (isMounted) {
          setCategories(catRes.categories || []);
          setServices(data.services || []);
        }
      } catch (err) {
        console.error("Error fetching public services:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load services."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServicesData();

    return () => {
      isMounted = false;
    };
  }, [selectedCategory, retryCount]);

  const currentCategoryObj = categories.find(
    (c) => c.slug === selectedCategory
  );

  return (
    <main id="main-content">
      <div className="site-container pt-4 pb-4 sm:pt-6 sm:pb-6 lg:pt-8">
        {/* 1. Services Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-border/80">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>BESPOKE DISCIPLINES</span>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl lg:text-5xl leading-tight">
              Our Renovation Services
            </h1>

            <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted font-normal">
              From bespoke cabinetry to architectural living transformations, explore how our master craft and space planning elevate every room in your home.
            </p>
          </div>

          {/* Quick stats highlight pill */}
          <div className="flex items-center gap-4 text-xs font-semibold text-brand self-start lg:self-auto bg-surface border border-border/90 px-4 py-2.5 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-accent" />
              <span>{services.length > 0 ? `${services.length} Specialized Offerings` : "Bespoke Services"}</span>
            </div>
            <span className="text-border">|</span>
            <span className="text-muted font-normal">100% Custom Joinery</span>
          </div>
        </div>

        {/* 2. Compact, Elegant Category Navigation Tabs */}
        {categories.length > 0 && (
          <nav
            aria-label="Filter services by category"
            className="mt-6 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none"
          >
            <Link
              href="/services"
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                !selectedCategory
                  ? "bg-brand text-white border border-brand shadow-xs font-semibold"
                  : "border border-border/80 bg-surface/90 text-muted hover:border-brand/40 hover:text-brand"
              }`}
            >
              {!selectedCategory && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
              <span>All Disciplines</span>
            </Link>

            {categories.map((cat) => {
              const active = selectedCategory === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={`/services?category=${encodeURIComponent(cat.slug)}`}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    active
                      ? "bg-brand text-white border border-brand shadow-xs font-semibold"
                      : "border border-border/80 bg-surface/90 text-muted hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  <span>{cat.name}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {/* 3. Content Area with Loading, Error, Empty, and Services States */}
        {loading ? (
          <div className="mt-12 py-12">
            <Loading text="Loading bespoke services..." size="lg" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-10 rounded-2xl border border-red-200 bg-surface p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-brand">
              Services are temporarily unavailable
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              {error}
            </p>

            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="btn btn-secondary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : services.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-8 sm:p-10 text-center max-w-xl mx-auto shadow-xs">
            <h2 className="text-xl font-semibold text-brand">
              {currentCategoryObj
                ? `No services found in ${currentCategoryObj.name}`
                : "New services are on the way"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              {currentCategoryObj
                ? "We are currently preparing services for this category. You can browse all services or check back shortly."
                : "Our service information will be available here soon."}
            </p>

            {selectedCategory && (
              <div className="mt-6">
                <Link href="/services" className="btn btn-secondary">
                  View All Services
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <PublicServiceCard
                key={service._id || service.slug}
                service={service}
              />
            ))}
          </div>
        )}
      </div>

      {/* Full-Width Luxury Consultation CTA Section with meet.jpg Background */}
      <section
        aria-labelledby="consultation-cta-heading"
        className="relative w-full overflow-hidden bg-neutral-950 mt-20 lg:mt-28 min-h-[460px] sm:min-h-[500px] lg:min-h-[540px] flex items-center justify-center"
      >
        {/* Background Image Layer with Next/Image and balanced overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <SafeImage
            src={MEET_IMAGE}
            alt="Dwellora bespoke renovation design and carpentry consultation"
            fallbackTitle="Renovation Consultation"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover object-center scale-105"
          />

          {/* Soft, balanced dark gradient overlay so the photo remains clearly visible */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/45"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/40 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,25,22,0.4)_0%,transparent_80%)] pointer-events-none"
          />
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

        {/* Centered Content Container */}
        <div className="relative z-10 mx-auto max-w-4xl px-6 py-16 sm:py-20 text-center flex flex-col items-center justify-center w-full">
          <div className="flex flex-col items-center w-full max-w-3xl">
            {/* Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/50 px-4 py-1.5 backdrop-blur-md shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                LET&apos;S BUILD TOGETHER
              </span>
            </div>

            {/* Heading */}
            <h2
              id="consultation-cta-heading"
              className="mt-4 sm:mt-5 text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tight text-[#F8F5EE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] text-balance leading-tight sm:leading-tight"
            >
              Have a renovation or woodwork project in mind?
            </h2>

            {/* Description */}
            <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] text-balance font-normal">
              Speak directly with our design and carpentry team to explore possibilities, materials, and custom solutions for your space.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/contact?type=quote"
                className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-8 py-3.5 text-base border border-accent inline-flex items-center justify-center gap-2.5"
              >
                <span>Request a Consultation</span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-brand" />
              </Link>

              <a
                href="tel:+18005553935"
                className="btn border border-white/60 bg-black/25 text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm font-medium inline-flex items-center justify-center gap-2 shadow-md"
              >
                <FiPhone className="h-4 w-4 text-accent" />
                <span>Call (800) 555-3935</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
