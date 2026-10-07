import type { MetadataRoute } from "next";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://dwellora.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/services`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/projects`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  // Dynamic service entries
  let serviceRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/services`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const services = data.services || [];
      serviceRoutes = services.map(
        (service: { slug: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/services/${encodeURIComponent(service.slug)}`,
          lastModified: service.updatedAt
            ? new Date(service.updatedAt)
            : service.createdAt
            ? new Date(service.createdAt)
            : currentDate,
          changeFrequency: "weekly",
          priority: 0.85,
        })
      );
    }
  } catch (err) {
    console.warn("Sitemap: Could not fetch dynamic services:", err);
  }

  // Dynamic category entries
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/categories`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const categories = data.categories || [];
      categoryRoutes = categories.map(
        (cat: { slug: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/services/category/${encodeURIComponent(cat.slug)}`,
          lastModified: cat.updatedAt
            ? new Date(cat.updatedAt)
            : cat.createdAt
            ? new Date(cat.createdAt)
            : currentDate,
          changeFrequency: "weekly",
          priority: 0.8,
        })
      );
    }
  } catch (err) {
    console.warn("Sitemap: Could not fetch dynamic categories:", err);
  }

  // Dynamic project entries
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/projects`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const projects = data.projects || [];
      projectRoutes = projects.map(
        (project: { slug: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/projects/${encodeURIComponent(project.slug)}`,
          lastModified: project.updatedAt
            ? new Date(project.updatedAt)
            : project.createdAt
            ? new Date(project.createdAt)
            : currentDate,
          changeFrequency: "monthly",
          priority: 0.8,
        })
      );
    }
  } catch (err) {
    console.warn("Sitemap: Could not fetch dynamic projects:", err);
  }

  // Dynamic blog / vlog entries
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/api/blogs`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const blogs = data.blogs || [];
      blogRoutes = blogs.map(
        (blog: { slug: string; updatedAt?: string; createdAt?: string }) => ({
          url: `${SITE_URL}/blogs/${encodeURIComponent(blog.slug)}`,
          lastModified: blog.updatedAt
            ? new Date(blog.updatedAt)
            : blog.createdAt
            ? new Date(blog.createdAt)
            : currentDate,
          changeFrequency: "monthly",
          priority: 0.75,
        })
      );
    }
  } catch (err) {
    console.warn("Sitemap: Could not fetch dynamic blogs:", err);
  }

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...categoryRoutes,
    ...projectRoutes,
    ...blogRoutes,
  ];
}
