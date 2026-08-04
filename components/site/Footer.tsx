"use client"

import Link from "next/link"
import Logo from "./Logo"
import SocialLinks from "./SocialLinks"
import { company, navHrefs } from "@/lib/site-content"
import { useContent } from "@/lib/i18n-context"

export default function Footer() {
  const year = new Date().getFullYear()
  const c = useContent()

  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page grid grid-cols-1 gap-10 py-14 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <Link href="/" className="text-ink">
            <Logo />
          </Link>
          <p className="mt-4 max-w-[38ch] text-[0.875rem] leading-relaxed text-ink-2">
{c.footer.description}
          </p>
          <p className="mt-4 text-[0.875rem]">
            <a href={`mailto:${company.email}`} className="link-accent">
              {company.email}
            </a>
          </p>

          <SocialLinks className="-ml-2 mt-5" />
        </div>

        <nav aria-label="Footer">
          <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
            {c.footer.navigate}
          </h2>
          <ul className="mt-4 space-y-2.5 text-[0.875rem]">
            {navHrefs.map((href, i) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {c.nav[i]}
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
            {c.footer.admin}
          </Link>
        </div>
      </div>
    </footer>
  )
}
