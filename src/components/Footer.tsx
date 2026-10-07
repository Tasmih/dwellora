"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiCheckCircle,
  FiChevronRight,
  FiPhone,
  FiMail,
  FiMapPin,
  FiShield,
  FiTool,
  FiAward,
  FiLayers,
  FiLock,
  FiHome,
  FiBox,
  FiGrid,
  FiMaximize2,
  FiHeart,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FooterServiceLink = {
  id: string;
  name: string;
  href: string;
  slug: string;
  type: "category" | "service";
};

let cachedFooterLinks: FooterServiceLink[] | null = null;
let footerLinksPromise: Promise<FooterServiceLink[]> | null = null;

async function fetchFooterServiceLinks(): Promise<FooterServiceLink[]> {
  if (cachedFooterLinks && cachedFooterLinks.length > 0) {
    return cachedFooterLinks;
  }
  if (!footerLinksPromise) {
    footerLinksPromise = (async () => {
      try {
        // Fetch categories first (preferred as primary service taxonomy)
        const catRes = await fetch(`${API_URL}/api/categories`, {
          next: { revalidate: 120 },
        });
        if (catRes.ok) {
          const catData = await catRes.json();
          const categories = catData.categories || [];
          if (Array.isArray(categories) && categories.length > 0) {
            const mappedCats: FooterServiceLink[] = categories
              .slice(0, 6)
              .map((cat: { _id?: string; name: string; slug: string }) => ({
                id: cat._id || cat.slug,
                name: cat.name,
                href: `/services/category/${encodeURIComponent(cat.slug)}`,
                slug: cat.slug,
                type: "category" as const,
              }));
            cachedFooterLinks = mappedCats;
            return mappedCats;
          }
        }

        // Fallback to individual services if categories are not present
        const svcRes = await fetch(`${API_URL}/api/services`, {
          next: { revalidate: 120 },
        });
        if (svcRes.ok) {
          const svcData = await svcRes.json();
          const services = svcData.services || [];
          if (Array.isArray(services) && services.length > 0) {
            const mappedSvcs: FooterServiceLink[] = services
              .slice(0, 6)
              .map((svc: { _id?: string; title?: string; name?: string; slug: string }) => ({
                id: svc._id || svc.slug,
                name: svc.title || svc.name || "Renovation Service",
                href: `/services/${encodeURIComponent(svc.slug)}`,
                slug: svc.slug,
                type: "service" as const,
              }));
            cachedFooterLinks = mappedSvcs;
            return mappedSvcs;
          }
        }
      } catch (err) {
        console.warn("Could not load dynamic service links for footer:", err);
      }
      return [];
    })().finally(() => {
      footerLinksPromise = null;
    });
  }
  return footerLinksPromise;
}

function getCategoryOrServiceIcon(name: string, slug: string) {
  const query = `${name} ${slug}`.toLowerCase();
  if (query.includes("kitchen")) return FiHome;
  if (query.includes("carpentry") || query.includes("wood")) return FiTool;
  if (
    query.includes("wardrobe") ||
    query.includes("closet") ||
    query.includes("cabinet")
  )
    return FiBox;
  if (query.includes("furniture") || query.includes("joinery") || query.includes("table"))
    return FiGrid;
  if (
    query.includes("bath") ||
    query.includes("tile") ||
    query.includes("floor") ||
    query.includes("paint") ||
    query.includes("wall")
  )
    return FiLayers;
  if (
    query.includes("full") ||
    query.includes("complete") ||
    query.includes("whole") ||
    query.includes("transformation") ||
    query.includes("interior")
  )
    return FiMaximize2;
  return FiTool;
}

