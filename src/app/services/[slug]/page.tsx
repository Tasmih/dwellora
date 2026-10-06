import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { FiCheck, FiMail, FiPhone } from "react-icons/fi";

import Navbar from "@/components/Navbar";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";
import SafeImage from "@/components/SafeImage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type IncludedItem = {
  title: string;
  description: string;
};

type ServiceDetails = PublicService & {
  includedItems?: IncludedItem[];
  status: "published" | "unpublished";
  category?: {
    _id?: string;
    name: string;
    slug: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
};

function getSiteUrl() {
  return process.env.SITE_URL || "http://localhost:3000";
}

// Fetch single service by slug (cache per request)
const getService = cache(async (slug: string): Promise<ServiceDetails | null> => {
  const response = await fetch(
    `${API_URL}/api/services/slug/${encodeURIComponent(slug)}`,
    {
      cache: "no-store",
    }
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load service (status: ${response.status}).`);
  }

  const data: { service: ServiceDetails } = await response.json();
  return data.service;
});

// Fetch up to 3 other published services: prefer same category, fill from others if needed
async function getRelatedServices(
  currentSlug: string,
  categorySlug?: string
): Promise<{ list: PublicService[]; isMixedCategories: boolean }> {
  try {
    let sameCategoryServices: PublicService[] = [];
    let isMixedCategories = false;

    if (categorySlug) {
      const res = await fetch(
        `${API_URL}/api/services?category=${encodeURIComponent(categorySlug)}`,
        { cache: "no-store" }
      );
      if (res.ok) {
        const data = await res.json();
        sameCategoryServices = (data.services || []).filter(
          (s: PublicService) => s.slug !== currentSlug
        );
      }
    }

    if (sameCategoryServices.length >= 3) {
      return {
        list: sameCategoryServices.slice(0, 3),
        isMixedCategories: false,
      };
    }

    // Fill remaining slots from all published services
    const allRes = await fetch(`${API_URL}/api/services`, {
      cache: "no-store",
    });
    if (!allRes.ok) {
      return { list: sameCategoryServices, isMixedCategories: false };
    }

    const allData = await allRes.json();
    const existingSlugs = new Set([
      currentSlug,
      ...sameCategoryServices.map((s) => s.slug),
    ]);

    const additionalServices: PublicService[] = (allData.services || []).filter(
      (s: PublicService) => !existingSlugs.has(s.slug)
    );

    if (additionalServices.length > 0 && sameCategoryServices.length > 0) {
      isMixedCategories = true;
    }

    const combined = [
      ...sameCategoryServices,
      ...additionalServices,
    ].slice(0, 3);

    return {
      list: combined,
      isMixedCategories,
    };
  } catch (err) {
    console.warn("Could not fetch related services:", err);
    return { list: [], isMixedCategories: false };
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Not Found | Dwellora",
      description: "The requested renovation service could not be found.",
    };
  }

  const seo = service.seo;
  const title = seo?.metaTitle?.trim() || `${service.title} | Dwellora`;
  const description =
    seo?.metaDescription?.trim() ||
    service.shortDescription?.trim() ||
    service.description.trim().slice(0, 160);

  const ogTitle = seo?.ogTitle?.trim() || service.title;
  const ogDescription = seo?.ogDescription?.trim() || description;
  const ogImage = seo?.ogImage?.trim() || service.image;

  const canonicalUrl =
    seo?.canonicalUrl?.trim() ||
    new URL(
      `/services/${encodeURIComponent(service.slug)}`,
      getSiteUrl()
    ).toString();

  const keywords = seo?.keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: { absolute: title },
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: "Dwellora",
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: [ogImage],
    },
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const { list: relatedServices, isMixedCategories } =
    await getRelatedServices(service.slug, service.category?.slug);

  const heroIntro =
    service.shortDescription?.trim() ||
    (service.description.length > 200
      ? `${service.description.slice(0, 200).trim()}...`
      : service.description);

  const hasIncludedItems =
    Array.isArray(service.includedItems) && service.includedItems.length > 0;

  return (
    <>
      <Navbar />

      <main className="site-container pt-3 pb-16 sm:pt-4 sm:pb-20 lg:pt-4 lg:pb-24">
        {/* 1. Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-5 sm:mb-6 lg:mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-normal text-muted">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-brand"
              >
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link
                href="/services"
                className="transition-colors hover:text-brand"
              >
                Services
              </Link>
            </li>

            {service.category && (
              <>
                <li aria-hidden="true" className="text-border">
                  /
                </li>
                <li>
                  <Link
                    href={`/services/category/${encodeURIComponent(
                      service.category.slug
                    )}`}
                    className="transition-colors hover:text-brand"
                  >
                    {service.category.name}
                  </Link>
                </li>
              </>
            )}

            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li
              aria-current="page"
              className="font-medium text-brand truncate max-w-xs sm:max-w-md"
            >
              {service.title}
            </li>
          </ol>
        </nav>

        {/* 2. Split Hero */}
        <section
          aria-labelledby="service-title-heading"
          className="grid gap-8 lg:grid-cols-12 lg:gap-12 items-center"
        >
          {/* Left: Title, Intro & CTA */}
          <div className="lg:col-span-7">
            {service.category && (
              <p className="text-xs lg:text-sm font-medium uppercase tracking-[0.25em] text-accent">
                {service.category.name}
              </p>
            )}

            <h1
              id="service-title-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-brand sm:text-4xl lg:text-[56px] lg:leading-[1.1] max-w-2xl"
            >
              {service.title}
            </h1>

            <p className="mt-4 sm:mt-5 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">
              {heroIntro}
            </p>

            <div className="mt-6 sm:mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#consultation" className="btn btn-primary">
                Book Consultation
              </a>

              <Link href="/services" className="btn btn-secondary">
                View All Services
              </Link>
            </div>
          </div>

          {/* Right: Service Image */}
          <div className="w-full lg:col-span-5">
            <div className="relative h-[320px] sm:h-[380px] lg:h-[440px] w-full overflow-hidden bg-surface">
              <SafeImage
                src={service.image}
                alt={service.title}
                fallbackTitle={service.title}
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </section>

        {/* 3, 4, 5. Overview + What's Included + Consultation Panel */}
        <section className="mt-16 grid gap-12 lg:mt-24 lg:grid-cols-12 lg:gap-12">
          {/* Main Content Column (Overview & What's Included) */}
          <div className="lg:col-span-8 space-y-12">
            {/* 3. Overview */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
              <h2 className="text-xl font-semibold tracking-tight text-brand sm:text-2xl">
                Service Overview
              </h2>

              <div className="mt-6 whitespace-pre-line text-base leading-8 text-foreground/90">
                {service.description}
              </div>
            </div>

            {/* 4. What's Included (omitted when empty) */}
            {hasIncludedItems && (
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-10">
                <div className="max-w-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                    Scope of Work
                  </p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-brand sm:text-2xl">
                    What&apos;s Included
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    We provide transparent, end-to-end craftsmanship with no hidden surprises.
                  </p>
                </div>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {service.includedItems!.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3.5 rounded-xl border border-border bg-background/50 p-5"
                    >
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand">
                        <FiCheck className="h-4 w-4 text-accent" />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold text-brand">
                          {item.title}
                        </h3>

                        {item.description && (
                          <p className="mt-1 text-xs leading-5 text-muted">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 5. Consultation Panel (Beside overview on desktop, below on mobile) */}
          <aside className="lg:col-span-4">
            <div
              id="consultation"
              className="sticky top-28 rounded-2xl border border-border bg-surface p-6 sm:p-8 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Consultation
              </p>

              <h2 className="mt-2 text-xl font-semibold text-brand">
                Plan Your Renovation
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                Discuss space planning, finishes and materials directly with our craftsmen. We offer upfront quotes and clear project timelines.
              </p>

              <div className="mt-6 space-y-3 border-t border-border pt-6">
                <a
                  href={`mailto:info@dwellora.com?subject=Consultation%20Inquiry%20-%20${encodeURIComponent(
                    service.title
                  )}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-sm font-medium text-brand transition-colors hover:border-accent hover:bg-background"
                >
                  <FiMail className="h-4 w-4 text-accent" />
                  <span className="truncate">info@dwellora.com</span>
                </a>

                <a
                  href="tel:+18005553935"
                  className="flex items-center gap-3 rounded-xl border border-border bg-background/60 p-3 text-sm font-medium text-brand transition-colors hover:border-accent hover:bg-background"
                >
                  <FiPhone className="h-4 w-4 text-accent" />
                  <span>(800) 555-3935</span>
                </a>
              </div>

              <div className="mt-6">
                <a
                  href={`mailto:info@dwellora.com?subject=Consultation%20Booking%20for%20${encodeURIComponent(
                    service.title
                  )}`}
                  className="btn btn-primary w-full"
                >
                  Request Consultation
                </a>
              </div>
            </div>
          </aside>
        </section>

        {/* 6. Up to Three Other Published Services (Omitted when none exist) */}
        {relatedServices.length > 0 && (
          <section
            aria-labelledby="related-services-heading"
            className="mt-20 border-t border-border pt-16 lg:mt-28"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Explore More
                </p>
                <h2
                  id="related-services-heading"
                  className="mt-1 text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
                >
                  {isMixedCategories || !service.category
                    ? "Explore More Services"
                    : `Other ${service.category.name}`}
                </h2>
              </div>

              <Link
                href="/services"
                className="btn btn-secondary inline-flex self-start text-xs sm:self-auto"
              >
                View All Services &rarr;
              </Link>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedServices.map((rel) => (
                <PublicServiceCard
                  key={rel._id || rel.slug}
                  service={rel}
                />
              ))}
            </div>
          </section>
        )}

        {/* 7. Dark Green Closing CTA */}
        <section
          aria-labelledby="closing-cta-heading"
          className="mt-20 overflow-hidden rounded-3xl bg-brand p-8 text-background sm:p-12 lg:mt-28 lg:p-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Dwellora Craftsmanship
            </p>

            <h2
              id="closing-cta-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl"
            >
              Ready to transform your home with {service.title}?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/80">
              From concept to finished details, we bring architectural clarity and master carpentry to every residential space.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#consultation"
                className="btn btn-primary w-full sm:w-auto"
              >
                Start Your Project
              </a>

              <Link
                href="/services"
                className="btn btn-outline-light w-full sm:w-auto"
              >
                Browse All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}