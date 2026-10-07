import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import VideoEmbed from "@/components/VideoEmbed";
import type { PublicBlog } from "@/components/PublicBlogCard";

type ProjectVideoShowcaseProps = {
  blog?: PublicBlog | null;
};

const DEFAULT_VLOG = {
  eyebrow: "Featured Vlog Tour",
  title: "Complete Home Renovation Process: From Planning to Final Finish",
  description:
    "Step inside Dwellora's structured whole-home renovation workflow — from initial architectural planning and spatial design to master carpentry installation and final finishing.",
  videoUrl:
    "https://res.cloudinary.com/rh4jhmw7/video/upload/c_fill,w_1920,h_1080,q_auto/v1791313258/complete-home-renovation-vedio.mp4",
  coverImage:
    "https://res.cloudinary.com/rh4jhmw7/image/upload/v1791309410/Complete_Home_Renovation.jpg",
  slug: "complete-home-renovation-process-from-planning-to-final-finish",
  highlights: [
    "Complete home transformation & spatial architecture",
    "Initial planning, 3D concept & material palettes",
    "Master carpentry fabrication & precision joinery",
    "Turnkey execution & rigorous final finishing",
  ],
};

export default function ProjectVideoShowcase({ blog }: ProjectVideoShowcaseProps) {
  const title = blog?.title || DEFAULT_VLOG.title;
  const description =
    blog?.shortDescription?.trim() || DEFAULT_VLOG.description;
  const videoUrl = blog?.videoUrl || DEFAULT_VLOG.videoUrl;
  const coverImage = blog?.coverImage || DEFAULT_VLOG.coverImage;
  const slug = blog?.slug || DEFAULT_VLOG.slug;

  return (
    <section
      aria-labelledby="video-showcase-heading"
      className="site-container section-spacing"
    >
      {/* Section Header */}
      <div className="mx-auto max-w-4xl text-center">
        <p className="section-eyebrow">
          {DEFAULT_VLOG.eyebrow}
        </p>

        <h2
          id="video-showcase-heading"
          className="section-title mx-auto max-w-[820px]"
        >
          {title}
        </h2>

        <p className="section-description">
          {description}
        </p>
      </div>

      {/* Main Showcase Card */}
      <div className="mt-6 sm:mt-8 rounded-3xl border border-border/90 bg-surface p-6 sm:p-8 lg:p-10 shadow-[0_8px_32px_rgba(25,53,50,0.04)] transition-all duration-300 hover:border-accent/40">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
          {/* Video Embed Player */}
          <div className="lg:col-span-7">
            <VideoEmbed
              videoUrl={videoUrl}
              coverImage={coverImage}
              title={title}
            />
          </div>

          {/* Details & Actions */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-3.5">
              <h3 className="text-xl font-bold tracking-tight text-brand">
                Whole-Home Transformation Journey
              </h3>
              {DEFAULT_VLOG.highlights.map((highlight, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/20 text-brand">
                    <FiCheckCircle className="h-3.5 w-3.5 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-brand/90">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Link
                href={`/blogs/${encodeURIComponent(slug)}`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-brand shadow-xs hover:bg-brand hover:text-white hover:shadow-md transition-all duration-300 ease-out w-full sm:w-auto"
              >
                <span>Watch Full Journey</span>
                <FiArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact?type=quote"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full border border-brand bg-transparent px-6 py-3 text-xs font-semibold text-brand hover:bg-brand hover:text-white hover:shadow-sm transition-all duration-300 ease-out w-full sm:w-auto"
              >
                Plan Your Renovation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
