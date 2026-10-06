import { Suspense } from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import ContactClient from "./ContactClient";
import Loading from "@/components/common/Loading";

export const metadata: Metadata = {
  title: "Contact & Consultations | Dwellora",
  description:
    "Get in touch with Dwellora for bespoke home renovations, architectural millwork, custom cabinetry, and master carpentry consultations.",
  openGraph: {
    title: "Contact & Consultations | Dwellora",
    description:
      "Get in touch with Dwellora for bespoke home renovations, architectural millwork, custom cabinetry, and master carpentry consultations.",
  },
};

function ContactFallback() {
  return (
    <main className="site-container page-spacing">
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          INQUIRIES &amp; CONSULTATIONS
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
          Transform Your Vision Into A Beautiful Living Space.
        </h1>
        <p className="mt-4 text-base leading-7 text-muted">
          From complete home renovations to bespoke carpentry and interior transformations, Dwellora brings thoughtful design, skilled craftsmanship, and personalised solutions to every project.
        </p>
      </div>

      <div className="mt-12">
        <Loading text="Loading contact form..." size="lg" />
      </div>
    </main>
  );
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Suspense fallback={<ContactFallback />}>
          <ContactClient />
        </Suspense>
      </main>
    </>
  );
}
