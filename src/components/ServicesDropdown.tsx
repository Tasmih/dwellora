"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import Loading from "@/components/common/Loading";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export type NavCategoryItem = {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  displayOrder?: number;
};

type ServicesDropdownProps = {
  isMobile?: boolean;
  active: boolean;
  onNavigate?: () => void;
};

let cachedNavCategories: NavCategoryItem[] | null = null;
let categoryFetchPromise: Promise<NavCategoryItem[]> | null = null;

async function fetchNavCategories(): Promise<NavCategoryItem[]> {
  if (cachedNavCategories) {
    return cachedNavCategories;
  }
  if (!categoryFetchPromise) {
    categoryFetchPromise = fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 120 },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        cachedNavCategories = data.categories || [];
        return cachedNavCategories!;
      })
      .catch((err) => {
        console.warn("Could not load published categories for navbar:", err);
        return [];
      })
      .finally(() => {
        categoryFetchPromise = null;
      });
  }
  return categoryFetchPromise;
}

export default function ServicesDropdown({
  isMobile = false,
  active,
  onNavigate,
}: ServicesDropdownProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<NavCategoryItem[]>(
    cachedNavCategories || []
  );
  const [loaded, setLoaded] = useState(Boolean(cachedNavCategories));

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let isMounted = true;

    if (!cachedNavCategories) {
      fetchNavCategories().then((cats) => {
        if (isMounted) {
          setCategories(cats);
          setLoaded(true);
        }
      });
    }

    return () => {
      isMounted = false;
    };
  }, []);

  // Click outside to close (desktop)
  useEffect(() => {
    if (isMobile || !open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, isMobile]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape" && open) {
      e.stopPropagation();
      setOpen(false);
      buttonRef.current?.focus();
    }
  }

  function handleSelect() {
    setOpen(false);
    onNavigate?.();
  }

  // Mobile rendering
  if (isMobile) {
    return (
      <div onKeyDown={handleKeyDown} className="flex flex-col">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-services-menu"
          onClick={() => setOpen((prev) => !prev)}
          className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none ${
            active || open
              ? "bg-brand/5 text-brand"
              : "text-muted hover:bg-brand/5 hover:text-brand"
          }`}
        >
          <span>Services</span>
          <FiChevronDown
            className={`h-4 w-4 text-accent transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>

        {open && (
          <div
            id="mobile-services-menu"
            className="my-1 ml-4 flex flex-col space-y-1 border-l-2 border-border/80 pl-3"
          >
            {!loaded ? (
              <div className="py-2 pl-2">
                <Loading variant="inline" size="sm" text="Loading categories..." />
              </div>
            ) : categories.length === 0 ? (
              <p className="px-3 py-2 text-xs text-muted">No categories available</p>
            ) : (
              categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/services/category/${encodeURIComponent(cat.slug)}`}
                  onClick={handleSelect}
                  className="rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-brand/5 hover:text-brand"
                >
                  {cat.name}
                </Link>
              ))
            )}

            <Link
              href="/services"
              onClick={handleSelect}
              className="mt-1 flex items-center justify-between rounded-md px-3 py-2 text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/10 hover:text-accent-hover"
            >
              <span>View All Services</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    );
  }

  // Desktop rendering
  const hasTwoColumns = categories.length >= 4;
  const midPoint = Math.ceil(categories.length / 2);
  const leftColumnCategories = categories.slice(0, midPoint);
  const rightColumnCategories = categories.slice(midPoint);

  const renderCategoryItem = (cat: NavCategoryItem) => {
    const excerpt =
      cat.description && cat.description.length > 60
        ? `${cat.description.slice(0, 60).trim()}...`
        : cat.description;

    return (
      <Link
        key={cat.slug}
        role="menuitem"
        href={`/services/category/${encodeURIComponent(cat.slug)}`}
        onClick={handleSelect}
        className="group/item flex flex-col rounded-xl p-2.5 transition-colors hover:bg-background/80"
      >
        <span className="text-sm font-medium text-brand transition-colors group-hover/item:text-brand-hover">
          {cat.name}
        </span>
        {excerpt && (
          <span className="mt-0.5 line-clamp-1 text-xs text-muted">
            {excerpt}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div
      ref={containerRef}
      onKeyDown={handleKeyDown}
      className="relative"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls="desktop-services-dropdown"
        onClick={() => setOpen((prev) => !prev)}
        className={`group relative inline-flex items-center gap-1.5 rounded-sm py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${
          active || open ? "text-brand" : "text-muted hover:text-brand"
        }`}
      >
        <span>Services</span>
        <FiChevronDown
          className={`h-3.5 w-3.5 text-accent transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />

        <span
          aria-hidden="true"
          className={`absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-200 motion-reduce:transition-none ${
            active || open ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        />
      </button>

      {open && (
        <div
          id="desktop-services-dropdown"
          role="menu"
          aria-label="Services dropdown"
          className={`absolute left-0 top-full z-50 mt-3 max-h-[calc(100vh-6rem)] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-border bg-surface/98 p-5 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150 ${
            hasTwoColumns ? "w-[540px]" : "w-[360px]"
          }`}
        >
          <div className="mb-3 flex items-center justify-between border-b border-border pb-2.5">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
              Service Categories
            </span>
            <span className="text-xs text-muted">
              {categories.length}{" "}
              {categories.length === 1 ? "Category" : "Categories"}
            </span>
          </div>

          {!loaded ? (
            <div className="py-6 flex justify-center">
              <Loading variant="inline" size="sm" text="Loading categories..." />
            </div>
          ) : categories.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs text-muted">
                Explore all our bespoke renovation and carpentry services.
              </p>
            </div>
          ) : hasTwoColumns ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 py-1">
              <div className="flex flex-col space-y-1">
                {leftColumnCategories.map(renderCategoryItem)}
              </div>
              <div className="flex flex-col space-y-1">
                {rightColumnCategories.map(renderCategoryItem)}
              </div>
            </div>
          ) : (
            <div className="flex flex-col space-y-1 py-1">
              {categories.map(renderCategoryItem)}
            </div>
          )}

          <div className="mt-3 border-t border-border pt-3">
            <Link
              role="menuitem"
              href="/services"
              onClick={handleSelect}
              className="group/all flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold uppercase tracking-wider text-accent transition-colors hover:bg-accent/10 hover:text-accent-hover"
            >
              <span>View All Services</span>
              <span
                aria-hidden="true"
                className="transition-transform duration-150 group-hover/all:translate-x-1"
              >
                &rarr;
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
