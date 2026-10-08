"use client";

import { useState } from "react";
import { FiPlay } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";
import { getSafeVideoSrc, getVideoThumbnail } from "@/lib/url";

type VideoEmbedProps = {
  videoUrl: string;
  coverImage?: string;
  title?: string;
};

function getEmbedInfo(url: string): { type: "youtube" | "vimeo" | "video" | "iframe"; embedUrl: string } {
  const trimmed = url.trim();

  // YouTube matchers
  const ytRegex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
  const ytMatch = trimmed.match(ytRegex);
  if (ytMatch && ytMatch[1]) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
    };
  }

  // Vimeo matchers
  const vimeoRegex = /(?:vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|))(\d+)/;
  const vimeoMatch = trimmed.match(vimeoRegex);
  if (vimeoMatch && vimeoMatch[3]) {
    return {
      type: "vimeo",
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[3]}?autoplay=1`,
    };
  }

  // Direct video files & Cloudinary video assets
  if (
    /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(trimmed) ||
    (trimmed.includes("cloudinary.com") && trimmed.includes("/video/upload/"))
  ) {
    return {
      type: "video",
      embedUrl: trimmed,
    };
  }

  return {
    type: "iframe",
    embedUrl: trimmed,
  };
}

export default function VideoEmbed({
  videoUrl,
  coverImage,
  title = "Video player",
}: VideoEmbedProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const embedInfo = getEmbedInfo(videoUrl);
  const posterSrc = coverImage?.trim() || getVideoThumbnail(videoUrl);

  if (!isPlaying && posterSrc) {
    return (
      <div className="group relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-neutral-950 shadow-xl">
        <SafeImage
          src={posterSrc}
          alt={title}
          fallbackTitle={title}
          fill
          thumbnailWidth={1200}
          sizes="(min-width: 1280px) 1152px, (min-width: 1024px) 896px, 100vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 transition-colors duration-300 group-hover:bg-black/50" />

        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label={`Play video: ${title}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-accent cursor-pointer"
        >
          <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-accent text-brand shadow-2xl transition-transform duration-300 group-hover:scale-110">
            <FiPlay className="h-7 w-7 sm:h-9 sm:w-9 fill-brand translate-x-0.5" />
          </div>
          <span className="text-sm sm:text-base font-semibold tracking-wide drop-shadow-md">
            Click to Play Video
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-neutral-950 shadow-xl">
      {embedInfo.type === "video" ? (
        <video
          src={getSafeVideoSrc(embedInfo.embedUrl)}
          controls
          autoPlay={isPlaying}
          preload="metadata"
          poster={posterSrc || undefined}
          className="h-full w-full object-contain bg-black"
        >
          Your browser does not support HTML5 video.
        </video>
      ) : (
        <iframe
          src={embedInfo.embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="h-full w-full border-0"
        />
      )}
    </div>
  );
}
