"use client"

import { PLATFORMS } from "@/lib/settings"
import { useSocialLinks } from "@/lib/settings-context"
import SocialIcon from "./SocialIcon"

/**
 * Renders only the platforms that have a URL set in the admin panel, so
 * removing a link from settings removes it from the site.
 */
export default function SocialLinks({
  variant = "icons",
  className = "",
}: {
  variant?: "icons" | "labelled"
  className?: string
}) {
  const links = useSocialLinks()
  const active = PLATFORMS.filter((p) => links[p.key])

  if (active.length === 0) return null

  if (variant === "labelled") {
    return (
      <ul className={`flex flex-col gap-1 ${className}`}>
        {active.map((p) => (
          <li key={p.key}>
            <a
              href={links[p.key]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 py-2 text-[0.9375rem] text-ink"
            >
              <SocialIcon platform={p.key} size={15} />
              {p.label}
            </a>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {active.map((p) => (
        <li key={p.key}>
          <a
            href={links[p.key]}
            target="_blank"
            rel="noopener noreferrer"
            title={`${p.label}`}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-ink-3 transition-colors hover:bg-surface-2 hover:text-ink"
          >
            <SocialIcon platform={p.key} size={16} />
            <span className="sr-only">Shift Orbit on {p.label}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}
