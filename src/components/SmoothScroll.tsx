"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * SmoothScroll component powered by Lenis.
 * Provides luxury, buttery-smooth scrolling across all public pages,
 * handles anchor and hash navigation, and isolates the admin dashboard.
 */
export default function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // 1. Bypass Lenis on admin dashboard or when reduced motion is preferred
    if (isAdmin || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete window.__lenis;
      }
      return;
    }

    // 2. Initialize Lenis for public website pages with fast, snappy smooth scrolling
    const lenis = new Lenis({
      duration: 0.65,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.25,
      touchMultiplier: 1.0,
      infinite: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // 3. In-page anchor click handler (supports #hash and /pathname#hash)
    function handleAnchorClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Check if href is an in-page hash or matches current pathname + hash
      let hash = "";
      if (href.startsWith("#") && href.length > 1) {
        hash = href;
      } else if (
        href.includes("#") &&
        (href.startsWith(pathname + "#") || href.startsWith("./#") || (pathname === "/" && href.startsWith("/#")))
      ) {
        hash = href.substring(href.indexOf("#"));
      }

      if (hash && hash.length > 1) {
        const targetElement = document.querySelector(hash);
        if (targetElement) {
          e.preventDefault();
          lenis.scrollTo(targetElement as HTMLElement, {
            offset: -84,
            duration: 0.75,
          });
        }
      }
    }

    // 4. Initial hash scroll check on load or route navigation
    if (window.location.hash) {
      const targetEl = document.querySelector(window.location.hash);
      if (targetEl) {
        setTimeout(() => {
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -84,
            duration: 0.75,
          });
        }, 100);
      }
    }

    document.addEventListener("click", handleAnchorClick, { passive: false });

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchorClick);
      lenis.destroy();
      lenisRef.current = null;
      if (window.__lenis === lenis) {
        delete window.__lenis;
      }
    };
  }, [isAdmin, pathname]);

  return null;
}
