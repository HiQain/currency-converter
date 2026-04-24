import { Link } from "wouter";
import SiteFooter from "@/components/SiteFooter";

const sections = [
  {
    title: "Information we collect",
    body:
      "This mock policy explains how a currency converter website might collect basic usage data, preferences, and support requests to improve the product experience.",
  },
  {
    title: "How data is used",
    body:
      "Mock usage examples include remembering selected currencies, understanding feature usage, responding to support questions, and protecting the service from abuse.",
  },
  {
    title: "Cookies and local storage",
    body:
      "This demo app may store simple preferences such as selected currencies or last-entered amounts so the converter feels faster and more personal on return visits.",
  },
  {
    title: "Third-party services",
    body:
      "Exchange-rate APIs, analytics providers, or hosting platforms may process limited data needed to operate the site. Replace this section with your real vendors before launch.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="xe-page">
      <div className="xe-page__hero">
        <div className="xe-page__hero-inner">
          <p className="xe-page__eyebrow">Privacy Policy</p>
          <h1 className="xe-page__title">How information is handled on this demo site</h1>
          <p className="xe-page__subtitle">
            This page contains mock legal copy and should be replaced with reviewed production
            language before going live.
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
