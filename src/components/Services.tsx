import Link from "next/link";
import PublicServiceCard, {
  type PublicService,
} from "@/components/PublicServiceCard";

type ServicesSectionProps = {
  services: PublicService[];
};

export default function ServicesSection({ services }: ServicesSectionProps) {
  if (!services || services.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="services-section-heading"
      className="site-container section-spacing"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            What We Do
          </p>

          <h2
            id="services-section-heading"
            className="mt-2 text-3xl font-semibold tracking-tight text-brand sm:text-4xl"
          >
            Crafted Renovation Services
          </h2>

          <p className="mt-3 text-base leading-7 text-muted">
            Specialized solutions designed to bring enduring warmth, function, and refined carpentry to every space.
          </p>
        </div>

        <Link
          href="/services"
          className="btn btn-secondary inline-flex self-start text-xs sm:self-auto"
        >
          View All Services &rarr;
        </Link>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <PublicServiceCard
            key={service._id || service.slug}
            service={service}
          />
        ))}
      </div>
    </section>
  );
}
