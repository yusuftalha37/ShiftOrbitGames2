"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getAllMembers, type TeamMember } from "@/lib/team"
import { team as copy } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"
import MemberCard from "@/components/site/MemberCard"

export default function Team() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && members.length === 0) return null

  return (
    <section id="team" className="section bg-surface" aria-labelledby="team-heading">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="eyebrow">{copy.eyebrow}</p>
              <h2 id="team-heading" className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">
                {copy.heading}
              </h2>
              <p className="lead mt-5 max-w-[52ch]">{copy.body}</p>
            </div>
            {members.length > 6 && (
              <Link href="/team" className="link-accent text-[0.9375rem]">
                All team members →
              </Link>
            )}
          </div>
        </Reveal>

        {loading ? (
          <p className="mt-12 text-[0.9375rem] text-ink-3">Loading…</p>
        ) : (
          <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.slice(0, 6).map((member, i) => (
              <li key={member.id}>
                <Reveal delay={(i % 3) * 70}>
                  <MemberCard member={member} />
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
