import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function BlogDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <div className="mx-auto max-w-3xl">
          <Loading text="Loading article..." size="lg" />
        </div>
      </main>
    </>
  );
}
