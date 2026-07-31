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
    <div className="legacy-surface min-h-screen flex items-center justify-center px-6 pt-20">
      <form onSubmit={handleSubmit} className="glass rounded-2xl p-8 w-full max-w-sm space-y-5">
        <h1 className="text-2xl font-black text-white text-center mb-2">
          Admin <span className="shimmer-text">Login</span>
        </h1>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-white outline-none focus:ring-2 focus:ring-purple-500 transition"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}
