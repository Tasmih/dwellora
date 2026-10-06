"use client";

import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import PublicBlogCard, { type PublicBlog } from "@/components/PublicBlogCard";

type RelatedStoriesCarouselProps = {
  blogs: PublicBlog[];
};

export default function RelatedStoriesCarousel({
  blogs,
}: RelatedStoriesCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (blogs.length === 0) {
    return null;
  }

  // Duplicate cards for seamless loop
  const repeatedBlogs =
    blogs.length < 4
      ? [...blogs, ...blogs, ...blogs, ...blogs]
      : [...blogs, ...blogs];

  const handleScroll = (direction: "left" | "right") => {
    if (!containerRef.current) return;
    const amount = direction === "left" ? -380 : 380;
    containerRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <div
      className="relative pause-on-hover"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Continue Reading
          </p>
          <h2 className="mt-1 text-2xl sm:text-3xl font-semibold tracking-tight text-brand">
            Related Stories &amp; Videos
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleScroll("left")}
            aria-label="Scroll left"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-brand shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand hover:text-white active:scale-95"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => handleScroll("right")}
            aria-label="Scroll right"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-brand shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand hover:text-white active:scale-95"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="overflow-x-auto scrollbar-none rounded-3xl py-3"
      >
        <div
          className="animate-continuous-scroll flex gap-6"
          style={{
            animationPlayState: isPaused ? "paused" : "running",
          }}
        >
          {repeatedBlogs.map((blog, idx) => (
            <div
              key={`${blog._id || blog.slug}-${idx}`}
              className="w-[280px] sm:w-[340px] lg:w-[380px] shrink-0"
            >
              <PublicBlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
