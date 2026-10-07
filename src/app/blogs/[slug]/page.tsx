import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  FiClock,
  FiUser,
  FiVideo,
  FiFileText,
  FiArrowLeft,
  FiCalendar,
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { PublicBlog } from "@/components/PublicBlogCard";
import SafeImage from "@/components/SafeImage";
import VideoEmbed from "@/components/VideoEmbed";
import RelatedStoriesCarousel from "@/components/RelatedStoriesCarousel";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type BlogDetails = PublicBlog & {
  status: "published" | "draft";
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://dwellora.vercel.app")
  );
}

// Fetch single blog/vlog by slug (cache per request)
const getBlog = cache(async (slug: string): Promise<BlogDetails | null> => {
  try {
    const response = await fetch(
      `${API_URL}/api/blogs/slug/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to load article (status: ${response.status}).`);
    }

    const data: { blog: BlogDetails } = await response.json();
    return data.blog;
  } catch {
    return null;
  }
});

// Fetch other published blogs/vlogs
async function getRelatedBlogs(
  currentSlug: string
): Promise<PublicBlog[]> {
  try {
    const res = await fetch(`${API_URL}/api/blogs`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.blogs || []).filter(
        (b: PublicBlog) => b.slug !== currentSlug
      );
    }
    return [];
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    return {
      title: "Article Not Found | Dwellora",
      description: "The requested article could not be found.",
    };
  }

  const seo = blog.seo;
  const title = seo?.metaTitle?.trim() || `${blog.title} | Dwellora`;
  const description =
    seo?.metaDescription?.trim() ||
    blog.shortDescription?.trim() ||
    blog.content.slice(0, 160).trim();

  const ogTitle = seo?.ogTitle?.trim() || title;
  const ogDescription = seo?.ogDescription?.trim() || description;
  const ogImage = seo?.ogImage?.trim() || blog.coverImage;
  const canonicalUrl =
    seo?.canonicalUrl?.trim() ||
    new URL(`/blogs/${encodeURIComponent(blog.slug)}`, getSiteUrl()).toString();

  const keywords = seo?.keywords
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    title: { absolute: title },
    description,
    keywords: keywords?.length ? keywords : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      siteName: "Dwellora",
      title: ogTitle,
      description: ogDescription,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage, alt: blog.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog) {
    notFound();
  }

  const relatedBlogs = await getRelatedBlogs(blog.slug);
  const isVlog = blog.type === "vlog";
  const hasCoverImage = Boolean(blog.coverImage && blog.coverImage.trim());
  const hasVideo = Boolean(blog.videoUrl && blog.videoUrl.trim());

  // Format date if present
  let formattedDate: string | null = null;
  if (blog.createdAt) {
    try {
      formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      formattedDate = null;
    }
  }

  return (
    <>
      <Navbar />

      <main className="site-container page-spacing">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="mb-6 sm:mb-8">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
            <li>
              <Link href="/" className="transition-colors hover:text-brand">
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li>
              <Link href="/blogs" className="transition-colors hover:text-brand">
                Journal
              </Link>
            </li>
            <li aria-hidden="true" className="text-border">
              /
            </li>
            <li
              aria-current="page"
              className="max-w-[200px] sm:max-w-md truncate font-medium text-brand"
            >
              {blog.title}
            </li>
          </ol>
        </nav>

        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-muted transition-colors hover:text-brand"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to All Stories</span>
          </Link>
        </div>

        {/* Article Header */}
        <article className="mx-auto max-w-4xl">
          <header className="space-y-4 text-center sm:text-left">
            {/* Format Badge */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${
                  isVlog
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-brand/10 text-brand border border-brand/20"
                }`}
              >
                {isVlog ? (
                  <>
                    <FiVideo className="h-3.5 w-3.5" /> Video Story
                  </>
                ) : (
                  <>
                    <FiFileText className="h-3.5 w-3.5" /> Editorial Article
                  </>
                )}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl leading-[1.15]">
              {blog.title}
            </h1>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs sm:text-sm text-muted border-b border-border pb-6">
              {blog.author && (
                <span className="inline-flex items-center gap-1.5 font-medium text-brand">
                  <FiUser className="h-4 w-4 text-accent" />
                  {blog.author}
                </span>
              )}

              {blog.readTime && (
                <span className="inline-flex items-center gap-1.5">
                  <FiClock className="h-4 w-4 text-accent" />
                  {blog.readTime}
                </span>
              )}

              {formattedDate && (
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar className="h-4 w-4 text-accent" />
                  {formattedDate}
                </span>
              )}
            </div>
          </header>

          {/* Media Section: Cover Image and/or Video Player strictly from Database Data */}
          {(hasCoverImage || hasVideo) && (
            <div className="mt-8 space-y-8">
              {/* 1. Full-Width Hero Cover Image (only if coverImage exists in database) */}
              {hasCoverImage && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-background shadow-lg">
                  <SafeImage
                    src={blog.coverImage!}
                    alt={blog.title}
                    fallbackTitle={blog.title}
                    fill
                    priority
                    sizes="(min-width: 1280px) 1152px, (min-width: 1024px) 896px, 100vw"
                    className="object-cover object-center"
                  />
                </div>
              )}

              {/* 2. Full-Width Video Player (only if videoUrl exists in database; rendered below cover image if both exist) */}
              {hasVideo && (
                <div className="w-full">
                  <VideoEmbed
                    videoUrl={blog.videoUrl!}
                    title={blog.title}
                  />
                </div>
              )}
            </div>
          )}

          {/* Short Description / Lead Excerpt */}
          {blog.shortDescription && (
            <div className="mt-10 rounded-2xl border-l-4 border-accent bg-surface p-6 sm:p-8">
              <p className="text-lg sm:text-xl font-medium leading-relaxed text-brand italic">
                &ldquo;{blog.shortDescription}&rdquo;
              </p>
            </div>
          )}

          {/* Body Content */}
          <div className="mt-10 prose prose-lg max-w-none text-foreground">
            <div className="space-y-6 text-base sm:text-lg leading-8 text-foreground/90 whitespace-pre-line">
              {blog.content}
            </div>
          </div>

          {/* Article Footer & Author Box */}
          <footer className="mt-10 sm:mt-12 rounded-3xl border border-border bg-surface p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-brand text-white font-semibold text-xl shadow-md">
                D
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Published By
                </p>
                <h3 className="text-lg font-semibold text-brand">
                  {blog.author || "Dwellora Editorial Team"}
                </h3>
                <p className="text-sm leading-6 text-muted">
                  Dedicated to sharing thoughtful architectural transformations, master joinery techniques, and refined residential design inspiration.
                </p>
              </div>
            </div>
          </footer>
        </article>

        {/* Related Stories Infinite Carousel */}
        {relatedBlogs.length > 0 && (
          <section
            aria-label="Related Stories"
            className="section-gap-top border-t border-border pt-6 sm:pt-8"
          >
            <RelatedStoriesCarousel blogs={relatedBlogs} />
          </section>
        )}

        {/* Bottom Consultation CTA */}
        <section
          aria-labelledby="consultation-cta-heading"
          className="section-gap-top overflow-hidden rounded-3xl bg-brand p-6 text-background sm:p-10 lg:p-12 text-center"
        >
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Let&apos;s Build Together
            </p>

            <h2
              id="consultation-cta-heading"
              className="mt-3 text-2xl font-semibold tracking-tight text-background sm:text-3xl lg:text-4xl"
            >
              Have a renovation or custom carpentry idea?
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-background/80">
              Speak directly with our architectural woodwork and renovation team to bring your vision to life.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="btn btn-primary">
                Request a Consultation
              </Link>
              <Link href="/services" className="btn btn-outline-light">
                Explore All Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
