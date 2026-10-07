"use client";

import Link from "next/link";
import { FiMenu, FiExternalLink, FiGlobe, FiRadio } from "react-icons/fi";

type AdminHeaderProps = {
  onToggleMenu?: () => void;
};

export default function AdminHeader({ onToggleMenu }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 sm:h-20 w-full items-center justify-between border-b border-border/80 bg-surface/95 px-4 sm:px-6 lg:px-8 backdrop-blur-md shadow-xs">
      {/* Left: Mobile Menu Button + Title */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {onToggleMenu && (
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label="Open sidebar menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-brand shadow-xs hover:border-accent hover:text-accent lg:hidden transition-all duration-200 cursor-pointer"
          >
            <FiMenu className="h-5 w-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="truncate text-sm sm:text-base font-bold text-brand">
              Welcome back, Dwellora Admin
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live CMS
            </span>
          </div>

          <p className="truncate text-[11px] sm:text-xs text-muted">
            Manage Dwellora website content, catalog &amp; inquiries
          </p>
        </div>
      </div>

      {/* Right: Quick Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex h-9 sm:h-10 items-center justify-center gap-2 rounded-full bg-brand px-4 sm:px-5 text-xs font-semibold tracking-wide text-background shadow-sm border border-accent/30 transition-all duration-300 hover:bg-brand-hover hover:border-accent hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
        >
          <FiGlobe className="h-3.5 w-3.5 text-accent" />
          <span className="hidden sm:inline">View Public Website</span>
          <span className="sm:hidden">Website</span>
          <FiExternalLink className="h-3 w-3 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </header>
  );
}