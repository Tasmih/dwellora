import Hero, { type HeroContent } from "@/component/Hero";
import Navbar from "@/component/Navbar";

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

export default function Home() {
  return (
    <>
      <Navbar />

      <main id="main-content">
        <Hero content={heroContent} />
      </main>
    </>
  );
}