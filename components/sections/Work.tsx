import { work } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

function Block({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <h4 className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
        {label}
      </h4>
      <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-ink-2">{children}</p>
    </div>
  )
}

export default function Work() {
  return (
    <section id="work" className="section" aria-labelledby="work-heading">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{work.eyebrow}</p>
          <h2 id="work-heading" className="h2 mt-4 max-w-[24ch] text-balance">
            {work.heading}
          </h2>
          <p className="mt-5 text-[0.875rem] text-ink-3">{work.note}</p>
        </Reveal>

        <div className="mt-14 space-y-14">
          {work.items.map((item) => (
            <Reveal key={item.title}>
              <article className="border-t border-line pt-8">
                <header className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                  <div>
                    <p className="text-[0.8125rem] text-ink-3">{item.sector}</p>
                    <h3 className="mt-1 text-[1.25rem] font-semibold tracking-[-0.018em]">
                      {item.title}
                    </h3>
                  </div>
                  <p className="mono text-[0.75rem] text-ink-3">{item.duration}</p>
                </header>

                <div className="mt-7 grid grid-cols-1 gap-8 md:grid-cols-3">
                  <Block label="Challenge">{item.challenge}</Block>
                  <Block label="What we did">{item.solution}</Block>
                  <Block label="Outcome">{item.outcome}</Block>
                </div>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {item.stack.map((tech) => (
                    <li key={tech} className="chip mono">
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
