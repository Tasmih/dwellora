import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

// Backend returns 404 for unpublished services, so they never show publicly
async function getService(slug: string) {
  const res = await fetch(`${API_URL}/api/services/slug/${slug}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.service;
}

// SEO: title, description and Open Graph come from the service data
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) return { title: "Service not found" };

  const description = service.description.slice(0, 160);

  return {
    title: service.title,
    description,
    openGraph: { title: service.title, description, images: [service.image] },
  };
}

export default async function ServiceDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  const service = await getService(slug);

  if (!service) notFound();

  return (
    <main className="site-container py-16">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">Our Service</p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">{service.title}</h1>

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
          <p className="whitespace-pre-line text-base leading-7 text-muted">{service.description}</p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="btn btn-primary">Get a Quote</Link>
          <Link href="/services" className="btn btn-secondary">Back to Services</Link>
        </div>
      </div>
    </main>
  );
}