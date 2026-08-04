"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { company } from "@/lib/site-content"
import { useContent } from "@/lib/i18n-context"
import { useAuth } from "@/lib/auth-context"
import { hasSentToday, sendMessage } from "@/lib/messages"

const fieldClass =
  "mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"

const labelClass = "block text-[0.8125rem] font-medium text-ink"

const MAX = 2000

type Status = "idle" | "sending" | "sent" | "error"

export default function Contact() {
  const c = useContent()
  const { user, loading: authLoading } = useAuth()
  const [status, setStatus] = useState<Status>("idle")
  const [error, setError] = useState("")
  const [typedName, setTypedName] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [checked, setChecked] = useState<{ uid: string; sent: boolean } | null>(null)

  // Derived rather than stored, so signing in or out never needs an effect
  // to reset state that is really a function of the current account.
  const name = typedName ?? user?.displayName ?? ""
  const sentToday = user && checked?.uid === user.uid ? checked.sent : null

  useEffect(() => {
    if (!user) return
    let cancelled = false
    const uid = user.uid
    hasSentToday(uid)
      .then((sent) => !cancelled && setChecked({ uid, sent }))
      .catch(() => !cancelled && setChecked({ uid, sent: false }))
    return () => {
      cancelled = true
    }
  }, [user])

  async function handleGoogle() {
    setError("")
    try {
      await signInWithPopup(auth, new GoogleAuthProvider())
    } catch {
      // A closed popup is not an error worth shouting about.
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!user) return

    if (message.trim().length > MAX) {
      setError(c.contact.tooLong)
      return
    }

    setStatus("sending")
    setError("")
    try {
      await sendMessage(user, name || user.displayName || user.email || "", message)
      setStatus("sent")
      setChecked({ uid: user.uid, sent: true })
      setMessage("")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">{c.contact.eyebrow}</p>
          <h2 id="contact-heading" className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            {c.contact.heading}
          </h2>
          <p className="lead mt-5 max-w-[46ch]">{c.contact.body}</p>

          <p className="mt-8 border-t border-line pt-8 text-[0.9375rem] text-ink-2">
            {c.contact.orEmail}{" "}
            <a href={`mailto:${company.email}`} className="link-accent">
              {company.email}
            </a>
          </p>
        </div>

        <div className="lg:col-span-7">
          {authLoading ? (
            <p className="card p-6 text-[0.9375rem] text-ink-3">{c.common.loading}</p>
          ) : !user ? (
            /* Messages are tied to an account: it keeps spam down and gives
               us a reliable address to reply to. */
            <div className="card p-6 sm:p-8">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
                {c.contact.signInPrompt}
              </h3>
              <p className="mt-3 max-w-[52ch] text-[0.9375rem] leading-relaxed text-ink-2">
                {c.contact.signInBody}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={handleGoogle} className="btn btn-primary">
                  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.47 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.29 9.14 4.75 12 4.75z" />
                  </svg>
                  {c.account.google}
                </button>
                <Link href="/admin/login" className="btn btn-secondary">
                  {c.account.signIn}
                </Link>
              </div>
            </div>
          ) : sentToday ? (
            <div className="card p-6 sm:p-8">
              <p role="status" className="text-[0.9375rem] leading-relaxed text-ink-2">
                {status === "sent" ? (
                  <span className="text-positive">{c.contact.sent}</span>
                ) : (
                  c.contact.alreadySent
                )}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    {c.contact.name}
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    maxLength={80}
                    value={name}
                    onChange={(e) => setTypedName(e.target.value)}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label htmlFor="email" className={labelClass}>
                    {c.contact.email}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={user.email ?? ""}
                    readOnly
                    className={`${fieldClass} text-ink-3`}
                  />
                </div>
              </div>

              <div className="mt-5">
                <div className="flex items-baseline justify-between gap-3">
                  <label htmlFor="message" className={labelClass}>
                    {c.contact.message}
                  </label>
                  <span className="mono text-[0.75rem] text-ink-3 tabular-nums">
                    {message.length}/{MAX}
                  </span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  maxLength={MAX}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`${fieldClass} resize-y`}
                />
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={status === "sending" || sentToday === null}
                >
                  {status === "sending" ? c.contact.sending : c.contact.send}
                </button>
                <span className="text-[0.8125rem] text-ink-3">{c.contact.dailyNote}</span>
              </div>

              {(error || status === "error") && (
                <p role="alert" className="mt-4 text-[0.875rem] text-ink-2">
                  {error || (
                    <>
                      {c.contact.error}{" "}
                      <a href={`mailto:${company.email}`} className="link-accent">
                        {company.email}
                      </a>
                    </>
                  )}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