const trustBadges = [
  { text: "Premium Craftsmanship", icon: FiAward },
  { text: "Quality Materials", icon: FiLayers },
  { text: "Transparent Process", icon: FiShield },
  { text: "Dedicated Support", icon: FiCheckCircle },
];

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blogs" },
  { name: "Contact", href: "/contact" },
];

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
  },
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: FaInstagram,
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const columnVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export default function Footer() {
  const [serviceLinks, setServiceLinks] = useState<FooterServiceLink[]>(
    cachedFooterLinks || []
  );
  const [loading, setLoading] = useState(!cachedFooterLinks);

  useEffect(() => {
    let isMounted = true;
    if (!cachedFooterLinks) {
      fetchFooterServiceLinks().then((links) => {
        if (isMounted) {
          setServiceLinks(links);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return (
    <footer
      aria-label="Site Footer"
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#081b18] via-[#0b231f] to-[#051310] text-[#EDE8DF]"
    >
      {/* Top Subtle Gold Border Glow */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />

      {/* Background Architectural Lighting & Pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(201,163,101,0.12),rgba(0,0,0,0))] opacity-90"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#c9a365 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Main Footer Content */}
      <div className="site-container relative z-10 pt-12 pb-10 sm:pt-14 sm:pb-12 lg:pt-16 lg:pb-14">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8 xl:gap-12"
        >
          {/* ================= COLUMN 1: Brand Identity ================= */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col lg:col-span-4"
          >
            {/* Logo */}
            <Link
              href="/"
              aria-label="Dwellora Home"
              className="inline-block transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-accent"
            >
              <Image
                src="/images/Footerlogo.png"
                alt="Dwellora Home Renovation & Carpentry"
                width={200}
                height={55}
                loading="lazy"
                className="h-auto w-[160px] sm:w-[185px] lg:w-[200px] object-contain brightness-110 drop-shadow-md"
              />
            </Link>

            {/* Brand Statement */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#EDE8DF]/80 font-normal">
              Dwellora transforms homes through thoughtful renovation, bespoke
              carpentry, and timeless craftsmanship.
            </p>

            {/* Trust Badges */}
            <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-md">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.text}
                    className="group flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2 backdrop-blur-xs transition-all duration-300 hover:border-accent/50 hover:bg-white/[0.07] hover:shadow-[0_4px_16px_rgba(201,163,101,0.12)]"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-accent transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xs font-medium tracking-wide text-[#F8F5EE]/90 group-hover:text-white transition-colors">
                      {badge.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ================= COLUMN 2: Quick Navigation ================= */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col lg:col-span-2 lg:pl-2"
          >
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Quick Links
              <span className="block mt-2 h-0.5 w-8 rounded-full bg-accent/60" />
            </h3>

            <ul className="mt-6 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[#EDE8DF]/80 transition-all duration-300 hover:text-accent hover:translate-x-1.5 focus-visible:outline-accent"
                  >
                    <FiChevronRight className="h-3.5 w-3.5 text-accent/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-accent" />
                    <span className="relative">
                      {link.name}
                      <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ================= COLUMN 3: Our Services ================= */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col lg:col-span-3 lg:pl-2"
          >
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Our Services
              <span className="block mt-2 h-0.5 w-8 rounded-full bg-accent/60" />
            </h3>

            {loading ? (
              <div className="mt-6 space-y-3.5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-pulse">
                    <div className="h-3.5 w-3.5 rounded bg-white/10 shrink-0" />
                    <div
                      className="h-3.5 rounded bg-white/10"
                      style={{ width: `${60 + (i % 3) * 15}%` }}
                    />
                  </div>
                ))}
              </div>
            ) : serviceLinks.length === 0 ? (
              <div className="mt-6">
                <Link
                  href="/services"
                  className="group inline-flex items-center gap-2 text-sm text-[#EDE8DF]/80 transition-all duration-300 hover:text-accent hover:translate-x-1.5 focus-visible:outline-accent"
                >
                  <FiTool className="h-3.5 w-3.5 text-accent/70 transition-transform duration-300 group-hover:scale-110 group-hover:text-accent shrink-0" />
                  <span className="relative font-medium transition-colors duration-300 group-hover:text-accent">
                    Explore All Services
                    <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                  </span>
                  <FiChevronRight className="h-3.5 w-3.5 text-accent transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            ) : (
              <ul className="mt-6 space-y-3">
                {serviceLinks.map((service) => {
                  const Icon = getCategoryOrServiceIcon(
                    service.name,
                    service.slug
                  );
                  return (
                    <li key={service.id}>
                      <Link
                        href={service.href}
                        className="group inline-flex items-center gap-2.5 text-sm text-[#EDE8DF]/80 transition-all duration-300 hover:text-accent hover:translate-x-1.5 focus-visible:outline-accent"
                      >
                        <Icon className="h-3.5 w-3.5 text-accent/70 transition-all duration-300 group-hover:scale-120 group-hover:text-accent shrink-0" />
                        <span className="relative font-medium transition-colors duration-300 group-hover:text-accent">
                          {service.name}
                          <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full" />
                        </span>
                        <FiChevronRight className="h-3 w-3 text-accent transition-all duration-300 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 shrink-0" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </motion.div>

          {/* ================= COLUMN 4: Contact & Social ================= */}
          <motion.div
            variants={columnVariants}
            className="flex flex-col lg:col-span-3"
          >
            <h3 className="relative inline-block text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Contact Us
              <span className="block mt-2 h-0.5 w-8 rounded-full bg-accent/60" />
            </h3>

            <div className="mt-6 space-y-4">
              {/* Phone */}
              <div className="flex items-start gap-3.5 text-sm text-[#EDE8DF]/85">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <FiPhone className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent/80">
                    Phone Inquiry
                  </span>
                  <a
                    href="tel:+8801700000000"
                    className="font-medium text-[#F8F5EE] transition-colors hover:text-accent"
                  >
                    +880 1700-DWELLORA
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5 text-sm text-[#EDE8DF]/85">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <FiMail className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent/80">
                    Email Address
                  </span>
                  <a
                    href="mailto:hello@dwellora.com"
                    className="font-medium text-[#F8F5EE] transition-colors hover:text-accent"
                  >
                    hello@dwellora.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5 text-sm text-[#EDE8DF]/85">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10 text-accent">
                  <FiMapPin className="h-4 w-4" />
                </div>
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-wider text-accent/80">
                    Studio &amp; Workshop
                  </span>
                  <p className="font-normal text-[#F8F5EE]/90 leading-snug">
                    House 42, Road 11, Banani, Dhaka 1213, Bangladesh
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Buttons */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <span className="block text-xs font-semibold uppercase tracking-wider text-accent/90 mb-3">
                Connect With Us
              </span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Follow Dwellora on ${social.name}`}
                      className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-white/[0.04] text-[#F8F5EE] backdrop-blur-md shadow-sm transition-all duration-300 hover:scale-110 hover:border-accent hover:bg-accent hover:text-brand hover:shadow-[0_0_18px_rgba(201,163,101,0.4)] focus-visible:outline-accent"
                    >
                      <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ================= BOTTOM FOOTER BAR ================= */}
      <div className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="site-container py-6">
          <div className="flex flex-col items-center justify-between gap-4 text-xs text-[#EDE8DF]/65 sm:flex-row">
            {/* Left: Copyright */}
            <div className="text-center sm:text-left">
              <span>© {new Date().getFullYear()} Dwellora. All Rights Reserved.</span>
            </div>

            {/* Middle: Signature */}
            <div className="flex items-center gap-1.5 text-center text-[#EDE8DF]/75">
              <span>Crafted with precision &amp; passion</span>
              <FiHeart className="h-3.5 w-3.5 text-accent fill-accent/30" />
            </div>

            {/* Right: Legal & Subtle Hidden Admin Portal Link */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-end text-xs">
              <Link
                href="/about"
                className="transition-colors hover:text-accent"
              >
                Privacy Policy
              </Link>
              <span aria-hidden="true" className="text-white/20">
                |
              </span>
              <Link
                href="/contact"
                className="transition-colors hover:text-accent"
              >
                Terms &amp; Conditions
              </Link>
              <span aria-hidden="true" className="text-white/20">
                |
              </span>
              {/* Subtle Low-Visibility Admin Portal Link */}
              <Link
                href="/admin/login"
                title="Management Access"
                className="group inline-flex items-center gap-1 text-[11px] text-white/30 transition-all duration-300 hover:text-accent hover:opacity-100"
              >
                <FiLock className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-100" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
