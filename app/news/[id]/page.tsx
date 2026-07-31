"use client"
import { useEffect, useState, use } from "react"
import Image from "next/image"
import Link from "next/link"
import { getPost, getComments, addComment, NewsPost, Comment } from "@/lib/news"
import { getGameBySlug, Game } from "@/lib/games"

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
    return <div className="min-h-screen pt-32 text-center text-slate-500">Loading...</div>
  }

  if (!post) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-slate-400 mb-6">Post not found.</p>
        <Link href="/news" className="text-purple-400 hover:text-purple-300">← Back to News</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link href="/news" className="text-sm text-slate-500 hover:text-purple-400 transition-colors mb-8 inline-block">
          ← Back to News
        </Link>

        {post.coverImage && /^(\/|https?:\/\/)/.test(post.coverImage) && (
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-8">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
          </div>
        )}

        <p className="text-xs text-slate-500 mb-3">
          {post.createdAt?.toDate().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) ?? ""}
          {" · "}{post.author}
        </p>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4">{post.title}</h1>
        {post.gameSlug && (
          <Link
            href={`/games/${post.gameSlug}`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8 transition-all hover:scale-105"
            style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#c4b5fd" }}
          >
            🎮 {linkedGame?.title ?? post.gameSlug}
          </Link>
        )}
        <div
          className="prose-content text-slate-300 mb-16"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Comments */}
        <section>
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-1 h-6 rounded-full bg-cyan-500 inline-block" />
            Comments ({comments.length})
          </h2>

          <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-8 space-y-4">
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={40}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
            />
            <textarea
              rows={3}
              placeholder="Share your thoughts..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
            />
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              {submitting ? "Posting..." : "Post Comment"}
            </button>
          </form>

          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white text-sm">{c.name}</span>
                  <span className="text-xs text-slate-600">
                    {c.createdAt?.toDate().toLocaleDateString("en-US", { month: "short", day: "numeric" }) ?? ""}
                  </span>
                </div>
                <p className="text-slate-300 text-sm">{c.message}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
