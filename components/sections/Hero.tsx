"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { hero } from "@/lib/site-content"
import { getAllGames, type Game } from "@/lib/games"
import { useSocialLinks } from "@/lib/settings-context"

const AUTOPLAY_MS = 7000

const STATUS_LINE: Record<Game["status"], string> = {
  released: "Out now on Steam",
  "coming-soon": "Coming soon",
  "in-development": "In development",
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={dir === "prev" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Slides of game key art — the studio's own titles are the hero. */
export default function Hero() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const links = useSocialLinks()
  const touchStart = useRef<number | null>(null)

  useEffect(() => {
    getAllGames()
      .then((all) => setGames(all.filter((g) => g.coverImage)))
      .catch(() => setGames([]))
      .finally(() => setLoading(false))
  }, [])

  const count = games.length
  const go = useCallback(
    (next: number) => setIndex(count === 0 ? 0 : (next + count) % count),
    [count],
  )

  useEffect(() => {
    if (count < 2 || paused) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [count, paused])

  // Respect people who navigate the carousel by keyboard.
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") go(index - 1)
    if (e.key === "ArrowRight") go(index + 1)
  }

  // No key art to show — keep a proper studio hero rather than a blank stage.
  if (!loading && count === 0) {
    return (
      <section
        className="relative -mt-[4.5rem] flex min-h-[88vh] items-center justify-center overflow-hidden px-6 pt-[4.5rem]"
        aria-labelledby="hero-heading"
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(ellipse 70% 55% at 50% 35%, rgba(255,164,36,0.16), transparent 70%)",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-3xl text-center">
          <div className="relative mx-auto mb-8 h-28 w-28">
            <Image src="/logo.png" alt="" fill sizes="112px" className="object-contain" priority />
          </div>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1
            id="hero-heading"
            className="display mt-5 text-[clamp(2.25rem,6.5vw,4.5rem)] text-balance"
          >
            {hero.heading}
          </h1>
          <p className="lead mx-auto mt-6 max-w-[46ch]">{hero.body}</p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label}
            </a>
            {links.steam && (
              <a
                href={links.steam}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Visit us on Steam
              </a>
            )}
          </div>
        </div>
      </section>
    )
  }

  const current = games[index]

  return (
    <section
      className="relative -mt-[4.5rem] min-h-[88vh] overflow-hidden bg-surface"
      aria-roledescription="carousel"
      aria-label="Our games"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStart.current === null) return
        const delta = e.changedTouches[0].clientX - touchStart.current
        if (Math.abs(delta) > 60) go(index + (delta < 0 ? 1 : -1))
        touchStart.current = null
      }}
      tabIndex={-1}
    >
      {games.map((game, i) => (
        <div
          key={game.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== index}
        >
          <Image
            src={game.coverImage!}
            alt=""
            fill
            sizes="100vw"
            priority={i === 0}
            className="object-cover"
          />
          {/* Key art needs a scrim or the title becomes unreadable. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(10,10,12,0.55) 0%, rgba(10,10,12,0.08) 28%, rgba(10,10,12,0.55) 68%, rgba(10,10,12,0.92) 92%, var(--color-paper) 100%)",
            }}
          />
        </div>
      ))}

      <div className="relative z-10 flex min-h-[88vh] flex-col items-center justify-end px-6 pb-24 pt-[7rem] text-center">
        {current && (
          <div key={current.id} className="reveal" data-visible="true">
            <h1 className="display mx-auto max-w-[16ch] text-[clamp(2.25rem,7vw,5rem)]">
              <span className="text-accent">/</span> {current.title}{" "}
              <span className="text-accent">/</span>
            </h1>

            <p className="mt-4 text-[clamp(1rem,2vw,1.375rem)] font-semibold text-accent">
              {STATUS_LINE[current.status]}
            </p>

            {current.shortDescription && (
              <p className="mx-auto mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-ink-2">
                {current.shortDescription}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {current.steamUrl ? (
                <a
                  href={current.steamUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  {current.status === "released" ? "Buy now" : "Wishlist"} →
                </a>
              ) : (
                <Link href={`/games/${current.slug}`} className="btn btn-primary">
                  View game →
                </Link>
              )}
              <Link href={`/games/${current.slug}`} className="btn btn-secondary">
                Learn more
              </Link>
            </div>
          </div>
        )}

        {count > 1 && (
          <div className="mt-12 flex items-center gap-3" role="tablist" aria-label="Slides">
            {games.map((game, i) => (
              <button
                key={game.id}
                role="tab"
                aria-selected={i === index}
                aria-label={game.title}
                onClick={() => go(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-accent" : "w-4 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous game"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:left-5"
          >
            <Arrow dir="prev" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next game"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full p-3 text-white/70 transition-colors hover:bg-white/10 hover:text-white sm:right-5"
          >
            <Arrow dir="next" />
          </button>
        </>
      )}
    </section>
  )
}
