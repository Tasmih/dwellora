import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
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
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          What We Do
        </p>

        <h2
          id="services-section-heading"
          className="section-title text-balance"
        >
          Crafted Renovation Services
        </h2>

        <p className="section-description text-balance">
          Specialized solutions designed to bring enduring warmth, function, and refined carpentry to every space.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.slice(0, 3).map((service) => (
          <PublicServiceCard
            key={service._id || service.slug}
            service={service}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/services"
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <span>View All Services</span>
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
