import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "./firebase"
import { company } from "./site-content"

export const PLATFORMS = [
  { key: "steam", label: "Steam", placeholder: "https://store.steampowered.com/curator/…" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/…" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@…" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/…" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@…" },
] as const

export type PlatformKey = (typeof PLATFORMS)[number]["key"]

export type SocialLinks = Partial<Record<PlatformKey, string>>

/** Used until the settings document exists, so the header is never empty. */
export const DEFAULT_LINKS: SocialLinks = {
  steam: company.steam,
}

const settingsRef = doc(db, "settings", "social")

export async function getSocialLinks(): Promise<SocialLinks> {
  const snap = await getDoc(settingsRef)
  if (!snap.exists()) return DEFAULT_LINKS

  const data = snap.data() as SocialLinks
  // An empty string means "no link" rather than a link to nowhere.
  return Object.fromEntries(
    PLATFORMS.map(({ key }) => [key, data[key]?.trim() || undefined]).filter(
      ([, value]) => value,
    ),
  ) as SocialLinks
}

export async function saveSocialLinks(links: SocialLinks) {
  const clean = Object.fromEntries(
    PLATFORMS.map(({ key }) => [key, links[key]?.trim() ?? ""]),
  )
  await setDoc(settingsRef, clean, { merge: true })
}
