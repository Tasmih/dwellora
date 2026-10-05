import Link from "next/link";

export default function ServiceHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Services
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Manage renovation services from here.
        </p>
      </div>

      <Link
        href="/admin/services/create"
        className="btn btn-primary w-full sm:w-auto"
      >
        Add Service
      </Link>
    </div>
  );
}