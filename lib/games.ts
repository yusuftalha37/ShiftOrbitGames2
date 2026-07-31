import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
} from "firebase/firestore"
import { db } from "./firebase"

export interface Review {
  author: string
  text: string
  source: string
  rating?: number
}

export interface SocialContent {
  platform: string
  creator: string
  url: string
  thumbnail?: string
  type: "video" | "post" | "article"
}

export interface Game {
  id: string
  slug: string
  title: string
  shortDescription: string
  description: string
  coverImage?: string
  screenshots: string[]
  trailer?: string
  steamUrl?: string
  epicUrl?: string
  tags: string[]
  genre: string
  releaseDate?: string
  status: "released" | "coming-soon" | "in-development"
  reviews: Review[]
  socialContent: SocialContent[]
  order: number
}

const gamesCol = collection(db, "games")

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

export async function getAllGames(): Promise<Game[]> {
  const q = query(gamesCol, orderBy("order", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Game, "id">) }))
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const snap = await getDocs(gamesCol)
  const match = snap.docs.find((d) => (d.data() as Game).slug === slug)
  if (!match) return null
  return { id: match.id, ...(match.data() as Omit<Game, "id">) }
}

export async function getGameById(id: string): Promise<Game | null> {
  const ref = doc(db, "games", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Game, "id">) }
}

export type GameInput = Omit<Game, "id" | "slug" | "order">

export async function createGame(data: GameInput) {
  const all = await getAllGames()
  const maxOrder = all.reduce((m, g) => Math.max(m, g.order ?? 0), 0)
  await addDoc(gamesCol, { ...data, slug: slugify(data.title), order: maxOrder + 1 })
}

export async function updateGame(id: string, data: GameInput) {
  const ref = doc(db, "games", id)
  await updateDoc(ref, { ...data, slug: slugify(data.title) })
}

export async function deleteGame(id: string) {
  await deleteDoc(doc(db, "games", id))
}
