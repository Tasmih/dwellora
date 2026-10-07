import Link from "next/link";
import { FiExternalLink } from "react-icons/fi";

export default function AdminHeader() {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border bg-surface px-5 sm:px-6 py-4">
      <div>
        <h1 className="text-base sm:text-lg font-semibold text-brand">
          Welcome back, Dwellora Admin
        </h1>

        <p className="text-xs sm:text-sm text-muted">
          Manage Dwellora website content
        </p>
      </div>

      <Link
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex h-10 w-fit items-center justify-center gap-2 rounded-full bg-brand px-5 text-xs font-semibold tracking-wide text-background shadow-sm border border-accent/30 transition-all duration-300 hover:bg-brand-hover hover:border-accent hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
      >
        <span>View Website</span>
        <FiExternalLink className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </header>
  );
}