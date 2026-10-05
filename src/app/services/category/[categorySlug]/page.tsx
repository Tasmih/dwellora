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

      <main className="site-container py-8 sm:py-12 lg:py-16">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-xs text-muted">
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
            <li aria-current="page" className="font-medium text-brand">
              {category.name}
            </li>
          </ol>
        </nav>

        {/* Category Header */}
        <div
          className={`grid gap-8 items-center ${
            category.image ? "lg:grid-cols-12" : ""
          }`}
        >
          <div className={category.image ? "lg:col-span-7" : "max-w-3xl"}>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Service Category
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
              {category.name}
            </h1>

            <p className="mt-4 text-base leading-7 text-muted sm:text-lg">
              {category.description}
            </p>

            <div className="mt-6 flex items-center gap-3">
              <Link href="/services" className="btn btn-secondary text-xs">
                &larr; View All Services
              </Link>
            </div>
          </div>

          {category.image && (
            <div className="lg:col-span-5">
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-border bg-background shadow-md">
                <SafeImage
                  src={category.image}
                  alt={category.name}
                  fallbackTitle={category.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 42vw, 100vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
          )}
        </div>

        {/* Services in this category */}
        <section
          aria-labelledby="category-services-heading"
          className="mt-14 border-t border-border pt-12"
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
          className="mt-20 overflow-hidden rounded-3xl bg-brand p-8 text-background sm:p-12 lg:mt-28 lg:p-16"
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              {category.name}
            </p>

            <h2
              id="category-consultation-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl"
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
