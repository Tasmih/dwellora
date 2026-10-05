"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FiEdit2, FiEye, FiEyeOff, FiTrash2 } from "react-icons/fi";

import { apiFetch } from "@/lib/api";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

type Status = "published" | "unpublished";

type ServiceCardProps = {
  service: {
    _id: string;
    title: string;
    description: string;
    image: string;
    status: Status;
  };
  onDeleted: (id: string) => void;
  onStatusChange: (id: string, status: Status) => void;
};

// One row in the admin services list: image, text, status and actions
export default function ServiceCard({ service, onDeleted, onStatusChange }: ServiceCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const published = service.status === "published";

  // Publish / unpublish: updates the status in the database, then the list state
  async function handleToggle() {
    const nextStatus: Status = published ? "unpublished" : "published";

    try {
      setToggling(true);
      await apiFetch(`/api/services/${service._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange(service._id, nextStatus);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setToggling(false);
    }
  }

  // Delete: ask first, then remove from the database and the list
  async function handleDelete() {
    const confirmed = await confirmDelete("service");

    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/services/${service._id}`, { method: "DELETE" });
      onDeleted(service._id);
      showSuccess("Service deleted successfully.");
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
          {service.image ? (
            <Image src={service.image} alt={service.title} fill sizes="112px" className="object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-muted">No image</div>
          )}
        </div>

        <div className="max-w-2xl">
          <h3 className="text-lg font-semibold text-brand">{service.title}</h3>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted">{service.description}</p>
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
          {service.status}
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleToggle} disabled={toggling} className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60">
            {published ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            {toggling ? "Saving..." : published ? "Unpublish" : "Publish"}
          </button>

          <Link href={`/admin/services/${service._id}/edit`} className="btn btn-secondary inline-flex items-center gap-2">
            <FiEdit2 className="h-4 w-4" />
            Edit
          </Link>

          <button onClick={handleDelete} disabled={deleting} className="btn btn-secondary inline-flex items-center gap-2 disabled:opacity-60">
            <FiTrash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}