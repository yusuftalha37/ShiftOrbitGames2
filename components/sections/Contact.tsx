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

    // Honeypot: bots fill hidden fields, people don't.
    if (data.website) return

    const endpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT

    // Without a configured endpoint the form hands off to the visitor's mail
    // client rather than silently discarding the enquiry.
    if (!endpoint) {
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Company: ${data.company}`,
        `Budget: ${data.budget}`,
        "",
        String(data.message ?? ""),
      ].join("\n")
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent(
        `Project enquiry — ${data.company || data.name}`,
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
          <h2 id="contact-heading" className="h2 mt-4 max-w-[16ch] text-balance">
            {contact.heading}
          </h2>
          <p className="lead mt-5 max-w-[46ch]">{contact.body}</p>

          <dl className="mt-10 space-y-6 border-t border-line pt-8 text-[0.9375rem]">
            <div>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                Email
              </dt>
              <dd className="mt-1.5">
                <a href={`mailto:${company.email}`} className="link-accent">
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                Phone
              </dt>
              <dd className="mt-1.5">
                <a
                  href={`tel:${company.phone.replace(/\s/g, "")}`}
                  className="text-ink-2 transition-colors hover:text-ink"
                >
                  {company.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                Office
              </dt>
              <dd className="mt-1.5 text-ink-2">
                <address className="not-italic">
                  {company.address.street}
                  <br />
                  {company.address.locality}, {company.address.country}
                </address>
              </dd>
            </div>
            <div>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                Response time
              </dt>
              <dd className="mt-1.5 text-ink-2">{company.responseTime}</dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="card p-6 sm:p-8"
            noValidate={false}
          >
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
                  Work email
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
              <div>
                <label htmlFor="company" className={labelClass}>
                  Company
                </label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  className={fieldClass}
                />
              </div>
              <div>
                <label htmlFor="budget" className={labelClass}>
                  Budget range
                </label>
                <select id="budget" name="budget" className={fieldClass} defaultValue="">
                  <option value="" disabled>
                    Select a range
                  </option>
                  {contact.budgets.map((budget) => (
                    <option key={budget} value={budget}>
                      {budget}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="message" className={labelClass}>
                What are you trying to build or fix?
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className={`${fieldClass} resize-y`}
                placeholder="The system involved, what's going wrong or what's missing, and any date you're working towards."
              />
            </div>

            {/* Honeypot — visually and programmatically hidden from people. */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={status === "sending"}
              >
                {status === "sending" ? "Sending…" : "Send enquiry"}
              </button>
              <p className="text-[0.8125rem] text-ink-3">
                We’ll sign your NDA before the first call if you need us to.
              </p>
            </div>

            <p role="status" aria-live="polite" className="mt-4 text-[0.875rem]">
              {status === "sent" && (
                <span className="text-positive">
                  Thank you — your enquiry is on its way. We’ll come back to you
                  within one business day.
                </span>
              )}
              {status === "error" && (
                <span className="text-ink-2">
                  Something went wrong sending the form. Please email us directly
                  at{" "}
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
