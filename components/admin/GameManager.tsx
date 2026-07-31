"use client"
import { useEffect, useState } from "react"
import {
  getAllGames,
  createGame,
  updateGame,
  deleteGame,
  Game,
  GameInput,
  Review,
  SocialContent,
} from "@/lib/games"
import ImageUrlInput from "@/components/ImageUrlInput"
import MultiImageUrlInput from "@/components/MultiImageUrlInput"

const emptyForm: GameInput = {
  title: "",
  shortDescription: "",
  description: "",
  coverImage: "",
  screenshots: [],
  trailer: "",
  steamUrl: "",
  epicUrl: "",
  tags: [],
  genre: "",
  releaseDate: "",
  status: "in-development",
  reviews: [],
  socialContent: [],
}

export default function GameManager() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<GameInput>(emptyForm)
  const [tagsText, setTagsText] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)

  function refresh() {
    setLoading(true)
    getAllGames().then(setGames).finally(() => setLoading(false))
  }

  useEffect(refresh, [])

  function startCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setTagsText("")
    setShowForm(true)
  }

  function startEdit(game: Game) {
    setEditingId(game.id)
    setForm({
      title: game.title,
      shortDescription: game.shortDescription,
      description: game.description,
      coverImage: game.coverImage ?? "",
      screenshots: game.screenshots ?? [],
      trailer: game.trailer ?? "",
      steamUrl: game.steamUrl ?? "",
      epicUrl: game.epicUrl ?? "",
      tags: game.tags ?? [],
      genre: game.genre,
      releaseDate: game.releaseDate ?? "",
      status: game.status,
      reviews: game.reviews ?? [],
      socialContent: game.socialContent ?? [],
    })
    setTagsText((game.tags ?? []).join(", "))
    setShowForm(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim()) return
    setSubmitting(true)
    try {
      const payload: GameInput = {
        ...form,
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      }
      if (editingId) {
        await updateGame(editingId, payload)
      } else {
        await createGame(payload)
      }
      setShowForm(false)
      refresh()
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this game? This cannot be undone.")) return
    await deleteGame(id)
    refresh()
  }

  function addReview() {
    setForm((f) => ({ ...f, reviews: [...f.reviews, { author: "", text: "", source: "", rating: 5 }] }))
  }
  function updateReview(i: number, patch: Partial<Review>) {
    setForm((f) => ({ ...f, reviews: f.reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) }))
  }
  function removeReview(i: number) {
    setForm((f) => ({ ...f, reviews: f.reviews.filter((_, idx) => idx !== i) }))
  }

  function addSocial() {
    setForm((f) => ({
      ...f,
      socialContent: [...f.socialContent, { platform: "YouTube", creator: "", url: "", thumbnail: "", type: "video" }],
    }))
  }
  function updateSocial(i: number, patch: Partial<SocialContent>) {
    setForm((f) => ({ ...f, socialContent: f.socialContent.map((s, idx) => (idx === i ? { ...s, ...patch } : s)) }))
  }
  function removeSocial(i: number) {
    setForm((f) => ({ ...f, socialContent: f.socialContent.filter((_, idx) => idx !== i) }))
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">Games</h2>
        <button
          onClick={() => (showForm ? setShowForm(false) : startCreate())}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          {showForm ? "Cancel" : "+ New Game"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 mb-10 space-y-5">
          <h3 className="font-bold text-white">{editingId ? "Edit Game" : "New Game"}</h3>

          <input
            type="text"
            placeholder="Game title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />

          <input
            type="text"
            placeholder="Short description (shown on cards)"
            value={form.shortDescription}
            onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            className={inputClass}
            style={inputStyle}
          />

          <textarea
            rows={5}
            placeholder="Full description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className={`${inputClass} resize-none`}
            style={inputStyle}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ImageUrlInput
              label="Cover Image"
              value={form.coverImage ?? ""}
              onChange={(url) => setForm({ ...form, coverImage: url })}
            />
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Genre"
                value={form.genre}
                onChange={(e) => setForm({ ...form, genre: e.target.value })}
                className={inputClass}
                style={inputStyle}
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Game["status"] })}
                className={inputClass}
                style={inputStyle}
              >
                <option value="in-development" style={{ background: "#0d0d1f" }}>In Development</option>
                <option value="coming-soon" style={{ background: "#0d0d1f" }}>Coming Soon</option>
                <option value="released" style={{ background: "#0d0d1f" }}>Released</option>
              </select>
            </div>
          </div>

          <MultiImageUrlInput
            label="Screenshots"
            values={form.screenshots}
            onChange={(urls) => setForm({ ...form, screenshots: urls })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Trailer embed URL (YouTube embed link)"
              value={form.trailer}
              onChange={(e) => setForm({ ...form, trailer: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Release date (e.g. 2025 or Q4 2025)"
              value={form.releaseDate}
              onChange={(e) => setForm({ ...form, releaseDate: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Steam URL"
              value={form.steamUrl}
              onChange={(e) => setForm({ ...form, steamUrl: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Epic Games URL"
              value={form.epicUrl}
              onChange={(e) => setForm({ ...form, epicUrl: e.target.value })}
              className={inputClass}
              style={inputStyle}
            />
          </div>

          <input
            type="text"
            placeholder="Tags (comma separated, e.g. Action, Indie, Co-op)"
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            className={inputClass}
            style={inputStyle}
          />

          {/* Reviews */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Reviews</label>
              <button type="button" onClick={addReview} className="text-xs text-purple-400 hover:text-purple-300">+ Add review</button>
            </div>
            <div className="space-y-3">
              {form.reviews.map((r, i) => (
                <div key={i} className="p-3 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Author" value={r.author} onChange={(e) => updateReview(i, { author: e.target.value })} className={inputClass} style={inputStyle} />
                    <input placeholder="Source (e.g. Steam)" value={r.source} onChange={(e) => updateReview(i, { source: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                  <textarea placeholder="Review text" value={r.text} onChange={(e) => updateReview(i, { text: e.target.value })} rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
                  <div className="flex items-center gap-3">
                    <label className="text-xs text-slate-500">Rating</label>
                    <input type="number" min={1} max={5} value={r.rating ?? 5} onChange={(e) => updateReview(i, { rating: Number(e.target.value) })} className="w-16 px-2 py-1 rounded-lg text-white text-sm" style={inputStyle} />
                    <button type="button" onClick={() => removeReview(i)} className="ml-auto text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">Community Content (videos, streams)</label>
              <button type="button" onClick={addSocial} className="text-xs text-purple-400 hover:text-purple-300">+ Add content</button>
            </div>
            <div className="space-y-3">
              {form.socialContent.map((s, i) => (
                <div key={i} className="p-3 rounded-xl space-y-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Platform (YouTube, Twitch...)" value={s.platform} onChange={(e) => updateSocial(i, { platform: e.target.value })} className={inputClass} style={inputStyle} />
                    <input placeholder="Creator name" value={s.creator} onChange={(e) => updateSocial(i, { creator: e.target.value })} className={inputClass} style={inputStyle} />
                  </div>
                  <input placeholder="Content URL" value={s.url} onChange={(e) => updateSocial(i, { url: e.target.value })} className={inputClass} style={inputStyle} />
                  <div className="flex items-center gap-3">
                    <select value={s.type} onChange={(e) => updateSocial(i, { type: e.target.value as SocialContent["type"] })} className="px-3 py-2 rounded-lg text-sm text-white" style={inputStyle}>
                      <option value="video" style={{ background: "#0d0d1f" }}>Video</option>
                      <option value="post" style={{ background: "#0d0d1f" }}>Post</option>
                      <option value="article" style={{ background: "#0d0d1f" }}>Article</option>
                    </select>
                    <button type="button" onClick={() => removeSocial(i)} className="ml-auto text-xs text-red-400 hover:text-red-300">Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
          >
            {submitting ? "Saving..." : editingId ? "Save Changes" : "Create Game"}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-slate-500">Loading...</p>
      ) : games.length === 0 ? (
        <p className="text-slate-600">No games yet. Create your first one above.</p>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <div key={game.id} className="glass rounded-xl p-5 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{game.title}</p>
                <p className="text-xs text-slate-500">/{game.slug} · {game.status}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => startEdit(game)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-purple-300 transition-colors hover:text-purple-200"
                  style={{ border: "1px solid rgba(124,58,237,0.3)" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(game.id)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-red-400 transition-colors hover:text-red-300"
                  style={{ border: "1px solid rgba(248,113,113,0.3)" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
