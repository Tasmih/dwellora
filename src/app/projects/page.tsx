import type { Metadata } from "next";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SafeImage from "@/components/SafeImage";
import PublicProjectCard, {
  type PublicProject,
} from "@/components/PublicProjectCard";
import { getSafeVideoSrc } from "@/lib/url";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const HERO_VIDEO =
  "https://res.cloudinary.com/rh4jhmw7/video/upload/v1791386216/home2.mp4";

const CTA_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791323224/el-s-uFXWhRfSe7A-unsplash.jpg";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export const metadata: Metadata = {
  title: "Featured Projects & Portfolio | Dwellora",
  description:
    "Explore Dwellora's portfolio of bespoke home renovations, architectural transformations, and custom carpentry projects.",
  openGraph: {
    title: "Featured Projects & Portfolio | Dwellora",
    description:
      "Explore Dwellora's portfolio of bespoke home renovations, architectural transformations, and custom carpentry projects.",
  },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

async function getProjects(categorySlug?: string): Promise<PublicProject[]> {
  const url = categorySlug
    ? `${API_URL}/api/projects?category=${encodeURIComponent(categorySlug)}`
    : `${API_URL}/api/projects`;

  const response = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("Failed to load projects.");
  }

  const data = await response.json();
  return data.projects || [];
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams;

  let projects: PublicProject[] = [];
  let categories: Category[] = [];
  let failed = false;

  try {
    [categories, projects] = await Promise.all([
      getCategories(),
      getProjects(selectedCategory),
    ]);
  } catch (error) {
    console.error("Failed to load public projects:", error);
    failed = true;
  }

  const currentCategoryObj = categories.find(
    (c) => c.slug === selectedCategory
  );

  return (
    <>
      <Navbar />

      <main id="main-content" className="w-full">
        {/* 1. Full-Width Cinematic Video Hero Section */}
        <section
          aria-labelledby="projects-hero-heading"
          className="relative w-full overflow-hidden bg-neutral-950 min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center border-b border-border/30"
        >
          {/* Background Autoplay Video */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="h-full w-full object-cover object-center scale-105"
            >
              <source src={getSafeVideoSrc(HERO_VIDEO)} type="video/mp4" />
            </video>

            {/* Directional gradient overlay: soft readability gradient on left, clear on right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 lg:from-black/85 lg:via-black/45 lg:to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/35" />
          </div>

          {/* Gold Rim Accents */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent z-10"
          />

          {/* Hero Content Layer */}
          <div className="site-container relative z-10 py-12 sm:py-14 lg:py-16">
            <div className="max-w-3xl text-center sm:text-left">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/50 px-4 py-1.5 backdrop-blur-md shadow-md">
                <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                  OUR PORTFOLIO
                </span>
              </div>

              {/* Main Heading */}
              <h1
                id="projects-hero-heading"
                className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-bold tracking-tight text-[#F8F5EE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] leading-[1.15] text-balance"
              >
                Spaces Designed With Detail, Built With Craftsmanship
              </h1>

              {/* Description */}
              <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] font-normal">
                Explore our completed renovation projects, custom interiors, and handcrafted solutions created to transform everyday living spaces.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
                <a
                  href="#projects-gallery"
                  className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base border border-accent inline-flex items-center justify-center gap-2.5"
                >
                  <span>View Projects</span>
                  <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-brand" />
                </a>

                <Link
                  href="/contact"
                  className="btn border border-white/60 bg-black/30 text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-medium inline-flex items-center justify-center shadow-md"
                >
                  <span>Start Your Project</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Main Portfolio Gallery & Filters Area */}
        <div id="projects-gallery" className="site-container pt-6 pb-10 sm:pt-8 sm:pb-12 scroll-mt-20">
          {/* Category Navigation Tabs & Count Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/80">
            {/* Category Filter Tabs */}
            {categories.length > 0 ? (
              <nav
                aria-label="Filter portfolio by category"
                className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
              >
                <Link
                  href="/projects"
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                    !selectedCategory
                      ? "bg-brand text-white border border-brand shadow-xs font-semibold"
                      : "border border-border/80 bg-surface/90 text-muted hover:border-brand/40 hover:text-brand"
                  }`}
                >
                  {!selectedCategory && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                  <span>All Projects</span>
                </Link>

                {categories.map((cat) => {
                  const active = selectedCategory === cat.slug;
                  return (
                    <Link
                      key={cat._id}
                      href={`/projects?category=${encodeURIComponent(cat.slug)}`}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium tracking-wide transition-all ${
                        active
                          ? "bg-brand text-white border border-brand shadow-xs font-semibold"
                          : "border border-border/80 bg-surface/90 text-muted hover:border-brand/40 hover:text-brand"
                      }`}
                    >
                      {active && <span className="h-1.5 w-1.5 rounded-full bg-accent" />}
                      <span>{cat.name}</span>
                    </Link>
                  );
                })}
              </nav>
            ) : (
              <div />
            )}

            {/* Project count indicator */}
            <div className="flex items-center gap-2 text-xs font-semibold text-brand self-start md:self-auto bg-surface border border-border/90 px-3.5 py-1.5 rounded-full shadow-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              <span>
                {projects.length > 0
                  ? `${projects.length} ${currentCategoryObj ? currentCategoryObj.name : "Featured"} Works`
                  : "Portfolio Archive"}
              </span>
            </div>
          </div>

          {/* Category Context Title if active */}
          {currentCategoryObj && (
            <div className="mt-6 mb-2">
              <h2 className="text-xl font-bold text-brand tracking-tight">
                {currentCategoryObj.name}
              </h2>
              {currentCategoryObj.description && (
                <p className="mt-1 text-sm text-muted max-w-2xl leading-relaxed">
                  {currentCategoryObj.description}
                </p>
              )}
            </div>
          )}

          {/* 3. Projects Grid Section */}
          <section className="mt-8" aria-label="Projects list">
            {failed ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
                <p className="font-medium">
                  Unable to load projects right now.
                </p>
                <p className="mt-1 text-sm">
                  Please ensure the server is running and try again.
                </p>
              </div>
            ) : projects.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
                <h3 className="text-lg font-semibold text-brand">
                  No projects found
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {selectedCategory
                    ? "There are no published projects in this category yet."
                    : "No projects have been published yet. Please check back soon."}
                </p>
                {selectedCategory && (
                  <Link
                    href="/projects"
                    className="btn btn-secondary mt-6 inline-flex"
                  >
                    View All Projects
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map((project) => (
                  <PublicProjectCard key={project._id || project.slug} project={project} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 4. Full-Width Cinematic CTA Section with Background Image */}
        <section
          aria-label="Start your renovation transformation"
          className="group relative w-full overflow-hidden bg-neutral-950 py-10 sm:py-12 lg:py-14 section-gap-top mb-6 sm:mb-8 lg:mb-10 text-center border-t border-b border-border/30 shadow-2xl"
        >
          {/* Background Image: Full Bleed from Left to Right */}
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
          >
            <SafeImage
              src={CTA_IMAGE}
              alt="Luxury home renovation consultation background"
              fill
              sizes="100vw"
              className="object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-105"
            />

            {/* Lighter cinematic overlay (35%-45%) so the image details are clearly visible */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/35 to-black/40 pointer-events-none" />
          </div>

          {/* Gold Rim Highlight */}
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10"
          />

          {/* Content Layer */}
          <div className="site-container relative z-10 mx-auto max-w-2xl px-4 sm:px-6">
            {/* Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-black/60 px-4 py-1.5 backdrop-blur-md shadow-md">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                START YOUR TRANSFORMATION
              </span>
            </div>

            {/* Heading */}
            <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-[1.2] text-balance">
              Have a Project in Mind for Your Home?
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] font-normal">
              Let&apos;s collaborate to design and build a space that perfectly aligns with your lifestyle and architectural aspirations.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base border border-accent inline-flex items-center justify-center gap-2"
              >
                <span>Book a Consultation</span>
                <FiArrowRight className="h-4 w-4 text-brand" />
              </Link>
              <Link
                href="/services"
                className="btn border border-white/60 bg-black/30 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-medium inline-flex items-center justify-center shadow-md"
              >
                <span>Explore Our Services</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
