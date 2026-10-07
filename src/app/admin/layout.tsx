"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col antialiased">
      {/* 1. Fixed Sidebar for Desktop & Slide-Over Drawer for Mobile */}
      <AdminSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area Offset by 72 (18rem) on Desktop */}
      <div className="lg:pl-72 flex-1 flex flex-col min-h-screen min-w-0 transition-all duration-300">
        {/* Sticky Top Header */}
        <AdminHeader onToggleMenu={() => setMobileMenuOpen((prev) => !prev)} />

        {/* Independently Scrollable Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}