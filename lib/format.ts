import type { Timestamp } from "firebase/firestore"

/** Post bodies are stored as HTML from the editor; strip it for previews. */
export function stripHtml(html: string) {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim()
}

export function excerpt(html: string, length = 160) {
  const text = stripHtml(html)
  if (text.length <= length) return text
  // Cut on a word boundary so previews don't end mid-word.
  return text.slice(0, text.lastIndexOf(" ", length)).trimEnd() + "…"
}

export function readingTime(html: string) {
  const words = stripHtml(html).split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}

export function formatDate(
  value: Timestamp | null | undefined,
  style: "long" | "short" = "long",
) {
  const date = value?.toDate()
  if (!date) return ""
  return date.toLocaleDateString(
    "en-US",
    style === "long"
      ? { year: "numeric", month: "long", day: "numeric" }
      : { year: "numeric", month: "short", day: "numeric" },
  )
}
