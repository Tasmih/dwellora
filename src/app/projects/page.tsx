import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import PublicProjectCard, {
  type PublicProject,
} from "@/components/PublicProjectCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  searchParams: Promise<{ category?: string }>;
};

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
};

export const metadata: Metadata = {
  title: "Featured Projects & Portfolio | Dwellora",
  description:
    "Explore Dwellora's portfolio of bespoke home renovations, architectural transformations, and custom carpentry projects.",
  openGraph: {
    title: "Featured Projects & Portfolio | Dwellora",
    description:
      "Explore Dwellora's portfolio of bespoke home renovations, architectural transformations, and custom carpentry projects.",
  },
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.categories || [];
  } catch {
    return [];
  }
}

async function getProjects(categorySlug?: string): Promise<PublicProject[]> {
  const url = categorySlug
    ? `${API_URL}/api/projects?category=${encodeURIComponent(categorySlug)}`
    : `${API_URL}/api/projects`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load projects.");
  }

  const data = await response.json();
  return data.projects || [];
}

export default async function ProjectsPage({ searchParams }: PageProps) {
  const { category: selectedCategory } = await searchParams;

  let projects: PublicProject[] = [];
  let categories: Category[] = [];
  let failed = false;

  try {
    [categories, projects] = await Promise.all([
      getCategories(),
      getProjects(selectedCategory),
    ]);
  } catch (error) {
    console.error("Failed to load public projects:", error);
    failed = true;
  }

  const currentCategoryObj = categories.find(
    (c) => c.slug === selectedCategory
  );

  return (
    <>
      <Navbar />

      <main className="site-container py-12 sm:py-16 lg:py-20">
        {/* Page Introduction */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Portfolio &amp; Case Studies
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            Our Completed Projects
          </h1>

          <p className="mt-4 text-base leading-7 text-muted">
            Explore our curated portfolio of residential transformations, from bespoke kitchen remodels to whole-home architectural carpentry. Each space is tailored with timeless craft.
          </p>
        </div>

        {/* Category Filter Navigation */}
        {categories.length > 0 && (
          <nav
            aria-label="Filter portfolio by category"
            className="mt-10 flex flex-wrap items-center gap-2 border-b border-border pb-6"
          >
            <Link
              href="/projects"
              scroll={false}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !selectedCategory
                  ? "bg-brand text-white shadow-sm"
                  : "bg-surface text-brand hover:bg-accent/15 border border-border"
              }`}
            >
              All Projects
            </Link>

            {categories.map((category) => {
              const active = selectedCategory === category.slug;
              return (
                <Link
                  key={category._id}
                  href={`/projects?category=${encodeURIComponent(category.slug)}`}
                  scroll={false}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand text-white shadow-sm"
                      : "bg-surface text-brand hover:bg-accent/15 border border-border"
                  }`}
                >
                  {category.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* Category Context Title if active */}
        {currentCategoryObj && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-brand">
              Showing: {currentCategoryObj.name}
            </h2>
            {currentCategoryObj.description && (
              <p className="mt-1 text-sm text-muted">
                {currentCategoryObj.description}
              </p>
            )}
          </div>
        )}

        {/* Projects Grid Section */}
        <section className="mt-10" aria-label="Projects list">
          {failed ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              <p className="font-medium">
                Unable to load projects right now.
              </p>
              <p className="mt-1 text-sm">
                Please ensure the server is running and try again.
              </p>
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
              <h3 className="text-lg font-semibold text-brand">
                No projects found
              </h3>
              <p className="mt-2 text-sm text-muted">
                {selectedCategory
                  ? "There are no published projects in this category yet."
                  : "No projects have been published yet. Please check back soon."}
              </p>
              {selectedCategory && (
                <Link
                  href="/projects"
                  className="btn btn-secondary mt-6 inline-flex"
                >
                  View All Projects
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <PublicProjectCard key={project._id || project.slug} project={project} />
              ))}
            </div>
          )}
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-20 rounded-3xl border border-border bg-surface p-8 sm:p-12 lg:p-16 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            Start Your Transformation
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-brand sm:text-3xl lg:text-4xl">
            Have a project in mind for your home?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-muted">
            Let&apos;s collaborate to design and build a space that perfectly aligns with your lifestyle and architectural aspirations.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn btn-primary">
              Book a Consultation
            </Link>
            <Link href="/services" className="btn btn-secondary">
              Explore Our Services
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
