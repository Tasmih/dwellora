import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import PublicProjectCard, {
  type PublicProject,
} from "@/components/PublicProjectCard";

type FeaturedProjectsProps = {
  projects: PublicProject[];
};

export default function FeaturedProjects({ projects }: FeaturedProjectsProps) {
  if (!projects || projects.length === 0) {
    return null;
  }

  const displayProjects = projects.slice(0, 3);

  return (
    <section
      aria-labelledby="featured-projects-heading"
      className="site-container section-spacing"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          Selected Works
        </p>

        <h2
          id="featured-projects-heading"
          className="section-title text-balance"
        >
          Featured Projects
        </h2>

        <p className="section-description text-balance">
          Explore our curated collection of bespoke home renovations, master carpentry transformations, and architectural interior builds.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayProjects.map((project) => (
          <PublicProjectCard
            key={project._id || project.slug}
            project={project}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/projects"
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <span>Explore All Projects</span>
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
