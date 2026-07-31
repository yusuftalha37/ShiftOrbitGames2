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
    return <div className="legacy-surface min-h-screen pt-32 text-center text-slate-500">Loading...</div>
  }

  return (
    <div className="legacy-surface min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-1">Admin Panel</p>
            <h1 className="text-3xl font-black text-white">Shift Orbit</h1>
          </div>
          <button
            onClick={() => signOut(auth)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 transition-colors hover:text-white"
            style={{ border: "1px solid rgba(124,58,237,0.3)" }}
          >
            Sign Out
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-10 p-1 rounded-xl inline-flex" style={{ background: "rgba(255,255,255,0.05)" }}>
          {(["games", "news"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize"
              style={{
                background: tab === t ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "transparent",
                color: tab === t ? "white" : "#94a3b8",
              }}
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
