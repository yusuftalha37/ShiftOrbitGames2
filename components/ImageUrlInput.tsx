"use client"
import Image from "next/image"

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
}

export default function ImageUrlInput({ label, value, onChange }: Props) {
  const isValid = /^(\/|https?:\/\/)/.test(value)

  return (
    <div>
      <label className="block text-sm font-medium text-ink-2 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line-2)" }}
        >
          {value && isValid ? (
            <Image src={value} alt="Preview" fill className="object-cover" />
          ) : (
            <span className="text-2xl opacity-30">🖼</span>
          )}
        </div>
        <input
          type="text"
          placeholder="Paste image URL (e.g. from imgur.com)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl text-ink placeholder:text-ink-3/70 outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition"
          style={{ background: "var(--color-paper)", border: "1px solid var(--color-line-2)" }}
        />
      </div>
    </div>
  )
}
