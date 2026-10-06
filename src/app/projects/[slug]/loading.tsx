import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function ProjectDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container py-12 sm:py-16 lg:py-20">
        <Loading text="Loading project details..." size="lg" />
      </main>
    </>
  );
}
