"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

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

  async function loadServices() {
    try {
      const data = await apiFetch("/api/services");

      setServices(data.services || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  return (
    <main className="min-h-screen bg-background p-6 lg:p-10">

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-brand">
          Services
        </h1>

        <p className="mt-2 text-muted">
          Manage your renovation services.
        </p>
      </div>


      <div className="rounded-2xl border border-border bg-surface">

        <div className="flex items-center justify-between border-b border-border p-6">

          <h2 className="text-xl font-semibold text-brand">
            All Services
          </h2>


          <button className="btn btn-primary">
            Add Service
          </button>

        </div>


        {loading ? (

          <div className="p-6 text-muted">
            Loading services...
          </div>

        ) : services.length === 0 ? (

          <div className="p-6 text-muted">
            No services found.
          </div>

        ) : (

          <div className="divide-y divide-border">

            {services.map((service) => (

              <div
                key={service._id}
                className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between"
              >

                <div>

                  <h3 className="text-lg font-semibold text-brand">
                    {service.title}
                  </h3>


                  <p className="mt-1 text-sm text-muted">
                    {service.description}
                  </p>

                </div>


                <div className="flex items-center gap-3">

                  <span
                    className={
                      service.status === "published"
                        ? "rounded-full bg-brand px-4 py-1 text-xs text-white"
                        : "rounded-full bg-border px-4 py-1 text-xs text-muted"
                    }
                  >
                    {service.status}
                  </span>


                  <button className="btn btn-secondary">
                    Edit
                  </button>


                  <button className="btn btn-secondary">
                    Delete
                  </button>

                </div>


              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}