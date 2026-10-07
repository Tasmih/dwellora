import type { CSSProperties } from "react";
import Link from "next/link";
import {
  FiClock,
  FiUser,
  FiArrowRight,
  FiVideo,
  FiFileText,
  FiPlay,
} from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

export type PublicBlog = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  content: string;
  coverImage?: string;
  type: "blog" | "vlog";
  videoUrl?: string;
  author: string;
  readTime: string;
  createdAt?: string | Date;
};

type PublicBlogCardProps = {
  blog: PublicBlog;
  className?: string;
  style?: CSSProperties;
};

function getVideoThumbnail(url?: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  if (trimmed.includes("cloudinary.com") && trimmed.includes("/video/upload/")) {
    return trimmed.replace(/\.(mp4|webm|ogg|mov|mkv)(\?.*)?$/i, ".jpg$2");
  }

  const ytMatch = trimmed.match(
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return trimmed.replace(/\.(mp4|webm|ogg)(\?.*)?$/i, ".jpg$2");
  }

  return null;
}

export default function PublicBlogCard({
  blog,
  className = "",
  style,
}: PublicBlogCardProps) {
  const summary =
    blog.shortDescription?.trim() ||
    (blog.content.length > 150
      ? `${blog.content.slice(0, 150).trim()}...`
      : blog.content);

  const href = `/blogs/${encodeURIComponent(blog.slug)}`;
  const hasCoverImage = Boolean(blog.coverImage && blog.coverImage.trim());
  const hasVideo = Boolean(blog.videoUrl && blog.videoUrl.trim());
  const isVlog = blog.type === "vlog" || hasVideo;

  const videoThumbnail = hasVideo ? getVideoThumbnail(blog.videoUrl) : null;
  const thumbnailSrc = hasCoverImage ? blog.coverImage : videoThumbnail;

  return (
    <article
      style={style}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-border/80 bg-surface shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] hover:border-accent/60 hover:shadow-xl ${className}`}
    >
      <Link
        href={href}
        aria-label={`Read ${blog.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-background"
      >
        {thumbnailSrc ? (
          <>
            <SafeImage
              src={thumbnailSrc}
              alt={blog.title}
              fallbackTitle={blog.title}
              fill
              thumbnailWidth={800}
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80"
            />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-brand/5 p-6 text-center">
            <span className="text-sm font-semibold text-brand">
              {blog.title}
            </span>
          </div>
        )}

        {/* Format Badge */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md shadow-sm ${
              isVlog
                ? "bg-brand text-white border border-white/20"
                : "bg-surface/95 text-brand border border-border/60"
            }`}
          >
            {isVlog ? (
              <>
                <FiVideo className="h-3 w-3 text-accent" /> Vlog
              </>
            ) : (
              <>
                <FiFileText className="h-3 w-3 text-accent" /> Article
              </>
            )}
          </span>
        </div>

        {/* Play Icon for Videos */}
        {hasVideo && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-accent text-brand shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-hover">
              <FiPlay className="h-5 w-5 sm:h-6 sm:w-6 fill-brand translate-x-0.5" />
            </div>
          </div>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-muted">
          {blog.author && (
            <span className="inline-flex items-center gap-1.5">
              <FiUser className="h-3.5 w-3.5 text-accent" />
              {blog.author}
            </span>
          )}
          {blog.readTime && (
            <span className="inline-flex items-center gap-1.5">
              <FiClock className="h-3.5 w-3.5 text-accent" />
              {blog.readTime}
            </span>
          )}
        </div>

        <h3 className="mt-3 text-xl font-bold tracking-tight text-brand transition-colors duration-200 group-hover:text-accent line-clamp-2">
          <Link href={href}>
            {blog.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted line-clamp-3">
          {summary}
        </p>

        <div className="mt-auto pt-6 border-t border-border/50">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-between rounded-full bg-background px-5 py-2.5 text-xs sm:text-sm font-semibold text-brand transition-all duration-300 group-hover:bg-brand group-hover:text-white"
          >
            <span>{isVlog ? "Watch Video Tour" : "Read Full Story"}</span>
            <FiArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}
