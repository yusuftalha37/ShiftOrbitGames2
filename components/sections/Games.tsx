"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllGames, type Game } from "@/lib/games"
import { useContent } from "@/lib/i18n-context"
import Reveal from "@/components/site/Reveal"

const DOT: Record<Game["status"], string> = {
  released: "bg-positive",
  "coming-soon": "bg-accent",
  "in-development": "bg-ink-3",
}

const FILTER_KEYS = ["all", "released", "coming-soon", "in-development"] as const

type FilterKey = (typeof FILTER_KEYS)[number]

function StatusBadge({ value }: { value: Game["status"] }) {
  const c = useContent()
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${DOT[value]}`} aria-hidden="true" />
      <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
        {c.games.filters[value]}
      </span>
    </span>
  )
}

/** The newest game gets a wide slot — it is what most visitors came for. */
function FeaturedGame({ game }: { game: Game }) {
  const c = useContent()
  return (
    <article className="card card-hover overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Link
          href={`/games/${game.slug}`}
          className="group relative aspect-[16/10] overflow-hidden bg-surface-2 lg:aspect-auto lg:min-h-[22rem]"
          tabIndex={-1}
          aria-hidden="true"
        >
          {game.coverImage ? (
            <Image
              src={game.coverImage}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-[0.8125rem] text-ink-3">
              {c.common.noCover}
            </span>
          )}
        </Link>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <StatusBadge value={game.status} />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-accent">
              {c.hero.latestRelease}
            </span>
          </div>

          <h3 className="mt-4 text-[1.625rem] font-semibold leading-tight tracking-[-0.022em]">
            <Link href={`/games/${game.slug}`} className="transition-colors hover:text-accent">
              {game.title}
            </Link>
          </h3>

          <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-relaxed text-ink-2">
            {game.shortDescription}
          </p>

          {game.tags.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2">
              {game.tags.slice(0, 4).map((tag) => (
                <li key={tag} className="chip">
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link href={`/games/${game.slug}`} className="btn btn-primary">
              {c.common.viewGame}
            </Link>
            {game.steamUrl && (
              <a
                href={game.steamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                {game.status === "released" ? "Steam" : c.hero.wishlist}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function GameCard({ game }: { game: Game }) {
  const c = useContent()
  return (
    <Link
      href={`/games/${game.slug}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface-2">
        {game.coverImage ? (
          <Image
            src={game.coverImage}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-[0.8125rem] text-ink-3">
            {c.common.noCover}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <StatusBadge value={game.status} />
        <h3 className="mt-3 text-[1.0625rem] font-semibold tracking-[-0.011em]">
          {game.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-2">
          {game.shortDescription}
        </p>

        {game.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2 pt-1">
            {game.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
        )}

        <span className="mt-auto pt-5 text-[0.8125rem] font-medium text-accent">
          {c.common.viewGame} →
        </span>
      </div>
    </Link>
  )
}

export default function Games() {
  const [items, setItems] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterKey>("all")
  const c = useContent()

  useEffect(() => {
    getAllGames()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  // Only offer a filter when something would actually be behind it.
  const filters = useMemo(
    () => FILTER_KEYS.filter((k) => k === "all" || items.some((g) => g.status === k)),
    [items],
  )

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((g) => g.status === filter)),
    [items, filter],
  )

  const [featured, ...rest] = visible

  return (
    <section id="games" className="section" aria-labelledby="games-heading">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">{c.games.eyebrow}</p>
              <h2 id="games-heading" className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                {c.games.heading}
              </h2>
              <p className="lead mt-5 max-w-[52ch]">{c.games.body}</p>
            </div>
            {!loading && items.length > 0 && (
              <p className="mono text-[0.8125rem] text-ink-3">
                {c.games.titleCount(items.length)}
              </p>
            )}
          </div>
        </Reveal>

        {!loading && filters.length > 2 && (
          <Reveal>
            <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={c.games.filterLabel}>
              {filters.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                    filter === key
                      ? "border-accent bg-accent text-[#17130a]"
                      : "border-line text-ink-2 hover:border-line-2 hover:text-ink"
                  }`}
                >
                  {c.games.filters[key]}
                </button>
              ))}
            </div>
          </Reveal>
        )}

        <div className="mt-10" aria-busy={loading}>
          {loading ? (
            <p className="text-[0.9375rem] text-ink-3">{c.common.loading}</p>
          ) : items.length === 0 ? (
            <div className="card px-6 py-14 text-center">
              <p className="text-[1.0625rem] font-medium">{c.games.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-2">
{c.games.emptyBody}
              </p>
              <Link href="/news" className="btn btn-secondary mt-6">
                {c.games.emptyCta}
              </Link>
            </div>
          ) : visible.length === 0 ? (
            <p className="text-[0.9375rem] text-ink-3">
              {c.games.emptyFilter}
            </p>
          ) : (
            <div className="space-y-6">
              {featured && (
                <Reveal>
                  <FeaturedGame game={featured} />
                </Reveal>
              )}

              {rest.length > 0 && (
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((game, i) => (
                    <li key={game.id}>
                      <Reveal delay={(i % 3) * 70}>
                        <GameCard game={game} />
                      </Reveal>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
