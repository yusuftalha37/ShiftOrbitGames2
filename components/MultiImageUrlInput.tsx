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
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {values.map((src, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden group" style={{ border: "1px solid rgba(124,58,237,0.3)" }}>
              <Image src={src} alt={`Screenshot ${i + 1}`} fill className="object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: "rgba(0,0,0,0.6)" }}
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
          className="flex-1 px-4 py-2.5 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
        />
        <button
          type="button"
          onClick={add}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          Add
        </button>
      </div>
    </div>
  )
}
