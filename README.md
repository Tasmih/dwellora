# Dwellora — Premium Home Renovation & Custom Carpentry

> **Frontend Developer Task Assessment**  
> **Company**: [Digital Resolution](https://digitalresolution.net/)  
> **Email**: contact@digitalresolution.net  
> **Address**: Software Technology Park, 6th Floor, Singapore Bangkok Market, Agrabad, Chattogram.  
> **Live Production Demo**: [https://dwellora-client.vercel.app](https://dwellora-client.vercel.app)  
> **Reference Inspiration**: [Tangs Carpentry](https://tangscarpentrysg.com/)

---

## 1. Project Overview

**Dwellora** is a modern, responsive, and performance-oriented web platform engineered for a luxury home renovation and bespoke carpentry studio. Built with a focus on high-end architectural aesthetics, seamless user experience, and robust engineering standards, the project demonstrates an end-to-end full-stack solution featuring:

- A **luxury public-facing portfolio and content hub** that engages potential clients through rich visual storytelling, dynamic video showcases, interactive FAQ systems, and dynamic service directories.
- A **full-featured administrative management portal** that enables real-time CRUD operations over services, service categories, project portfolios, and editorial blog/vlog publications.
- **Enterprise-grade SEO & web performance** infrastructure, including dynamic Open Graph generation, JSON-LD Schema.org structured data, dynamic XML sitemaps, robots.txt directives, and Google Search Console verification.

---

## 2. Features

### 🌐 Public Experience
- **Architectural Homepage**:
  - **Hero & Trust Indicators**: High-contrast luxury design with key trust badges and architectural typography.
  - **Dynamic Services Showcase**: Dynamic category taxonomy linking directly to specific service disciplines.
  - **Why Choose Dwellora**: Core value propositions highlighting master joinery, premium materials, and transparent workflows.
  - **Featured Projects**: Curated gallery of luxury residential and commercial transformations.
  - **Featured Vlog Tour**: Dynamic video showcase spotlighting whole-home renovation processes from planning to final finishing.
  - **Renovation Process**: Step-by-step workflow guide illustrating consultation, design, crafting, and installation.
  - **Latest Blogs & Vlogs**: Dynamic multimedia publication feed supporting both written articles and embedded video walkthroughs.
  - **Interactive Expandable FAQ**: Horizontal accordion with fluid Framer Motion expansions and responsive fallback.
  - **Cinematic Showcase CTA**: Dedicated kitchen renovation visual tour with high-conversion consultation triggers.
  - **Dynamic Luxury Footer**: Four-column layout dynamically mapped to live service categories from the database with animated micro-interactions.
- **Dedicated Section Pages**:
  - `/about`: Studio heritage, craftsmanship philosophy, and team profile.
  - `/services`: Filterable catalog of renovation and carpentry services.
  - `/services/[slug]`: Dynamic service detail pages with included deliverables, related offerings, and tailored metadata.
  - `/services/category/[categorySlug]`: Dynamic category landing pages grouping related renovation services.
  - `/projects`: Comprehensive architectural portfolio with category filters.
  - `/projects/[slug]`: In-depth project case studies featuring high-resolution galleries, material specifications, and features.
  - `/blogs` & `/blogs/[slug]`: Multi-category knowledge base supporting editorial articles and video vlogs.
  - `/contact`: Interactive consultation booking form with integrated validation.
  - `not-found.tsx`: Custom architectural blueprint-inspired 404 page with navigation fallbacks.

### 🔐 Admin Dashboard
- **Admin Authentication**: Secure JWT-based access control with session management.
- **Service & Category Management**:
  - Create, edit, delete, and re-order service categories.
  - Create, update, publish/unpublish renovation services with rich descriptions, image galleries, and included item lists.
- **Project Portfolio Management**:
  - Create, update, and manage completed project case studies with image galleries and feature highlights.
- **Blog & Vlog Management**:
  - Create and curate articles and video tours with dynamic video URL embeds and rich text formatting.
- **Real-Time Dynamic Synchronization**: All changes made in the admin portal immediately reflect across the public client and dynamic sitemap.

---

## 3. Technology Stack

### Frontend
- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (Curated luxury palette: Deep Forest Green `#0F2F2A`, Warm Gold `#c9a365`, Warm Off-White `#faf6ef`)
- **Animation**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/) (Feather & FontAwesome)
- **Images**: Next.js Image Optimization (`next/image`) with safe fallbacks

### Backend & API
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express.js](https://expressjs.com/)
- **Language**: TypeScript
- **Database**: [MongoDB](https://www.mongodb.com/) (Native MongoDB Driver & Aggregation Pipelines)
- **Authentication**: JSON Web Tokens (JWT) & HTTP-only cookies / Bearer headers

### SEO & DevOps
- **Deployment**: [Vercel](https://vercel.com/) (Frontend)
- **Metadata**: Next.js Metadata API with dynamic OpenGraph & Twitter Cards
- **Structured Data**: Schema.org `Organization` & `HomeAndConstructionBusiness` JSON-LD
- **Indexing**: Dynamic `sitemap.xml`, `robots.txt`, and Google Search Console verification

---

## 4. Project Architecture

```text
Dwellora/
├── Dwellora-client/              # Next.js App Router Frontend
│   ├── public/                   # Static assets, branding logos, icons
│   │   └── images/
│   ├── src/
│   │   ├── app/                  # App Router pages, layouts, and route handlers
│   │   │   ├── about/            # About Studio page
│   │   │   ├── admin/            # Admin dashboard & management modules
│   │   │   ├── blogs/            # Blog & Vlog listing and dynamic [slug] pages
│   │   │   ├── contact/          # Consultation booking page
│   │   │   ├── projects/         # Portfolio listing and dynamic [slug] pages
│   │   │   ├── services/         # Services directory, [slug], and category pages
│   │   │   ├── globals.css       # Global design tokens and styles
│   │   │   ├── layout.tsx        # Root layout with metadata & JSON-LD schema
│   │   │   ├── not-found.tsx     # Custom luxury 404 page
│   │   │   ├── robots.ts         # Search engine crawler directives
│   │   │   └── sitemap.ts        # Dynamic XML sitemap generator
│   │   ├── components/           # Reusable UI components
│   │   │   ├── admin/            # Admin cards, headers, and form controls
│   │   │   ├── common/           # Loading indicators, modals, alerts
│   │   │   ├── Footer.tsx        # Dynamic 4-column luxury footer
│   │   │   ├── Navbar.tsx        # Navigation bar with desktop & mobile dropdowns
│   │   │   ├── FAQSection.tsx    # Interactive expandable FAQ cards
│   │   │   └── ...               # Showcase sections (Hero, Services, CTA, etc.)
│   │   ├── lib/                  # Shared utilities and API client helpers
│   │   └── types/                # Global TypeScript definitions
│   └── package.json
│
└── dwellora-server/              # Express.js REST API Backend
    ├── src/
    │   ├── config/               # Database connection and environment config
    │   ├── controllers/          # Business logic handlers for CRUD endpoints
    │   ├── middleware/           # Auth guards, error handling, validation
    │   ├── models/               # MongoDB collections and schema definitions
    │   ├── routes/               # API route definitions (/api/services, etc.)
    │   ├── seed/                 # Initial database seeding datasets
    │   └── server.ts             # Express server entry point
    └── package.json
```

---

## 5. Dynamic Content Management

Dwellora operates as a headless, database-driven platform where public pages consume live data directly from MongoDB through structured REST API endpoints:

1. **Service Categories**: Services are classified under dynamic categories that can be ordered and managed via the admin panel.
2. **Dynamic Slugs**: Every service, category, project, and blog post generates a semantic, URL-safe slug for clean routing (e.g., `/services/kitchen-renovation`).
3. **Automated Taxonomies**: The public navigation bar and footer automatically fetch and display active service categories, ensuring navigation never falls out of sync with published offerings.
4. **Resilient Data Fetching**: Client requests utilize server-side caching with revalidation, coupled with skeleton placeholders and graceful fallbacks if network connectivity varies.

---

## 6. SEO Implementation

Dwellora incorporates a complete, production-ready SEO architecture adhering to Next.js App Router best practices:

- **Root & Page Metadata**: Comprehensive base title (`Dwellora | Premium Home Renovation & Custom Carpentry`), templated sub-pages (`%s | Dwellora`), and targeted keyword strategies.
- **Dynamic Metadata Generation**: Automated `generateMetadata()` hooks across all dynamic routes (`/services/[slug]`, `/projects/[slug]`, `/blogs/[slug]`, `/services/category/[categorySlug]`) pulling live titles, descriptions, and cover images.
- **Social Sharing (Open Graph & Twitter)**: High-resolution image previews with `summary_large_image` cards for rich previews on social platforms.
- **Structured Data (JSON-LD)**: Injected `@graph` Schema.org representations for both `Organization` and `HomeAndConstructionBusiness` (address, coordinates, opening hours, contact endpoints).
- **Dynamic Sitemap (`/sitemap.xml`)**: Automatically aggregates all static application routes with dynamic service, project, category, and blog URLs with appropriate priority rankings and `lastModified` timestamps.
- **Crawler Directives (`/robots.txt`)**: Allows search engine indexing across public pages while protecting `/admin/` and `/api/` endpoints.
- **Search Engine Verification**: Integrated Google Search Console verification token directly in the root layout metadata.

---

## 7. Image Optimization & Performance

- **Next.js Image Pipeline**: All images leverage Next.js `next/image` with WebP/AVIF format negotiation, responsive dimension hints, and layout shift prevention.
- **Accessible & SEO-Friendly Alt Text**: Title-derived, descriptive `alt` tags on every visual element to ensure accessibility and search discoverability.
- **Safe Fallback Wrapper**: Custom `SafeImage` component preventing UI breakages in the event of missing or external image host anomalies.
- **Fluid Micro-Animations**: GPU-accelerated transforms using Framer Motion configured to minimize layout recalculations and preserve $60\text{ FPS}$ performance.

---

## 8. Installation & Setup

### Prerequisites
- Node.js (v18.17 or higher)
- npm or yarn
- MongoDB Atlas cluster or local MongoDB instance

---

### Frontend Setup (`Dwellora-client`)

1. Navigate to the client directory:
   ```bash
   cd Dwellora-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```
   The client application will be available at `http://localhost:3000`.

5. Build for production:
   ```bash
   npm run build
   ```

---

### Backend Setup (`dwellora-server`)

1. Navigate to the server directory:
   ```bash
   cd dwellora-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables by creating `.env`:
   ```env
   PORT=5000
   CLIENT_ORIGIN=http://localhost:3000
   MONGODB_URI=your_mongodb_connection_string_placeholder
   MONGODB_DB=dwellora
   JWT_SECRET=your_jwt_secret_placeholder
   NODE_ENV=development
   ```

4. Run the server in development mode:
   ```bash
   npm run dev
   ```
   The API server will listen at `http://localhost:5000`.

---

## 9. Submission & Contact

This project was developed for the **Frontend Developer Task Assessment** for **Digital Resolution**.

- **Organization**: Digital Resolution
- **Email**: contact@digitalresolution.net
- **Website**: [https://digitalresolution.net/](https://digitalresolution.net/)
- **Address**: Software Technology Park, 6th Floor, Singapore Bangkok Market, Agrabad, Chattogram.
- **Live Deployment**: [https://dwellora-client.vercel.app](https://dwellora-client.vercel.app)
