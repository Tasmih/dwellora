"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

export type CategoryFormValues = {
  name: string;
  slug: string;
  description: string;
  image?: string;
  displayOrder?: number | null;
};

type CategoryFormProps = {
  initialValues?: CategoryFormValues;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  submitLabel?: string;
  loadingLabel?: string;
};

type InternalFormState = {
  name: string;
  slug: string;
  description: string;
  image: string;
  displayOrder: string;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

import { sanitizeHttpsUrl } from "@/lib/url";

export default function CategoryForm({
  initialValues,
  onSubmit,
  submitLabel = "Create Category",
  loadingLabel = "Creating...",
}: CategoryFormProps) {
  const [values, setValues] = useState<InternalFormState>({
    name: initialValues?.name || "",
    slug: initialValues?.slug || "",
    description: initialValues?.description || "",
    image: initialValues?.image || "",
    displayOrder:
      initialValues?.displayOrder !== undefined &&
      initialValues?.displayOrder !== null
        ? String(initialValues.displayOrder)
        : "",
  });

  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues?.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

  function updateField(
    field: keyof InternalFormState,
    value: string
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleNameChange(name: string) {
    setValues((current) => ({
      ...current,
      name,
      slug: slugEdited ? current.slug : createSlug(name),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    setError("");

    const name = values.name.trim();
    const slug = values.slug.trim();
    const description = values.description.trim();

    if (!name || !slug || !description) {
      setError("Please complete all required category fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "Use lowercase English letters, numbers and single hyphens for the slug."
      );
      return;
    }

    let image = "";
    if (values.image && values.image.trim()) {
      const sanitized = sanitizeHttpsUrl(values.image);
      if (sanitized.error || !sanitized.url) {
        setError(
          sanitized.error ||
            "Please enter a valid HTTPS category image URL, or leave it blank."
        );
        return;
      }
      image = sanitized.url;
    }

    let displayOrder: number | null = null;
    const orderRaw = values.displayOrder.trim();
    if (orderRaw !== "") {
      const parsed = Number(orderRaw);
      if (!Number.isInteger(parsed) || parsed < 0) {
        setError("Display Order must be a non-negative integer (e.g. 1, 2, 3...).");
        return;
      }
      displayOrder = parsed;
    }

    const payload: CategoryFormValues = {
      name,
      slug,
      description,
      ...(image ? { image } : {}),
      displayOrder,
    };

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save category. Please try again."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-busy={submitting}
      className="rounded-2xl border border-border bg-surface p-5 sm:p-8"
    >
      <fieldset disabled={submitting} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="category-name" className="form-label">
              Category Name <span className="text-accent">*</span>
            </label>

            <input
              id="category-name"
              name="name"
              type="text"
              value={values.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Kitchen Services"
              className="form-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="category-slug" className="form-label">
              SEO-friendly Slug <span className="text-accent">*</span>
            </label>

            <input
              id="category-slug"
              name="slug"
              type="text"
              value={values.slug}
              onChange={(e) => {
                setSlugEdited(true);
                updateField("slug", e.target.value);
              }}
              placeholder="kitchen"
              aria-describedby="category-slug-help"
              className="form-input w-full"
              required
            />

            <p
              id="category-slug-help"
              className="break-all text-xs leading-5 text-muted"
            >
              Public path: /services/category/{values.slug || "kitchen"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="category-description" className="form-label">
            Description <span className="text-accent">*</span>
          </label>

          <textarea
            id="category-description"
            name="description"
            rows={4}
            value={values.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Overview of this renovation category, scopes and specialties."
            className="form-input w-full resize-y"
            required
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="category-order" className="form-label">
              Display Order{" "}
              <span className="text-xs font-normal text-muted">
                (Optional, e.g. 1–10)
              </span>
            </label>

            <input
              id="category-order"
              name="displayOrder"
              type="number"
              min="0"
              step="1"
              value={values.displayOrder}
              onChange={(e) => updateField("displayOrder", e.target.value)}
              placeholder="e.g. 1"
              aria-describedby="category-order-help"
              className="form-input w-full"
            />

            <p
              id="category-order-help"
              className="text-xs leading-5 text-muted"
            >
              Order in the Services dropdown and listings. Lowest numbers appear first.
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="category-image" className="form-label">
              Category Cover Image URL{" "}
              <span className="text-xs font-normal text-muted">
                (Optional)
              </span>
            </label>

            <input
              id="category-image"
              name="image"
              type="url"
              value={values.image || ""}
              onChange={(e) => updateField("image", e.target.value)}
              placeholder="https://example.com/kitchen-category.jpg"
              className="form-input w-full"
            />
          </div>
        </div>
      </fieldset>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50/50 p-4 text-sm leading-6 text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
        {!submitting && (
          <Link
            href="/admin/categories"
            className="btn btn-secondary w-full sm:w-auto"
          >
            Cancel
          </Link>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
