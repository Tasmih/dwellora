"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Ensure scrollRestoration is set to manual as early as possible
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

/**
 * Bulletproof ScrollToTop handler for Next.js App Router.
 * Ensures that whenever a user navigates to any new route/page,
 * the viewport is guaranteed to start from the top (0, 0).
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;

    // If there is an explicit hash in the URL targeted by the user on the current page, allow it
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      if (el) return;
    }

    const resetScroll = () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      }
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant" as ScrollBehavior,
      });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    };

    // 1. Reset immediately in layout effect
    resetScroll();

    // 2. Reset in animation frame after initial paint
    const rafId = requestAnimationFrame(resetScroll);

    // 3. Reset after microtasks & dynamic child mounts (50ms)
    const timeoutId = setTimeout(resetScroll, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return null;
}
