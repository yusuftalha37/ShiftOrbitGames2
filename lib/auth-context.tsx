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
  roleLoading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  blocked: false,
  loading: true,
  roleLoading: true,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [blocked, setBlocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [roleLoading, setRoleLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        setUser(null)
        setIsAdmin(false)
        setBlocked(false)
        setLoading(false)
        setRoleLoading(false)
        return
      }

      setUser(u)
      setLoading(false)

      setRoleLoading(true)
      Promise.all([
        getDoc(doc(db, "users", u.uid)),
        getDoc(doc(db, "admins", u.uid)),
      ])
        .then(([profile, admin]) => {
          if (profile.exists() && profile.data().blocked === true) {
            setBlocked(true)
            setUser(null)
            setIsAdmin(false)
            signOut(auth)
            return
          }
          setBlocked(false)
          setIsAdmin(admin.exists())
          recordSignIn(u).catch(() => {})
        })
        .catch((err) => {
          console.warn("Firestore unreachable:", err)
          setIsAdmin(false)
        })
        .finally(() => setRoleLoading(false))
    })
    return () => unsub()
  }, [])

  return (
    <AuthContext.Provider value={{ user, isAdmin, blocked, loading, roleLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
