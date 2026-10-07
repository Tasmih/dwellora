/**
 * Validates and sanitizes URLs used for images and links.
 * Enforces HTTPS, trims surrounding whitespace, and removes trailing dots from hostnames.
 */
export function sanitizeHttpsUrl(value: string): { url: string; error?: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { url: "" };
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:") {
      return { url: "", error: "Image URL must use a secure HTTPS protocol (https://)." };
    }

    // Remove any trailing dot(s) from the hostname (e.g., "i.ibb.co." -> "i.ibb.co")
    if (parsed.hostname.endsWith(".")) {
      parsed.hostname = parsed.hostname.replace(/\.+$/, "");
    }

    if (!parsed.hostname) {
      return { url: "", error: "Image URL must have a valid domain hostname." };
    }

    return { url: parsed.toString() };
  } catch {
    return { url: "", error: "Please enter a valid HTTPS URL (e.g. https://...)." };
  }
}

/**
 * Safe image URL helper for components rendering next/image.
 * Wraps `new URL(src)` in try/catch to ensure the URL is valid,
 * trims trailing dots in hostnames, and injects Cloudinary auto-format
 * and auto-quality transformations (f_auto,q_auto) for faster delivery.
 */
export function getSafeImageSrc(
  src?: string | null,
  width?: number
): string | null {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;

  // Local relative paths (e.g., /logo.png, /hero.jpg)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }

    // Strip trailing dot(s) from hostname (e.g., "i.ibb.co." -> "i.ibb.co")
    if (url.hostname.endsWith(".")) {
      url.hostname = url.hostname.replace(/\.+$/, "");
    }

    // Cloudinary auto-format & quality injection (f_auto,q_auto)
    if (
      url.hostname.includes("cloudinary.com") &&
      url.pathname.includes("/image/upload/")
    ) {
      // If not already transformed with f_auto or q_auto
      if (
        !url.pathname.includes("/f_auto") &&
        !url.pathname.includes("q_auto") &&
        !url.pathname.includes("/c_") &&
        !url.pathname.includes("/w_")
      ) {
        const transform = width
          ? `f_auto,q_auto,w_${width},c_limit`
          : "f_auto,q_auto";
        url.pathname = url.pathname.replace(
          "/image/upload/",
          `/image/upload/${transform}/`
        );
      }
    }

    // Unsplash auto-format & quality parameters
    if (url.hostname.includes("images.unsplash.com")) {
      if (!url.searchParams.has("auto")) {
        url.searchParams.set("auto", "format");
      }
      if (!url.searchParams.has("fit")) {
        url.searchParams.set("fit", "crop");
      }
      if (!url.searchParams.has("q")) {
        url.searchParams.set("q", "80");
      }
      if (width && !url.searchParams.has("w")) {
        url.searchParams.set("w", String(width));
      }
    }

    return url.toString();
  } catch {
    return null;
  }
}
