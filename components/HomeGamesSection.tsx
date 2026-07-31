"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllGames, Game } from "@/lib/games"

export default function HomeGamesSection() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllGames().then(setGames).finally(() => setLoading(false))
  }, [])

  return (
    <section id="games" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Our Universe</p>
          <h2 className="section-title text-white mb-4">Games</h2>
          <p className="text-slate-400 max-w-lg mx-auto">
            Each title is a new world. Explore the games we have launched into orbit.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-600">Loading...</p>
        ) : games.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <p className="text-6xl mb-4">🚀</p>
            <p className="text-xl">First launch coming soon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {games.map((game) => (
              <Link
                key={game.id}
                href={`/games/${game.slug}`}
                className="group block rounded-2xl overflow-hidden hover-lift gradient-border"
                style={{ background: "var(--bg-card)" }}
              >
                <div className="relative h-52 bg-slate-900 overflow-hidden">
                  {game.coverImage ? (
                    <Image
                      src={game.coverImage}
                      alt={game.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"
                      style={{ background: "linear-gradient(135deg, #1e1b4b, #0f172a)" }}>
                      <span className="text-5xl opacity-30">🌌</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-card)] to-transparent opacity-60" />

                  <div className="absolute top-3 right-3">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                      style={{
                        background: game.status === "released"
                          ? "rgba(16,185,129,0.2)"
                          : game.status === "coming-soon"
                          ? "rgba(124,58,237,0.3)"
                          : "rgba(245,158,11,0.2)",
                        color: game.status === "released"
                          ? "#34d399"
                          : game.status === "coming-soon"
                          ? "#c4b5fd"
                          : "#fcd34d",
                        border: `1px solid ${game.status === "released" ? "rgba(52,211,153,0.4)" : game.status === "coming-soon" ? "rgba(196,181,253,0.4)" : "rgba(252,211,77,0.4)"}`,
                      }}
                    >
                      {game.status === "released" ? "Released" : game.status === "coming-soon" ? "Coming Soon" : "In Development"}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {game.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{game.shortDescription}</p>
                  <div className="flex flex-wrap gap-2">
                    {game.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 rounded-md text-xs font-medium"
                        style={{ background: "rgba(124,58,237,0.15)", color: "#a78bfa", border: "1px solid rgba(124,58,237,0.25)" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
