"use client"

import { LOCALES, type Locale } from "@/lib/site-content"
import { useLanguage } from "@/lib/i18n-context"

const LABELS: Record<Locale, string> = { en: "EN", tr: "TR" }

export default function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage()

  return (
    <div
      className={`flex items-center gap-1 ${className}`}
      role="group"
      aria-label="Language"
    >
      {LOCALES.map((code) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            lang={code}
            className={`rounded-full px-2.5 py-1 text-[0.8125rem] font-bold tracking-[0.06em] transition-colors ${
              active ? "text-accent" : "text-white/55 hover:text-white"
            }`}
          >
            {LABELS[code]}
          </button>
        )
      })}
    </div>
  )
}
