"use client";

import { useState } from "react";
import {
  FiEye,
  FiTrash2,
  FiMail,
  FiPhone,
  FiClock,
  FiTag,
} from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import { confirmDelete, showError, showSuccess } from "@/lib/alert";

export type ContactStatus = "new" | "read" | "replied";

export type AdminContact = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: ContactStatus;
  createdAt: string | Date;
  updatedAt: string | Date;
};

type ContactCardProps = {
  contact: AdminContact;
  onView: (contact: AdminContact) => void;
  onDeleted: (id: string) => void;
  onStatusChange: (id: string, status: ContactStatus) => void;
};

export default function ContactCard({
  contact,
  onView,
  onDeleted,
  onStatusChange,
}: ContactCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  async function handleStatusSelect(nextStatus: ContactStatus) {
    if (nextStatus === contact.status) return;

    try {
      setUpdating(true);
      await apiFetch(`/api/contact/${contact._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: nextStatus }),
      });
      onStatusChange(contact._id, nextStatus);
      showSuccess(`Status changed to ${nextStatus}.`);
    } catch (error) {
      showError(
        error instanceof Error ? error.message : "Status update failed"
      );
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    const confirmed = await confirmDelete("contact message");
    if (!confirmed) return;

    try {
      setDeleting(true);
      await apiFetch(`/api/contact/${contact._id}`, {
        method: "DELETE",
      });
      onDeleted(contact._id);
      showSuccess("Message deleted successfully.");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  let formattedDate = "N/A";
  if (contact.createdAt) {
    try {
      formattedDate = new Date(contact.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      formattedDate = String(contact.createdAt);
    }
  }

  return (
    <div className="flex flex-col gap-5 p-6 transition-colors hover:bg-background/40 lg:flex-row lg:items-center lg:justify-between">
      {/* Contact Info and Message Preview */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Badge */}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
              contact.status === "new"
                ? "bg-amber-100 text-amber-900 border border-amber-200"
                : contact.status === "replied"
                ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                : "bg-blue-100 text-blue-900 border border-blue-200"
            }`}
          >
            {contact.status}
          </span>

          <h3 className="text-lg font-bold text-brand">{contact.name}</h3>

          <span className="inline-flex items-center gap-1 rounded-md bg-brand/10 px-2 py-0.5 text-xs font-medium text-brand">
            <FiTag className="h-3 w-3" />
            {contact.service}
          </span>
        </div>

        {/* Contact Details Meta Row */}
        <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted">
          <a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-1 hover:text-brand transition-colors"
          >
            <FiMail className="h-3.5 w-3.5 text-accent" />
            {contact.email}
          </a>

          <a
            href={`tel:${contact.phone}`}
            className="inline-flex items-center gap-1 hover:text-brand transition-colors"
          >
            <FiPhone className="h-3.5 w-3.5 text-accent" />
            {contact.phone}
          </a>

          <span className="inline-flex items-center gap-1">
            <FiClock className="h-3.5 w-3.5 text-accent" />
            {formattedDate}
          </span>
        </div>

        {/* Message Preview */}
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted">
          {contact.message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 lg:flex-col lg:items-end">
        {/* Quick Status Dropdown */}
        <div className="flex items-center rounded-xl border border-border bg-surface p-1">
          <select
            value={contact.status}
            onChange={(e) =>
              handleStatusSelect(e.target.value as ContactStatus)
            }
            disabled={updating}
            className="bg-transparent text-xs font-semibold text-brand focus:outline-none cursor-pointer px-2 py-1"
          >
            <option value="new">Status: New</option>
            <option value="read">Status: Read</option>
            <option value="replied">Status: Replied</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(contact)}
            className="btn btn-secondary inline-flex items-center gap-1.5 px-4 py-2 text-xs"
          >
            <FiEye className="h-3.5 w-3.5" />
            View
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete message"
            className="btn btn-secondary inline-flex items-center gap-1.5 px-3 py-2 text-xs text-red-700 hover:border-red-600 hover:bg-red-600 hover:text-white disabled:opacity-60"
          >
            <FiTrash2 className="h-3.5 w-3.5" />
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
