"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FiEdit2,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiUser,
  FiClock,
  FiVideo,
  FiFileText,
} from "react-icons/fi";
import SafeImage from "@/components/SafeImage";
import { apiFetch } from "@/lib/api";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

export type BlogType = "blog" | "vlog";
export type BlogStatus = "published" | "draft";

export type AdminBlog = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  coverImage?: string;
  type: BlogType;
  videoUrl?: string;
  author: string;
  readTime: string;
  status: BlogStatus;
  createdAt: string;
  updatedAt: string;
};

type BlogCardProps = {
  blog: AdminBlog;
  onDeleted: (id: string) => void;
  onStatusChange: (id: string, status: BlogStatus) => void;
};

export default function BlogCard({
  blog,
  onDeleted,
  onStatusChange,
}: BlogCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const published = blog.status === "published";
  const isVlog = blog.type === "vlog" || Boolean(blog.videoUrl);

  async function handleToggle() {
    const nextStatus: BlogStatus = published ? "draft" : "published";

    try {
      setToggling(true);
      await apiFetch(`/api/blogs/${blog._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange(blog._id, nextStatus);
      showSuccess(
        `Article status changed to ${nextStatus === "published" ? "Published" : "Draft"}.`
      );
    } catch (error) {
      showError(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    const confirmed = await confirmDelete(isVlog ? "vlog" : "blog post");

    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/blogs/${blog._id}`, { method: "DELETE" });
      onDeleted(blog._id);
      showSuccess("Article deleted successfully.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-background border border-border">
          {blog.coverImage ? (
            <>
              <SafeImage
                src={blog.coverImage}
                alt={blog.title}
                fallbackTitle={blog.title}
                fill
                sizes="112px"
                className="object-cover"
              />
              {isVlog && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white">
                  <FiVideo className="h-5 w-5 drop-shadow-md" />
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand/10 to-accent/10 p-2 text-center text-brand">
              <FiVideo className="h-6 w-6 text-accent" />
              <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted">
                Video Only
              </span>
            </div>
          )}
        </div>

        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                isVlog
                  ? "bg-purple-100 text-purple-800 border border-purple-200"
                  : "bg-blue-100 text-blue-800 border border-blue-200"
              }`}
            >
              {isVlog ? (
                <>
                  <FiVideo className="h-3 w-3" /> Vlog
                </>
              ) : (
                <>
                  <FiFileText className="h-3 w-3" /> Blog
                </>
              )}
            </span>

            <h3 className="text-lg font-semibold text-brand">{blog.title}</h3>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
            {blog.author && (
              <span className="inline-flex items-center gap-1">
                <FiUser className="h-3 w-3 text-accent" />
                {blog.author}
              </span>
            )}
            {blog.readTime && (
              <span className="inline-flex items-center gap-1">
                <FiClock className="h-3 w-3 text-accent" />
                {blog.readTime}
              </span>
            )}
            <span className="text-muted/60">
              /blogs/{blog.slug}
            </span>
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {blog.shortDescription || blog.content.slice(0, 140)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
        <span
          className={
            published
              ? "rounded-full bg-brand px-4 py-1.5 text-xs font-medium text-white"
              : "rounded-full bg-border px-4 py-1.5 text-xs font-medium text-muted"
          }
        >
          {blog.status}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            disabled={toggling}
            className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60"
          >
            {published ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            {toggling ? "Saving..." : published ? "Unpublish" : "Publish"}
          </button>

          <Link
            href={`/admin/blogs/${blog._id}/edit`}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60"
          >
            <FiTrash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
