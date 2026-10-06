"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import BlogForm, {
  type BlogFormValues,
} from "@/components/admin/BlogForm";
import Loading from "@/components/common/Loading";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [initialValues, setInitialValues] = useState<BlogFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadBlog() {
      if (!id) return;

      try {
        setLoading(true);
        setLoadError("");
        const data = await apiFetch(`/api/blogs/${id}`);
        if (isMounted) {
          if (data.blog) {
            setInitialValues({
              title: data.blog.title || "",
              slug: data.blog.slug || "",
              shortDescription: data.blog.shortDescription || "",
              content: data.blog.content || "",
              coverImage: data.blog.coverImage || "",
              type: data.blog.type || "blog",
              videoUrl: data.blog.videoUrl || "",
              author: data.blog.author || "Dwellora Editorial Team",
              readTime: data.blog.readTime || "",
              status: data.blog.status || "published",
              seo: data.blog.seo || undefined,
            });
          } else {
            setLoadError("Blog post not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load blog post."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadBlog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleUpdateBlog(values: BlogFormValues) {
    if (!id) return;

    await apiFetch(`/api/blogs/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    showSuccess("Article updated successfully.");
    router.replace("/admin/blogs");
  }

  if (loading) {
    return <Loading text="Loading article details..." className="py-16" />;
  }

  if (loadError || !initialValues) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Article Not Found</h2>
        <p className="mt-2 text-sm text-muted">
          {loadError || "The requested article could not be loaded."}
        </p>
        <Link href="/admin/blogs" className="btn btn-secondary mt-6">
          Back to Blogs
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Edit Blog / Vlog
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Update article content, video details, publication status, and SEO metadata.
        </p>
      </div>

      <BlogForm
        initialValues={initialValues}
        onSubmit={handleUpdateBlog}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
      />
    </div>
  );
}
