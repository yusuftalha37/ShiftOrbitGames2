"use client"
import { useState } from "react"
import Image from "next/image"

interface Props {
  label: string
  values: string[]
  onChange: (urls: string[]) => void
}

export default function MultiImageUrlInput({ label, values, onChange }: Props) {
  const [draft, setDraft] = useState("")

  function add() {
    const url = draft.trim()
    if (url && /^(\/|https?:\/\/)/.test(url)) {
      onChange([...values, url])
      setDraft("")
    }
  }

  function removeAt(i: number) {
    onChange(values.filter((_, idx) => idx !== i))
  }

  return (
    <div>
      <label className="block text-sm font-medium text-ink-2 mb-2">{label}</label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group" style={{ border: "1px solid var(--color-line-2)" }}>
              <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute inset-0 flex items-center justify-center text-ink text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(13,15,18,0.55)" }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Paste image URL and press Add..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1 px-4 py-2.5 rounded-xl text-ink placeholder:text-ink-3/70 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line-2)" }}
        />
        <button
          type="button"
          onClick={add}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-ink transition-all hover:scale-[1.02]"
          style={{ background: "var(--color-ink)" }}
        >
          Add
        </button>
      </div>
    </div>
  )
}
