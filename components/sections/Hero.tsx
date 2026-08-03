"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { hero, company } from "@/lib/site-content"
import { getAllGames } from "@/lib/games"
import { getAllMembers } from "@/lib/team"
import Reveal from "@/components/site/Reveal"

export default function Hero() {
  const [gameCount, setGameCount] = useState<number | null>(null)
  const [teamCount, setTeamCount] = useState<number | null>(null)

  useEffect(() => {
    getAllGames()
      .then((g) => setGameCount(g.length))
      .catch(() => setGameCount(null))
    getAllMembers()
      .then((m) => setTeamCount(m.length))
      .catch(() => setTeamCount(null))
  }, [])

  const stats = [
    { value: gameCount === null ? "—" : String(gameCount), label: "Games" },
    { value: teamCount === null ? "—" : String(teamCount), label: "Team members" },
    { value: String(company.founded), label: "Founded" },
  ]

  return (
    <section className="border-b border-line" aria-labelledby="hero-heading">
      <div className="container-page grid grid-cols-1 items-center gap-12 pb-14 pt-16 md:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-heading" className="h1 mt-5 max-w-[16ch] text-balance">
              {hero.heading}
            </h1>
            <p className="lead mt-6 max-w-[50ch]">{hero.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={hero.primaryCta.href} className="btn btn-primary">
                {hero.primaryCta.label}
              </a>
              <a href={hero.secondaryCta.href} className="btn btn-secondary">
                {hero.secondaryCta.label}
              </a>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-5">
          <Reveal delay={120}>
            <div className="flex justify-center lg:justify-end">
              {/* The logo artwork is drawn for a dark field, so it keeps one. */}
              <div className="relative aspect-square w-56 overflow-hidden rounded-full bg-ink sm:w-72">
                <Image
                  src="/logo.png"
                  alt={`${company.name} logo`}
                  fill
                  sizes="(max-width: 640px) 224px, 288px"
                  className="object-contain p-8"
                  priority
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="container-page">
        <dl className="grid grid-cols-3 gap-6 border-t border-line py-6">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                {stat.label}
              </dt>
              <dd className="mt-1 text-[1.375rem] font-semibold tabular-nums tracking-[-0.02em]">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
