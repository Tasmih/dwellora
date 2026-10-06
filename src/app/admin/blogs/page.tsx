"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import BlogCard, {
  type AdminBlog,
  type BlogStatus,
  type BlogType,
} from "@/components/admin/BlogCard";
import BlogHeader from "@/components/admin/BlogHeader";
import Loading from "@/components/common/Loading";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<AdminBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | BlogType>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | BlogStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchBlogs() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/blogs/admin");

        if (isMounted) {
          setBlogs(data.blogs || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load blogs."
          );
        }
        console.error("Failed to load blogs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(id: string) {
    setBlogs((current) => current.filter((item) => item._id !== id));
  }

  function handleStatusChange(id: string, status: BlogStatus) {
    setBlogs((current) =>
      current.map((item) => (item._id === id ? { ...item, status } : item))
    );
  }

  const filteredBlogs = blogs.filter((blog) => {
    if (typeFilter !== "all" && blog.type !== typeFilter) {
      return false;
    }
    if (statusFilter !== "all" && blog.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = blog.title.toLowerCase().includes(q);
      const matchAuthor = blog.author?.toLowerCase().includes(q);
      const matchSlug = blog.slug.toLowerCase().includes(q);
      const matchDesc = blog.shortDescription?.toLowerCase().includes(q);
      return matchTitle || matchAuthor || matchSlug || matchDesc;
    }
    return true;
  });

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <BlogHeader />

        {/* Filter and Search Controls */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles by title, author, or slug..."
              className="form-input w-full pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Format Filter */}
            <div className="flex rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  typeFilter === "all"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("blog")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  typeFilter === "blog"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                Blogs
              </button>
              <button
                type="button"
                onClick={() => setTypeFilter("vlog")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  typeFilter === "vlog"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                Vlogs
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex rounded-xl border border-border bg-surface p-1">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === "all"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                All Status
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("published")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === "published"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                Published
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter("draft")}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  statusFilter === "draft"
                    ? "bg-brand text-white shadow-sm"
                    : "text-muted hover:text-brand"
                }`}
              >
                Drafts
              </button>
            </div>
          </div>
        </div>

        {/* Listing Container */}
        <section className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface">
          {loading ? (
            <Loading
              text="Loading blog articles..."
              className="border-0 bg-transparent py-16"
            />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No articles found. Click &quot;Add Blog / Vlog&quot; to publish your first post.
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No articles match the selected filters.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredBlogs.map((blog) => (
                <BlogCard
                  key={blog._id}
                  blog={blog}
                  onDeleted={handleDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
