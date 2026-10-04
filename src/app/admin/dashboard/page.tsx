export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="site-container py-12">

        <div className="rounded-2xl border border-border bg-surface p-8">

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Dwellora Administration
          </p>

          <h1 className="mt-3 text-3xl font-semibold text-brand">
            Dashboard
          </h1>

          <p className="mt-3 text-muted">
            Manage your services, projects and blogs from here.
          </p>


          <div className="mt-8 grid gap-5 sm:grid-cols-3">

            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold text-brand">
                Services
              </h2>
              <p className="mt-2 text-sm text-muted">
                Create and manage services
              </p>
            </div>


            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold text-brand">
                Projects
              </h2>
              <p className="mt-2 text-sm text-muted">
                Manage renovation projects
              </p>
            </div>


            <div className="rounded-xl border border-border p-5">
              <h2 className="font-semibold text-brand">
                Blogs
              </h2>
              <p className="mt-2 text-sm text-muted">
                Manage blogs and vlogs
              </p>
            </div>

          </div>

        </div>

      </div>
    </main>
  );
}