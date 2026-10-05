import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: "published" | "unpublished";
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

const getService = cache(async (slug: string): Promise<Service | null> => {
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
    throw new Error("Failed to load service.");
  }

  const data: { service: Service } = await response.json();

  return data.service;
});

function getSiteUrl() {
  const siteUrl = process.env.SITE_URL;

  if (siteUrl) {
    return siteUrl;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("SITE_URL is required in production.");
  }

  return "http://localhost:3000";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  const seo = service.seo;

  const title = seo?.metaTitle?.trim() || service.title;

  const description =
    seo?.metaDescription?.trim() ||
    service.description.trim().slice(0, 160);

  const ogTitle = seo?.ogTitle?.trim() || title;
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
    .map((keyword) => keyword.trim())
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

  return (
    <main className="site-container py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Our Service
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          {service.title}
        </h1>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-background">
          <Image
            src={service.image}
            alt={service.title}
            fill
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
          <p className="whitespace-pre-line text-base leading-7 text-muted">
            {service.description}
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">
            Get a Quote
          </Link>

          <Link href="/services" className="btn btn-secondary">
            Back to Services
          </Link>
        </div>
      </div>
    </main>
  );
}