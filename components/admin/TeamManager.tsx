"use client"

import { useEffect, useState } from "react"
import {
  CATEGORIES,
  categoryLabel,
  createMember,
  deleteMember,
  getAllMembers,
  updateMember,
  type CategoryKey,
  type TeamMember,
} from "@/lib/team"
import ImageUrlInput from "@/components/ImageUrlInput"
import { isSafeUrl } from "@/lib/sanitize"

const inputClass =
  "w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
const labelClass = "block text-[0.8125rem] font-medium text-ink mb-2"

const EMPTY = {
  name: "",
  role: "",
  category: "development" as CategoryKey,
  bio: "",
  photo: "",
  linkedin: "",
  customLink: "",
  customLinkLabel: "",
}

export default function TeamManager() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  function refresh() {
    return getAllMembers()
      .then(setMembers)
      .catch(() => setError("Could not load team members."))
      .finally(() => setLoading(false))
  }

  // Only the initial load runs from an effect; later reloads come from the
  // save and delete handlers.
  useEffect(() => {
    getAllMembers()
      .then(setMembers)
      .catch(() => setError("Could not load team members."))
      .finally(() => setLoading(false))
  }, [])

  function reset() {
    setForm(EMPTY)
    setEditingId(null)
    setError("")
  }

  function startEdit(member: TeamMember) {
    setEditingId(member.id)
    setForm({
      name: member.name,
      role: member.role,
      category: member.category ?? "other",
      bio: member.bio ?? "",
      photo: member.photo ?? "",
      linkedin: member.linkedin ?? "",
      customLink: member.customLink ?? "",
      customLinkLabel: member.customLinkLabel ?? "",
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.role.trim()) return

    // Links go straight into href on the public site; only web addresses.
    const badLink = [form.linkedin, form.customLink].find(
      (v) => v.trim() && !isSafeUrl(v),
    )
    if (badLink) {
      setError("Links must be full web addresses starting with https://")
      return
    }

    setSubmitting(true)
    setError("")
    try {
      const payload = {
        name: form.name.trim(),
        role: form.role.trim(),
        category: form.category,
        bio: form.bio.trim() || undefined,
        photo: form.photo.trim() || undefined,
        linkedin: form.linkedin.trim() || undefined,
        customLink: form.customLink.trim() || undefined,
        customLinkLabel: form.customLinkLabel.trim() || undefined,
      }
      if (editingId) {
        await updateMember(editingId, payload)
      } else {
        await createMember(payload)
      }
      reset()
      refresh()
    } catch {
      setError("Could not save. Check that your account has admin access.")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!confirm(`Remove ${member.name} from the team?`)) return
    try {
      await deleteMember(member.id)
      refresh()
    } catch {
      setError("Could not delete. Check that your account has admin access.")
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="card mb-10 space-y-5 p-6">
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
          {editingId ? "Edit member" : "Add a team member"}
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="tm-name" className={labelClass}>
              Name
            </label>
            <input
              id="tm-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tm-role" className={labelClass}>
              Role
            </label>
            <input
              id="tm-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Lead Developer"
              required
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="tm-category" className={labelClass}>
            Category
          </label>
          <select
            id="tm-category"
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value as CategoryKey })
            }
            className={inputClass}
          >
            {CATEGORIES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tm-bio" className={labelClass}>
            Short bio <span className="font-normal text-ink-3">(optional)</span>
          </label>
          <textarea
            id="tm-bio"
            rows={3}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className={`${inputClass} resize-y`}
          />
        </div>

        <ImageUrlInput
          label="Photo"
          value={form.photo}
          onChange={(v) => setForm({ ...form, photo: v })}
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label htmlFor="tm-linkedin" className={labelClass}>
              LinkedIn URL
            </label>
            <input
              id="tm-linkedin"
              value={form.linkedin}
              onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tm-link" className={labelClass}>
              Other link
            </label>
            <input
              id="tm-link"
              value={form.customLink}
              onChange={(e) => setForm({ ...form, customLink: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="tm-link-label" className={labelClass}>
              Link label
            </label>
            <input
              id="tm-link-label"
              value={form.customLinkLabel}
              onChange={(e) => setForm({ ...form, customLinkLabel: e.target.value })}
              placeholder="Portfolio"
              className={inputClass}
            />
          </div>
        </div>

        {error && (
          <p role="alert" className="text-[0.875rem] text-ink-2">
            {error}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button type="submit" disabled={submitting} className="btn btn-primary">
            {submitting ? "Saving…" : editingId ? "Save changes" : "Add member"}
          </button>
          {editingId && (
            <button type="button" onClick={reset} className="btn btn-secondary">
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="border-b border-line pb-3 text-[1.0625rem] font-semibold tracking-[-0.011em]">
        Team ({members.length})
      </h2>

      {loading ? (
        <p className="mt-4 text-[0.9375rem] text-ink-3">Loading…</p>
      ) : members.length === 0 ? (
        <p className="mt-4 text-[0.9375rem] text-ink-3">No members yet.</p>
      ) : (
        <ul className="mt-2">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-line py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-[0.9375rem] font-medium">{member.name}</p>
                <p className="text-[0.75rem] text-ink-3">
                  {member.role} · {categoryLabel(member.category)}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => startEdit(member)}
                  className="btn btn-secondary btn-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(member)}
                  className="text-[0.8125rem] font-medium text-ink-3 transition-colors hover:text-ink"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
