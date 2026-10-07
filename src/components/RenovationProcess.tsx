import { FiMessageSquare, FiCompass, FiTool, FiKey } from "react-icons/fi";

export default function RenovationProcess() {
  const steps = [
    {
      number: "01",
      title: "Consultation",
      subtitle: "Vision & Spatial Assessment",
      description:
        "We discuss your lifestyle, aesthetic goals, functional challenges, and budget during an in-depth spatial review.",
      icon: FiMessageSquare,
    },
    {
      number: "02",
      title: "Design & Planning",
      subtitle: "3D Visuals & Material Selection",
      description:
        "Our team produces comprehensive drawings, curated finish palettes, and an itemized fixed-scope estimate.",
      icon: FiCompass,
    },
    {
      number: "03",
      title: "Construction",
      subtitle: "Master Joinery & Installation",
      description:
        "Skilled craftsmen manage on-site demolition, structural refinements, and custom cabinetry installation with rigorous quality control.",
      icon: FiTool,
    },
    {
      number: "04",
      title: "Final Handover",
      subtitle: "Inspection & Warranty Care",
      description:
        "We conduct a thorough final walkthrough, ensure pristine details, and provide full 10-year craft warranty documentation.",
      icon: FiKey,
    },
  ];

  return (
    <section
      aria-labelledby="process-heading"
      className="site-container section-spacing"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          Structured Execution
        </p>
        <h2
          id="process-heading"
          className="section-title text-balance"
        >
          Our Renovation Process
        </h2>
        <p className="section-description text-balance">
          A predictable, transparent journey designed to turn complex home renovations into an enjoyable transformation.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 relative">
        {/* Desktop Connector Line */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 -translate-y-6 bg-gradient-to-r from-accent/20 via-accent/40 to-accent/20 z-0"
        />

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between rounded-3xl border border-border bg-surface p-7 sm:p-8 shadow-[0_4px_24px_rgba(25,53,50,0.03)] transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/60 hover:shadow-[0_12px_36px_rgba(25,53,50,0.08)]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-accent transition-transform duration-300 group-hover:scale-110 shadow-sm">
                      <Icon className="h-6 w-6 stroke-[1.8]" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight text-accent/80 font-mono">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-6 text-xl font-semibold tracking-tight text-brand">
                    {step.title}
                  </h3>

                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-accent">
                    {step.subtitle}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-border/60 pt-4 flex items-center gap-2 text-xs font-medium text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Phase {step.number} Milestones</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
