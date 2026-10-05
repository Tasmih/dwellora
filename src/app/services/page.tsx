import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: "published" | "unpublished";
};

export const metadata: Metadata = {
  title: "Our Services | Dwellora",
  description:
    "Explore Dwellora's home renovation and carpentry services, designed to create comfortable, practical and beautiful living spaces.",
};

async function getServices(): Promise<Service[]> {
  const response = await fetch(`${API_URL}/api/services`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load services.");
  }

  const data: { services: Service[] } = await response.json();

  return data.services.filter(
    (service) => service.status === "published"
  );
}

export default async function ServicesPage() {
  let services: Service[] = [];
  let failed = false;

  try {
    services = await getServices();
  } catch (error) {
    console.error("Failed to load public services:", error);
    failed = true;
  }

  return (
    <main className="site-container py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Renovation & Carpentry
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Our Services
        </h1>

        <p className="mt-4 text-base leading-7 text-muted">
          From thoughtful upgrades to complete transformations, explore
          how we can help create a home that works for you.
        </p>
      </div>

      {failed ? (
        <div
          role="alert"
          className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8"
        >
          <h2 className="text-xl font-semibold text-brand">
            Services are temporarily unavailable
          </h2>

          <p className="mt-3 text-base leading-7 text-muted">
            We could not load our services. Please try again shortly.
          </p>

          <a href="/services" className="btn btn-secondary mt-6">
            Try Again
          </a>
        </div>
      ) : services.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-brand">
            New services are on the way
          </h2>

          <p className="mt-3 text-base leading-7 text-muted">
            Our service information will be available here soon.
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service._id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface"
            >
              <Link
                href={`/services/${encodeURIComponent(service.slug)}`}
                aria-label={`View ${service.title}`}
                className="relative block aspect-[4/3] overflow-hidden bg-background"
              >
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </Link>

              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className="text-xl font-semibold tracking-tight text-brand">
                  <Link
                    href={`/services/${encodeURIComponent(service.slug)}`}
                    className="transition-colors hover:text-brand-hover"
                  >
                    {service.title}
                  </Link>
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
                  {service.description}
                </p>

                <div className="mt-auto pt-6">
                  <Link
                    href={`/services/${encodeURIComponent(service.slug)}`}
                    className="btn btn-secondary w-full"
                  >
                    View Service
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}