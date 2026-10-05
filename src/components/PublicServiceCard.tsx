import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export type PublicService = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  image: string;
  category?: {
    _id?: string;
    name: string;
    slug: string;
  };
};

type PublicServiceCardProps = {
  service: PublicService;
};

export default function PublicServiceCard({ service }: PublicServiceCardProps) {
  const summary =
    service.shortDescription?.trim() ||
    (service.description.length > 160
      ? `${service.description.slice(0, 160).trim()}...`
      : service.description);

  const href = `/services/${encodeURIComponent(service.slug)}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg">
      <Link
        href={href}
        aria-label={`Explore ${service.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-background"
      >
        <SafeImage
          src={service.image}
          alt={service.title}
          fallbackTitle={service.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
      </Link>

      <div className="flex flex-1 flex-col p-6">
        {service.category && (
          <div className="mb-2">
            <Link
              href={`/services/category/${encodeURIComponent(
                service.category.slug
              )}`}
              className="inline-block text-[11px] font-semibold uppercase tracking-wider text-accent transition-colors hover:text-accent-hover"
            >
              {service.category.name}
            </Link>
          </div>
        )}

        <h3 className="text-xl font-semibold tracking-tight text-brand">
          <Link href={href} className="transition-colors hover:text-brand-hover">
            {service.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
          {summary}
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={href}
            className="btn btn-secondary inline-flex w-full items-center justify-between group/btn hover:border-brand"
          >
            <span>Explore Service</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden="true"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
