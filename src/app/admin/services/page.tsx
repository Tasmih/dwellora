"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import ServiceCard from "@/components/admin/ServiceCard";
import ServiceHeader from "@/components/admin/ServiceHeader";
import Loading from "@/components/common/Loading";

type Service = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  status: "published" | "unpublished";
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchServices() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/services/admin");

        if (isMounted) {
          setServices(data.services || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load services."
          );
        }
        console.error("Failed to load services", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchServices();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(id: string) {
    setServices((current) => current.filter((item) => item._id !== id));
  }

  function handleStatusChange(id: string, status: "published" | "unpublished") {
    setServices((current) =>
      current.map((item) => (item._id === id ? { ...item, status } : item))
    );
  }

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <ServiceHeader />

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
          {loading ? (
            <Loading text="Loading services..." className="border-0 bg-transparent py-16" />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : services.length === 0 ? (
            <div className="p-8 text-center text-muted">No services found. Click &quot;Add Service&quot; to create one.</div>
          ) : (
            <div className="divide-y divide-border">
              {services.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
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