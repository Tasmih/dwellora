"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { FiHome } from "react-icons/fi";

type SafeImageProps = Omit<ImageProps, "onError"> & {
  fallbackTitle?: string;
};

export default function SafeImage({
  src,
  alt,
  fallbackTitle,
  className = "",
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  // If source is missing or an error occurred during loading/optimization
  if (error || !src) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-brand/90 to-brand p-6 text-center text-background ${className}`}
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

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
}
