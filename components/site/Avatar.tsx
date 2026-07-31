"use client"

import Image from "next/image"
import { useState } from "react"

/**
 * Falls back to initials when a photo is missing or fails to load, so a
 * placeholder path in the team data never renders a broken image.
 */
export default function Avatar({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false)

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-line bg-surface-2">
      {src && !failed ? (
        <Image
          src={src}
          alt=""
          fill
          sizes="56px"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center text-[0.875rem] font-medium text-ink-3"
          aria-hidden="true"
        >
          {initials}
        </span>
      )}
    </div>
  )
}
