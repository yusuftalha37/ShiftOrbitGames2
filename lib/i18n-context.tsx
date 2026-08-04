"use client"

import {
  createContext,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react"
import {
  content,
  DEFAULT_LOCALE,
  LOCALES,
  type Content,
  type Locale,
} from "./site-content"

const STORAGE_KEY = "shift-orbit-locale"

function isLocale(value: string | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value)
}

/**
 * The chosen language lives in localStorage, which is an external store —
 * reading it through useSyncExternalStore keeps the server render and the
 * hydration pass consistent instead of setting state from an effect.
 */
const listeners = new Set<() => void>()
let cached: Locale | null = null

function readLocale(): Locale {
  if (cached) return cached
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) {
    cached = stored
  } else {
    // First visit: follow the browser, but never persist a guess.
    cached = navigator.language?.toLowerCase().startsWith("tr") ? "tr" : DEFAULT_LOCALE
  }
  return cached
}

function subscribe(onChange: () => void) {
  listeners.add(onChange)
  return () => {
    listeners.delete(onChange)
  }
}

function writeLocale(next: Locale) {
  cached = next
  window.localStorage.setItem(STORAGE_KEY, next)
  listeners.forEach((listener) => listener())
}

interface LanguageValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  c: Content
}

const LanguageContext = createContext<LanguageValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  c: content[DEFAULT_LOCALE],
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, readLocale, () => DEFAULT_LOCALE)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return (
    <LanguageContext.Provider value={{ locale, setLocale: writeLocale, c: content[locale] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

/** Shorthand for components that only need the strings. */
export function useContent() {
  return useContext(LanguageContext).c
}
