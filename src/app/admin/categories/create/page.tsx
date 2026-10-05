"use client";

import { useRouter } from "next/navigation";

import CategoryForm from "@/components/admin/CategoryForm";
import type { CategoryFormValues } from "@/components/admin/CategoryForm";
import { apiFetch } from "@/lib/api";
import { showSuccess } from "@/lib/alert";

export default function CreateCategoryPage() {
  const router = useRouter();

  async function handleCreateCategory(values: CategoryFormValues) {
    await apiFetch("/api/categories", {
      method: "POST",
      body: JSON.stringify(values),
    });

    showSuccess("Category created successfully.");
    router.replace("/admin/categories");
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Add Category
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Create a renovation category to organize your services (e.g. Kitchen Services, Bathroom Services).
        </p>
      </div>

      <CategoryForm onSubmit={handleCreateCategory} />
    </div>
  );
}
