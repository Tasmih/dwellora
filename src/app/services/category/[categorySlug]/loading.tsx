import Navbar from "@/components/Navbar";
import Loading from "@/components/common/Loading";

export default function CategoryDetailLoading() {
  return (
    <>
      <Navbar />
      <main className="site-container page-spacing">
        <Loading text="Loading service category..." size="lg" />
      </main>
    </>
  );
}
