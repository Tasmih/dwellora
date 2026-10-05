import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export const metadata: Metadata = {
  title: "Our Services | Dwellora",
  description:
    "Explore Dwellora's bespoke home renovation and custom carpentry services. Thoughtful interiors, functional spaces and carefully crafted finishes.",
  openGraph: {
    title: "Our Services | Dwellora",
    description:
      "Explore Dwellora's bespoke home renovation and custom carpentry services. Crafted spaces tailored to your lifestyle.",
  },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

async function getServices(categorySlug?: string): Promise<PublicService[]> {
  const url = categorySlug
    ? `${API_URL}/api/services?category=${encodeURIComponent(categorySlug)}`
    : `${API_URL}/api/services`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load services.");
  }

  const data = await response.json();
  return data.services || [];
}

export default async function ServicesPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams;

  let services: PublicService[] = [];
  let categories: Category[] = [];
  let failed = false;

  try {
    [categories, services] = await Promise.all([
      getCategories(),
      getServices(selectedCategory),
    ]);
  } catch (error) {
    console.error("Failed to load public services:", error);
    failed = true;
  }

  const currentCategoryObj = categories.find(
    (c) => c.slug === selectedCategory
  );

  return (
    <>
      <Navbar />

      <main className="site-container py-12 sm:py-16 lg:py-20">
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

        {/* Content Area */}
        {failed ? (
          <div
            role="alert"
            className="mt-10 rounded-2xl border border-border bg-surface p-8 sm:p-10 text-center max-w-xl mx-auto"
          >
            <h2 className="text-xl font-semibold text-brand">
              Services are temporarily unavailable
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              We could not load our services right now. Please check back shortly or reach out to our team directly.
            </p>

            <Link href="/services" className="btn btn-secondary mt-6">
              Try Again
            </Link>
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

        {/* Restrained Consultation CTA Section */}
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
              <a
                href="mailto:info@dwellora.com?subject=Renovation%20Consultation%20Inquiry"
                className="btn btn-primary w-full sm:w-auto"
              >
                Request a Consultation
              </a>

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
    </>
  );
}