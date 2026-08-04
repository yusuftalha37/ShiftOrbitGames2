import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Timestamp,
} from "firebase/firestore"
import type { User } from "firebase/auth"
import { db } from "./firebase"

export interface UserRecord {
  uid: string
  email: string
  displayName?: string
  blocked?: boolean
  isAdmin: boolean
  createdAt?: Timestamp | null
  lastSeenAt?: Timestamp | null
}

const usersCol = collection(db, "users")
const adminsCol = collection(db, "admins")

/**
 * The Firebase client SDK cannot list accounts, so every sign-in records the
 * account here. That directory is what the admin panel lists — meaning it
 * covers everyone who has signed in since this was added, not accounts that
 * only ever existed in Firebase Auth.
 */
export async function recordSignIn(user: User) {
  const ref = doc(db, "users", user.uid)
  const snap = await getDoc(ref)

  const base = {
    email: user.email ?? "",
    displayName: user.displayName ?? "",
    lastSeenAt: serverTimestamp(),
  }

  if (snap.exists()) {
    await updateDoc(ref, base)
  } else {
    await setDoc(ref, { ...base, createdAt: serverTimestamp() })
  }
}

export async function isBlocked(uid: string) {
  const snap = await getDoc(doc(db, "users", uid))
  return snap.exists() && snap.data().blocked === true
}

export async function getAllUsers(): Promise<UserRecord[]> {
  const [users, admins] = await Promise.all([getDocs(usersCol), getDocs(adminsCol)])
  const adminIds = new Set(admins.docs.map((d) => d.id))

  return users.docs
    .map((d) => {
      const data = d.data()
      return {
        uid: d.id,
        email: data.email ?? "",
        displayName: data.displayName || undefined,
        blocked: data.blocked === true,
        isAdmin: adminIds.has(d.id),
        createdAt: data.createdAt ?? null,
        lastSeenAt: data.lastSeenAt ?? null,
      }
    })
    .sort((a, b) => (b.lastSeenAt?.toMillis() ?? 0) - (a.lastSeenAt?.toMillis() ?? 0))
}

export async function setAdmin(uid: string, value: boolean) {
  const ref = doc(db, "admins", uid)
  if (value) {
    await setDoc(ref, { grantedAt: serverTimestamp() })
  } else {
    await deleteDoc(ref)
  }
}

export async function setBlocked(uid: string, value: boolean) {
  await updateDoc(doc(db, "users", uid), { blocked: value })
}
