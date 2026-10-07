"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiVideo, FiFileText, FiArrowRight, FiPlay } from "react-icons/fi";

import PublicBlogCard, {
  type PublicBlog,
} from "@/components/PublicBlogCard";
import Loading from "@/components/common/Loading";
import SafeImage from "@/components/SafeImage";
import { apiFetch } from "@/lib/api";

const HERO_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791395132/Premium_Wardrobe_Storage_Solution.jpg";

const CTA_IMAGE =
  "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791386789/home4.jpg";

export default function BlogsClient() {
  const searchParams = useSearchParams();
  const formatQuery = searchParams.get("type");
  const initialType: "all" | "blog" | "vlog" =
    formatQuery === "blog" || formatQuery === "vlog" ? formatQuery : "all";

  const [blogs, setBlogs] = useState<PublicBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<"all" | "blog" | "vlog">(initialType);
  const [search, setSearch] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicBlogs() {
      try {
        setLoading(true);
        setError(null);

        const data = await apiFetch("/api/blogs");

        if (isMounted) {
          setBlogs(data.blogs || []);
        }
      } catch (err) {
        console.error("Failed to load public blogs:", err);
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load articles."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPublicBlogs();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const filteredBlogs = blogs.filter((blog) => {
    if (activeType !== "all" && blog.type !== activeType) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      const matchTitle = blog.title.toLowerCase().includes(q);
      const matchAuthor = blog.author?.toLowerCase().includes(q);
      const matchDesc = blog.shortDescription?.toLowerCase().includes(q);
      const matchContent = blog.content?.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchDesc || matchContent;
    }
    return true;
  });

  const scrollToSection = (type?: "all" | "blog" | "vlog") => {
    if (type) setActiveType(type);
    const element = document.getElementById("blogs-section");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main id="main-content" className="w-full">
      {/* 1. Full-Width Cinematic Hero Section */}
      <section
        aria-labelledby="blogs-hero-heading"
        className="relative w-full overflow-hidden bg-neutral-950 min-h-[480px] sm:min-h-[520px] lg:min-h-[580px] flex items-center justify-center border-b border-border/30"
      >
        {/* Background Static Hero Image */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <SafeImage
            src={HERO_IMAGE}
            alt="Dwellora Articles, Guides & Renovation Insights"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center scale-105"
          />

          {/* Directional light gradient overlay: soft readability on left, clear on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/20 lg:from-black/75 lg:via-black/35 lg:to-black/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
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
                INSIGHTS &amp; INSPIRATION
              </span>
            </div>

            {/* Main Heading */}
            <h1
              id="blogs-hero-heading"
              className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl xl:text-[54px] font-bold tracking-tight text-[#F8F5EE] drop-shadow-[0_2px_14px_rgba(0,0,0,0.8)] leading-[1.15] text-balance"
            >
              Ideas, Stories &amp; Inspiration For Beautiful Living Spaces
            </h1>

            {/* Description */}
            <p className="mt-4 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#EDE8DF] drop-shadow-[0_1px_8px_rgba(0,0,0,0.7)] font-normal">
              Explore renovation guides, design ideas, craftsmanship stories, and home transformation journeys from Dwellora.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => scrollToSection("all")}
                className="group btn bg-accent text-brand font-semibold shadow-xl hover:bg-white hover:text-brand hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base border border-accent inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Explore Blogs</span>
                <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5 text-brand" />
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("vlog")}
                className="btn border border-white/60 bg-black/30 text-[#F8F5EE] backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-medium inline-flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <FiPlay className="h-4 w-4 text-accent fill-accent" />
                <span>Watch Vlogs</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Blog & Vlog Listing Area */}
      <div id="blogs-section" className="site-container pt-6 pb-10 sm:pt-8 sm:pb-12 scroll-mt-20">
        {/* Filter Tabs & Search Bar */}
        <div className="flex flex-col gap-4 border-b border-border/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Format Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveType("all")}
              className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeType === "all"
                  ? "bg-brand text-white shadow-sm border border-brand"
                  : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
              }`}
            >
              All Stories ({blogs.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveType("blog")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeType === "blog"
                  ? "bg-brand text-white shadow-sm border border-brand"
                  : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
              }`}
            >
              <FiFileText className="h-3.5 w-3.5" />
              Articles ({blogs.filter((b) => b.type === "blog").length})
            </button>

            <button
              type="button"
              onClick={() => setActiveType("vlog")}
              className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all cursor-pointer ${
                activeType === "vlog"
                  ? "bg-brand text-white shadow-sm border border-brand"
                  : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
              }`}
            >
              <FiVideo className="h-3.5 w-3.5" />
              Video Tours ({blogs.filter((b) => b.type === "vlog").length})
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stories..."
              className="form-input w-full pl-10 text-xs sm:text-sm rounded-full"
            />
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="mt-12">
            <Loading text="Loading journal & stories..." size="lg" />
          </div>
        ) : error ? (
          <div
            role="alert"
            className="mt-10 rounded-2xl border border-red-200 bg-surface p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm"
          >
            <h2 className="text-xl font-semibold text-brand">
              Articles are temporarily unavailable
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              {error}
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((c) => c + 1)}
              className="btn btn-secondary mt-6"
            >
              Try Again
            </button>
          </div>
        ) : blogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-border bg-surface p-12 text-center max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-brand">
              New Stories Coming Soon
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              We are currently crafting new articles and project transformation videos. Please check back shortly.
            </p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-border bg-surface p-12 text-center max-w-xl mx-auto">
            <h2 className="text-xl font-semibold text-brand">
              No Stories Found
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              No articles match your search or selected filter. Try clearing the search or switching formats.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveType("all");
              }}
              className="btn btn-secondary mt-6"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {(() => {
              // Strictly limit video playback to top 2 featured vlogs to maximize performance
              const featuredVlogIds = new Set(
                blogs
                  .filter((b) => b.type === "vlog" && b.videoUrl?.trim())
                  .slice(0, 2)
                  .map((b) => b._id || b.slug)
              );

              return filteredBlogs.map((blog, idx) => (
                <PublicBlogCard
                  key={blog._id || blog.slug}
                  blog={blog}
                  enableVideo={featuredVlogIds.has(blog._id || blog.slug)}
                  className="animate-fade-up"
                  style={{ animationDelay: `${idx * 60}ms` }}
                />
              ));
            })()}
          </div>
        )}
      </div>

      {/* 3. Existing Bottom CTA Section with Full-Width home4.jpg Background */}
      <section
        aria-label="Connect with our artisans"
        className="group relative w-full overflow-hidden bg-neutral-950 py-10 sm:py-12 lg:py-14 section-gap-top mb-6 sm:mb-8 lg:mb-10 text-center border-t border-b border-border/30 shadow-2xl"
      >
        {/* Background Image: Full Bleed from Left to Right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        >
          <SafeImage
            src={CTA_IMAGE}
            alt="Dwellora luxury living space and carpentry craftsmanship"
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
              CONNECT WITH OUR ARTISANS
            </span>
          </div>

          {/* Heading */}
          <h2 className="mt-4 text-2xl sm:text-3xl lg:text-4xl xl:text-[42px] font-bold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-[1.2] text-balance">
            Inspired by what you&apos;ve seen?
          </h2>

          {/* Description */}
          <p className="mt-4 text-sm sm:text-base lg:text-lg leading-relaxed text-neutral-200 drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)] font-normal">
            Let&apos;s bring the same level of craftsmanship and intentional design into your living space.
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
              href="/projects"
              className="btn border border-white/60 bg-black/30 text-white backdrop-blur-sm hover:border-white hover:bg-white hover:text-brand hover:scale-105 transition-all duration-300 w-full sm:w-auto px-7 py-3.5 text-sm sm:text-base font-medium inline-flex items-center justify-center shadow-md"
            >
              <span>Explore Our Portfolio</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

