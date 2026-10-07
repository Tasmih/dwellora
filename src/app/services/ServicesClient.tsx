"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";
import Loading from "@/components/common/Loading";
import { apiFetch } from "@/lib/api";

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
    <main className="site-container page-spacing">
      {/* Page Introduction */}
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Renovation &amp; Carpentry
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
          Our Services
        </h1>

        <p className="mt-4 text-base leading-7 text-muted">
          From thoughtful kitchen and bathroom transformations to bespoke cabinetry,
          explore how our craft and attention to detail elevate every corner of your home.
        </p>
      </div>

      {/* Category Filter Tabs */}
      {categories.length > 0 && (
        <nav
          aria-label="Filter services by category"
          className="mt-10 flex flex-wrap items-center gap-2 border-b border-border pb-6"
        >
          <Link
            href="/services"
            className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
              !selectedCategory
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            All Services
          </Link>

          {categories.map((cat) => {
            const active = selectedCategory === cat.slug;
            return (
              <Link
                key={cat.slug}
                href={`/services?category=${encodeURIComponent(cat.slug)}`}
                className={`rounded-full px-5 py-2.5 text-xs font-semibold tracking-wide transition-all ${
                  active
                    ? "bg-brand text-white shadow-sm"
                    : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
                }`}
              >
                {cat.name}
              </Link>
            );
          })}
        </nav>
      )}

      {/* Content Area with Loading, Error, Empty, and Services States */}
      {loading ? (
        <div className="mt-12">
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
        <div className="mt-10 rounded-2xl border border-border bg-surface p-8 sm:p-10 text-center max-w-xl mx-auto">
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
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <PublicServiceCard
              key={service._id || service.slug}
              service={service}
            />
          ))}
        </div>
      )}

      {/* Consultation CTA Section */}
      <section
        aria-labelledby="consultation-cta-heading"
        className="mt-20 overflow-hidden rounded-3xl bg-brand p-8 text-background sm:p-12 lg:mt-28 lg:p-16"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Let&apos;s Build Together
          </p>

          <h2
            id="consultation-cta-heading"
            className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl"
          >
            Have a renovation or woodwork project in mind?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/80">
            Speak directly with our design and carpentry team to explore possibilities, materials, and custom solutions for your space.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact?type=quote"
              className="btn btn-primary w-full sm:w-auto"
            >
              Request a Consultation
            </Link>

            <a
              href="tel:+18005553935"
              className="btn btn-outline-light w-full sm:w-auto"
            >
              Call (800) 555-3935
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
