"use client"

import { useEffect, useState } from "react"
import {
  PLATFORMS,
  getSocialLinks,
  saveSocialLinks,
  type PlatformKey,
  type SocialLinks,
} from "@/lib/settings"
import SocialIcon from "@/components/site/SocialIcon"

const inputClass =
  "w-full rounded-lg border border-line-2 bg-paper px-3.5 py-2.5 text-[0.9375rem] text-ink placeholder:text-ink-3/70 transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"

export default function SettingsManager() {
  const [links, setLinks] = useState<SocialLinks>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle")
  const [invalid, setInvalid] = useState<PlatformKey[]>([])

  useEffect(() => {
    getSocialLinks()
      .then(setLinks)
      .catch(() => setStatus("error"))
      .finally(() => setLoading(false))
  }, [])

  function update(key: PlatformKey, value: string) {
    setLinks((prev) => ({ ...prev, [key]: value }))
    setStatus("idle")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // A typo here breaks a link on every page, so check before saving.
    const bad = PLATFORMS.filter(({ key }) => {
      const value = links[key]?.trim()
      return value && !/^https?:\/\/.+/i.test(value)
    }).map(({ key }) => key)

    setInvalid(bad)
    if (bad.length > 0) return

    setSaving(true)
    setStatus("idle")
    try {
      await saveSocialLinks(links)
      setStatus("saved")
    } catch {
      setStatus("error")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <p className="text-[0.9375rem] text-ink-3">Loading…</p>
  }

  // noValidate: the browser's own URL bubble would pre-empt the styled
  // per-field messages below, so validation runs in handleSubmit instead.
  return (
    <form onSubmit={handleSubmit} noValidate className="card max-w-2xl space-y-6 p-6">
      <div>
        <h2 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
          Social links
        </h2>
        <p className="mt-2 text-[0.875rem] leading-relaxed text-ink-2">
          These appear in the site header and footer. Leave a field empty to
          hide that platform completely.
        </p>
      </div>

      <div className="space-y-5">
        {PLATFORMS.map((platform) => (
          <div key={platform.key}>
            <label
              htmlFor={`social-${platform.key}`}
              className="mb-2 flex items-center gap-2 text-[0.8125rem] font-medium text-ink"
            >
              <SocialIcon platform={platform.key} size={14} />
              {platform.label}
            </label>
            <input
              id={`social-${platform.key}`}
              type="url"
              inputMode="url"
              value={links[platform.key] ?? ""}
              onChange={(e) => update(platform.key, e.target.value)}
              placeholder={platform.placeholder}
              aria-invalid={invalid.includes(platform.key)}
              className={inputClass}
            />
            {invalid.includes(platform.key) && (
              <p className="mt-1.5 text-[0.75rem] text-ink-2">
                Must be a full address starting with https://
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={saving} className="btn btn-primary">
          {saving ? "Saving…" : "Save links"}
        </button>
        <p role="status" aria-live="polite" className="text-[0.875rem]">
          {status === "saved" && <span className="text-positive">Saved.</span>}
          {status === "error" && (
            <span className="text-ink-2">
              Could not save. Check that your account has admin access.
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
