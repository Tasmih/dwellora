export default function AdminDashboardPage() {
  const dashboardCards = [
    {
      title: "Services",
      description: "Create and manage services",
      href: "/admin/services",
    },
    {
      title: "Service Categories",
      description: "Organize services into categories",
      href: "/admin/categories",
    },
    {
      title: "Projects",
      description: "Manage renovation projects",
      href: "/admin/projects",
    },
    {
      title: "Blogs",
      description: "Manage blogs and vlogs",
      href: "/admin/blogs",
    },
  ];

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Dwellora Administration
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Dashboard
          </h1>

          <p className="mt-3 max-w-xl text-base text-muted">
            Manage your services, projects and blogs from here.
          </p>


          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {dashboardCards.map((card) => (
             <a
             key={card.href}
             href={card.href}
             className="rounded-2xl border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-1 hover:border-accent hover:bg-accent/5"
>

              <h2 className="text-lg font-semibold text-brand">
                 {card.title}
              </h2>

                <p className="mt-2 text-sm text-muted">
                  {card.description}
                </p>

              </a>
            ))}

          </div>

        </section>
      </div>
    </main>
  );
}