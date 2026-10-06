"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ServiceForm, {
  type ServiceFormValues,
} from "@/components/admin/ServiceForm";
import Loading from "@/components/common/Loading";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [initialValues, setInitialValues] = useState<ServiceFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      if (!id) return;

      try {
        setLoading(true);
        setLoadError("");
        const data = await apiFetch(`/api/services/${id}`);
        if (isMounted) {
          if (data.service) {
            setInitialValues({
              title: data.service.title || "",
              slug: data.service.slug || "",
              shortDescription: data.service.shortDescription || "",
              description: data.service.description || "",
              image: data.service.image || "",
              includedItems: data.service.includedItems || [],
              categoryId: data.service.categoryId || null,
              seo: data.service.seo || undefined,
            });
          } else {
            setLoadError("Service not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load service."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadService();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleUpdateService(values: ServiceFormValues) {
    if (!id) return;

    await apiFetch(`/api/services/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    showSuccess("Service updated successfully.");
    router.replace("/admin/services");
  }

  if (loading) {
    return <Loading text="Loading service details..." className="py-16" />;
  }

  if (loadError || !initialValues) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Service Not Found</h2>
        <p className="mt-2 text-sm text-muted">
          {loadError || "The requested service could not be loaded."}
        </p>
        <Link href="/admin/services" className="btn btn-secondary mt-6">
          Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Edit Service
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Update service information, description, included scope and SEO metadata.
        </p>
      </div>

      <ServiceForm
        initialValues={initialValues}
        onSubmit={handleUpdateService}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
      />
    </div>
  );
}
