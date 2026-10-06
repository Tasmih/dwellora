import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function ProjectsLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container py-12 sm:py-16 lg:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Portfolio &amp; Case Studies
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            Our Completed Projects
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Explore our curated portfolio of residential transformations, from bespoke kitchen remodels to whole-home architectural carpentry.
          </p>
        </div>

        <div className="mt-12">
          <Loading text="Loading portfolio projects..." size="lg" />
        </div>
      </main>
    </>
  );
}
