import type { Metadata } from "next";
import Hero, { type HeroContent } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Services";
import TrustStats from "@/components/TrustStats";
import LivingExperienceShowcase from "@/components/LivingExperienceShowcase";
import WhyChooseDwellora from "@/components/WhyChooseDwellora";
import FeaturedProjects from "@/components/FeaturedProjects";
import LatestBlogsSection from "@/components/LatestBlogsSection";
import FAQSection from "@/components/FAQSection";
import CinematicCta from "@/components/CinematicCta";
import Footer from "@/components/Footer";
import type { PublicService } from "@/components/PublicServiceCard";
import type { PublicProject } from "@/components/PublicProjectCard";
import type { PublicBlog } from "@/components/PublicBlogCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const metadata: Metadata = {
  title: "Dwellora | Bespoke Home Renovation & Custom Carpentry",
  description:
    "Transforming residential living spaces with architectural space planning, custom cabinetry, and master interior craftsmanship.",
};

const heroContent: HeroContent = {
  eyebrow: "Home renovation & custom carpentry",
  title: "Thoughtfully crafted spaces.",
  highlightedTitle: "Beautifully yours.",
  description:
    "From inviting kitchens to custom woodwork, we bring thoughtful design and careful craftsmanship to the spaces you call home.",
  image: "/images/hero-interior.jpeg",
  imageAlt:
    "Modern kitchen with wooden cabinetry, a spacious island and warm pendant lighting",
  primaryLabel: "Get a Quote",
  primaryHref: "/contact?type=quote",
  secondaryLabel: "Explore Projects",
  secondaryHref: "/projects",
};

async function getHomeData(): Promise<{
  services: PublicService[];
  projects: PublicProject[];
  blogs: PublicBlog[];
}> {
  try {
    const [servicesRes, projectsRes, blogsRes] = await Promise.all([
      fetch(`${API_URL}/api/services`, { next: { revalidate: 60 } }).catch(
        () => null
      ),
      fetch(`${API_URL}/api/projects`, { next: { revalidate: 60 } }).catch(
        () => null
      ),
      fetch(`${API_URL}/api/blogs`, { next: { revalidate: 60 } }).catch(
        () => null
      ),
    ]);

    let services: PublicService[] = [];
    let projects: PublicProject[] = [];
    let blogs: PublicBlog[] = [];

    if (servicesRes && servicesRes.ok) {
      const data = await servicesRes.json();
      services = (data.services || []).filter(
        (s: { status?: string }) => !s.status || s.status === "published"
      );
    }

    if (projectsRes && projectsRes.ok) {
      const data = await projectsRes.json();
      projects = (data.projects || []).filter(
        (p: { status?: string }) => !p.status || p.status === "published"
      );
    }

    if (blogsRes && blogsRes.ok) {
      const data = await blogsRes.json();
      blogs = data.blogs || [];
    }

    return { services, projects, blogs };
  } catch {
    return { services: [], projects: [], blogs: [] };
  }
}

export default async function Home() {
  const { services, projects, blogs } = await getHomeData();

  return (
    <>
      <Navbar />

      <main id="main-content">
        {/* 1. Hero */}
        <Hero content={heroContent} />

        {/* 2. Trust Stats */}
        <TrustStats
          servicesCount={services.length}
          projectsCount={projects.length}
        />

        {/* 3. Cinematic Video Showcase */}
        <LivingExperienceShowcase />

        {/* 4. Services */}
        <ServicesSection services={services} />

        {/* 5. Why Choose Dwellora */}
        <WhyChooseDwellora />

        {/* 6. Featured Projects */}
        <FeaturedProjects projects={projects} />

        {/* 7. Latest Blogs */}
        <LatestBlogsSection blogs={blogs} />

        {/* 8. FAQ */}
        <FAQSection />

        {/* 9. New Consultation CTA Section */}
        <CinematicCta />
      </main>

      <Footer />
    </>
  );
}