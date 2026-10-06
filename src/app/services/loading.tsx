import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function ServicesLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Renovation &amp; Carpentry
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            From thoughtful kitchen and bathroom transformations to bespoke cabinetry, explore how our craft and attention to detail elevate every corner of your home.
          </p>
        </div>

        <div className="mt-12">
          <Loading text="Loading bespoke services..." size="lg" />
        </div>
      </main>
    </>
  );
}
