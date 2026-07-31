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
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="flex items-center gap-4">
        <div
          className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
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
          className="flex-1 px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
        />
      </div>
    </div>
  )
}
