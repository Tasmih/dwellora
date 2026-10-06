"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ServicesDropdown from "@/components/ServicesDropdown";

const navItems = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    function handleResize(event: MediaQueryListEvent) {
      if (event.matches) {
        setMenuOpen(false);
      }
    }

    desktopQuery.addEventListener("change", handleResize);

    return () => {
      desktopQuery.removeEventListener("change", handleResize);
    };
  }, []);

  function isActive(href: string) {
    return href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          closeMenu();
          menuButtonRef.current?.focus();
        }
      }}
      className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-md"
    >
      <div className="site-container flex h-20 items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href="/"
          aria-label="Dwellora home"
          onClick={closeMenu}
          className="group shrink-0 rounded-sm"
        >
          <span className="block text-2xl font-semibold leading-none tracking-[0.08em] text-brand transition-colors group-hover:text-brand-hover motion-reduce:transition-none">
            Dwellora<span className="text-accent">.</span>
          </span>

          <span className="mt-2 block text-[8px] font-medium leading-none tracking-[0.18em] text-muted sm:text-[9px]">
            HOME RENOVATION & CARPENTRY
          </span>
        </Link>

        {/* Desktop links */}
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-6 lg:flex xl:gap-8"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.name === "Services") {
              return (
                <ServicesDropdown
                  key={item.href}
                  active={active}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative rounded-sm py-2 text-sm font-medium transition-colors duration-200 motion-reduce:transition-none ${
                  active
                    ? "text-brand"
                    : "text-muted hover:text-brand"
                }`}
              >
                {item.name}

                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-px w-full origin-left bg-accent transition-transform duration-200 motion-reduce:transition-none ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop button */}
        <Link
          href="/contact?type=quote"
          className="btn btn-primary hidden lg:inline-flex"
        >
          Get a Quote
          <ArrowIcon />
        </Link>

        {/* Mobile toggle */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border text-brand transition-colors hover:bg-brand/5 motion-reduce:transition-none lg:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {menuOpen ? (
              <>
                <path d="m6 6 12 12" />
                <path d="M18 6 6 18" />
              </>
            ) : (
              <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        hidden={!menuOpen}
        className="border-t border-border bg-background lg:hidden"
      >
        <nav
          aria-label="Mobile navigation"
          className="site-container flex flex-col gap-1 py-5"
        >
          {navItems.map((item) => {
            const active = isActive(item.href);

            if (item.name === "Services") {
              return (
                <ServicesDropdown
                  key={item.href}
                  isMobile
                  active={active}
                  onNavigate={closeMenu}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={closeMenu}
                className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors motion-reduce:transition-none ${
                  active
                    ? "bg-brand/5 text-brand"
                    : "text-muted hover:bg-brand/5 hover:text-brand"
                }`}
              >
                {item.name}
              </Link>
            );
          })}

          <Link
            href="/contact?type=quote"
            onClick={closeMenu}
            className="btn btn-primary mt-4 w-full sm:w-auto sm:self-start"
          >
            Get a Quote
            <ArrowIcon />
          </Link>
        </nav>
      </div>
    </header>
  );
}

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}