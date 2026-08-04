"use client"

import { useState, type FormEvent } from "react"
import { company, contact } from "@/lib/site-content"

const fieldClass =
  "mt-2 w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"

const labelClass = "block text-[0.8125rem] font-medium text-ink"

type Status = "idle" | "sending" | "sent" | "error"

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())

    // Honeypot: bots fill hidden fields, people don’t.
    if (data.website) return

    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT

    // Without a configured endpoint the form hands off to the visitor’s mail
    // client rather than silently discarding the message.
    if (!endpoint) {
      const body = [`Name: ${data.name}`, `Email: ${data.email}`, "", String(data.message ?? "")].join("\n")
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        `Message from ${data.name}`,
      )}&body=${encodeURIComponent(body)}`
      setStatus("sent")
      return
    }

    setStatus("sending")
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!response.ok) throw new Error(String(response.status))
      form.reset()
      setStatus("sent")
    } catch {
      setStatus("error")
    }
  }

  return (
    <section id="contact" className="section" aria-labelledby="contact-heading">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">{contact.eyebrow}</p>
          <h2 id="contact-heading" className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
            {contact.heading}
          </h2>
          <p className="lead mt-5 max-w-[46ch]">{contact.body}</p>

          <p className="mt-8 border-t border-line pt-8 text-[0.9375rem] text-ink-2">
            Or email us directly at{" "}
            <a href={`mailto:${company.email}`} className="link-accent">
              {company.email}
            </a>
          </p>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="card p-6 sm:p-8">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className={labelClass}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className={`${fieldClass} resize-y`}
              />
            </div>

            {/* Honeypot — visually and programmatically hidden from people. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>

            <p role="status" aria-live="polite" className="mt-4 text-[0.875rem]">
              {status === "sent" && (
                <span className="text-positive">
                  Thank you — your message is on its way.
                </span>
              )}
              {status === "error" && (
                <span className="text-ink-2">
                  Something went wrong sending the form. Please email us at{" "}
                  <a href={`mailto:${company.email}`} className="link-accent">
                    {company.email}
                  </a>
                  .
                </span>
              )}
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
