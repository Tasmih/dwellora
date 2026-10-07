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
    (service.description.length > 150
      ? `${service.description.slice(0, 150).trim()}...`
      : service.description);

  const href = `/services/${encodeURIComponent(service.slug)}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-[0_4px_20px_rgba(25,53,50,0.03)] transition-all duration-500 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_16px_40px_rgba(25,53,50,0.09)]">
      {/* Image Container with category tag */}
      <Link
        href={href}
        aria-label={`Explore ${service.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-brand/5"
      >
        <SafeImage
          src={service.image}
          alt={service.title}
          fallbackTitle={service.title}
          fill
          thumbnailWidth={800}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
        />

        {service.category && (
          <span className="absolute top-3.5 left-3.5 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-brand shadow-sm backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            <span>{service.category.name}</span>
          </span>
        )}
      </Link>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-6 sm:p-7 justify-between">
        <div>
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-brand transition-colors group-hover:text-brand">
            <Link href={href} className="hover:text-accent transition-colors">
              {service.title}
            </Link>
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted font-normal">
            {summary}
          </p>
        </div>

        {/* Action button */}
        <div className="mt-6 pt-5 border-t border-border/60">
          <Link
            href={href}
            className="inline-flex min-h-11 w-full items-center justify-between rounded-xl border border-border bg-background/60 px-5 py-2.5 text-xs sm:text-sm font-semibold text-brand transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white group-hover:shadow-md"
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
              className="transition-transform duration-300 group-hover:translate-x-1.5 text-accent group-hover:text-accent"
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
