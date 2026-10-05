"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";

import SeoFields, {
  emptySeo,
  type SeoValues,
} from "@/components/admin/SeoFields";

export type ServiceFormValues = {
  title: string;
  slug: string;
  description: string;
  image: string;
  seo?: SeoValues;
};

type ServiceFormProps = {
  initialValues?: ServiceFormValues;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  submitLabel?: string;
  loadingLabel?: string;
};

const emptyValues: ServiceFormValues = {
  title: "",
  slug: "",
  description: "",
  image: "",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function ServiceForm({
  initialValues = emptyValues,
  onSubmit,
  submitLabel = "Create Service",
  loadingLabel = "Creating...",
}: ServiceFormProps) {
  const [values, setValues] = useState(initialValues);

  const [seo, setSeo] = useState<SeoValues>({
    ...emptySeo,
    ...initialValues.seo,
  });

  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

  function updateField(
    field: "title" | "slug" | "description" | "image",
    value: string
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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    setError("");

    const cleanSeo: SeoValues = {
      metaTitle: seo.metaTitle.trim(),
      metaDescription: seo.metaDescription.trim(),
      keywords: seo.keywords.trim(),
      ogTitle: seo.ogTitle.trim(),
      ogDescription: seo.ogDescription.trim(),
      ogImage: seo.ogImage.trim(),
      canonicalUrl: seo.canonicalUrl.trim(),
    };

    const service: ServiceFormValues = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      description: values.description.trim(),
      image: values.image.trim(),
      seo: cleanSeo,
    };

    if (
      !service.title ||
      !service.slug ||
      !service.description ||
      !service.image
    ) {
      setError("Please complete all required service fields.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(service.slug)) {
      setError(
        "Use lowercase English letters, numbers and single hyphens for the slug."
      );
      return;
    }

    if (!isHttpUrl(service.image)) {
      setError("Please enter a valid HTTP or HTTPS service image URL.");
      return;
    }

    if (cleanSeo.ogImage && !isHttpUrl(cleanSeo.ogImage)) {
      setError("Please enter a valid HTTP or HTTPS Open Graph image URL.");
      return;
    }

    if (cleanSeo.canonicalUrl && !isHttpUrl(cleanSeo.canonicalUrl)) {
      setError("Please enter a valid HTTP or HTTPS canonical URL.");
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);

    try {
      await onSubmit(service);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
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
              Service Title
            </label>

            <input
              id="service-title"
              name="title"
              type="text"
              value={values.title}
              onChange={(event) => handleTitleChange(event.target.value)}
              placeholder="Kitchen Renovation"
              className="form-input w-full"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="service-slug" className="form-label">
              SEO-friendly Slug
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
              placeholder="kitchen-renovation"
              aria-describedby="service-slug-help"
              className="form-input w-full"
              required
            />

            <p
              id="service-slug-help"
              className="break-all text-sm leading-6 text-muted"
            >
              Page path: /services/{values.slug || "your-service-slug"}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="service-description" className="form-label">
            Description
          </label>

          <textarea
            id="service-description"
            name="description"
            rows={6}
            value={values.description}
            onChange={(event) =>
              updateField("description", event.target.value)
            }
            placeholder="Describe the service and what it includes."
            className="form-input w-full resize-y"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="service-image" className="form-label">
            Image URL
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

        <SeoFields
          value={seo}
          onChange={setSeo}
          fallbackTitle={values.title}
          fallbackDescription={values.description}
          fallbackImage={values.image}
        />
      </fieldset>

      {error && (
        <p
          role="alert"
          className="mt-6 rounded-xl border border-border bg-background px-4 py-3 text-sm leading-6 text-foreground"
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