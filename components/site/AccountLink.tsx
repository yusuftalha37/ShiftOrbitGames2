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
    const href = user ? "/admin" : "/admin/login"
    const label = user ? c.account.panel : c.account.signIn
    return (
      <Link
        href={href}
        onClick={onNavigate}
        title={label}
        className={`inline-flex h-9 items-center gap-2 rounded-full px-3 text-[0.875rem] font-medium text-white/75 transition-colors hover:bg-white/10 hover:text-accent ${className}`}
      >
        <UserIcon />
        <span className="hidden lg:inline">{label}</span>
        <span className="sr-only lg:hidden">{label}</span>
      </Link>
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
