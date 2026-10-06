"use client";

import {
  FiX,
  FiMail,
  FiPhone,
  FiCalendar,
  FiTag,
} from "react-icons/fi";
import type { AdminContact, ContactStatus } from "./ContactCard";

type ContactDetailModalProps = {
  contact: AdminContact | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ContactStatus) => void;
};

export default function ContactDetailModal({
  contact,
  onClose,
  onStatusChange,
}: ContactDetailModalProps) {
  if (!contact) return null;

  let formattedDate = "N/A";
  if (contact.createdAt) {
    try {
      formattedDate = new Date(contact.createdAt).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch {
      formattedDate = String(contact.createdAt);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-border bg-surface shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-border bg-background px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white font-bold">
              {contact.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 id="modal-title" className="text-lg font-bold text-brand">
                {contact.name}
              </h2>
              <p className="text-xs text-muted">Inquiry Details</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted transition-colors hover:bg-surface hover:text-brand"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Metadata Grid */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-border bg-background p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <FiMail className="h-4 w-4 text-accent mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-muted">Email</span>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm font-semibold text-brand hover:text-accent transition-colors break-all"
                >
                  {contact.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiPhone className="h-4 w-4 text-accent mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-muted">Phone Number</span>
                <a
                  href={`tel:${contact.phone}`}
                  className="text-sm font-semibold text-brand hover:text-accent transition-colors"
                >
                  {contact.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiTag className="h-4 w-4 text-accent mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-muted">Requested Service</span>
                <span className="inline-block mt-0.5 rounded-md bg-brand/10 px-2.5 py-0.5 text-xs font-semibold text-brand">
                  {contact.service}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiCalendar className="h-4 w-4 text-accent mt-1 shrink-0" />
              <div>
                <span className="block text-xs text-muted">Date Received</span>
                <span className="text-xs font-medium text-foreground">
                  {formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Status Quick Updater */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                Status:
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                  contact.status === "new"
                    ? "bg-amber-100 text-amber-900 border border-amber-200"
                    : contact.status === "replied"
                    ? "bg-emerald-100 text-emerald-900 border border-emerald-200"
                    : "bg-blue-100 text-blue-900 border border-blue-200"
                }`}
              >
                {contact.status}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {(["new", "read", "replied"] as ContactStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => onStatusChange(contact._id, st)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                    contact.status === st
                      ? "bg-brand text-white shadow-sm"
                      : "border border-border bg-background text-muted hover:text-brand"
                  }`}
                >
                  Mark {st.charAt(0).toUpperCase() + st.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Message Content */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-accent mb-2">
              Complete Message
            </h3>
            <div className="rounded-2xl border border-border bg-background p-5 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {contact.message}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-border bg-background px-6 py-4">
          <a
            href={`mailto:${contact.email}?subject=Regarding your Dwellora Consultation Inquiry`}
            className="btn btn-primary inline-flex items-center gap-2 text-xs sm:text-sm"
          >
            <FiMail className="h-4 w-4" />
            Reply via Email
          </a>

          <button
            type="button"
            onClick={onClose}
            className="btn btn-secondary text-xs sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
