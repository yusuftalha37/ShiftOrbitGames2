"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import NewsManager from "@/components/admin/NewsManager"
import GameManager from "@/components/admin/GameManager"

export default function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<"news" | "games">("games")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login")
    }
  }, [authLoading, user, router])

  if (authLoading || !user) {
    return (
      <div className="section container-page text-[0.9375rem] text-ink-3">Loading…</div>
    )
  }

  // Signed in, but not on the admin list. Show the uid so an existing admin
  // can grant access rather than leaving the person at a dead end.
  if (!isAdmin) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
        <div className="card w-full max-w-md p-8">
          <h1 className="text-[1.25rem] font-semibold tracking-[-0.018em]">
            Access not granted yet
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-2">
            You are signed in as{" "}
            <span className="font-medium text-ink">{user.email}</span>, but this
            account is not allowed to edit the site. An existing admin can grant
            access by adding your account ID to the <code className="mono">admins</code>{" "}
            collection in Firebase.
          </p>

          <div className="mt-6">
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
              Your account ID
            </p>
            <div className="mt-2 flex items-center gap-2">
              <code className="mono flex-1 truncate rounded-lg border border-line bg-surface px-3 py-2 text-[0.8125rem]">
                {user.uid}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(user.uid)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
                className="btn btn-secondary btn-sm"
              >
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          <button
            onClick={() => signOut(auth)}
            className="btn btn-secondary btn-sm mt-6"
          >
            Sign out
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="py-14">
      <div className="container-page max-w-[64rem]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1 className="h2 mt-2">Shift Orbit</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[0.8125rem] text-ink-3 sm:inline">
              {user.displayName || user.email}
            </span>
            <button onClick={() => signOut(auth)} className="btn btn-secondary btn-sm">
              Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Content type"
          className="mb-10 inline-flex gap-1 rounded-lg border border-line bg-surface p-1"
        >
          {(["games", "news"] as const).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              onClick={() => setTab(t)}
              className={`rounded-md px-4 py-1.5 text-[0.875rem] font-medium transition-colors ${
                tab === t
                  ? "bg-paper text-ink shadow-[0_1px_2px_rgba(13,15,18,0.06)]"
                  : "text-ink-3 hover:text-ink"
              }`}
            >
              {t === "games" ? "Games" : "News"}
            </button>
          ))}
        </div>

        {tab === "games" ? <GameManager /> : <NewsManager />}
      </div>
    </div>
  )
}
