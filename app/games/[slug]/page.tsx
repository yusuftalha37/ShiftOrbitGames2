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
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={i < Math.round(rating) ? "text-ink" : "text-line-2"}
          aria-hidden="true"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="ml-1.5 text-[0.75rem] tabular-nums text-ink-3">
        {rating}/{max}
      </span>
    </div>
  )
}

const statusLabels: Record<Game["status"], { label: string; dot: string }> = {
  released: { label: "Released", dot: "bg-positive" },
  "coming-soon": { label: "Coming soon", dot: "bg-accent" },
  "in-development": { label: "In development", dot: "bg-ink-3" },
}

export default function GamePage({ params }: Props) {
  const { slug } = use(params)
  const [game, setGame] = useState<Game | null | undefined>(undefined)

  useEffect(() => {
    getGameBySlug(slug)
      .then(setGame)
      .catch(() => setGame(null))
  }, [slug])

  if (game === undefined) {
    return (
      <div className="section container-page text-[0.9375rem] text-ink-3">Loading…</div>
    )
  }

  if (game === null) {
    return (
      <div className="section container-page">
        <p className="text-[0.9375rem] text-ink-2">Game not found.</p>
        <Link href="/#games" className="link-accent mt-4 inline-block">
          ← Back to games
        </Link>
      </div>
    )
  }

  const rated = game.reviews.filter((r) => r.rating)
  const avgRating =
    rated.length > 0
      ? rated.reduce((sum, r) => sum + (r.rating ?? 0), 0) / rated.length
      : null

  return (
    <div className="pb-20 pt-10">
      <div className="container-page">
        <Link
          href="/#games"
          className="mb-8 inline-block text-[0.875rem] text-ink-3 transition-colors hover:text-ink"
        >
          ← Back to games
        </Link>

        {/* ─── HEADER ──────────────────────────────────────────── */}
        <header>
          {game.coverImage && (
            <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-xl border border-line bg-surface-2">
              <Image
                src={game.coverImage}
                alt=""
                fill
                sizes="(max-width: 1140px) 100vw, 1092px"
                className="object-cover"
                priority
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${statusLabels[game.status].dot}`}
              aria-hidden="true"
            />
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
              {statusLabels[game.status].label}
            </span>
          </div>

          <h1 className="h1 mt-3 max-w-[18ch]">{game.title}</h1>
          <p className="lead mt-4 max-w-[56ch]">{game.shortDescription}</p>
        </header>

        {/* ─── CONTENT ─────────────────────────────────────────── */}
        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-16">
          <div className="space-y-14 lg:col-span-2">
            {game.trailer && (
              <section aria-labelledby="trailer-heading">
                <SectionTitle id="trailer-heading">Trailer</SectionTitle>
                <div className="aspect-video overflow-hidden rounded-xl border border-line bg-surface-2">
                  <iframe
                    src={game.trailer}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${game.title} trailer`}
                  />
                </div>
              </section>
            )}

            {game.screenshots.length > 0 && (
              <section aria-labelledby="screenshots-heading">
                <SectionTitle id="screenshots-heading">Screenshots</SectionTitle>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {game.screenshots.map((src, i) => (
                    <li
                      key={i}
                      className="relative aspect-video overflow-hidden rounded-lg border border-line bg-surface-2"
                    >
                      <Image
                        src={src}
                        alt={`${game.title} screenshot ${i + 1}`}
                        fill
                        sizes="(max-width: 640px) 100vw, 360px"
                        className="object-cover"
                      />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section aria-labelledby="about-heading">
              <SectionTitle id="about-heading">About the game</SectionTitle>
              <p className="max-w-[68ch] whitespace-pre-line text-[1rem] leading-relaxed text-ink-2">
                {game.description}
              </p>
            </section>

            <GameNewsSection gameSlug={game.slug} />

            {game.socialContent.length > 0 && (
              <section aria-labelledby="community-heading">
                <SectionTitle id="community-heading">Community content</SectionTitle>
                <p className="-mt-2 mb-5 text-[0.875rem] text-ink-3">
                  Made something about this game? Send it to us and we will feature it
                  here.
                </p>
                <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {game.socialContent.map((content, i) => (
                    <li key={i}>
                      <a
                        href={content.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card card-hover group block h-full overflow-hidden"
                      >
                        <div className="relative aspect-video bg-surface-2">
                          {content.thumbnail ? (
                            <Image
                              src={content.thumbnail}
                              alt=""
                              fill
                              sizes="(max-width: 640px) 100vw, 360px"
                              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                            />
                          ) : (
                            <span className="absolute inset-0 flex items-center justify-center text-[0.8125rem] text-ink-3">
                              {content.platform}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                            {content.platform} · {content.type}
                          </p>
                          <p className="mt-1.5 line-clamp-1 text-[0.9375rem] font-medium">
                            {content.creator}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {game.reviews.length > 0 && (
              <section aria-labelledby="reviews-heading">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3">
                  <h2
                    id="reviews-heading"
                    className="text-[1.0625rem] font-semibold tracking-[-0.011em]"
                  >
                    Reviews
                  </h2>
                  {avgRating !== null && (
                    <div className="flex items-center gap-3">
                      <span className="text-[1.25rem] font-semibold tabular-nums">
                        {avgRating.toFixed(1)}
                      </span>
                      <StarRating rating={Math.round(avgRating)} />
                      <span className="text-[0.75rem] text-ink-3">
                        {rated.length} {rated.length === 1 ? "review" : "reviews"}
                      </span>
                    </div>
                  )}
                </div>
                <ul className="space-y-4">
                  {game.reviews.map((review, i) => (
                    <li key={i} className="card p-6">
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[0.9375rem] font-semibold">{review.author}</p>
                          <p className="text-[0.75rem] text-ink-3">{review.source}</p>
                        </div>
                        {review.rating && <StarRating rating={review.rating} />}
                      </div>
                      <blockquote className="text-[0.9375rem] leading-relaxed text-ink-2">
                        {review.text}
                      </blockquote>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* ─── SIDEBAR ───────────────────────────────────────── */}
          <div>
            <div className="card sticky top-24 p-6">
              <h2 className="h3">Get the game</h2>

              <div className="mt-4 space-y-3">
                {game.steamUrl && (
                  <a
                    href={game.steamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary w-full"
                  >
                    {game.status === "released" ? "View on Steam" : "Wishlist on Steam"}
                  </a>
                )}
                {game.epicUrl && (
                  <a
                    href={game.epicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary w-full"
                  >
                    Epic Games Store
                  </a>
                )}
              </div>

              {game.tags.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                    Tags
                  </h3>
                  <ul className="mt-2.5 flex flex-wrap gap-2">
                    {game.tags.map((tag) => (
                      <li key={tag} className="chip">
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <dl className="mt-6 space-y-2.5 border-t border-line pt-5 text-[0.875rem]">
                <InfoRow label="Genre" value={game.genre} />
                {game.releaseDate && <InfoRow label="Release" value={game.releaseDate} />}
                <InfoRow label="Developer" value="Shift Orbit" />
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionTitle({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="mb-4 border-b border-line pb-3 text-[1.0625rem] font-semibold tracking-[-0.011em]"
    >
      {children}
    </h2>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-3">{label}</dt>
      <dd className="text-right text-ink-2">{value}</dd>
    </div>
  )
}
