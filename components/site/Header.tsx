"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import Logo from "./Logo"
import SocialLinks from "./SocialLinks"
import { nav } from "@/lib/site-content"

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Stop the page behind the menu overlay from scrolling.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-line bg-paper/95 backdrop-blur-md"
          : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent"
      }`}
    >
      <div className="relative flex h-[4.5rem] items-center justify-between gap-4 px-4 sm:px-6">
        {/* Left — menu */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink transition-colors hover:bg-white/10"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M5 5l12 12M17 5L5 17"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M3 6h16M3 11h16M3 16h16"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>

        {/* Centre — logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="absolute left-1/2 -translate-x-1/2 text-ink"
          aria-label="Shift Orbit — home"
        >
          <Logo />
        </Link>

        {/* Right — social links */}
        <div className="flex items-center gap-2">
          <SocialLinks className="hidden sm:flex" />
          <Link href="/#contact" className="btn btn-primary btn-sm hidden lg:inline-flex">
            Get in touch
          </Link>
        </div>
      </div>

    </header>

      {/* Full-screen menu, the way the reference site does it on every size.
          It lives outside <header> because the header's backdrop-filter would
          otherwise become the containing block for this fixed layer. */}
      {open && (
        <div
          id="site-menu"
          className="fixed inset-0 top-[4.5rem] z-40 overflow-y-auto border-t border-line bg-paper"
        >
          <nav aria-label="Primary" className="container-page py-10">
            <ul className="space-y-1">
              {nav.map((item, i) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 border-b border-line py-5 transition-colors hover:text-accent"
                  >
                    <span className="mono text-[0.75rem] text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="display text-[clamp(1.75rem,6vw,3rem)]">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/#contact"
                onClick={() => setOpen(false)}
                className="btn btn-primary"
              >
                Get in touch
              </Link>
              <SocialLinks />
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
