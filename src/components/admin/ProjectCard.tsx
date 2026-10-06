"use client";

import Link from "next/link";
import { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiMapPin, FiTrash2, FiUser, FiCalendar } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

import { apiFetch } from "@/lib/api";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Status = "published" | "unpublished";

export type AdminProject = {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  client?: string;
  location?: string;
  year?: string;
  status: Status;
  category?: {
    _id: string;
    name: string;
    slug: string;
    status?: string;
  };
};

type ProjectCardProps = {
  project: AdminProject;
  onDeleted: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
};

// One row in the admin projects list: image, metadata, status and actions
export default function ProjectCard({
  project,
  onDeleted,
  onStatusChange,
}: ProjectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const published = project.status === "published";

  // Publish / unpublish: updates status in database, then list state
  async function handleToggle() {
    const nextStatus: Status = published ? "unpublished" : "published";

    try {
      setToggling(true);
      await apiFetch(`/api/projects/${project._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange(project._id, nextStatus);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setToggling(false);
    }
  }

  // Delete: ask confirmation, then remove
  async function handleDelete() {
    const confirmed = await confirmDelete("project");

    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/projects/${project._id}`, { method: "DELETE" });
      onDeleted(project._id);
      showSuccess("Project deleted successfully.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-background">
          <SafeImage
            src={project.coverImage}
            alt={project.title}
            fallbackTitle={project.title}
            fill
            sizes="112px"
            className="object-cover"
          />
        </div>

        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-brand">{project.title}</h3>
            {project.category && (
              <span
                className={`rounded-md px-2 py-0.5 text-xs font-medium border ${
                  project.category.status === "unpublished"
                    ? "border-amber-300 bg-amber-50 text-amber-800"
                    : "border-border bg-background text-muted"
                }`}
              >
                {project.category.name}
                {project.category.status === "unpublished"
                  ? " (Category Unpublished)"
                  : ""}
              </span>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
            {project.location && (
              <span className="inline-flex items-center gap-1">
                <FiMapPin className="h-3 w-3 text-accent" />
                {project.location}
              </span>
            )}
            {project.client && (
              <span className="inline-flex items-center gap-1">
                <FiUser className="h-3 w-3 text-accent" />
                {project.client}
              </span>
            )}
            {project.year && (
              <span className="inline-flex items-center gap-1">
                <FiCalendar className="h-3 w-3 text-accent" />
                {project.year}
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">
            {project.shortDescription || project.description}
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
          {project.status}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleToggle}
            disabled={toggling}
            className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60"
          >
            {published ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            {toggling ? "Saving..." : published ? "Unpublish" : "Publish"}
          </button>

          <Link
            href={`/admin/projects/${project._id}/edit`}
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
