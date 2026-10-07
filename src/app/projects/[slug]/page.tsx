import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import {
  FiCalendar,
  FiCheckCircle,
  FiMapPin,
  FiUser,
  FiFolder,
  FiMail,
  FiPhone,
  FiArrowLeft,
} from "react-icons/fi";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PublicProjectCard, {
  type PublicProject,
} from "@/components/PublicProjectCard";
import SafeImage from "@/components/SafeImage";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type PageProps = {
  params: Promise<{ slug: string }>;
};

type ProjectFeature = {
  title: string;
  description: string;
};

type ProjectDetails = PublicProject & {
  features?: ProjectFeature[];
  gallery?: string[];
  status: "published" | "unpublished";
  category?: {
    _id?: string;
    name: string;
    slug: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    canonicalUrl?: string;
  };
};

function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://dwellora.vercel.app")
  );
}

// Fetch single project by slug (cached per request)
const getProject = cache(async (slug: string): Promise<ProjectDetails | null> => {
  try {
    const response = await fetch(
      `${API_URL}/api/projects/slug/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 60 },
      }
    );

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to load project (status: ${response.status}).`);
    }

    const data: { project: ProjectDetails } = await response.json();
    return data.project;
  } catch {
    return null;
  }
});

// Fetch up to 3 other published projects
async function getRelatedProjects(
  currentSlug: string,
  categorySlug?: string
): Promise<PublicProject[]> {
  try {
    let sameCategoryProjects: PublicProject[] = [];

    if (categorySlug) {
      const res = await fetch(
        `${API_URL}/api/projects?category=${encodeURIComponent(categorySlug)}`,
        { next: { revalidate: 60 } }
      );
      if (res.ok) {
        const data = await res.json();
        sameCategoryProjects = (data.projects || []).filter(
          (p: PublicProject) => p.slug !== currentSlug
        );
      }
    }

    if (sameCategoryProjects.length >= 3) {
      return sameCategoryProjects.slice(0, 3);
    }

    // Fill remaining from all projects
    const allRes = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 60 },
    });
    if (allRes.ok) {
      const allData = await allRes.json();
      const others = (allData.projects || []).filter(
        (p: PublicProject) =>
          p.slug !== currentSlug &&
          !sameCategoryProjects.some((sc) => sc.slug === p.slug)
      );
      return [...sameCategoryProjects, ...others].slice(0, 3);
    }

    return sameCategoryProjects;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found | Dwellora",
      description: "The requested project could not be found.",
    };
  }

  const siteUrl = getSiteUrl();
  const pageUrl = `${siteUrl}/projects/${encodeURIComponent(project.slug)}`;

  const pageTitle =
    project.seo?.metaTitle?.trim() || `${project.title} | Dwellora`;
  const pageDescription =
    project.seo?.metaDescription?.trim() ||
    project.shortDescription?.trim() ||
    project.description.slice(0, 160).trim();

  const ogTitle = project.seo?.ogTitle?.trim() || pageTitle;
  const ogDescription = project.seo?.ogDescription?.trim() || pageDescription;
  const ogImage = project.seo?.ogImage?.trim() || project.coverImage;

  return {
    title: { absolute: pageTitle },
    description: pageDescription,
    keywords: project.seo?.keywords
      ? project.seo.keywords.split(",").map((k) => k.trim())
      : undefined,
    alternates: {
      canonical: project.seo?.canonicalUrl?.trim() || pageUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: pageUrl,
      type: "article",
      images: ogImage ? [{ url: ogImage, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedProjects = await getRelatedProjects(
    project.slug,
    project.category?.slug
  );

  return (
    <>
      <Navbar />

      <main className="site-container page-spacing">
        {/* Back Link & Breadcrumbs */}
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-medium text-muted">
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-brand"
          >
            <FiArrowLeft className="h-4 w-4" />
            <span>Back to All Projects</span>
          </Link>

          <nav aria-label="Breadcrumb" className="flex items-center gap-2">
            <Link href="/" className="hover:text-brand">
              Home
            </Link>
            <span>/</span>
            <Link href="/projects" className="hover:text-brand">
              Projects
            </Link>
            {project.category && (
              <>
                <span>/</span>
                <Link
                  href={`/projects?category=${encodeURIComponent(
                    project.category.slug
                  )}`}
                  className="hover:text-brand"
                >
                  {project.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-brand line-clamp-1 max-w-[200px]">
              {project.title}
            </span>
          </nav>
        </div>

        {/* Project Header */}
        <header className="mt-8 max-w-4xl">
          {project.category && (
            <Link
              href={`/projects?category=${encodeURIComponent(
                project.category.slug
              )}`}
              className="inline-block rounded-full bg-accent/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand"
            >
              {project.category.name}
            </Link>
          )}

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-brand sm:text-4xl lg:text-5xl">
            {project.title}
          </h1>

          {project.shortDescription && (
            <p className="mt-4 text-lg leading-relaxed text-muted">
              {project.shortDescription}
            </p>
          )}
        </header>

        {/* Project Meta Bar (Location, Client, Year, Category) */}
        <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-4">
          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <FiMapPin className="h-3.5 w-3.5" />
              Location
            </span>
            <span className="mt-1 text-sm font-medium text-brand">
              {project.location || "Private Location"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <FiUser className="h-3.5 w-3.5" />
              Client
            </span>
            <span className="mt-1 text-sm font-medium text-brand">
              {project.client || "Residential"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <FiCalendar className="h-3.5 w-3.5" />
              Year Completed
            </span>
            <span className="mt-1 text-sm font-medium text-brand">
              {project.year || "Recent"}
            </span>
          </div>

          <div className="flex flex-col">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
              <FiFolder className="h-3.5 w-3.5" />
              Category
            </span>
            <span className="mt-1 text-sm font-medium text-brand">
              {project.category?.name || "Architectural Renovation"}
            </span>
          </div>
        </div>

        {/* Cover Hero Image */}
        <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-border bg-background shadow-md">
          <SafeImage
            src={project.coverImage}
            alt={project.title}
            fallbackTitle={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Content & Sidebar Layout */}
        <div className="mt-14 grid gap-12 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="space-y-12 lg:col-span-2">
            {/* Project Overview Narrative */}
            <section aria-labelledby="project-overview">
              <h2
                id="project-overview"
                className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
              >
                Project Overview
              </h2>
              <div className="mt-6 space-y-4 whitespace-pre-line text-base leading-relaxed text-muted">
                {project.description}
              </div>
            </section>

            {/* Key Features & Deliverables */}
            {project.features && project.features.length > 0 && (
              <section aria-labelledby="project-features" className="pt-6">
                <h2
                  id="project-features"
                  className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
                >
                  Key Highlights &amp; Scope
                </h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <FiCheckCircle className="mt-1 h-5 w-5 shrink-0 text-accent" />
                        <div>
                          <h3 className="font-semibold text-brand">
                            {feature.title}
                          </h3>
                          {feature.description && (
                            <p className="mt-1.5 text-sm leading-6 text-muted">
                              {feature.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Showcase */}
            {project.gallery && project.gallery.length > 0 && (
              <section aria-labelledby="project-gallery" className="pt-6">
                <h2
                  id="project-gallery"
                  className="text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
                >
                  Project Gallery
                </h2>
                <p className="mt-2 text-sm text-muted">
                  Explore detailed perspectives of the finishes and craftsmanship.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {project.gallery.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-background"
                    >
                      <SafeImage
                        src={imgUrl}
                        alt={`${project.title} - Gallery Image ${index + 1}`}
                        fallbackTitle={`${project.title} Gallery #${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Area */}
          <aside className="space-y-8">
            {/* Consultation Box */}
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Ready to Begin?
              </p>
              <h3 className="mt-2 text-xl font-semibold text-brand">
                Bring This Quality to Your Home
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted">
                Our bespoke craftsmanship and structured project delivery ensure seamless home transformations from concept to installation.
              </p>

              <div className="mt-6 space-y-3">
                <Link
                  href="/contact"
                  className="btn btn-primary w-full text-center"
                >
                  Request a Consultation
                </Link>
                <Link
                  href="/services"
                  className="btn btn-secondary w-full text-center"
                >
                  View Renovation Services
                </Link>
              </div>

              <div className="mt-8 border-t border-border pt-6 space-y-3 text-sm text-muted">
                <div className="flex items-center gap-3">
                  <FiPhone className="h-4 w-4 text-accent" />
                  <span>+1 (800) 555-0199</span>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="h-4 w-4 text-accent" />
                  <span>projects@dwellora.com</span>
                </div>
              </div>
            </div>

            {/* Design & Build Guarantee */}
            <div className="rounded-3xl border border-border bg-background p-6">
              <h4 className="font-semibold text-brand">The Dwellora Standard</h4>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Premium architectural grade timber &amp; materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Dedicated site management and project timeline tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Transparent itemized scopes &amp; 10-Year Craft Warranty</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>

        {/* Related Projects Section */}
        {relatedProjects.length > 0 && (
          <section className="mt-24 border-t border-border pt-16">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  More Inspiration
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-brand sm:text-3xl">
                  Related Projects
                </h2>
              </div>

              <Link
                href="/projects"
                className="text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
              >
                View all projects &rarr;
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((p) => (
                <PublicProjectCard key={p._id || p.slug} project={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
