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
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="section">
      <div className="container-page">
        <header className="max-w-[52ch]">
          <p className="eyebrow">Latest updates</p>
          <h1 className="h2 mt-4">News &amp; blog</h1>
          <p className="lead mt-5">
            Development updates, announcements, and stories from the Shift Orbit
            team.
          </p>
        </header>

        <div className="mt-12" aria-busy={loading}>
          {loading ? (
            <p className="text-[0.9375rem] text-ink-3">Loading…</p>
          ) : posts.length === 0 ? (
            <p className="border-t border-line pt-8 text-[0.9375rem] text-ink-3">
              No news yet. Check back soon.
            </p>
          ) : (
            <ul className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link
                    href={`/news/${post.id}`}
                    className="card card-hover group flex h-full flex-col overflow-hidden"
                  >
                    {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                        <Image
                          src={post.coverImage}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 540px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-[0.75rem] text-ink-3">
                        {post.createdAt?.toDate().toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }) ?? ""}
                        {" · "}
                        {post.author}
                      </p>
                      <h2 className="mt-2 text-[1.0625rem] font-semibold tracking-[-0.011em]">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-2">
                        {post.content.replace(/<[^>]*>/g, " ")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
