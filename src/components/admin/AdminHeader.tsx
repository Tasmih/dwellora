import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-6 py-4">

      <div>
        <h1 className="text-lg font-semibold text-brand">
            Welcome back,Dwellora Admin
        </h1>

        <p className="text-sm text-muted">
          Manage Dwellora website content
        </p>
      </div>


      <Link
        href="/"
        target="_blank"
        className="btn btn-secondary"
      >
        View Website
      </Link>

    </header>
  );
}