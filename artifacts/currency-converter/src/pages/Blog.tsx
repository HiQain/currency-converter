import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";

const posts = [
  {
    slug: "usd-inr-weekly-outlook",
    category: "Market Update",
    title: "USD to INR weekly outlook for importers and remote teams",
    excerpt:
      "Mock analysis covering near-term volatility, payroll timing, and how to think about weekly conversion windows.",
    date: "April 24, 2026",
    readTime: "4 min read",
  },
  {
    slug: "travel-budget-eur-jpy",
    category: "Travel",
    title: "Planning a Europe and Japan trip with one FX budget",
    excerpt:
      "Mock budgeting guidance for travelers comparing EUR and JPY spending, cash needs, and card-friendly strategies.",
    date: "April 19, 2026",
    readTime: "5 min read",
  },
  {
    slug: "small-business-fx-checklist",
    category: "Business",
    title: "A simple foreign exchange checklist for small businesses",
    excerpt:
      "Mock content for teams that invoice internationally and want a practical routine for monitoring rate changes.",
    date: "April 11, 2026",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="xe-page">
      <div className="xe-page__hero">
        <div className="xe-page__hero-inner">
          <p className="xe-page__eyebrow">Blog</p>
          <h1 className="xe-page__title">Currency insights, guides, and market notes</h1>
          <p className="xe-page__subtitle">
            This is mock content for the blog section. You can replace these cards with real
            articles whenever the content is ready.
          </p>
        </div>
      </div>

      <main className="xe-page__content">
        <div className="xe-page__actions">
          <Link className="xe-page__backlink" href="/">
            Back to converter
          </Link>
        </div>

        <section className="xe-blog-grid" aria-label="Blog posts">
          {posts.map((post) => (
            <article key={post.slug} className="xe-surface xe-blog-card">
              <p className="xe-blog-card__meta">
                {post.category} · {post.date} · {post.readTime}
              </p>
              <h2 className="xe-blog-card__title">{post.title}</h2>
              <p className="xe-blog-card__excerpt">{post.excerpt}</p>
              <span className="xe-page__text-link">Read mock article</span>
            </article>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
