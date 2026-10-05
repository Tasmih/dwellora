import AdminHeader from "@/components/admin/AdminHeader";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background lg:flex">

      <AdminSidebar />

      <div className="flex-1">

        <AdminHeader />

        <main className="p-6">
          {children}
        </main>

      </div>

    </div>
  );
}