"use client"

import Link from "next/link"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import { useContent } from "@/lib/i18n-context"

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 20a7.5 7.5 0 0115 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * The way into the admin panel. Shows the panel and a sign-out when someone
 * is already signed in, so the entry point never sends them to a login form
 * they do not need.
 */
export default function AccountLink({
  onNavigate,
  variant = "full",
  className = "",
}: {
  onNavigate?: () => void
  /** "compact" is the header treatment: icon always, label from sm up. */
  variant?: "full" | "compact"
  className?: string
}) {
  const { user, loading } = useAuth()
  const c = useContent()

  if (loading) return null

  if (variant === "compact") {
    if (!user) {
      return (
        <Link
          href="/admin/login"
          onClick={onNavigate}
          title={c.account.signIn}
          className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-[0.875rem] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-accent ${className}`}
        >
          <UserIcon />
          <span className="hidden lg:inline">{c.account.signIn}</span>
          <span className="sr-only lg:hidden">{c.account.signIn}</span>
        </Link>
      )
    }
    return (
      <span className={`inline-flex items-center gap-1 ${className}`}>
        <Link
          href="/admin"
          onClick={onNavigate}
          title={c.account.panel}
          className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[0.875rem] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-accent"
        >
          <UserIcon />
          <span className="hidden lg:inline">{c.account.panel}</span>
          <span className="sr-only lg:hidden">{c.account.panel}</span>
        </Link>
        <button
          type="button"
          onClick={() => signOut(auth)}
          title={c.account.signOut}
          className="inline-flex h-9 items-center rounded-full px-2 text-[0.75rem] text-white/50 transition-colors hover:bg-white/10 hover:text-accent"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <polyline points="16 17 21 12 16 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="sr-only">{c.account.signOut}</span>
        </button>
      </span>
    )
  }

  if (!user) {
    return (
      <Link
        href="/admin/login"
        onClick={onNavigate}
        className={`inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink-2 transition-colors hover:text-accent ${className}`}
      >
        <UserIcon />
        {c.account.signIn}
      </Link>
    )
  }

  return (
    <span className={`inline-flex flex-wrap items-center gap-x-4 gap-y-2 ${className}`}>
      <Link
        href="/admin"
        onClick={onNavigate}
        className="inline-flex items-center gap-2 text-[0.9375rem] font-medium text-ink transition-colors hover:text-accent"
      >
        <UserIcon />
        {c.account.panel}
      </Link>
      <button
        type="button"
        onClick={() => signOut(auth)}
        className="text-[0.8125rem] text-ink-3 transition-colors hover:text-ink"
      >
        {c.account.signOut}
      </button>
    </span>
  )
}
