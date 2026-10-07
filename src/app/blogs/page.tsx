import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BlogsClient from "./BlogsClient";
import Loading from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "Journal & Stories | Dwellora",
  description:
    "Explore architectural ideas, bespoke woodworking stories, renovation guides, and behind-the-scenes video tours from Dwellora.",
  openGraph: {
    title: "Journal & Stories | Dwellora",
    description:
      "Explore architectural ideas, bespoke woodworking stories, renovation guides, and behind-the-scenes video tours from Dwellora.",
  },
};

function BlogsFallback() {
  return (
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
  );
}

export default function BlogsPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={<BlogsFallback />}>
        <BlogsClient />
      </Suspense>
      <Footer />
    </>
  );
}
