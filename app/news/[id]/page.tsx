"use client"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { getPost, getComments, addComment, NewsPost, Comment } from "@/lib/news"
import { getGameBySlug, Game } from "@/lib/games"
import { formatDate, readingTime } from "@/lib/format"

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [post, setPost] = useState<NewsPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [linkedGame, setLinkedGame] = useState<Game | null>(null)
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const loadComments = () => getComments(id).then(setComments)

  useEffect(() => {
    Promise.all([getPost(id), getComments(id)])
      .then(([p, c]) => {
        setPost(p)
        setComments(c)
        if (p?.gameSlug) {
          getGameBySlug(p.gameSlug).then(setLinkedGame)
        }
      })
      .finally(() => setLoading(false))
  }, [id])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    try {
      await addComment(id, { name: name.trim(), message: message.trim() })
      setName("")
      setMessage("")
      await loadComments()
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="section container-page text-[0.9375rem] text-ink-3">Loading…</div>
    )
  }

  if (!post) {
    return (
      <div className="section container-page">
        <p className="text-[0.9375rem] text-ink-2">Post not found.</p>
        <Link href="/news" className="link-accent mt-4 inline-block">
          ← Back to news
        </Link>
      </div>
    )
  }

  return (
    <div className="section">
      <article className="container-page max-w-[46rem]">
        <Link
          href="/news"
          className="mb-8 inline-block text-[0.875rem] text-ink-3 transition-colors hover:text-ink"
        >
          ← Back to news
        </Link>

        {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
          <div className="relative mb-8 aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface-2">
            <Image src={post.coverImage} alt="" fill sizes="736px" className="object-cover" />
          </div>
        )}

        <p className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.75rem] text-ink-3">
          <span>{formatDate(post.createdAt)}</span>
          <span aria-hidden="true">·</span>
          <span>{post.author}</span>
          <span aria-hidden="true">·</span>
          <span>{readingTime(post.content)} min read</span>
        </p>
        <h1 className="h2 mb-4">{post.title}</h1>
        {post.gameSlug && (
          <Link
            href={`/games/${post.gameSlug}`}
            className="chip mb-8 transition-colors hover:border-line-2 hover:text-ink"
          >
            {linkedGame?.title ?? post.gameSlug}
          </Link>
        )}
        <div
          className="prose-content mb-16 text-ink-2"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments */}
        <section>
          <h2 className="mb-6 border-t border-line pt-8 text-[1.0625rem] font-semibold tracking-[-0.011em]">
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleSubmit} className="card mb-8 space-y-4 p-6">
            <div>
              <label htmlFor="comment-name" className="block text-[0.8125rem] font-medium text-ink">
                Name
              </label>
              <input
                id="comment-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                className="mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div>
              <label htmlFor="comment-message" className="block text-[0.8125rem] font-medium text-ink">
                Comment
              </label>
              <textarea
                id="comment-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={1000}
                className="mt-2 w-full resize-y rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn btn-primary">
              {submitting ? "Posting…" : "Post comment"}
            </button>
          </form>

          <div className="space-y-4">
            {comments.length === 0 && (
              <p className="text-[0.9375rem] text-ink-3">
                No comments yet. Be the first to reply.
              </p>
            )}
            {comments.map((c) => (
              <div key={c.id} className="card p-5">
                <div className="mb-2 flex items-center justify-between gap-4">
                  <span className="text-[0.875rem] font-semibold">{c.name}</span>
                  <span className="text-[0.75rem] text-ink-3">
                    {formatDate(c.createdAt, "short")}
                  </span>
                </div>
                <p className="text-[0.9375rem] leading-relaxed text-ink-2">{c.message}</p>
              </div>
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
