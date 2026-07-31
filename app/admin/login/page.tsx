"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push("/admin")
    } catch {
      setError("Invalid email or password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-6 py-16">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-5 p-8">
        <h1 className="text-[1.25rem] font-semibold tracking-[-0.018em]">Admin sign in</h1>
        <div>
          <label htmlFor="admin-email" className="block text-[0.8125rem] font-medium text-ink">
            Email
          </label>
          <input
            id="admin-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        <div>
          <label htmlFor="admin-password" className="block text-[0.8125rem] font-medium text-ink">
            Password
          </label>
          <input
            id="admin-password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
        </div>
        {error && (
          <p role="alert" className="text-[0.875rem] text-ink-2">
            {error}
          </p>
        )}
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  )
}
