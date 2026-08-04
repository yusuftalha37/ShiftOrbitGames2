"use client"

import { useEffect, useMemo, useState } from "react"
import { CATEGORIES, getAllMembers, type CategoryKey, type TeamMember } from "@/lib/team"
import MemberCard from "@/components/site/MemberCard"
import { useContent } from "@/lib/i18n-context"

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [active, setActive] = useState<string>("all")
  const c = useContent()

  useEffect(() => {
    getAllMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setLoading(false))
  }, [])

  // Only categories that actually have someone in them are worth showing.
  const groups = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        members: members.filter((m) => (m.category ?? "other") === category.key),
      })).filter((g) => g.members.length > 0),
    [members],
  )

  const visible = active === "all" ? groups : groups.filter((g) => g.key === active)

  return (
    <div className="section">
      <div className="container-page">
        <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
          <div className="max-w-[52ch]">
            <p className="eyebrow">{c.team.eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)]">{c.team.pageHeading}</h1>
            <p className="lead mt-5">
{c.team.pageBody}
            </p>
          </div>
          {!loading && members.length > 0 && (
            <p className="mono text-[0.8125rem] text-ink-3">
              {c.team.peopleCount(members.length)}
            </p>
          )}
        </header>

        {groups.length > 1 && (
          <div className="mt-8 flex flex-wrap gap-2" role="group" aria-label={c.team.filterLabel}>
            {[{ key: "all" as const }, ...groups].map((g) => (
              <button
                key={g.key}
                type="button"
                onClick={() => setActive(g.key)}
                aria-pressed={active === g.key}
                className={`rounded-full border px-3.5 py-1.5 text-[0.8125rem] font-medium transition-colors ${
                  active === g.key
                    ? "border-accent bg-accent text-[#17130a]"
                    : "border-line text-ink-2 hover:border-line-2 hover:text-ink"
                }`}
              >
                {g.key === "all" ? c.team.all : c.team.categories[g.key as CategoryKey]}
              </button>
            ))}
          </div>
        )}

        <div className="mt-12" aria-busy={loading}>
          {loading ? (
            <p className="text-[0.9375rem] text-ink-3">{c.common.loading}</p>
          ) : members.length === 0 ? (
            <div className="card px-6 py-14 text-center">
              <p className="text-[1.0625rem] font-medium">{c.team.emptyTitle}</p>
              <p className="mx-auto mt-2 max-w-[42ch] text-[0.9375rem] leading-relaxed text-ink-2">
{c.team.emptyBody}
              </p>
            </div>
          ) : (
            <div className="space-y-14">
              {visible.map((group) => (
                <section key={group.key} aria-labelledby={`cat-${group.key}`}>
                  <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
                    <h2
                      id={`cat-${group.key}`}
                      className="text-[1.0625rem] font-semibold tracking-[-0.011em]"
                    >
                      {c.team.categories[group.key]}
                    </h2>
                    <span className="mono text-[0.75rem] text-ink-3">
                      {group.members.length}
                    </span>
                  </div>

                  <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {group.members.map((member) => (
                      <li key={member.id}>
                        <MemberCard member={member} showBio />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
