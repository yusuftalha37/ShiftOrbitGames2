"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllGames, type Game } from "@/lib/games"
import { games as copy } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

const status: Record<Game["status"], { label: string; dot: string }> = {
  released: { label: "Released", dot: "bg-positive" },
  "coming-soon": { label: "Coming soon", dot: "bg-accent" },
  "in-development": { label: "In development", dot: "bg-ink-3" },
}

export default function Games() {
  const [items, setItems] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllGames()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section id="games" className="section" aria-labelledby="games-heading">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="games-heading" className="h2 mt-4">
            {copy.heading}
          </h2>
          <p className="lead mt-5 max-w-[52ch]">{copy.body}</p>
        </Reveal>

        <div className="mt-12" aria-busy={loading}>
          {loading ? (
            <p className="text-[0.9375rem] text-ink-3">Loading…</p>
          ) : items.length === 0 ? (
            <p className="border-t border-line pt-8 text-[0.9375rem] text-ink-3">
              {copy.empty}
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((game, i) => (
                <li key={game.id}>
                  <Reveal delay={(i % 3) * 70}>
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
                            No cover image
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${status[game.status].dot}`}
                            aria-hidden="true"
                          />
                          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                            {status[game.status].label}
                          </span>
                        </div>

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
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
