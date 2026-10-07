"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { apiFetch, setStoredToken } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alert";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Service Categories",
    href: "/admin/categories",
  },
  {
    name: "Services",
    href: "/admin/services",
  },
  {
    name: "Projects",
    href: "/admin/projects",
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
  },
  {
    name: "Contact Messages",
    href: "/admin/contact",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setLoggingOut(true);
      await apiFetch("/api/auth/logout", {
        method: "POST",
      });
      setStoredToken(null);
      const isHttps =
        typeof window !== "undefined" && window.location.protocol === "https:";
      document.cookie = `admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax${
        isHttps ? "; Secure" : ""
      }`;
      showSuccess("Logged out successfully");
      router.push("/admin/login");
      router.refresh();
    } catch {
      setStoredToken(null);
      document.cookie =
        "admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      showError("Failed to log out. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <aside className="w-full border-b border-border bg-surface p-6 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-brand">
          Admin Panel
        </h2>

        <p className="mt-2 text-sm text-muted">
          Manage your website content
        </p>
      </div>

      <nav className="mt-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "bg-accent text-brand"
                  : "text-brand hover:bg-accent/10"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        disabled={loggingOut}
        className="mt-10 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-4 py-2.5 text-sm font-medium text-muted transition-all duration-200 hover:border-rose-200 hover:bg-rose-50/80 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiLogOut className="h-4 w-4" />
        <span>{loggingOut ? "Logging out..." : "Logout"}</span>
      </button>
    </aside>
  );
}