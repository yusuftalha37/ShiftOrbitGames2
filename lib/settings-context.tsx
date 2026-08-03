"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { DEFAULT_LINKS, getSocialLinks, type SocialLinks } from "./settings"

const SettingsContext = createContext<SocialLinks>(DEFAULT_LINKS)

/**
 * Header and footer both need the social links, so they are fetched once
 * here rather than once per component.
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const [links, setLinks] = useState<SocialLinks>(DEFAULT_LINKS)

  useEffect(() => {
    getSocialLinks()
      .then(setLinks)
      .catch(() => setLinks(DEFAULT_LINKS))
  }, [])

  return <SettingsContext.Provider value={links}>{children}</SettingsContext.Provider>
}

export function useSocialLinks() {
  return useContext(SettingsContext)
}
