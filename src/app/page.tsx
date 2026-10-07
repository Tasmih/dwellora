import Hero, { type HeroContent } from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/Services";
import type { PublicService } from "@/components/PublicServiceCard";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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
  primaryHref: "/contact",
  secondaryLabel: "Explore Projects",
  secondaryHref: "/projects",
};

async function getFeaturedServices(): Promise<PublicService[]> {
  try {
    const response = await fetch(`${API_URL}/api/services`, {
      next: { revalidate: 60 },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (data.services || []).filter(
      (s: { status: string }) => s.status === "published"
    );
  } catch {
    return [];
  }
}

export default async function Home() {
  const services = await getFeaturedServices();

  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero content={heroContent} />
        <ServicesSection services={services} />
      </main>
    </>
  );
}