"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import CategoryCard, {
  type CategoryCardProps,
} from "@/components/admin/CategoryCard";
import CategoryHeader from "@/components/admin/CategoryHeader";

type Category = CategoryCardProps["category"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        const data = await apiFetch("/api/categories/admin");
        if (isMounted) {
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  function handleDeleted(id: string) {
    setCategories((current) => current.filter((c) => c._id !== id));
  }

  function handleStatusChange(
    id: string,
    status: "published" | "unpublished"
  ) {
    setCategories((current) =>
      current.map((c) => (c._id === id ? { ...c, status } : c))
    );
  }

  return (
    <main>
      <div className="site-container py-10 lg:py-12">
        <CategoryHeader />

        <section className="mt-8 overflow-hidden rounded-2xl border border-border bg-surface">
          {loading ? (
            <div className="p-6 text-muted">Loading categories...</div>
          ) : categories.length === 0 ? (
            <div className="p-6 text-muted">
              No categories found. Click &quot;Add Category&quot; to create one.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
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
