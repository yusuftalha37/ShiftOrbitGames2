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
      .finally(() => setLoading(false))
  }, [gameSlug])

  if (loading || posts.length === 0) return null

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-indigo-500 inline-block" />
        Game News
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.id}`}
            className="group block rounded-xl overflow-hidden hover-lift"
            style={{ background: "var(--bg-card)", border: "1px solid rgba(124,58,237,0.2)" }}
          >
            {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
              <div className="relative h-32 bg-slate-900">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            )}
            <div className="p-4">
              <p className="text-xs text-slate-500 mb-1">
                {post.createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) ?? ""}
              </p>
              <p className="font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                {post.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
