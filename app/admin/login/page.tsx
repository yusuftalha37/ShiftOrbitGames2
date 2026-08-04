"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth"
import { FirebaseError } from "firebase/app"
import { auth } from "@/lib/firebase"
import { useContent } from "@/lib/i18n-context"

type Mode = "signin" | "signup"

const fieldClass =
  "mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
const labelClass = "block text-[0.8125rem] font-medium text-ink"

/** Firebase error codes turned into something a person can act on. */
function messageFor(code: string) {
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect."
    case "auth/email-already-in-use":
      return "An account already exists for this email. Sign in instead."
    case "auth/weak-password":
      return "Password must be at least 6 characters."
    case "auth/invalid-email":
      return "That email address does not look right."
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again."
    case "auth/operation-not-allowed":
      return "Email sign-in is not enabled for this Firebase project yet."
    case "auth/network-request-failed":
      return "Could not reach the server. Check your connection."
    default:
      return "Something went wrong. Please try again."
  }
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("signin")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [notice, setNotice] = useState("")
  const [loading, setLoading] = useState(false)
  const c = useContent()

  function switchMode(next: Mode) {
    setMode(next)
    setError("")
    setNotice("")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setNotice("")
    setLoading(true)
    try {
      if (mode === "signin") {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) {
          await updateProfile(cred.user, { displayName: name.trim() })
        }
      }
      router.push("/admin")
    } catch (err) {
      setError(messageFor(err instanceof FirebaseError ? err.code : ""))
    } finally {
      setLoading(false)
    }
  }

  async function handleReset() {
    setError("")
    setNotice("")
    if (!email) {
      setError("Enter your email address first, then request a reset link.")
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setNotice(`If an account exists for ${email}, a reset link is on its way.`)
    } catch (err) {
      setError(messageFor(err instanceof FirebaseError ? err.code : ""))
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm">
        <div className="card p-8">
          <h1 className="text-[1.25rem] font-semibold tracking-[-0.018em]">
            {mode === "signin" ? c.account.signInTitle : c.account.signUpTitle}
          </h1>
          <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-2">
{mode === "signin" ? c.account.signInBody : c.account.signUpBody}
          </p>

          <div
            role="tablist"
            aria-label="Authentication mode"
            className="mt-6 inline-flex w-full gap-1 rounded-lg border border-line bg-surface p-1"
          >
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={mode === m}
                onClick={() => switchMode(m)}
                className={`flex-1 rounded-md px-3 py-1.5 text-[0.875rem] font-medium transition-colors ${
                  mode === m
                    ? "bg-surface-2 text-ink"
                    : "text-ink-3 hover:text-ink"
                }`}
              >
                {m === "signin" ? c.account.signIn : c.account.signUp}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {mode === "signup" && (
              <div>
                <label htmlFor="auth-name" className={labelClass}>
                  {c.account.name}
                </label>
                <input
                  id="auth-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={fieldClass}
                />
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className={labelClass}>
                {c.account.email}
              </label>
              <input
                id="auth-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={fieldClass}
              />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor="auth-password" className={labelClass}>
                  {c.account.password}
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="text-[0.75rem] text-ink-3 transition-colors hover:text-ink"
                  >
                    {c.account.forgot}
                  </button>
                )}
              </div>
              <input
                id="auth-password"
                type="password"
                required
                minLength={6}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={fieldClass}
              />
              {mode === "signup" && (
                <p className="mt-2 text-[0.75rem] text-ink-3">{c.account.minChars}</p>
              )}
            </div>

            {error && (
              <p role="alert" className="text-[0.875rem] text-ink-2">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="text-[0.875rem] text-positive">
                {notice}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading
                ? mode === "signin"
                  ? c.account.signingIn
                  : c.account.creating
                : mode === "signin"
                  ? c.account.signIn
                  : c.account.createAccount}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[0.8125rem] text-ink-3">
          <Link href="/" className="transition-colors hover:text-ink">
            ← {c.account.backToSite}
          </Link>
        </p>
      </div>
    </div>
  )
}
