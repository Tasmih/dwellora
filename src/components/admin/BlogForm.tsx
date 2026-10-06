"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { FiFileText, FiVideo } from "react-icons/fi";

import SeoFields, {
  emptySeo,
  type SeoValues,
} from "@/components/admin/SeoFields";
import { sanitizeHttpsUrl } from "@/lib/url";
import SafeImage from "@/components/SafeImage";

export type BlogType = "blog" | "vlog";
export type BlogStatus = "published" | "draft";

export type BlogFormValues = {
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  coverImage?: string;
  type: BlogType;
  videoUrl?: string;
  author?: string;
  readTime?: string;
  status?: BlogStatus;
  seo?: SeoValues;
};

type BlogFormProps = {
  initialValues?: BlogFormValues;
  onSubmit: (values: BlogFormValues) => Promise<void>;
  submitLabel?: string;
  loadingLabel?: string;
};

const emptyValues: BlogFormValues = {
  title: "",
  slug: "",
  shortDescription: "",
  content: "",
  coverImage: "",
  type: "blog",
  videoUrl: "",
  author: "Dwellora Editorial Team",
  readTime: "",
  status: "published",
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function calculateReadTimePreview(content: string, type: BlogType): string {
  if (type === "vlog") return "Video";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export default function BlogForm({
  initialValues = emptyValues,
  onSubmit,
  submitLabel = "Create Blog",
  loadingLabel = "Creating...",
}: BlogFormProps) {
  const [values, setValues] = useState<BlogFormValues>({
    ...emptyValues,
    ...initialValues,
    shortDescription:
      initialValues.shortDescription ||
      (initialValues.content
        ? initialValues.content.slice(0, 160).trim()
        : ""),
    type: initialValues.type || "blog",
    coverImage: initialValues.coverImage || "",
    videoUrl: initialValues.videoUrl || "",
    author: initialValues.author || "Dwellora Editorial Team",
    readTime: initialValues.readTime || "",
    status: initialValues.status || "published",
  });

  const [seo, setSeo] = useState<SeoValues>({
    ...emptySeo,
    ...initialValues.seo,
  });

  const [slugEdited, setSlugEdited] = useState(Boolean(initialValues.slug));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const submittingRef = useRef(false);

  function handleTitleChange(title: string) {
    setValues((current) => ({
      ...current,
      title,
      slug: slugEdited ? current.slug : createSlug(title),
    }));
  }

  const estimatedReadTime = calculateReadTimePreview(values.content, values.type);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submittingRef.current) return;

    setError("");

    if (!values.title.trim()) {
      setError("Title is required.");
      return;
    }

    if (!values.slug.trim()) {
      setError("Slug is required.");
      return;
    }

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.slug)) {
      setError(
        "Slug must contain lowercase English letters, numbers and single hyphens."
      );
      return;
    }

    const hasCover = Boolean(values.coverImage && values.coverImage.trim());
    const hasVideo = Boolean(values.videoUrl && values.videoUrl.trim());

    if (!hasCover && !hasVideo) {
      setError(
        "At least one media source is required: provide a Cover Image URL, a Video URL, or both."
      );
      return;
    }

    let sanitizedCover: string | undefined = undefined;
    if (hasCover) {
      const { url: validCover, error: coverError } = sanitizeHttpsUrl(
        values.coverImage!
      );
      if (coverError || !validCover) {
        setError(coverError || "Please provide a valid HTTPS cover image URL.");
        return;
      }
      sanitizedCover = validCover;
    }

    let sanitizedVideoUrl: string | undefined = undefined;
    if (hasVideo) {
      const { url: validVideo, error: videoError } = sanitizeHttpsUrl(
        values.videoUrl!
      );
      if (videoError || !validVideo) {
        setError(videoError || "Please provide a valid HTTPS video URL.");
        return;
      }
      sanitizedVideoUrl = validVideo;
    }

    if (!values.content.trim()) {
      setError("Content is required.");
      return;
    }

    const payload: BlogFormValues = {
      title: values.title.trim(),
      slug: values.slug.trim(),
      shortDescription:
        values.shortDescription?.trim() ||
        values.content.slice(0, 160).trim(),
      content: values.content.trim(),
      ...(sanitizedCover ? { coverImage: sanitizedCover } : {}),
      type: values.type,
      ...(sanitizedVideoUrl ? { videoUrl: sanitizedVideoUrl } : {}),
      author: values.author?.trim() || "Dwellora Editorial Team",
      readTime: values.readTime?.trim() || estimatedReadTime,
      status: values.status || "published",
      seo: {
        metaTitle: seo.metaTitle.trim(),
        metaDescription: seo.metaDescription.trim(),
        keywords: seo.keywords.trim(),
        ogTitle: seo.ogTitle.trim(),
        ogDescription: seo.ogDescription.trim(),
        ogImage: seo.ogImage.trim() || sanitizedCover || "",
        canonicalUrl: seo.canonicalUrl.trim(),
      },
    };

    try {
      submittingRef.current = true;
      setSubmitting(true);
      await onSubmit(payload);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save blog post."
      );
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {error}
        </div>
      )}

      {/* Basic Article Information */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-brand">Article Details</h2>
          <p className="mt-1 text-sm text-muted">
            Core article information, publication format, and presentation.
          </p>
        </div>

        {/* Format Selector: Blog vs Vlog */}
        <div className="space-y-2">
          <label className="form-label">Article Format</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setValues((c) => ({ ...c, type: "blog" }))}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                values.type === "blog"
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-background hover:border-brand/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  values.type === "blog"
                    ? "bg-brand text-white"
                    : "bg-surface text-muted"
                }`}
              >
                <FiFileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-brand">Editorial Article</p>
                <p className="text-xs text-muted">
                  Written journal, design guides &amp; renovation tips
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setValues((c) => ({ ...c, type: "vlog" }))}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                values.type === "vlog"
                  ? "border-accent bg-accent/10 shadow-sm"
                  : "border-border bg-background hover:border-brand/40"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  values.type === "vlog"
                    ? "bg-brand text-white"
                    : "bg-surface text-muted"
                }`}
              >
                <FiVideo className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-brand">Video Story / Vlog</p>
                <p className="text-xs text-muted">
                  Video site walkthroughs, craftsman interviews &amp; BTS
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <label htmlFor="blog-title" className="form-label">
            Title <span className="text-accent">*</span>
          </label>
          <input
            id="blog-title"
            type="text"
            required
            value={values.title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="e.g. The Art of Bespoke Teak Joinery in Modern Interiors"
            className="form-input w-full"
          />
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <label htmlFor="blog-slug" className="form-label">
            URL Slug <span className="text-accent">*</span>
          </label>
          <input
            id="blog-slug"
            type="text"
            required
            value={values.slug}
            onChange={(e) => {
              setSlugEdited(true);
              setValues((c) => ({ ...c, slug: e.target.value }));
            }}
            placeholder="e.g. art-of-bespoke-teak-joinery"
            className="form-input w-full"
          />
          <p className="text-xs text-muted">
            Public link: /blogs/{values.slug || "your-slug"}
          </p>
        </div>

        {/* Author & Read Time */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="blog-author" className="form-label">
              Author
            </label>
            <input
              id="blog-author"
              type="text"
              value={values.author}
              onChange={(e) =>
                setValues((c) => ({ ...c, author: e.target.value }))
              }
              placeholder="e.g. Dwellora Editorial Team"
              className="form-input w-full"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="blog-read-time" className="form-label">
              Read Time (Optional override)
            </label>
            <input
              id="blog-read-time"
              type="text"
              value={values.readTime}
              onChange={(e) =>
                setValues((c) => ({ ...c, readTime: e.target.value }))
              }
              placeholder={`Auto-estimated: ${estimatedReadTime}`}
              className="form-input w-full"
            />
            <p className="text-xs text-muted">
              Auto calculated: {estimatedReadTime}
            </p>
          </div>
        </div>

        {/* Media Sources Notice */}
        <div className="rounded-xl border border-border bg-background p-4 text-xs text-muted">
          <span className="font-semibold text-brand">Media Requirement:</span> You must provide at least one media source (Cover Image URL, Video URL, or both).
        </div>

        {/* Cover Image URL & Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="blog-cover-image" className="form-label">
              Cover Image URL
            </label>
            <span className="text-xs text-muted">
              Optional if Video URL is provided
            </span>
          </div>
          <input
            id="blog-cover-image"
            type="url"
            value={values.coverImage}
            onChange={(e) =>
              setValues((c) => ({ ...c, coverImage: e.target.value }))
            }
            placeholder="https://images.unsplash.com/..."
            className="form-input w-full"
          />

          {values.coverImage && values.coverImage.trim() && (
            <div className="mt-3 flex items-center gap-4 rounded-xl border border-border bg-background p-3">
              <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-surface">
                <SafeImage
                  src={values.coverImage}
                  alt="Cover preview"
                  fallbackTitle="Preview"
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 text-xs text-muted">
                <p className="font-medium text-brand truncate">Image Preview</p>
                <p className="truncate">{values.coverImage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Video URL */}
        <div
          className={`space-y-2 rounded-xl border p-4 ${
            values.type === "vlog"
              ? "border-purple-200 bg-purple-50/50"
              : "border-border bg-background"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium text-sm text-brand">
              <FiVideo className="h-4 w-4 text-accent" />
              <span>Video Embed / Stream URL</span>
            </div>
            <span className="text-xs text-muted">
              Optional if Cover Image is provided
            </span>
          </div>
          <input
            id="blog-video-url"
            type="url"
            value={values.videoUrl}
            onChange={(e) =>
              setValues((c) => ({ ...c, videoUrl: e.target.value }))
            }
            placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/... or .mp4"
            className="form-input w-full bg-surface"
          />
          <p className="text-xs text-muted">
            Supports YouTube, Vimeo, or direct MP4/WebM video streams.
          </p>
        </div>

        {/* Publication Status */}
        <div className="space-y-2">
          <label htmlFor="blog-status" className="form-label">
            Publication Status
          </label>
          <select
            id="blog-status"
            value={values.status}
            onChange={(e) =>
              setValues((c) => ({
                ...c,
                status: e.target.value as BlogStatus,
              }))
            }
            className="form-input w-full sm:max-w-xs"
          >
            <option value="published">Published (Visible publicly)</option>
            <option value="draft">Draft (Hidden from public)</option>
          </select>
        </div>
      </section>

      {/* Content Section */}
      <section className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-brand">Article Content</h2>
          <p className="mt-1 text-sm text-muted">
            Write your full article body, insights, and summaries.
          </p>
        </div>

        {/* Short Description */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="blog-short-description" className="form-label">
              Short Description / Excerpt
            </label>
            <span className="text-xs text-muted">
              {values.shortDescription?.length || 0} / 160 recommended
            </span>
          </div>
          <textarea
            id="blog-short-description"
            rows={3}
            value={values.shortDescription}
            onChange={(e) =>
              setValues((c) => ({ ...c, shortDescription: e.target.value }))
            }
            placeholder="A compelling 1-2 sentence preview for cards and social sharing..."
            className="form-input w-full resize-y"
          />
        </div>

        {/* Full Content */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="blog-content" className="form-label">
              Full Content <span className="text-accent">*</span>
            </label>
            <span className="text-xs text-muted">
              {values.content.trim().split(/\s+/).filter(Boolean).length} words ·{" "}
              {estimatedReadTime}
            </span>
          </div>
          <textarea
            id="blog-content"
            required
            rows={12}
            value={values.content}
            onChange={(e) =>
              setValues((c) => ({ ...c, content: e.target.value }))
            }
            placeholder="Write the full content of your article or video description here..."
            className="form-input w-full resize-y font-mono text-sm leading-6"
          />
        </div>
      </section>

      {/* SEO Section */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <SeoFields
          value={seo}
          onChange={setSeo}
          fallbackTitle={values.title ? `${values.title} | Dwellora` : "Dwellora Journal"}
          fallbackDescription={
            values.shortDescription?.trim() ||
            values.content.slice(0, 160).trim()
          }
          fallbackImage={values.coverImage || ""}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Link
          href="/admin/blogs"
          className="btn btn-secondary w-full sm:w-auto text-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={submitting}
          className="btn btn-primary w-full sm:w-auto disabled:opacity-60"
        >
          {submitting ? loadingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
