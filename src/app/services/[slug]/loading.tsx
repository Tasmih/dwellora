import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function ServiceDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <Loading text="Loading service details..." size="lg" />
      </main>
    </>
  );
}
