"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, type NewsPost } from "@/lib/news"
import { excerpt, formatDate, readingTime } from "@/lib/format"
import Reveal from "@/components/site/Reveal"

export default function News() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllPosts()
      .then((all) => setPosts(all.slice(0, 3)))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  // The homepage should not carry an empty shell — News has its own page.
  if (loading || posts.length === 0) return null

  return (
    <section className="section bg-surface" aria-labelledby="news-heading">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">From the studio</p>
              <h2 id="news-heading" className="h2 mt-4">
                Latest news
              </h2>
            </div>
            <Link href="/news" className="link-accent text-[0.9375rem]">
              All posts →
            </Link>
          </div>
        </Reveal>

        <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post, i) => {
            const hasCover =
              post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage)

            return (
              <li key={post.id}>
                <Reveal delay={i * 70}>
                  <Link
                    href={`/news/${post.id}`}
                    className="card card-hover group flex h-full flex-col overflow-hidden bg-paper"
                  >
                    {hasCover && (
                      <div className="relative aspect-[16/9] overflow-hidden bg-surface-2">
                        <Image
                          src={post.coverImage!}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.011em]">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-2">
                        {excerpt(post.content, 120)}
                      </p>
                      <p className="mt-auto pt-4 text-[0.75rem] text-ink-3">
                        {formatDate(post.createdAt, "short")} ·{" "}
                        {readingTime(post.content)} min read
                      </p>
                    </div>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
