import Link from "next/link"
import Logo from "./Logo"
import SteamIcon from "./SteamIcon"
import { company, nav } from "@/lib/site-content"

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Link href="/" className="text-ink">
            <Logo />
          </Link>
          <p className="mt-4 max-w-[38ch] text-[0.875rem] leading-relaxed text-ink-2">
            An independent game studio building bold, universe-scale gaming
            experiences. Every orbit begins with a single shift.
          </p>
          <p className="mt-4 text-[0.875rem]">
            <a href={`mailto:${company.email}`} className="link-accent">
              {company.email}
            </a>
          </p>

          <a
            href={company.steam}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-line-2 bg-paper px-3.5 py-2 text-[0.875rem] font-medium text-ink transition-colors hover:bg-surface-2"
          >
            <SteamIcon size={16} />
            Shift Orbit on Steam
          </a>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
            Navigate
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.875rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-6 text-[0.8125rem] text-ink-3">
          <p>
            © {year} {company.name}
          </p>
          <Link href="/admin" className="transition-colors hover:text-ink">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
