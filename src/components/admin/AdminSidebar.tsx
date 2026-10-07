"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FiGrid,
  FiLayers,
  FiTool,
  FiImage,
  FiBookOpen,
  FiMail,
  FiLogOut,
  FiX,
  FiShield,
  FiCheck,
} from "react-icons/fi";
import { apiFetch, setStoredToken } from "@/lib/api";
import { showSuccess, showError } from "@/lib/alert";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: FiGrid,
    description: "Overview & Analytics",
  },
  {
    name: "Service Categories",
    href: "/admin/categories",
    icon: FiLayers,
    description: "Structure & Disciplines",
  },
  {
    name: "Services",
    href: "/admin/services",
    icon: FiTool,
    description: "Renovation Offerings",
  },
  {
    name: "Projects",
    href: "/admin/projects",
    icon: FiImage,
    description: "Portfolio Case Studies",
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
    icon: FiBookOpen,
    description: "Articles & Video Tours",
  },
  {
    name: "Contact Messages",
    href: "/admin/contact",
    icon: FiMail,
    description: "Inquiries & Consultations",
  },
];

type AdminSidebarProps = {
  isOpen?: boolean;
  onClose?: () => void;
};

export default function AdminSidebar({ isOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    if (onClose) {
      onClose();
    }
  }, [pathname]);

  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between overflow-y-auto bg-[#FBF9F5] border-r border-border/80 scrollbar-thin">
      {/* Top Branding Area */}
      <div>
        <div className="relative px-6 pt-6 pb-5 border-b border-border/70">
          <div className="flex items-center justify-between">
            {/* Logo Link */}
            <Link
              href="/admin/dashboard"
              className="group flex items-center gap-3 transition-opacity duration-300 hover:opacity-90"
            >
              <Image
                src="/images/dwellora-logo.png"
                alt="Dwellora Home Renovation & Carpentry"
                width={150}
                height={40}
                priority
                className="h-8 w-auto object-contain transition-transform duration-300 group-hover:scale-[1.02]"
              />
            </Link>

            {/* Mobile Close Button */}
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close admin navigation"
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-brand hover:border-brand lg:hidden"
              >
                <FiX className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Admin Panel Badge */}
          <div className="mt-4 flex items-center justify-between">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>CMS CONTROL</span>
            </div>
            <span className="text-[11px] font-medium text-muted">v1.0 Suite</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-6">
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-muted/80">
            Main Management
          </p>

          <nav aria-label="Admin Navigation" className="mt-3 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-xs font-semibold tracking-wide transition-all duration-200 ${
                    isActive
                      ? "bg-brand text-white shadow-md shadow-brand/10 border border-brand"
                      : "text-brand/80 hover:bg-black/5 hover:text-brand"
                  }`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${
                      isActive
                        ? "bg-white/15 text-accent"
                        : "bg-surface border border-border/80 text-muted group-hover:text-accent group-hover:border-accent/40"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-xs ${isActive ? "text-white font-bold" : "text-brand"}`}>
                      {item.name}
                    </p>
                    <p
                      className={`truncate text-[10px] ${
                        isActive ? "text-neutral-300 font-normal" : "text-muted"
                      }`}
                    >
                      {item.description}
                    </p>
                  </div>

                  {isActive && (
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Logout Area */}
      <div className="p-4 border-t border-border/70 bg-[#F6F3EC]/70">
        {/* Administrator Profile Card */}
        <div className="mb-3 flex items-center gap-3 rounded-2xl border border-border/80 bg-surface p-3 shadow-xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-accent font-bold text-xs shadow-xs border border-accent/30">
            DA
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-bold text-brand">Dwellora Admin</p>
            <div className="flex items-center gap-1.5 text-[10px] text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online • Superadmin</span>
            </div>
          </div>
          <FiShield className="h-4 w-4 text-accent/80 shrink-0" />
        </div>

        {/* Logout Button */}
        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="group flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-xs font-semibold text-muted transition-all duration-200 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 hover:shadow-xs disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <FiLogOut className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
          <span>{loggingOut ? "Logging out..." : "Sign Out"}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Fixed Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        {sidebarContent}
      </aside>

      {/* 2. Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          aria-hidden="true"
          onClick={onClose}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* 3. Mobile Slide-Over Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}