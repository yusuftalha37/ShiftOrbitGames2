"use client"
import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { getAllPosts, NewsPost } from "@/lib/news"
import { excerpt, formatDate, readingTime } from "@/lib/format"

function Meta({ post }: { post: NewsPost }) {
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-ink-3">
      <span>{formatDate(post.createdAt)}</span>
      <span aria-hidden="true">·</span>
      <span>{post.author}</span>
      <span aria-hidden="true">·</span>
      <span>{readingTime(post.content)} min read</span>
    </p>
  )
}

function FeaturedPost({ post }: { post: NewsPost }) {
  const hasCover = post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage)

  return (
    <article className="card card-hover overflow-hidden">
      <Link href={`/news/${post.id}`} className="group grid grid-cols-1 lg:grid-cols-2">
        {hasCover && (
          <div className="relative aspect-[16/10] overflow-hidden bg-surface-2 lg:aspect-auto lg:min-h-[20rem]">
            <Image
              src={post.coverImage!}
              alt=""
              fill
              sizes="(max-width: 1024px) 100vw, 560px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              priority
            />
          </div>
        )}

        <div className={`flex flex-col justify-center p-6 sm:p-8 ${hasCover ? "" : "lg:col-span-2"}`}>
          <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-accent">
            Latest
          </span>
          <h2 className="mt-3 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] transition-colors group-hover:text-accent">
            {post.title}
          </h2>
          <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
            {excerpt(post.content, 220)}
          </p>
          <div className="mt-5">
            <Meta post={post} />
          </div>
        </div>
      </Link>
    </article>
  )
}

function PostCard({ post }: { post: NewsPost }) {
  const hasCover = post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage)

  return (
    <Link
      href={`/news/${post.id}`}
      className="card card-hover group flex h-full flex-col overflow-hidden"
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
        <h2 className="text-[1.0625rem] font-semibold leading-snug tracking-[-0.011em]">
          {post.title}
        </h2>
        <p className="mt-2 line-clamp-3 text-[0.9375rem] leading-relaxed text-ink-2">
          {excerpt(post.content)}
        </p>
        <div className="mt-auto pt-4">
          <Meta post={post} />
        </div>
      </div>
    </Link>
  )
}

export default function NewsPage() {
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")

  useEffect(() => {
    getAllPosts()
      .then(setPosts)
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return posts
    return posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        stripSearchable(p.content).includes(q),
    )
  }, [posts, query])

  const [featured, ...rest] = visible

  return (
    <div className="section">
      <div className="container-page">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-6">
          <div className="max-w-[52ch]">
            <p className="eyebrow">Latest updates</p>
            <h1 className="h2 mt-4">News &amp; blog</h1>
            <p className="lead mt-5">
              Development updates, announcements, and stories from the Shift
              Orbit team.
            </p>
          </div>

          {posts.length > 3 && (
            <div className="w-full sm:w-64">
              <label htmlFor="news-search" className="sr-only">
                Search posts
              </label>
              <input
                id="news-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts"
                className="w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          )}
        </header>

        <div className="mt-12" aria-busy={loading}>
          {loading ? (
            <p className="text-[0.9375rem] text-ink-3">Loading…</p>
          ) : posts.length === 0 ? (
            <div className="card px-6 py-14 text-center">
              <p className="text-[1.0625rem] font-medium">No posts yet</p>
              <p className="mx-auto mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-2">
                Development updates will show up here as our games come
                together.
              </p>
              <Link href="/#games" className="btn btn-secondary mt-6">
                See our games
              </Link>
            </div>
          ) : visible.length === 0 ? (
            <p className="text-[0.9375rem] text-ink-3">
              No posts match “{query}”.
            </p>
          ) : (
            <div className="space-y-6">
              {featured && <FeaturedPost post={featured} />}
              {rest.length > 0 && (
                <ul className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((post) => (
                    <li key={post.id}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function stripSearchable(html: string) {
  return html.replace(/<[^>]*>/g, " ").toLowerCase()
}
