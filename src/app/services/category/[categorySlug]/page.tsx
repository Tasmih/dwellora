import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

import Navbar from "@/components/Navbar";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";
import SafeImage from "@/components/SafeImage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ categorySlug: string }>;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  status: "published" | "unpublished";
};

function getSiteUrl() {
  return process.env.SITE_URL || "http://localhost:3000";
}

const getCategory = cache(
  async (slug: string): Promise<Category | null> => {
    const response = await fetch(
      `${API_URL}/api/categories/slug/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to load category (status: ${response.status}).`
      );
    }

    const data = await response.json();
    return data.category;
  }
);

async function getCategoryServices(
  categorySlug: string
): Promise<PublicService[]> {
  const response = await fetch(
    `${API_URL}/api/services?category=${encodeURIComponent(categorySlug)}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load category services.");
  }

  const data = await response.json();
  return data.services || [];
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    return {
      title: "Category Not Found | Dwellora",
      description: "The requested category could not be found.",
    };
  }

  const title = `${category.name} | Dwellora`;
  const description = category.description.slice(0, 160);
  const canonicalUrl = new URL(
    `/services/category/${encodeURIComponent(category.slug)}`,
    getSiteUrl()
  ).toString();

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      siteName: "Dwellora",
      title,
      description,
      url: canonicalUrl,
      images: category.image ? [{ url: category.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: category.image ? [category.image] : undefined,
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  const category = await getCategory(categorySlug);

  if (!category) {
    notFound();
  }

  const services = await getCategoryServices(category.slug);

  return (
    <>
      <Navbar />

      <main className="site-container pt-2 pb-12 sm:pt-3 sm:pb-16 lg:pt-3 lg:pb-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-3 sm:mb-4 lg:mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-sm font-normal text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
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
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li aria-current="page" className="font-medium text-brand truncate max-w-xs sm:max-w-md">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Category Hero */}
        <div
          className={`grid items-center gap-8 lg:gap-12 ${
            category.image ? "lg:grid-cols-2" : "max-w-3xl"
          }`}
        >
          {/* Left Content */}
          <div
            className={
              category.image
                ? "min-w-0 flex flex-col justify-center"
                : "max-w-3xl"
            }
          >
            <p className="text-xs lg:text-sm font-medium uppercase tracking-[0.25em] text-accent">
              Service Category
            </p>

            <h1 className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1] text-brand max-w-2xl">
              {category.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-muted sm:text-lg sm:leading-8 max-w-xl">
              {category.description}
            </p>

            <div className="mt-6">
              <Link
                href="/services"
                className="btn btn-secondary text-xs sm:text-sm"
              >
                &larr; View All Services
              </Link>
            </div>
          </div>

          {/* Right Image */}
          {category.image && (
            <div className="min-w-0 w-full">
              <div className="relative h-[300px] sm:h-[360px] lg:h-[420px] w-full overflow-hidden bg-surface">
                <SafeImage
                  src={category.image}
                  alt={category.name}
                  fallbackTitle={category.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>

        {/* Services in this category */}
        <section
          aria-labelledby="category-services-heading"
          className="mt-10 sm:mt-12 border-t border-border pt-8 sm:pt-10"
        >
          <div className="flex items-center justify-between pb-6">
            <h2
              id="category-services-heading"
              className="text-xl font-semibold text-brand"
            >
              {category.name} Offerings ({services.length})
            </h2>

            <Link
              href="/services"
              className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
            >
              All Categories &rarr;
            </Link>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface p-8 sm:p-12 text-center max-w-xl mx-auto my-8">
              <h3 className="text-lg font-semibold text-brand">
                No services currently published in this category
              </h3>
              <p className="mt-2 text-sm text-muted">
                Our bespoke services for {category.name} are being updated. In the meantime, explore all other available services.
              </p>
              <div className="mt-6">
                <Link href="/services" className="btn btn-secondary">
                  Browse All Services
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <PublicServiceCard
                  key={service._id || service.slug}
                  service={service}
                />
              ))}
            </div>
          )}
        </section>

        {/* Consultation Section */}
        <section
          aria-labelledby="category-consultation-heading"
          className="mt-20 rounded-3xl bg-brand p-8 text-background sm:p-12 lg:mt-28 lg:p-16"
        >
          <div className="mx-auto max-w-full text-center">
            <p className="text-sm md:text-base lg:text-lg font-semibold uppercase tracking-[0.2em] text-accent">
              {category.name}
            </p>

            <h2
              id="category-consultation-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl xl:text-4xl text-balance xl:whitespace-nowrap"
            >
              Ready to start your {category.name.toLowerCase()} project?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/80">
              Speak directly with our team to discuss project scopes, timelines and bespoke finishes tailored to your home.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href={`mailto:info@dwellora.com?subject=Consultation%20Inquiry%20-%20${encodeURIComponent(
                  category.name
                )}`}
                className="btn btn-primary w-full sm:w-auto"
              >
                Request a Consultation
              </a>

              <Link
                href="/services"
                className="btn btn-outline-light w-full sm:w-auto"
              >
                Explore All Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
