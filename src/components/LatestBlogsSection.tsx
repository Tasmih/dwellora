import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import PublicBlogCard, {
  type PublicBlog,
} from "@/components/PublicBlogCard";

type LatestBlogsSectionProps = {
  blogs: PublicBlog[];
};

export default function LatestBlogsSection({ blogs }: LatestBlogsSectionProps) {
  if (!blogs || blogs.length === 0) {
    return null;
  }

  // Dynamically map the featured full home renovation vlog
  const featuredHomeVlog = blogs.find(
    (b) =>
      b.title.toLowerCase().includes("complete home renovation") ||
      (b.videoUrl && b.title.toLowerCase().includes("complete"))
  );

  // Other stories from dynamic blog/vlog data (excluding the dedicated kitchen tour to keep sections distinct)
  const otherStories = blogs.filter(
    (b) =>
      b !== featuredHomeVlog &&
      !b.title.toLowerCase().includes("modern kitchen renovation")
  );

  const displayBlogs = [
    ...(featuredHomeVlog ? [featuredHomeVlog] : []),
    ...otherStories,
  ].slice(0, 3);

  return (
    <section
      aria-labelledby="latest-blogs-heading"
      className="site-container section-spacing"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="section-eyebrow">
          Journal &amp; Perspectives
        </p>

        <h2
          id="latest-blogs-heading"
          className="section-title text-balance"
        >
          Latest Blogs &amp; Vlogs
        </h2>

        <p className="section-description text-balance">
          Expert craftsmanship insights, design guides, material selection tips, and behind-the-scenes video tours.
        </p>
      </div>

      <div className="mt-6 sm:mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayBlogs.map((blog) => (
          <PublicBlogCard
            key={blog._id || blog.slug}
            blog={blog}
          />
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blogs"
          className="btn btn-secondary inline-flex items-center gap-2"
        >
          <span>View All Articles</span>
          <FiArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
