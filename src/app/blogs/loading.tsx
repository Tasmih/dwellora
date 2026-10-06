import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function BlogsLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Journal &amp; Editorial
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            Craft, Design &amp; Living
          </h1>
          <p className="mt-4 text-base leading-7 text-muted">
            Explore architectural ideas, bespoke woodworking stories, renovation guides, and behind-the-scenes video tours from the Dwellora team.
          </p>
        </div>

        <div className="mt-12">
          <Loading text="Loading journal & stories..." size="lg" />
        </div>
      </main>
    </>
  );
}
