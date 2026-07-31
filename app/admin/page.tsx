"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { useAuth } from "@/lib/auth-context"
import NewsManager from "@/components/admin/NewsManager"
import GameManager from "@/components/admin/GameManager"

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tab, setTab] = useState<"news" | "games">("games")

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

  return (
    <div className="py-14">
      <div className="container-page max-w-[64rem]">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Admin panel</p>
            <h1 className="h2 mt-2">Shift Orbit</h1>
          </div>
          <button onClick={() => signOut(auth)} className="btn btn-secondary btn-sm">
            Sign out
          </button>
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
