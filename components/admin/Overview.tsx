"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllGames, type Game } from "@/lib/games"
import { getAllPosts, type NewsPost } from "@/lib/news"
import { formatDate } from "@/lib/format"

interface Stat {
  label: string
  value: string
  hint?: string
}

export default function Overview({
  onNavigate,
}: {
  onNavigate: (tab: "games" | "news") => void
}) {
  const [games, setGames] = useState<Game[]>([])
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    Promise.all([getAllGames(), getAllPosts()])
      .then(([g, p]) => {
        setGames(g)
        setPosts(p)
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-[0.9375rem] text-ink-3">Loading…</p>
  }

  if (failed) {
    return (
      <p className="card p-6 text-[0.9375rem] text-ink-2">
        Could not load content from Firebase. Check the project configuration
        and your connection, then reload.
      </p>
    )
  }

  const released = games.filter((g) => g.status === "released").length
  const unreleased = games.length - released
  const latestPost = posts[0]

  const stats: Stat[] = [
    {
      label: "Games",
      value: String(games.length),
      hint: `${released} released · ${unreleased} in progress`,
    },
    {
      label: "News posts",
      value: String(posts.length),
      hint: latestPost ? `Last: ${formatDate(latestPost.createdAt, "short")}` : "None yet",
    },
    {
      label: "Missing cover art",
      value: String(games.filter((g) => !g.coverImage).length),
      hint: "Games without a cover image",
    },
  ]

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
              {stat.label}
            </dt>
            <dd className="mt-2 text-[1.75rem] font-semibold tabular-nums tracking-[-0.02em]">
              {stat.value}
            </dd>
            {stat.hint && (
              <p className="mt-1 text-[0.75rem] text-ink-3">{stat.hint}</p>
            )}
          </div>
        ))}
      </dl>

      <section aria-labelledby="quick-actions">
        <h2
          id="quick-actions"
          className="border-b border-line pb-3 text-[1.0625rem] font-semibold tracking-[-0.011em]"
        >
          Quick actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => onNavigate("games")} className="btn btn-primary btn-sm">
            Add a game
          </button>
          <button onClick={() => onNavigate("news")} className="btn btn-secondary btn-sm">
            Write a post
          </button>
          <Link href="/" target="_blank" className="btn btn-secondary btn-sm">
            View live site
          </Link>
        </div>
      </section>

      <section aria-labelledby="recent-games">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
          <h2 id="recent-games" className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
            Games
          </h2>
          <button
            onClick={() => onNavigate("games")}
            className="text-[0.8125rem] font-medium text-accent hover:text-accent-2"
          >
            Manage →
          </button>
        </div>
        {games.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] text-ink-3">No games yet.</p>
        ) : (
          <ul className="mt-2">
            {games.slice(0, 5).map((game) => (
              <li
                key={game.id}
                className="flex items-center justify-between gap-4 border-b border-line py-3"
              >
                <Link
                  href={`/games/${game.slug}`}
                  target="_blank"
                  className="truncate text-[0.9375rem] font-medium hover:text-accent"
                >
                  {game.title}
                </Link>
                <span className="shrink-0 text-[0.75rem] text-ink-3">
                  {game.status.replace("-", " ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recent-posts">
        <div className="flex items-center justify-between gap-4 border-b border-line pb-3">
          <h2 id="recent-posts" className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
            Recent posts
          </h2>
          <button
            onClick={() => onNavigate("news")}
            className="text-[0.8125rem] font-medium text-accent hover:text-accent-2"
          >
            Manage →
          </button>
        </div>
        {posts.length === 0 ? (
          <p className="mt-4 text-[0.9375rem] text-ink-3">No posts yet.</p>
        ) : (
          <ul className="mt-2">
            {posts.slice(0, 5).map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-4 border-b border-line py-3"
              >
                <Link
                  href={`/news/${post.id}`}
                  target="_blank"
                  className="truncate text-[0.9375rem] font-medium hover:text-accent"
                >
                  {post.title}
                </Link>
                <span className="shrink-0 text-[0.75rem] text-ink-3">
                  {formatDate(post.createdAt, "short")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
