"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { recordSignIn } from "./users"

interface AuthContextValue {
  user: User | null
  /** True only for accounts listed in the `admins` collection. */
  isAdmin: boolean
  /** Set when the account was signed out because an admin blocked it. */
  blocked: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  blocked: false,
  loading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null)
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        const profile = await getDoc(doc(db, "users", u.uid))

        // A blocked account is signed straight back out. Firestore rules deny
        // its writes regardless — this only keeps the interface honest.
        if (profile.exists() && profile.data().blocked === true) {
          setBlocked(true)
          setUser(null)
          setIsAdmin(false)
          setLoading(false)
          await signOut(auth)
          return
        }

        setBlocked(false)
        setUser(u)

        // Having an account is not the same as being allowed to edit the
        // site: the uid also has to exist in `admins`.
        const admin = await getDoc(doc(db, "admins", u.uid))
        setIsAdmin(admin.exists())

        // Keeps the directory the admin panel lists up to date.
        recordSignIn(u).catch(() => {})
      } catch (err) {
        console.warn("Firestore unreachable — user authenticated but role check skipped:", err)
        setUser(u)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, blocked, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
