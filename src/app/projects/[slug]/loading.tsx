import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function ProjectDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <Loading text="Loading project details..." size="lg" />
      </main>
    </>
  );
}
