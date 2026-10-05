"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import ServiceCard from "@/components/admin/ServiceCard";


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
      console.error("Failed to load services", error);

    } finally {
      setLoading(false);
    }
  }


useEffect(() => {
  let active = true;

  async function fetchServices() {
    try {
      const data = await apiFetch("/api/services");

      if (active) {
        setServices(data.services || []);
      }

    } catch (error) {
      console.error("Failed to load services", error);

    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  fetchServices();

  return () => {
    active = false;
  };

}, []);



  return (
    <main>
      <div className="site-container py-10 lg:py-12">

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Dwellora Administration
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-brand">
              Services
            </h1>

            <p className="mt-2 text-muted">
              Manage renovation services from here.
            </p>
          </div>


          <button className="btn btn-primary">
            Add Service
          </button>

        </div>



        <section className="overflow-hidden rounded-2xl border border-border bg-surface">

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
                <ServiceCard
                  key={service._id}
                  service={service}
                />
              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}