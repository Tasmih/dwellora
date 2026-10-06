"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";

import SeoFields, {
  emptySeo,
  type SeoValues,
} from "@/components/admin/SeoFields";
import { apiFetch } from "@/lib/api";

export type IncludedItem = {
  title: string;
  description: string;
};

export type ServiceFormValues = {
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  image: string;
  categoryId?: string | null;
  includedItems?: IncludedItem[];
  seo?: SeoValues;
};

type ServiceFormProps = {
  initialValues?: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  submitLabel?: string;
  loadingLabel?: string;
};

type CategoryOption = {
  _id: string;
  name: string;
  slug: string;
  status: "published" | "unpublished";
};

const emptyValues: ServiceFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  description: "",
  image: "",
  categoryId: null,
  includedItems: [],
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

import { sanitizeHttpsUrl } from "@/lib/url";

export default function ServiceForm({
  initialValues = emptyValues,
  onSubmit,
  submitLabel = "Create Service",
  loadingLabel = "Creating...",
}: ServiceFormProps) {
  const [values, setValues] = useState<ServiceFormValues>({
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
  });

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryLoadError, setCategoryLoadError] = useState("");

  const [includedItems, setIncludedItems] = useState<IncludedItem[]>(
    initialValues.includedItems ? [...initialValues.includedItems] : []
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
            err instanceof Error
              ? err.message
              : "Failed to load categories"
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

  function updateField<K extends keyof ServiceFormValues>(
    field: K,
    value: ServiceFormValues[K]
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

  function handleAddIncludedItem() {
    setIncludedItems((current) => [
      ...current,
      { title: "", description: "" },
    ]);
  }

  function handleRemoveIncludedItem(index: number) {
    setIncludedItems((current) => current.filter((_, i) => i !== index));
  }

  function handleIncludedItemChange(
    index: number,
    field: "title" | "description",
    val: string
  ) {
    setIncludedItems((current) =>
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
    const image = values.image.trim();

    if (!title || !slug || !description || !image) {
      setError("Please complete all required service fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
      setError(
        "Use lowercase English letters, numbers and single hyphens for the slug."
      );
      return;
    }

    const sanitizedImage = sanitizeHttpsUrl(image);
    if (sanitizedImage.error || !sanitizedImage.url) {
      setError(
        sanitizedImage.error || "Please enter a valid HTTPS service image URL."
      );
      return;
    }
    const cleanImage = sanitizedImage.url;

    // Validate included items
    for (let i = 0; i < includedItems.length; i++) {
      const item = includedItems[i];
      if (!item.title.trim()) {
        setError(
          `Included item #${i + 1} must have a title, or remove that item.`
        );
        return;
      }
    }

    const cleanIncludedItems: IncludedItem[] = includedItems.map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }));

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

    const cleanSeo: SeoValues = {
      metaTitle: seo.metaTitle.trim(),
      metaDescription: seo.metaDescription.trim(),
      keywords: seo.keywords.trim(),
      ogTitle: seo.ogTitle.trim(),
      ogDescription: seo.ogDescription.trim(),
      ogImage: cleanOgImage,
      canonicalUrl: cleanCanonicalUrl,
    };

    const payload: ServiceFormValues = {
      title,
      slug,
      shortDescription,
      description,
      image: cleanImage,
      categoryId: values.categoryId ? values.categoryId : null,
      includedItems: cleanIncludedItems,
      seo: cleanSeo,
    };

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save service. Please try again."
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
            <label htmlFor="service-title" className="form-label">
              Service Title <span className="text-accent">*</span>
            </label>

            <input
              id="service-title"
              name="title"
              type="text"
              value={values.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="e.g. Custom Kitchen Cabinets"
              className="form-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service-slug" className="form-label">
              SEO-friendly Slug <span className="text-accent">*</span>
            </label>

            <input
              id="service-slug"
              name="slug"
              type="text"
              value={values.slug}
              onChange={(event) => {
                setSlugEdited(true);
                updateField("slug", event.target.value);
              }}
              placeholder="custom-kitchen-cabinets"
              aria-describedby="service-slug-help"
              className="form-input w-full"
              required
            />

            <p
              id="service-slug-help"
              className="break-all text-xs leading-5 text-muted"
            >
              Page path: /services/{values.slug || "your-service-slug"}
            </p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="space-y-2">
          <label htmlFor="service-category" className="form-label">
            Service Category
          </label>

          <select
            id="service-category"
            name="categoryId"
            value={values.categoryId || ""}
            onChange={(e) =>
              updateField("categoryId", e.target.value ? e.target.value : null)
            }
            className="form-input w-full"
            disabled={loadingCategories}
          >
            <option value="">No category (Uncategorized)</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
                {cat.status === "unpublished" ? " [Unpublished Category]" : ""}
              </option>
            ))}
          </select>

          <p className="text-xs leading-5 text-muted">
            Organizes this service under a category (e.g. Kitchen Services, Bathroom Services). Note: if a category is unpublished, its assigned services are hidden from public pages.
          </p>

          {categoryLoadError && (
            <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
              Unable to load category list ({categoryLoadError}). Current category assignment will be preserved.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="service-short-desc" className="form-label">
            Short Description
          </label>
          <textarea
            id="service-short-desc"
            name="shortDescription"
            rows={2}
            value={values.shortDescription || ""}
            onChange={(event) =>
              updateField("shortDescription", event.target.value)
            }
            placeholder="A concise summary for cards and the details hero (falls back to description excerpt if empty)."
            className="form-input w-full resize-y"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="service-description" className="form-label">
            Full Description <span className="text-accent">*</span>
          </label>

          <textarea
            id="service-description"
            name="description"
            rows={6}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Detailed overview of the renovation service, process and craftsmanship."
            className="form-input w-full resize-y"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="service-image" className="form-label">
            Image URL <span className="text-accent">*</span>
          </label>

          <input
            id="service-image"
            name="image"
            type="url"
            value={values.image}
            onChange={(event) => updateField("image", event.target.value)}
            placeholder="https://example.com/kitchen.jpg"
            className="form-input w-full"
            required
          />
        </div>

        {/* What's Included Section */}
        <div className="rounded-xl border border-border bg-background/50 p-5 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-brand">
                What&apos;s Included (Scope &amp; Deliverables)
              </h2>
              <p className="text-xs text-muted">
                Add specific tasks or scopes included in this service (e.g. Demolition, Custom Cabinetry, Fixture Installation).
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddIncludedItem}
              className="btn btn-secondary inline-flex items-center gap-1.5 self-start text-xs sm:self-auto"
            >
              <FiPlus className="h-3.5 w-3.5" />
              Add Item
            </button>
          </div>

          {includedItems.length === 0 ? (
            <p className="mt-4 text-xs italic text-muted">
              No items added yet. Click &quot;Add Item&quot; to specify included work.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {includedItems.map((item, index) => (
                <div
                  key={index}
                  className="relative rounded-lg border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between pb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Item #{index + 1}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleRemoveIncludedItem(index)}
                      className="inline-flex items-center gap-1 text-xs text-muted transition-colors hover:text-red-600"
                      aria-label={`Remove item #${index + 1}`}
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label
                        htmlFor={`included-title-${index}`}
                        className="mb-1 block text-xs font-medium text-brand"
                      >
                        Item Title <span className="text-accent">*</span>
                      </label>
                      <input
                        id={`included-title-${index}`}
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          handleIncludedItemChange(index, "title", e.target.value)
                        }
                        placeholder="e.g. Custom Cabinetry & Joinery"
                        className="form-input text-sm"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`included-desc-${index}`}
                        className="mb-1 block text-xs font-medium text-brand"
                      >
                        Description (Optional)
                      </label>
                      <textarea
                        id={`included-desc-${index}`}
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          handleIncludedItemChange(
                            index,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="e.g. Made-to-measure hardwood cabinetry, soft-close hardware and tailored shelving."
                        className="form-input text-sm resize-y"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <SeoFields
          value={seo}
          onChange={setSeo}
          fallbackTitle={values.title}
          fallbackDescription={values.shortDescription || values.description}
          fallbackImage={values.image}
        />
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
            href="/admin/services"
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