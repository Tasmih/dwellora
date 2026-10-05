"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import CategoryForm, {
  type CategoryFormValues,
} from "@/components/admin/CategoryForm";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function EditCategoryPage() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params.id === "string" ? params.id : "";

  const [initialValues, setInitialValues] =
    useState<CategoryFormValues | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      if (!id) return;

      try {
        const data = await apiFetch(`/api/categories/${id}`);
        if (isMounted) {
          if (data.category) {
            setInitialValues({
              name: data.category.name || "",
              slug: data.category.slug || "",
              description: data.category.description || "",
              image: data.category.image || "",
              displayOrder:
                data.category.displayOrder !== undefined
                  ? data.category.displayOrder
                  : null,
            });
          } else {
            setLoadError("Category not found.");
          }
        }
      } catch (err) {
        if (isMounted) {
          setLoadError(
            err instanceof Error ? err.message : "Failed to load category."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [id]);

  async function handleUpdateCategory(values: CategoryFormValues) {
    if (!id) return;

    await apiFetch(`/api/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    });

    showSuccess("Category updated successfully.");
    router.replace("/admin/categories");
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center text-muted">
        Loading category details...
      </div>
    );
  }

  if (loadError || !initialValues) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-8 text-center">
        <h2 className="text-xl font-semibold text-brand">Category Not Found</h2>
        <p className="mt-2 text-sm text-muted">
          {loadError || "The requested category could not be loaded."}
        </p>
        <Link href="/admin/categories" className="btn btn-secondary mt-6">
          Back to Categories
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
          Edit Category
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Update category name, slug, description or image.
        </p>
      </div>

      <CategoryForm
        initialValues={initialValues}
        onSubmit={handleUpdateCategory}
        submitLabel="Save Changes"
        loadingLabel="Saving..."
      />
    </div>
  );
}
