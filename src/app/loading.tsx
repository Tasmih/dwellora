import Loading from "@/components/common/Loading";

export default function RootLoading() {
  return (
    <div className="site-container flex min-h-[50vh] items-center justify-center py-20">
      <Loading text="Loading Dwellora..." size="lg" />
    </div>
  );
}
