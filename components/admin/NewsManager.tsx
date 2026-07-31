"use client"
import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { getAllPosts, createPost, deletePost, NewsPost } from "@/lib/news"
import { getAllGames, Game } from "@/lib/games"
import RichTextEditor from "@/components/RichTextEditor"
import ImageUrlInput from "@/components/ImageUrlInput"

export default function NewsManager() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<NewsPost[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loadingPosts, setLoadingPosts] = useState(true)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImage, setCoverImage] = useState("")
  const [gameSlug, setGameSlug] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [editorKey, setEditorKey] = useState(0)

  function refreshPosts() {
    setLoadingPosts(true)
    getAllPosts().then(setPosts).finally(() => setLoadingPosts(false))
  }

  useEffect(() => {
    refreshPosts()
    getAllGames().then(setGames)
  }, [])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    const plainText = content.replace(/<[^>]*>/g, "").trim()
    if (!title.trim() || !plainText) return
    setSubmitting(true)
    try {
      await createPost({
        title: title.trim(),
        content,
        coverImage: coverImage || undefined,
        gameSlug: gameSlug || undefined,
        author: user?.email ?? "Shift Orbit",
      })
      setTitle("")
      setContent("")
      setCoverImage("")
      setGameSlug("")
      setEditorKey((k) => k + 1)
      refreshPosts()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return
    await deletePost(id)
    refreshPosts()
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }

  return (
    <div>
      <form onSubmit={handleCreate} className="glass rounded-2xl p-6 mb-12 space-y-4">
        <h2 className="text-lg font-bold text-white mb-2">New Post</h2>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClass}
          style={inputStyle}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <ImageUrlInput label="Cover Image (optional)" value={coverImage} onChange={setCoverImage} />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Linked Game</label>
            <select
              value={gameSlug}
              onChange={(e) => setGameSlug(e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              <option value="" style={{ background: "#0d0d1f" }}>No linked game (general news)</option>
              {games.map((g) => (
                <option key={g.slug} value={g.slug} style={{ background: "#0d0d1f" }}>
                  {g.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Content</label>
          <RichTextEditor key={editorKey} content={content} onChange={setContent} />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          {submitting ? "Publishing..." : "Publish Post"}
        </button>
      </form>

      <h2 className="text-lg font-bold text-white mb-4">Published Posts</h2>
      {loadingPosts ? (
        <p className="text-slate-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-slate-600">No posts yet.</p>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{post.title}</p>
                <p className="text-xs text-slate-500">
                  {post.createdAt?.toDate().toLocaleDateString() ?? ""}
                  {post.gameSlug && (
                    <span className="ml-2 px-2 py-0.5 rounded-full" style={{ background: "rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                      {games.find((g) => g.slug === post.gameSlug)?.title ?? post.gameSlug}
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={() => handleDelete(post.id)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-red-400 transition-colors hover:text-red-300 flex-shrink-0"
                style={{ border: "1px solid rgba(248,113,113,0.3)" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
