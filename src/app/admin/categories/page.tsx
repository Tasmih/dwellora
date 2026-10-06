"use client";

import { useEffect, useState } from "react";

import { apiFetch } from "@/lib/api";
import CategoryCard, {
  type CategoryCardProps,
} from "@/components/admin/CategoryCard";
import CategoryHeader from "@/components/admin/CategoryHeader";
import Loading from "@/components/common/Loading";

type Category = CategoryCardProps["category"];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function fetchCategories() {
      try {
        setLoading(true);
        setError("");
        const data = await apiFetch("/api/categories/admin");
        if (isMounted) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Failed to load categories."
          );
        }
        console.error("Failed to load categories", err);
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
            <Loading text="Loading categories..." className="border-0 bg-transparent py-16" />
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="p-8 text-center text-muted">
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
