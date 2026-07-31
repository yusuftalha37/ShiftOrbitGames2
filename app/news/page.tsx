"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, NewsPost } from "@/lib/news"

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-purple-400 text-sm font-semibold tracking-widest uppercase mb-3">Latest Updates</p>
          <h1 className="section-title text-white mb-4">News &amp; Blog</h1>
          <p className="text-slate-400 max-w-lg mx-auto">
            Development updates, announcements, and stories from the Shift Orbit team.
          </p>
        </div>

        {loading ? (
          <p className="text-center text-slate-500">Loading...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-slate-600">
            <p className="text-6xl mb-4">📰</p>
            <p className="text-xl">No news yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/news/${post.id}`}
                className="group block rounded-2xl overflow-hidden hover-lift gradient-border"
                style={{ background: "var(--bg-card)" }}
              >
                {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
                  <div className="relative h-48 bg-slate-900">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs text-slate-500 mb-2">
                    {post.createdAt?.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) ?? ""}
                    {" · "}{post.author}
                  </p>
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-slate-400 text-sm line-clamp-3">{post.content.replace(/<[^>]*>/g, " ")}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
