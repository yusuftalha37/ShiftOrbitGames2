import { hero, pipeline } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <circle cx="7" cy="7" r="6.25" stroke="currentColor" strokeWidth="1.25" opacity="0.35" />
      <path
        d="M4.4 7.2l1.85 1.85L9.7 5.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A real deployment run — the product visual is evidence, not decoration. */
function PipelinePanel() {
  return (
    <figure className="card overflow-hidden shadow-[0_1px_2px_rgba(13,15,18,0.04),0_24px_56px_-32px_rgba(13,15,18,0.28)]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3">
        <span className="mono truncate text-[0.8125rem] text-ink-2">
          {pipeline.repo}
        </span>
        <span className="chip mono shrink-0">{pipeline.branch}</span>
      </figcaption>

      <div className="border-b border-line px-4 py-3.5">
        <p className="text-[0.875rem] leading-snug text-ink">{pipeline.message}</p>
        <p className="mono mt-1.5 text-[0.75rem] text-ink-3">
          {pipeline.commit} · {pipeline.author}
        </p>
      </div>

      <ol className="px-4 py-1">
        {pipeline.steps.map((step) => (
          <li
            key={step.name}
            className="flex items-center gap-3 border-b border-line py-2.5 last:border-0"
          >
            <span className="text-positive" aria-hidden="true">
              <Check />
            </span>
            <span className="min-w-0 flex-1 truncate text-[0.8125rem] text-ink-2">
              {step.name}
            </span>
            <span className="mono text-[0.75rem] tabular-nums text-ink-3">
              {step.duration}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex items-center gap-2 border-t border-line bg-surface px-4 py-3">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-positive"
          aria-hidden="true"
        />
        <span className="mono text-[0.75rem] text-ink-2">{pipeline.summary}</span>
      </div>
    </figure>
  )
}

export default function Hero() {
  return (
    <section className="border-b border-line" aria-labelledby="hero-heading">
      <div className="container-page grid grid-cols-1 items-center gap-12 pb-12 pt-16 md:pb-14 md:pt-20 lg:grid-cols-12 lg:gap-16 lg:pb-16 lg:pt-24">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="eyebrow">{hero.eyebrow}</p>
            <h1 id="hero-heading" className="h1 mt-5 max-w-[17ch] text-balance">
              {hero.heading}
            </h1>
            <p className="lead mt-6 max-w-[52ch]">{hero.body}</p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href={hero.primaryCta.href} className="btn btn-primary">
                {hero.primaryCta.label}
              </a>
              <a href={hero.secondaryCta.href} className="btn btn-secondary">
                {hero.secondaryCta.label}
              </a>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.8125rem] text-ink-3">
              {hero.meta.map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span
                    className="h-1 w-1 rounded-full bg-line-2"
                    aria-hidden="true"
                  />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6">
          <Reveal delay={120}>
            <PipelinePanel />
          </Reveal>
        </div>
      </div>

      <div className="container-page">
        <p className="border-t border-line py-5 text-[0.8125rem] text-ink-3">
          {hero.footnote}
        </p>
      </div>
    </section>
  )
}
