import LoginForm from "@/components/admin/LoginForm";

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="site-container flex min-h-screen items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Dwellora Administration
            </p>

            <h1 className="section-title text-3xl">
              Admin Login
            </h1>

            <p className="section-description mt-3">
              Access your dashboard to manage services, projects and blogs.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}