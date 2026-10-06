"use client";

import { useRouter } from "next/navigation";

import BlogForm, {
  type BlogFormValues,
} from "@/components/admin/BlogForm";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function CreateBlogPage() {
  const router = useRouter();

  async function handleCreateBlog(values: BlogFormValues) {
    await apiFetch("/api/blogs", {
      method: "POST",
      body: JSON.stringify(values),
    });

    showSuccess("Article created successfully.");
    router.replace("/admin/blogs");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Add Blog / Vlog
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Create an editorial journal, craft guide, or video transformation story.
        </p>
      </div>

      <BlogForm onSubmit={handleCreateBlog} />
    </div>
  );
}
