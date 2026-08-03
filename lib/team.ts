import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"
import { team as fallbackTeam } from "./data"

/**
 * Categories a member can belong to. Keys are stored in Firestore, so
 * renaming one means migrating existing documents — add new keys instead.
 */
export const CATEGORIES = [
  { key: "leadership", label: "Leadership" },
  { key: "development", label: "Development" },
  { key: "art", label: "Art" },
  { key: "design", label: "Design" },
  { key: "audio", label: "Audio & music" },
  { key: "production", label: "Production" },
  { key: "other", label: "Other" },
] as const

export type CategoryKey = (typeof CATEGORIES)[number]["key"]

export function categoryLabel(key: string) {
  return CATEGORIES.find((c) => c.key === key)?.label ?? "Other"
}

export interface TeamMember {
  id: string
  name: string
  role: string
  category: CategoryKey
  bio?: string
  photo?: string
  linkedin?: string
  customLink?: string
  customLinkLabel?: string
  order: number
}

const teamCol = collection(db, "team")

/**
 * Members come from Firestore so they can be managed from the admin panel.
 * While that collection is still empty the hard-coded list in `lib/data.ts`
 * is used, so the site never renders an empty team section before anyone has
 * had a chance to fill it in. The first member added takes over completely.
 */
export async function getAllMembers(): Promise<TeamMember[]> {
  const q = query(teamCol, orderBy("order", "asc"))
  const snap = await getDocs(q)

  if (snap.empty) {
    return fallbackTeam.map((m, i) => ({
      id: m.id,
      name: m.name,
      role: m.role,
      category: "other" as CategoryKey,
      photo: m.photo,
      linkedin: m.linkedin,
      customLink: m.customLink,
      customLinkLabel: m.customLinkLabel,
      order: i,
    }))
  }

  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<TeamMember, "id">) }))
}

export type TeamMemberInput = Omit<TeamMember, "id" | "order">

export async function createMember(data: TeamMemberInput) {
  const snap = await getDocs(teamCol)
  const maxOrder = snap.docs.reduce(
    (m, d) => Math.max(m, (d.data() as TeamMember).order ?? 0),
    0,
  )
  await addDoc(teamCol, { ...stripUndefined(data), order: maxOrder + 1 })
}

export async function updateMember(id: string, data: TeamMemberInput) {
  await updateDoc(doc(db, "team", id), stripUndefined(data))
}

export async function deleteMember(id: string) {
  await deleteDoc(doc(db, "team", id))
}

/** Firestore rejects undefined values, so drop empty optional fields. */
function stripUndefined<T extends Record<string, unknown>>(data: T) {
  return Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined && v !== ""),
  )
}
