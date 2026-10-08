"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FiHome } from "react-icons/fi";
import { getSafeImageSrc } from "@/lib/url";

type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  src?: string | null;
  fallbackTitle?: string;
  thumbnailWidth?: number;
};

export default function SafeImage({
  src,
  alt,
  fallbackTitle,
  thumbnailWidth,
  className = "",
  priority = false,
  loading,
  sizes,
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // Validate, sanitize, and auto-optimize Cloudinary / CDN sources
  const safeSrc = getSafeImageSrc(src, thumbnailWidth);

  // If source is missing, invalid, or an error occurred during loading/optimization
  if (error || !safeSrc) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-[#0F2F2A] p-6 text-center text-background ${className}`}
        role="img"
        aria-label={alt || fallbackTitle || "Dwellora renovation"}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/20 text-accent">
          <FiHome className="h-6 w-6" aria-hidden="true" />
        </div>

        <p className="mt-3 text-sm font-semibold tracking-wide text-background/95">
          {fallbackTitle || alt || "Dwellora Craftsmanship"}
        </p>

        <span className="mt-1 text-[10px] uppercase tracking-widest text-accent">
          Home Renovation &amp; Carpentry
        </span>
      </div>
    );
  }

  // Determine optimal loading strategy
  const computedLoading = priority ? undefined : (loading || "lazy");
  // Responsive default sizes for fill layout if not explicitly provided
  const computedSizes =
    props.fill && !sizes
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : sizes;

  return (
    <Image
      src={safeSrc}
      alt={alt || fallbackTitle || "Dwellora renovation and custom carpentry"}
      className={className}
      priority={priority}
      loading={computedLoading}
      sizes={computedSizes}
      onError={() => setError(true)}
      {...props}
    />
  );
}
