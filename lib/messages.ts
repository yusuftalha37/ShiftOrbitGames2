import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  type Timestamp,
} from "firebase/firestore"
import type { User } from "firebase/auth"
import { db } from "./firebase"

export interface Message {
  id: string
  uid: string
  name: string
  email: string
  message: string
  createdAt: Timestamp | null
}

/**
 * One message per account per day is enforced by the document id rather than
 * by a check the client could skip: the id is `<uid>_<day>`, the rules refuse
 * any other shape, and a second write for the same day collides with the
 * document that already exists.
 *
 * The day is counted in UTC, so the allowance resets at 00:00 UTC.
 */
export function dayNumber(at: Date = new Date()) {
  return Math.floor(at.getTime() / 86_400_000)
}

export function messageId(uid: string) {
  return `${uid}_${dayNumber()}`
}

export async function hasSentToday(uid: string) {
  const snap = await getDoc(doc(db, "messages", messageId(uid)))
  return snap.exists()
}

export async function sendMessage(user: User, name: string, message: string) {
  await setDoc(doc(db, "messages", messageId(user.uid)), {
    uid: user.uid,
    name: name.trim(),
    email: user.email ?? "",
    message: message.trim(),
    createdAt: serverTimestamp(),
  })
}

export async function getAllMessages(): Promise<Message[]> {
  const snap = await getDocs(query(collection(db, "messages"), orderBy("createdAt", "desc")))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Message, "id">) }))
}

export async function deleteMessage(id: string) {
  await deleteDoc(doc(db, "messages", id))
}
