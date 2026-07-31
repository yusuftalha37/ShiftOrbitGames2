"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getPostsByGame, NewsPost } from "@/lib/news"

export default function GameNewsSection({ gameSlug }: { gameSlug: string }) {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPostsByGame(gameSlug)
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [gameSlug])

  if (loading || posts.length === 0) return null

  return (
    <section aria-labelledby="game-news-heading">
      <h2
        id="game-news-heading"
        className="mb-4 border-b border-line pb-3 text-[1.0625rem] font-semibold tracking-[-0.011em]"
      >
        Game news
      </h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              href={`/news/${post.id}`}
              className="card card-hover group block h-full overflow-hidden"
            >
              {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
                <div className="relative aspect-[16/9] bg-surface-2">
                  <Image
                    src={post.coverImage}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 100vw, 360px"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
              )}
              <div className="p-4">
                <p className="text-[0.75rem] text-ink-3">
                  {post.createdAt?.toDate().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  }) ?? ""}
                </p>
                <p className="mt-1.5 line-clamp-1 text-[0.9375rem] font-medium">
                  {post.title}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
