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
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null)
        setIsAdmin(false)
        setBlocked(false)
        setLoading(false)
        return
      }

      setUser(u)
      setLoading(false)

      const checkRole = async () => {
        try {
          const [profile, admin] = await Promise.all([
            getDoc(doc(db, "users", u.uid)),
            getDoc(doc(db, "admins", u.uid)),
          ])

          if (profile.exists() && profile.data().blocked === true) {
            setBlocked(true)
            setUser(null)
            setIsAdmin(false)
            await signOut(auth)
            return
          }

          setBlocked(false)
          setIsAdmin(admin.exists())
          recordSignIn(u).catch(() => {})
        } catch (err) {
          console.warn("Firestore unreachable:", err)
          setIsAdmin(false)
        }
      }
      checkRole()
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
