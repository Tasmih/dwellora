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
 * trims trailing dots in hostnames, and returns a sanitized URL string.
 * Returns null if the URL is invalid, non-http(s), or empty.
 */
export function getSafeImageSrc(src?: string | null): string | null {
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

    return url.toString();
  } catch {
    return null;
  }
}
