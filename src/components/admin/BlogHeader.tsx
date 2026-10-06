import Link from "next/link";

export default function BlogHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Blogs &amp; Vlogs
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Manage editorial articles, renovation journals, guides, and video tours.
        </p>
      </div>

      <Link
        href="/admin/blogs/create"
        className="btn btn-primary w-full sm:w-auto"
      >
        Add Blog / Vlog
      </Link>
    </div>
  );
}
