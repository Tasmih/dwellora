import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import { FiCheck, FiMail, FiPhone } from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";
import SafeImage from "@/components/SafeImage";
import ServiceOverviewShowcase from "@/components/ServiceOverviewShowcase";
import ServiceWhatsIncluded from "@/components/ServiceWhatsIncluded";
import ServiceRenovationProcess from "@/components/ServiceRenovationProcess";
import ServiceWhyChooseDwellora from "@/components/ServiceWhyChooseDwellora";
import ServiceMaterialShowcase from "@/components/ServiceMaterialShowcase";
import ServiceFinalCta from "@/components/ServiceFinalCta";

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
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://dwellora.vercel.app")
  );
}

// Fetch single service by slug (cache per request)
const getService = cache(async (slug: string): Promise<ServiceDetails | null> => {
  const response = await fetch(
    `${API_URL}/api/services/slug/${encodeURIComponent(slug)}`,
    {
      next: { revalidate: 60 },
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
        { next: { revalidate: 60 } }
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
      next: { revalidate: 60 },
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

      <main id="main-content">
        <div className="site-container pt-3 pb-4 sm:pt-4 sm:pb-6 lg:pt-4 lg:pb-8">
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
                <Link href="/contact?type=quote" className="btn btn-primary">
                  Book Consultation
                </Link>

                <Link href="/services" className="btn btn-secondary">
                  View All Services
                </Link>
              </div>
            </div>

            {/* Right: Service Image */}
            <div className="w-full lg:col-span-5">
              <div className="relative h-[320px] sm:h-[380px] lg:h-[440px] w-full overflow-hidden rounded-2xl border border-border/80 bg-neutral-100 dark:bg-neutral-900/40 shadow-md">
                <SafeImage
                  src={service.image}
                  alt={service.title}
                  fallbackTitle={service.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </section>

          {/* 3. Service Overview Two-Column Showcase (Wood Craftsmanship & Team Discussion) */}
          <ServiceOverviewShowcase
            serviceTitle={service.title}
            description={service.description}
          />

          {/* 4. What's Included (Two-Column Balanced Scope & Service Visual Showcase) */}
          <ServiceWhatsIncluded
            serviceTitle={service.title}
            serviceImage={service.image}
            includedItems={
              hasIncludedItems
                ? service.includedItems!
                : [
                    {
                      title: "On-Site Consultation & Spatial Layout",
                      description:
                        "Detailed measurement, structural assessment, and personalized architectural planning.",
                    },
                    {
                      title: "Custom 3D Rendering & Material Specs",
                      description:
                        "Photorealistic spatial previews and curated timber/hardware finish selections.",
                    },
                    {
                      title: "Precision Fabrication & Joinery",
                      description:
                        "In-house bespoke carpentry crafted by master joiners with premium tolerances.",
                    },
                    {
                      title: "Full Installation & Final Walkthrough",
                      description:
                        "Dust-controlled installation, fine adjustments, and full 10-year craft warranty.",
                    },
                  ]
            }
          />

          {/* 5. Static "Our Renovation Process" Timeline Section */}
          <ServiceRenovationProcess />

          {/* 6. Static "Why Choose Dwellora" Section with bestproject_1.jpg */}
          <ServiceWhyChooseDwellora />

          {/* 7. Static Material Showcase Section with Cinematic Video */}
          <ServiceMaterialShowcase />

          {/* 8. Up to Three Other Published Services (Omitted when none exist) */}
          {relatedServices.length > 0 && (
            <section
              aria-labelledby="related-services-heading"
              className="section-gap-top border-t border-border pt-6 sm:pt-8"
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
        </div>

        {/* 9. Full-Width Cinematic Video Consultation CTA Section */}
        <ServiceFinalCta />
      </main>

      <Footer />
    </>
  );
}