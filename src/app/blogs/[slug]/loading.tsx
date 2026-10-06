import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function BlogDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl">
          <Loading text="Loading article..." size="lg" />
        </div>
      </main>
    </>
  );
}
