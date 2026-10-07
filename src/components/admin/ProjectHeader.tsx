import Link from "next/link";
import { FiPlus } from "react-icons/fi";

export default function ProjectHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Dwellora Administration
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
          Projects
        </h1>

        <p className="mt-3 text-base leading-7 text-muted">
          Manage renovation and portfolio projects from here.
        </p>
      </div>

      <Link
        href="/admin/projects/create"
        className="group btn-admin-primary"
      >
        <FiPlus className="h-4 w-4 text-accent transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110" />
        <span>Add Project</span>
      </Link>
    </div>
  );
}
