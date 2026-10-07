import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://dwellora.com";

export const viewport: Viewport = {
  themeColor: "#0F2F2A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dwellora | Premium Home Renovation & Custom Carpentry",
    template: "%s | Dwellora",
  },
  description:
    "Transform your home with Dwellora's premium renovation, interior design, and custom carpentry solutions.",
  keywords: [
    "home renovation",
    "interior design",
    "custom carpentry",
    "kitchen renovation",
    "home transformation",
    "luxury joinery",
    "bespoke furniture",
    "architectural remodeling",
    "Dhaka renovations",
    "Dwellora",
  ],
  authors: [{ name: "Dwellora Studio", url: siteUrl }],
  creator: "Dwellora",
  publisher: "Dwellora Home Renovation & Carpentry",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Dwellora | Premium Home Renovation & Custom Carpentry",
    description:
      "Transform your home with Dwellora's premium renovation, interior design, and custom carpentry solutions.",
    url: siteUrl,
    siteName: "Dwellora",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/images/dwellora-logo.png",
        width: 1200,
        height: 630,
        alt: "Dwellora | Premium Home Renovation & Custom Carpentry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dwellora | Premium Home Renovation & Custom Carpentry",
    description:
      "Transform your home with Dwellora's premium renovation, interior design, and custom carpentry solutions.",
    images: ["/images/dwellora-logo.png"],
    creator: "@dwellora",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Dwellora",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/dwellora-logo.png`,
        width: 512,
        height: 512,
      },
      description:
        "Transform your home with Dwellora's premium renovation, interior design, and custom carpentry solutions.",
      sameAs: [
        "https://facebook.com",
        "https://instagram.com",
        "https://youtube.com",
        "https://linkedin.com",
      ],
    },
    {
      "@type": "HomeAndConstructionBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Dwellora Home Renovation & Custom Carpentry",
      url: siteUrl,
      logo: `${siteUrl}/images/dwellora-logo.png`,
      image: `${siteUrl}/images/Footerlogo.png`,
      description:
        "Premium home renovation, interior design, and bespoke carpentry studio providing master craftsmanship and architectural transformations.",
      telephone: "+8801700000000",
      email: "hello@dwellora.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "House 42, Road 11, Banani",
        addressLocality: "Dhaka",
        postalCode: "1213",
        addressCountry: "BD",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 23.7937,
        longitude: 90.4066,
      },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Saturday",
            "Sunday",
          ],
          opens: "09:00",
          closes: "19:00",
        },
      ],
      priceRange: "$$$",
    },
  ],
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}