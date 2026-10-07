"use client";

import Image from "next/image";
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
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleScroll() {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-border/80 bg-gradient-to-r from-background/98 via-[#FDFBF7]/98 to-background/98 shadow-[0_4px_24px_rgba(25,53,50,0.06)] backdrop-blur-md"
          : "border-b border-border/50 bg-gradient-to-r from-background/95 via-[#FDFBF7]/95 to-background/95 shadow-[0_2px_12px_rgba(25,53,50,0.02)] backdrop-blur-sm"
      }`}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-5 lg:px-6 relative flex h-[72px] sm:h-[80px] lg:h-[84px] items-center justify-between gap-6">
        {/* Logo Image */}
        <Link
          href="/"
          aria-label="Dwellora home"
          onClick={closeMenu}
          className="group relative flex shrink-0 items-center justify-start transition-opacity duration-300 hover:opacity-90 py-1 -ml-1 lg:-ml-2"
        >
          <Image
            src="/images/dwellora-logo.png"
            alt="Dwellora Home Renovation & Carpentry"
            width={190}
            height={50}
            priority
            className="h-auto w-[140px] sm:w-[165px] lg:w-[190px] object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
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
                className={`group relative rounded-sm py-2 text-[14.5px] font-medium tracking-wide transition-colors duration-200 motion-reduce:transition-none ${
                  active
                    ? "text-brand font-semibold"
                    : "text-muted hover:text-brand"
                }`}
              >
                {item.name}

                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent to-[#C89545] transition-transform duration-200 motion-reduce:transition-none ${
                    active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA button */}
        <Link
          href="/contact?type=quote"
          className="group hidden lg:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D4A95A] via-[#C9A365] to-[#B88738] px-6 py-2.5 text-sm font-semibold text-brand shadow-[0_4px_16px_rgba(201,163,101,0.28)] hover:shadow-[0_8px_24px_rgba(201,163,101,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 border border-accent/50"
        >
          <span>Get a Quote</span>
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
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-brand transition-colors hover:bg-brand/5 motion-reduce:transition-none lg:hidden"
        >
          <svg
            width="20"
            height="20"
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

      {/* Thin Elegant Gold Bottom Accent Line */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/35 to-transparent pointer-events-none"
      />

      {/* Mobile menu */}
      <div
        id="mobile-navigation"
        hidden={!menuOpen}
        className="border-t border-border bg-background lg:hidden shadow-lg"
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
                    ? "bg-brand/5 text-brand font-semibold"
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
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D4A95A] via-[#C9A365] to-[#B88738] px-6 py-3 text-sm font-semibold text-brand shadow-md w-full sm:w-auto sm:self-start border border-accent/50"
          >
            <span>Get a Quote</span>
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
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}