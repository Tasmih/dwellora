"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
  },
  {
    name: "Services",
    href: "/admin/services",
  },
  {
    name: "Service Categories",
    href: "/admin/categories",
  },
  {
    name: "Projects",
    href: "/admin/projects",
  },
  {
    name: "Blogs",
    href: "/admin/blogs",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

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


      <button className="btn btn-primary mt-10 w-full">
        Logout
      </button>

    </aside>
  );
}