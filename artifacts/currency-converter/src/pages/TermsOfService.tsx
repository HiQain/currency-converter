import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  {
    title: "Service overview",
    body:
      "These mock terms describe a currency conversion website that provides exchange-rate information for general informational use and user convenience.",
  },
  {
    title: "Acceptable use",
    body:
      "Example restrictions include not attempting to disrupt the service, scrape protected systems, bypass rate limits, or misuse the site in ways that harm other users.",
  },
  {
    title: "No financial advice",
    body:
      "Rates, charts, and market commentary shown on this demo site are mock examples and should not be treated as investment, tax, accounting, or legal advice.",
  },
  {
    title: "Availability and changes",
    body:
      "Features, content, and supported currencies may change over time. Replace this placeholder text with the operational commitments that match your real service.",
  },
];

export default function TermsOfServicePage() {
  return (
    <div className="xe-page">
      <div className="xe-page__hero">
        <div className="xe-page__hero-inner">
          <p className="xe-page__eyebrow">Terms of Service</p>
          <h1 className="xe-page__title">Rules and expectations for using this demo</h1>
          <p className="xe-page__subtitle">
            This page uses mock legal text for layout and navigation purposes. It should be
            reviewed and replaced before production use.
          </p>
        </div>
      </div>

      <main className="xe-page__content">
        <div className="xe-page__actions">
          <Link className="xe-page__backlink" href="/">
            Back to converter
          </Link>
        </div>

        <section className="xe-surface xe-legal-card">
          {sections.map((section) => (
            <div key={section.title} className="xe-legal-card__section">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
          ))}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
