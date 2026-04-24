import { Link } from "wouter";

export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="xe-footer">
      <div className="xe-footer__inner">
        <p className="xe-footer__copy">
          © {currentYear} Currency Converter. All rights reserved.
        </p>
        <nav className="xe-footer__nav" aria-label="Footer navigation">
          <Link className="xe-footer__text-link" href="/">
            Home
          </Link>
          <span className="xe-footer__divider" aria-hidden="true">
            |
          </span>
          <Link className="xe-footer__text-link" href="/blog">
            Blog
          </Link>
          <span className="xe-footer__divider" aria-hidden="true">
            |
          </span>
          <Link className="xe-footer__text-link" href="/privacy-policy">
            Privacy Policy
          </Link>
          <span className="xe-footer__divider" aria-hidden="true">
            |
          </span>
          <Link className="xe-footer__text-link" href="/terms-of-service">
            Terms of Service
          </Link>
        </nav>
        <a
          className="xe-footer__text-link"
          href="https://hiqain.com/"
          target="_blank"
          rel="noreferrer"
        >
          Powered By Hiqain Pvt Ltd
        </a>
      </div>
    </footer>
  );
}
