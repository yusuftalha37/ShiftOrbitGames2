/**
 * Every piece of site copy lives here so content can be revised without
 * touching component code.
 */

export const company = {
  name: "Shift Orbit",
  legalName: "Shift Orbit",
  tagline: "Independent game studio",
  founded: 2024,
  email: "hello@shiftorbit.com",
  /** PLACEHOLDER — replace with the studio's real Steam publisher page. */
  steam: "https://store.steampowered.com/publisher/shiftorbit",
}

export const nav = [
  { href: "/#games", label: "Games" },
  { href: "/news", label: "News" },
  { href: "/team", label: "Team" },
  { href: "/#contact", label: "Contact" },
]

export const hero = {
  eyebrow: company.tagline,
  heading: "Games that take you beyond the stars.",
  body: "We are an independent studio building bold, universe-scale gaming experiences. Every orbit begins with a single shift.",
  primaryCta: { href: "#games", label: "Explore our games" },
  secondaryCta: { href: "#contact", label: "Get in touch" },
}

export const games = {
  eyebrow: "Our universe",
  heading: "Games",
  body: "Each title is a new world. Explore what we have launched into orbit.",
  empty: "First launch coming soon.",
}

export const team = {
  eyebrow: "The crew",
  heading: "Team",
  body: "A small group of developers, artists, and designers building every world by hand.",
}

export const contact = {
  eyebrow: "Say hello",
  heading: "Contact us",
  body: "Questions, press enquiries, collaboration ideas, or something you want to share about our games — we read every message.",
}
