import Link from "next/link"
import Logo from "./Logo"
import { company, nav } from "@/lib/site-content"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Link href="/" className="text-ink">
            <Logo />
          </Link>
          <p className="mt-4 max-w-[36ch] text-[0.875rem] leading-relaxed text-ink-2">
            A software engineering studio in İstanbul. We build and operate
            custom software for companies that depend on it.
          </p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
            Navigate
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.875rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                href="/news"
                className="text-ink-2 transition-colors hover:text-ink"
              >
                News
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
            Contact
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.875rem]">
            <li>
              <a href={`mailto:${company.email}`} className="link-accent">
                {company.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.phone.replace(/\s/g, "")}`}
                className="text-ink-2 transition-colors hover:text-ink"
              >
                {company.phone}
              </a>
            </li>
            <li>
              <address className="not-italic text-ink-2">
                {company.address.street}
                <br />
                {company.address.locality}
              </address>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-6 text-[0.8125rem] text-ink-3">
          <p>
            © {year} {company.legalName}
          </p>
          <p>Registered in {company.address.country}</p>
        </div>
      </div>
    </footer>
  )
}
