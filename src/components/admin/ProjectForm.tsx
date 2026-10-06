"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FiPlus, FiTrash2, FiImage } from "react-icons/fi";

import SeoFields, {
  emptySeo,
  type SeoValues,
} from "@/components/admin/SeoFields";
import { apiFetch } from "@/lib/api";
import { sanitizeHttpsUrl } from "@/lib/url";

export type ProjectFeature = {
  title: string;
  description: string;
};

export type ProjectFormValues = {
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  coverImage?: string;
  gallery?: string[];
  categoryId?: string | null;
  client?: string;
  location?: string;
  year?: string;
  features?: ProjectFeature[];
  seo?: SeoValues;
};

type ProjectFormProps = {
  initialValues?: ProjectFormValues;
  onSubmit: (values: ProjectFormValues) => Promise<void>;
  submitLabel?: string;
  loadingLabel?: string;
};

type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
  status: "published" | "unpublished";
};

const DEFAULT_PLACEHOLDER_COVER =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200";

const emptyValues: ProjectFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  gallery: [],
  categoryId: null,
  client: "",
  location: "",
  year: "",
  features: [],
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProjectForm({
  initialValues = emptyValues,
  onSubmit,
  submitLabel = "Create Project",
  loadingLabel = "Creating...",
}: ProjectFormProps) {
  const [values, setValues] = useState<ProjectFormValues>({
    ...emptyValues,
    ...initialValues,
    shortDescription:
      initialValues.shortDescription ||
      (initialValues.description
        ? initialValues.description.slice(0, 160).trim()
        : ""),
    categoryId:
      initialValues.categoryId !== undefined
        ? initialValues.categoryId
        : null,
    client: initialValues.client || "",
    location: initialValues.location || "",
    year: initialValues.year || "",
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState("");

  const [gallery, setGallery] = useState<string[]>(
    initialValues.gallery ? [...initialValues.gallery] : []
  );

  const [features, setFeatures] = useState<ProjectFeature[]>(
    initialValues.features ? [...initialValues.features] : []
  );

  const [seo, setSeo] = useState<SeoValues>({
    ...emptySeo,
    ...initialValues.seo,
  });

  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      try {
        const data = await apiFetch("/api/categories/admin");
        if (isMounted) {
          setCategories(data.categories || []);
        }
      } catch (err) {
        if (isMounted) {
          setCategoryLoadError(
            err instanceof Error ? err.message : "Failed to load categories"
          );
        }
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  function updateField<K extends keyof ProjectFormValues>(
    field: K,
    value: ProjectFormValues[K]
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleTitleChange(title: string) {
    setValues((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : createSlug(title),
    }));
  }

  // Gallery handlers
  function handleAddGalleryImage() {
    setGallery((current) => [...current, ""]);
  }

  function handleRemoveGalleryImage(index: number) {
    setGallery((current) => current.filter((_, i) => i !== index));
  }

  function handleGalleryImageChange(index: number, url: string) {
    setGallery((current) =>
      current.map((item, i) => (i === index ? url : item))
    );
  }

  // Features handlers
  function handleAddFeature() {
    setFeatures((current) => [
      ...current,
      { title: "", description: "" },
    ]);
  }

  function handleRemoveFeature(index: number) {
    setFeatures((current) => current.filter((_, i) => i !== index));
  }

  function handleFeatureChange(
    index: number,
    field: "title" | "description",
    val: string
  ) {
    setFeatures((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [field]: val } : item
      )
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    setError("");

    const title = values.title.trim();
    const slug = values.slug.trim();
    const description = values.description.trim();
    const shortDescription =
      values.shortDescription?.trim() || description.slice(0, 160).trim();

    if (!title || !slug || !description) {
      setError("Please complete all required project fields (title, slug, description).");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "Use lowercase English letters, numbers and single hyphens for the slug."
      );
      return;
    }

    // Cover image validation (fallback if left empty for now)
    let cleanCoverImage = values.coverImage?.trim() || "";
    if (cleanCoverImage) {
      const sanitizedCover = sanitizeHttpsUrl(cleanCoverImage);
      if (sanitizedCover.error || !sanitizedCover.url) {
        setError(sanitizedCover.error || "Please enter a valid HTTPS cover image URL.");
        return;
      }
      cleanCoverImage = sanitizedCover.url;
    } else {
      cleanCoverImage = DEFAULT_PLACEHOLDER_COVER;
    }

    // Gallery validation
    const cleanGallery: string[] = [];
    for (let i = 0; i < gallery.length; i++) {
      const item = gallery[i].trim();
      if (item) {
        const sanitized = sanitizeHttpsUrl(item);
        if (sanitized.error || !sanitized.url) {
          setError(
            sanitized.error ||
              `Gallery item #${i + 1} must be a valid HTTPS image URL.`
          );
          return;
        }
        cleanGallery.push(sanitized.url);
      }
    }

    // Features validation
    for (let i = 0; i < features.length; i++) {
      const item = features[i];
      if (!item.title.trim()) {
        setError(
          `Project feature #${i + 1} must have a title, or remove that feature.`
        );
        return;
      }
    }

    const cleanFeatures: ProjectFeature[] = features.map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }));

    // SEO validation
    let cleanOgImage = "";
    if (seo.ogImage && seo.ogImage.trim()) {
      const sanitizedOg = sanitizeHttpsUrl(seo.ogImage);
      if (sanitizedOg.error || !sanitizedOg.url) {
        setError(
          sanitizedOg.error ||
            "Please enter a valid HTTPS Open Graph image URL."
        );
        return;
      }
      cleanOgImage = sanitizedOg.url;
    }

    let cleanCanonicalUrl = "";
    if (seo.canonicalUrl && seo.canonicalUrl.trim()) {
      const sanitizedCanonical = sanitizeHttpsUrl(seo.canonicalUrl);
      if (sanitizedCanonical.error || !sanitizedCanonical.url) {
        setError(
          sanitizedCanonical.error ||
            "Please enter a valid HTTPS canonical URL."
        );
        return;
      }
      cleanCanonicalUrl = sanitizedCanonical.url;
    }

    try {
      submittingRef.current = true;
      setSubmitting(true);

      await onSubmit({
        title,
        slug,
        shortDescription,
        description,
        coverImage: cleanCoverImage,
        gallery: cleanGallery,
        categoryId: values.categoryId || null,
        client: values.client?.trim() || "",
        location: values.location?.trim() || "",
        year: values.year?.trim() || "",
        features: cleanFeatures,
        seo: {
          ...seo,
          ogImage: cleanOgImage,
          canonicalUrl: cleanCanonicalUrl,
        },
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save project."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Main Details */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-brand">Project Details</h2>
        <p className="mt-1 text-sm text-muted">
          Basic information about this portfolio showcase.
        </p>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-brand"
            >
              Project Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={values.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Modern Minimalist Kitchen Renovation"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-brand"
            >
              Slug (URL Identifier) <span className="text-red-500">*</span>
            </label>
            <input
              id="slug"
              type="text"
              required
              value={values.slug}
              onChange={(e) => {
                setSlugEdited(true);
                updateField("slug", e.target.value);
              }}
              placeholder="e.g. modern-minimalist-kitchen-renovation"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted">
              Used in public URL: /projects/{values.slug || "your-slug"}
            </p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-brand"
            >
              Service Category
            </label>
            {loadingCategories ? (
              <div className="mt-2 text-sm text-muted">
                Loading categories...
              </div>
            ) : categoryLoadError ? (
              <div className="mt-2 text-sm text-red-600">
                {categoryLoadError}
              </div>
            ) : (
              <select
                id="categoryId"
                value={values.categoryId || ""}
                onChange={(e) =>
                  updateField("categoryId", e.target.value || null)
                }
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand focus:border-accent focus:outline-none"
              >
                <option value="">-- No Category (General Project) --</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                    {category.status === "unpublished"
                      ? " (Unpublished)"
                      : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Cover Image URL */}
          <div>
            <label
              htmlFor="coverImage"
              className="block text-sm font-medium text-brand"
            >
              Cover Image URL
            </label>
            <input
              id="coverImage"
              type="url"
              value={values.coverImage || ""}
              onChange={(e) => updateField("coverImage", e.target.value)}
              placeholder="https://example.com/project-cover.jpg (Optional - default placeholder used if empty)"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
            />
            <p className="mt-1 text-xs text-muted">
              Enter a secure HTTPS image URL. If left empty, a placeholder will be used and can be updated later.
            </p>
          </div>

          {/* Meta Specifications: Location, Client, Year */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-brand"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                value={values.location || ""}
                onChange={(e) => updateField("location", e.target.value)}
                placeholder="e.g. Tribeca, New York"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="client"
                className="block text-sm font-medium text-brand"
              >
                Client
              </label>
              <input
                id="client"
                type="text"
                value={values.client || ""}
                onChange={(e) => updateField("client", e.target.value)}
                placeholder="e.g. Private Residence"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="year"
                className="block text-sm font-medium text-brand"
              >
                Year / Completion
              </label>
              <input
                id="year"
                type="text"
                value={values.year || ""}
                onChange={(e) => updateField("year", e.target.value)}
                placeholder="e.g. 2025"
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label
              htmlFor="shortDescription"
              className="block text-sm font-medium text-brand"
            >
              Short Summary
            </label>
            <input
              id="shortDescription"
              type="text"
              value={values.shortDescription || ""}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              placeholder="Brief summary for cards and listings (optional)"
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>

          {/* Full Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-brand"
            >
              Full Description / Project Narrative <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              rows={6}
              required
              value={values.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Provide a detailed narrative of the renovation project, design goals, and craftsmanship details..."
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Project Features / Scope Highlights */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand">
              Key Features &amp; Deliverables
            </h2>
            <p className="mt-1 text-sm text-muted">
              Add highlight points, architectural specifics, or custom features.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddFeature}
            className="btn btn-secondary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <FiPlus className="h-4 w-4" />
            Add Feature
          </button>
        </div>

        {features.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            No features added yet. Click &quot;Add Feature&quot; to include project highlights.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {features.map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-4 rounded-xl border border-border bg-background p-4"
              >
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={item.title}
                    onChange={(e) =>
                      handleFeatureChange(index, "title", e.target.value)
                    }
                    placeholder="Feature title (e.g. Custom White Oak Cabinetry)"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                  <textarea
                    rows={2}
                    value={item.description}
                    onChange={(e) =>
                      handleFeatureChange(index, "description", e.target.value)
                    }
                    placeholder="Details about this feature..."
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveFeature(index)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove feature"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Image URLs */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand">
              Project Gallery
            </h2>
            <p className="mt-1 text-sm text-muted">
              Add additional image URLs for the project gallery showcase.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddGalleryImage}
            className="btn btn-secondary inline-flex items-center gap-2 self-start sm:self-auto"
          >
            <FiImage className="h-4 w-4" />
            Add Image URL
          </button>
        </div>

        {gallery.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            No gallery images added. You can add them now or update later.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {gallery.map((url, index) => (
              <div
                key={index}
                className="flex items-center gap-4 rounded-xl border border-border bg-background p-3"
              >
                <input
                  type="url"
                  value={url}
                  onChange={(e) =>
                    handleGalleryImageChange(index, e.target.value)
                  }
                  placeholder={`https://example.com/gallery-photo-${index + 1}.jpg`}
                  className="flex-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-brand placeholder:text-muted focus:border-accent focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(index)}
                  className="rounded-lg p-2 text-muted transition-colors hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove gallery image"
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SEO Fields */}
      <SeoFields
        value={seo}
        onChange={setSeo}
        fallbackTitle={values.title}
        fallbackDescription={values.shortDescription || values.description}
        fallbackImage={values.coverImage || ""}
      />

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-4">
        <Link href="/admin/projects" className="btn btn-secondary">
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary disabled:opacity-60"
        >
          {submitting ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
