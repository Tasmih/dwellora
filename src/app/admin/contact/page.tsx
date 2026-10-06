"use client";

import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { apiFetch } from "@/lib/api";
import Loading from "@/components/common/Loading";
import ContactHeader from "@/components/admin/ContactHeader";
import ContactCard, {
  type AdminContact,
  type ContactStatus,
} from "@/components/admin/ContactCard";
import ContactDetailModal from "@/components/admin/ContactDetailModal";

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<AdminContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ContactStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<AdminContact | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchContacts() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/contact");

        if (isMounted) {
          setContacts(data.contacts || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load messages."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchContacts();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(id: string) {
    setContacts((current) => current.filter((item) => item._id !== id));
    if (selectedContact?._id === id) {
      setSelectedContact(null);
    }
  }

  function handleStatusChange(id: string, status: ContactStatus) {
    setContacts((current) =>
      current.map((item) => (item._id === id ? { ...item, status } : item))
    );
    if (selectedContact?._id === id) {
      setSelectedContact((prev) => (prev ? { ...prev, status } : null));
    }
  }

  const newCount = contacts.filter((c) => c.status === "new").length;

  const filteredContacts = contacts.filter((item) => {
    if (statusFilter !== "all" && item.status !== statusFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = item.name.toLowerCase().includes(q);
      const matchEmail = item.email.toLowerCase().includes(q);
      const matchPhone = item.phone.toLowerCase().includes(q);
      const matchService = item.service.toLowerCase().includes(q);
      const matchMessage = item.message.toLowerCase().includes(q);
      return (
        matchName || matchEmail || matchPhone || matchService || matchMessage
      );
    }
    return true;
  });

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <ContactHeader
          totalCount={contacts.length}
          newCount={newCount}
        />

        {/* Filter and Search Controls */}
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, email, service..."
              className="form-input w-full pl-10"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-border bg-surface p-1.5">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "all"
                  ? "bg-brand text-white shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              All ({contacts.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("new")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "new"
                  ? "bg-amber-600 text-white shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              New ({newCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("read")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "read"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              Read ({contacts.filter((c) => c.status === "read").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("replied")}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                statusFilter === "replied"
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "text-muted hover:text-brand"
              }`}
            >
              Replied ({contacts.filter((c) => c.status === "replied").length})
            </button>
          </div>
        </div>

        {/* Listing Container */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-border bg-surface shadow-xs">
          {loading ? (
            <Loading
              text="Loading contact messages..."
              className="border-0 bg-transparent py-16"
            />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No contact inquiries submitted yet.
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="p-12 text-center text-muted">
              No messages match the selected filters or search query.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredContacts.map((item) => (
                <ContactCard
                  key={item._id}
                  contact={item}
                  onView={setSelectedContact}
                  onDeleted={handleDeleted}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Details View Modal */}
      <ContactDetailModal
        contact={selectedContact}
        onClose={() => setSelectedContact(null)}
        onStatusChange={handleStatusChange}
      />
    </main>
  );
}
