"use client"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { onAuthStateChanged, signOut, User } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "./firebase"
import { recordSignIn } from "./users"

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  blocked: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  blocked: false,
  loading: true,
})

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), ms)
    ),
  ])
}

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
        setBlocked(false)
        setLoading(false)
        return
      }

      try {
        const [profile, admin] = await withTimeout(
          Promise.all([
            getDoc(doc(db, "users", u.uid)),
            getDoc(doc(db, "admins", u.uid)),
          ]),
          5000
        )

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
        setIsAdmin(admin.exists())
        recordSignIn(u).catch(() => {})
      } catch (err) {
        console.warn("Firestore role check failed:", err)
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
