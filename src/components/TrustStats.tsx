import { FiTool, FiHome, FiAward, FiShield } from "react-icons/fi";

type TrustStatsProps = {
  servicesCount: number;
  projectsCount: number;
};

export default function TrustStats({
  servicesCount,
  projectsCount,
}: TrustStatsProps) {
  const stats = [
    {
      label: "Bespoke Services",
      value: servicesCount > 0 ? `${servicesCount}+` : "12+",
      description: "Custom carpentry & interior renovation offerings",
      icon: FiTool,
    },
    {
      label: "Completed Works",
      value: projectsCount > 0 ? `${projectsCount}+` : "25+",
      description: "Architectural residential transformations",
      icon: FiHome,
    },
    {
      label: "Master Joinery",
      value: "100%",
      description: "Custom built with hand-finished precision",
      icon: FiAward,
    },
    {
      label: "Craft Warranty",
      value: "10-Year",
      description: "Comprehensive warranty on all bespoke woodwork",
      icon: FiShield,
    },
  ];

  return (
    <section
      aria-labelledby="trust-stats-heading"
      className="site-container relative -mt-6 sm:-mt-10 lg:-mt-12 z-20"
    >
      <h2 id="trust-stats-heading" className="sr-only">
        Dwellora Highlights &amp; Track Record
      </h2>

      <div className="rounded-3xl border border-border/90 bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_12px_40px_rgba(25,53,50,0.06)]">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-border/70">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col justify-between ${
                  idx === 0 ? "pt-0 sm:pt-0" : "pt-6 sm:pt-0 sm:pl-6 lg:pl-8"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent shrink-0">
                    <Icon className="h-5 w-5 stroke-[1.8]" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
                    {stat.label}
                  </span>
                </div>

                <div className="mt-4">
                  <p className="text-3xl font-bold tracking-tight text-brand sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
