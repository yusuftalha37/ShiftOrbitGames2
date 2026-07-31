"use client"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { getGameBySlug, Game } from "@/lib/games"
import GameNewsSection from "@/components/GameNewsSection"

interface Props {
  params: Promise<{ slug: string }>
}

function StarRating({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "#facc15" : "none"}
          stroke={i < Math.round(rating) ? "#facc15" : "#475569"}
          strokeWidth="2"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-slate-400 ml-1">{rating}/{max}</span>
    </div>
  )
}

const platformIcons: Record<string, string> = {
  YouTube: "▶",
  Twitch: "🟣",
  TikTok: "♪",
  Twitter: "✕",
  Instagram: "📸",
  Default: "🔗",
}

const platformColors: Record<string, string> = {
  YouTube: "rgba(255,0,0,0.15)",
  Twitch: "rgba(145,71,255,0.15)",
  TikTok: "rgba(0,242,234,0.1)",
  Twitter: "rgba(29,161,242,0.15)",
  Instagram: "rgba(225,48,108,0.15)",
  Default: "rgba(124,58,237,0.15)",
}

export default function GamePage({ params }: Props) {
  const { slug } = use(params)
  const [game, setGame] = useState<Game | null | undefined>(undefined)

  useEffect(() => {
    getGameBySlug(slug).then(setGame)
  }, [slug])

  if (game === undefined) {
    return <div className="legacy-surface min-h-screen pt-32 text-center text-slate-500">Loading...</div>
  }

  if (game === null) {
    return (
      <div className="legacy-surface min-h-screen pt-32 text-center">
        <p className="text-slate-400 mb-6">Game not found.</p>
        <Link href="/" className="text-purple-400 hover:text-purple-300">← Back to Home</Link>
      </div>
    )
  }

  const avgRating =
    game.reviews.length > 0
      ? game.reviews.reduce((sum, r) => sum + (r.rating ?? 0), 0) / game.reviews.filter((r) => r.rating).length
      : null

  return (
    <div className="legacy-surface min-h-screen pt-20">
      {/* ─── HERO ────────────────────────────────────────────── */}
      <div className="relative h-[60vh] min-h-[420px] overflow-hidden">
        {game.coverImage ? (
          <Image src={game.coverImage} alt={game.title} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(135deg,#1e1b4b,#0f172a,#0c1445)" }} />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom,rgba(5,5,15,0.2) 0%,rgba(5,5,15,0.85) 75%,var(--bg-primary) 100%)" }}
        />
        <div className="absolute bottom-10 left-6 right-6 max-w-7xl mx-auto">
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3"
            style={{
              background: game.status === "released" ? "rgba(16,185,129,0.2)" : "rgba(124,58,237,0.2)",
              border: `1px solid ${game.status === "released" ? "rgba(52,211,153,0.4)" : "rgba(196,181,253,0.4)"}`,
              color: game.status === "released" ? "#34d399" : "#c4b5fd",
            }}
          >
            {game.status === "released" ? "Released" : game.status === "coming-soon" ? "Coming Soon" : "In Development"}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-2 tracking-tight">{game.title}</h1>
          <p className="text-slate-300 text-lg max-w-xl">{game.shortDescription}</p>
        </div>
      </div>

      {/* ─── CONTENT ──────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* ── LEFT / MAIN ── */}
          <div className="lg:col-span-2 space-y-14">

            {/* Trailer */}
            {game.trailer && (
              <section>
                <SectionTitle color="#7c3aed" label="Trailer" />
                <div className="rounded-2xl overflow-hidden aspect-video">
                  <iframe
                    src={game.trailer}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${game.title} trailer`}
                  />
                </div>
              </section>
            )}

            {/* Screenshots */}
            {game.screenshots.length > 0 && (
              <section>
                <SectionTitle color="#06b6d4" label="Screenshots" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.screenshots.map((src, i) => (
                    <div key={i} className="relative aspect-video rounded-xl overflow-hidden hover-lift">
                      <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* About */}
            <section>
              <SectionTitle color="#e879f9" label="About the Game" />
              <div className="glass rounded-2xl p-6">
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{game.description}</p>
              </div>
            </section>

            {/* ── GAME NEWS ── */}
            <GameNewsSection gameSlug={game.slug} />

            {/* ── COMMUNITY VIDEOS & CONTENT ── */}
            {game.socialContent.length > 0 && (
              <section>
                <SectionTitle color="#22c55e" label="Community Content" />
                <p className="text-slate-500 text-sm mb-5 -mt-3">
                  Created something about this game? Send it to us and we will feature it here!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {game.socialContent.map((content, i) => {
                    const icon = platformIcons[content.platform] ?? platformIcons.Default
                    const bg = platformColors[content.platform] ?? platformColors.Default
                    return (
                      <a
                        key={i}
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative rounded-2xl overflow-hidden hover-lift block"
                        style={{ background: "var(--bg-card)", border: "1px solid rgba(124,58,237,0.2)" }}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-full aspect-video bg-slate-900">
                          {content.thumbnail ? (
                            <Image src={content.thumbnail} alt={content.creator} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-5xl" style={{ background: bg }}>
                              {icon}
                            </div>
                          )}
                          {/* Play overlay */}
                          {content.type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              style={{ background: "rgba(0,0,0,0.5)" }}>
                              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.9)" }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#111">
                                  <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                              </div>
                            </div>
                          )}
                          {/* Platform badge */}
                          <div className="absolute top-2 left-2">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
                              style={{ background: bg, border: "1px solid rgba(255,255,255,0.1)", color: "white" }}
                            >
                              {content.platform}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide font-semibold">{content.type}</p>
                          <p className="text-white font-semibold group-hover:text-purple-300 transition-colors line-clamp-1">
                            {content.creator}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </section>
            )}

            {/* ── REVIEWS ── */}
            {game.reviews.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <SectionTitle color="#facc15" label="Reviews" noMargin />
                  {avgRating !== null && (
                    <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl">
                      <span className="text-2xl font-black text-yellow-400">{avgRating.toFixed(1)}</span>
                      <div>
                        <StarRating rating={Math.round(avgRating)} />
                        <p className="text-xs text-slate-500 mt-0.5">{game.reviews.filter((r) => r.rating).length} reviews</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {game.reviews.map((review, i) => (
                    <div key={i} className="glass rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-bold text-white">{review.author}</p>
                          <p className="text-xs text-slate-500">{review.source}</p>
                        </div>
                        {review.rating && <StarRating rating={review.rating} />}
                      </div>
                      <p className="text-slate-300 leading-relaxed italic">"{review.text}"</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* ── RIGHT SIDEBAR ── */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 space-y-5 sticky top-24">
              <h3 className="font-bold text-white text-lg">Get the Game</h3>

              {game.steamUrl && (
                <a
                  href={game.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#1b2838,#2a475e)" }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.455 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273.012c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.252 0-2.265-1.014-2.265-2.265z" />
                  </svg>
                  {game.status === "released" ? "View on Steam" : "Add to Wishlist on Steam"}
                </a>
              )}

              {game.epicUrl && (
                <a
                  href={game.epicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02]"
                  style={{ background: "linear-gradient(135deg,#2d2d2d,#111)" }}
                >
                  Epic Games Store
                </a>
              )}

              <div>
                <p className="text-xs text-slate-500 uppercase tracking-widest mb-2">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
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

              <div className="space-y-2.5 text-sm pt-2" style={{ borderTop: "1px solid rgba(124,58,237,0.2)" }}>
                <InfoRow label="Genre" value={game.genre} />
                {game.releaseDate && <InfoRow label="Release" value={game.releaseDate} />}
                <InfoRow label="Developer" value="Shift Orbit" />
                {avgRating !== null && (
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Rating</span>
                    <StarRating rating={Math.round(avgRating)} />
                  </div>
                )}
              </div>
            </div>

            <Link
              href="/"
              className="block text-center py-3 rounded-xl text-sm text-slate-400 hover:text-white transition-colors"
              style={{ border: "1px solid rgba(124,58,237,0.2)" }}
            >
              ← All Games
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ color, label, noMargin }: { color: string; label: string; noMargin?: boolean }) {
  return (
    <h2 className={`text-xl font-bold text-white flex items-center gap-2 ${noMargin ? "" : "mb-4"}`}>
      <span className="w-1 h-6 rounded-full inline-block" style={{ background: color }} />
      {label}
    </h2>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-300">{value}</span>
    </div>
  )
}
