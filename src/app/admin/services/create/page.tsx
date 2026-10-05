"use client";

import { useRouter } from "next/navigation";

import ServiceForm from "@/components/admin/ServiceForm";
import type { ServiceFormValues } from "@/components/admin/ServiceForm";
import { apiFetch } from "@/lib/api";

export default function CreateServicePage() {
  const router = useRouter();

  async function handleCreateService(values: ServiceFormValues) {
    await apiFetch("/api/services", {
      method: "POST",
      body: JSON.stringify(values),
    });

    router.replace("/admin/services");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Add Service
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Add a renovation service. It will be published after saving.
        </p>
      </div>

      <ServiceForm onSubmit={handleCreateService} />
    </div>
  );
}