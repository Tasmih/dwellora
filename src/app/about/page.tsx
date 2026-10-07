import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutClient from "./AboutClient";
import Loading from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "About Us | Dwellora",
  description:
    "Learn about Dwellora's dedication to architectural home renovations, bespoke master joinery, and tailored residential transformations in Dhaka, Bangladesh.",
  openGraph: {
    title: "About Us | Dwellora",
    description:
      "Learn about Dwellora's dedication to architectural home renovations, bespoke master joinery, and tailored residential transformations in Dhaka, Bangladesh.",
  },
};

function AboutFallback() {
  return (
    <main className="site-container page-spacing">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          ABOUT DWELLORA
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
          Thoughtfully Crafted Spaces. Built With Purpose.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          Loading Dwellora story, vision, and team details...
        </p>
      </div>

      <div className="mt-12">
        <Loading text="Loading about Dwellora..." size="lg" />
      </div>
    </main>
  );
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<AboutFallback />}>
          <AboutClient />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
