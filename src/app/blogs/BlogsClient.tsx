"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiSearch, FiVideo, FiFileText } from "react-icons/fi";

import PublicBlogCard, {
  type PublicBlog,
} from "@/components/PublicBlogCard";
import Loading from "@/components/common/Loading";
import { apiFetch } from "@/lib/api";

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

  return (
    <main className="site-container py-12 sm:py-16 lg:py-20">
      {/* Page Introduction */}
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

      {/* Filter Tabs & Search Bar */}
      <div className="mt-10 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        {/* Format Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveType("all")}
            className={`rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all ${
              activeType === "all"
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            All Stories ({blogs.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveType("blog")}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all ${
              activeType === "blog"
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            <FiFileText className="h-3.5 w-3.5" />
            Articles (
            {blogs.filter((b) => b.type === "blog").length})
          </button>

          <button
            type="button"
            onClick={() => setActiveType("vlog")}
            className={`inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide transition-all ${
              activeType === "vlog"
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-surface text-muted hover:border-brand hover:text-brand"
            }`}
          >
            <FiVideo className="h-3.5 w-3.5" />
            Video Tours (
            {blogs.filter((b) => b.type === "vlog").length})
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
          {filteredBlogs.map((blog, idx) => (
            <PublicBlogCard
              key={blog._id || blog.slug}
              blog={blog}
              className="animate-fade-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            />
          ))}
        </div>
      )}

      {/* Bottom CTA Banner */}
      <section className="mt-20 overflow-hidden rounded-3xl bg-brand p-8 text-background sm:p-12 lg:mt-28 lg:p-16 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Connect With Our Artisans
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl">
            Inspired by what you&apos;ve seen?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/80">
            Let&apos;s bring the same level of craftsmanship and intentional design into your living space.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">
              Book a Consultation
            </Link>
            <Link href="/projects" className="btn btn-outline-light">
              Explore Our Portfolio
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
