"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Status = "published" | "unpublished";

export type CategoryCardProps = {
  category: {
    _id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    displayOrder?: number;
    status: Status;
  };
  onDeleted: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
};

export default function CategoryCard({
  category,
  onDeleted,
  onStatusChange,
}: CategoryCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const published = category.status === "published";

  async function handleToggle() {
    const nextStatus: Status = published ? "unpublished" : "published";

    try {
      setToggling(true);
      await apiFetch(`/api/categories/${category._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange(category._id, nextStatus);
      showSuccess(
        `Category ${nextStatus === "published" ? "published" : "unpublished"} successfully.`
      );
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Status update failed"
      );
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    const confirmed = await confirmDelete("category");
    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/categories/${category._id}`, {
        method: "DELETE",
      });
      onDeleted(category._id);
      showSuccess("Category deleted successfully.");
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
          {category.image ? (
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-muted">
              No image
            </div>
          )}
        </div>

        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2.5">
            <h3 className="text-lg font-semibold text-brand">
              {category.name}
            </h3>
            <span className="text-xs text-muted font-mono bg-background px-2 py-0.5 rounded border border-border">
              /services/category/{category.slug}
            </span>
            {typeof category.displayOrder === "number" && (
              <span className="text-xs font-semibold text-brand bg-accent/20 px-2 py-0.5 rounded border border-accent/40">
                Order #{category.displayOrder}
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">
            {category.description}
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
          {category.status}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60"
          >
            {published ? (
              <FiEyeOff className="h-4 w-4" />
            ) : (
              <FiEye className="h-4 w-4" />
            )}
            {toggling ? "Saving..." : published ? "Unpublish" : "Publish"}
          </button>

          <Link
            href={`/admin/categories/${category._id}/edit`}
            className="btn btn-secondary inline-flex items-center gap-2"
          >
            <FiEdit2 className="h-4 w-4" />
            Edit
          </Link>

          <button
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
