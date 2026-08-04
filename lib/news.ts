import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

export interface NewsPost {
  id: string
  title: string
  content: string
  coverImage?: string
  gameSlug?: string
  createdAt: Timestamp | null
  author: string
}

export interface Comment {
  id: string
  name: string
  message: string
  createdAt: Timestamp | null
}

const postsCol = collection(db, "posts")

export async function getAllPosts(): Promise<NewsPost[]> {
  const q = query(postsCol, orderBy("createdAt", "desc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsPost, "id">) }))
}

export async function getPostsByGame(gameSlug: string): Promise<NewsPost[]> {
  const q = query(postsCol, where("gameSlug", "==", gameSlug))
  const snap = await getDocs(q)
  const posts = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<NewsPost, "id">) }))
  return posts.sort((a, b) => (b.createdAt?.toMillis() ?? 0) - (a.createdAt?.toMillis() ?? 0))
}

export async function getPost(id: string): Promise<NewsPost | null> {
  const ref = doc(db, "posts", id)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<NewsPost, "id">) }
}

export async function createPost(data: {
  title: string
  content: string
  coverImage?: string
  gameSlug?: string
  author: string
}) {
  const { title, content, coverImage, gameSlug, author } = data
  await addDoc(postsCol, {
    title,
    content,
    author,
    ...(coverImage ? { coverImage } : {}),
    ...(gameSlug ? { gameSlug } : {}),
    createdAt: serverTimestamp(),
  })
}

export async function deletePost(id: string) {
  await deleteDoc(doc(db, "posts", id))
}

export async function getComments(postId: string): Promise<Comment[]> {
  const q = query(collection(db, "posts", postId, "comments"), orderBy("createdAt", "asc"))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Comment, "id">) }))
}

export async function addComment(postId: string, data: { name: string; message: string; uid: string }) {
  await addDoc(collection(db, "posts", postId, "comments"), { ...data, createdAt: serverTimestamp() })
}
