import { FiAward, FiFileText, FiLayers, FiCheckCircle } from "react-icons/fi";

export default function WhyChooseDwellora() {
  const pillars = [
    {
      title: "Expert Craftsmanship",
      description:
        "Every cut, joint, and finish is executed by seasoned master carpenters and interior artisans dedicated to architectural precision.",
      icon: FiAward,
      tag: "Master Joinery",
    },
    {
      title: "Transparent Process",
      description:
        "Clear itemized estimates, predictable project timelines, and proactive communication. No unexpected delays or hidden surcharges.",
      icon: FiFileText,
      tag: "Honest Delivery",
    },
    {
      title: "Premium Materials",
      description:
        "We selectively source high-grade architectural hardwoods, durable stone surfaces, and bespoke European hardware built to last.",
      icon: FiLayers,
      tag: "Enduring Quality",
    },
    {
      title: "Complete Renovation Solution",
      description:
        "From initial spatial concept and 3D modeling through demolition, cabinetry fabrication, and pristine final styling under one roof.",
      icon: FiCheckCircle,
      tag: "End-to-End",
    },
  ];

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="site-container section-spacing"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          The Dwellora Standard
        </p>
        <h2
          id="why-choose-heading"
          className="section-title text-balance"
        >
          Why Choose Dwellora
        </h2>
        <p className="section-description text-balance">
          We combine the thoughtful discipline of architectural planning with the warmth of handcrafted residential woodwork.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface p-7 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_12px_36px_rgba(25,53,50,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/15 text-accent transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted">
                    {pillar.tag}
                  </span>
                </div>

                <h3 className="mt-6 text-xl font-semibold tracking-tight text-brand">
                  {pillar.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-muted">
                  {pillar.description}
                </p>
              </div>

              <div className="mt-8 border-t border-border/60 pt-4 text-xs font-medium text-accent">
                Refined Residential Standards
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
