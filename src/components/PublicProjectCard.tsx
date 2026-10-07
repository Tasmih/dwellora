import Link from "next/link";
import { FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";
import SafeImage from "@/components/SafeImage";

export type PublicProject = {
  _id?: string;
  title: string;
  slug: string;
  shortDescription?: string;
  description: string;
  coverImage?: string;
  location?: string;
  client?: string;
  year?: string;
  gallery?: string[];
  features?: {
    title: string;
    description: string;
  }[];
  category?: {
    _id?: string;
    name: string;
    slug: string;
  };
};

type PublicProjectCardProps = {
  project: PublicProject;
};

export default function PublicProjectCard({ project }: PublicProjectCardProps) {
  const summary =
    project.shortDescription?.trim() ||
    (project.description.length > 150
      ? `${project.description.slice(0, 150).trim()}...`
      : project.description);

  const href = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg">
      <Link
        href={href}
        aria-label={`View ${project.title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-background"
      >
        <SafeImage
          src={project.coverImage}
          alt={project.title}
          fallbackTitle={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        {project.category && (
          <span className="absolute left-4 top-4 rounded-full bg-brand/90 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
            {project.category.name}
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          {project.location && (
            <span className="inline-flex items-center gap-1">
              <FiMapPin className="h-3 w-3 text-accent" />
              {project.location}
            </span>
          )}
          {project.year && (
            <span className="inline-flex items-center gap-1">
              <FiCalendar className="h-3 w-3 text-accent" />
              {project.year}
            </span>
          )}
        </div>

        <h3 className="mt-2 text-lg sm:text-xl font-bold tracking-tight text-brand">
          <Link href={href} className="transition-colors hover:text-brand-hover">
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
          {summary}
        </p>

        <div className="mt-auto pt-6">
          <Link
            href={href}
            className="inline-flex min-h-11 w-full items-center justify-between rounded-full border border-brand bg-transparent px-6 py-3 text-sm font-semibold text-brand transition-all duration-300 hover:bg-brand hover:text-white hover:shadow-sm group/btn"
          >
            <span>View Project</span>
            <FiArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
