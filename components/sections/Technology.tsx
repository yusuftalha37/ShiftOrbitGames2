import { technology } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

export default function Technology() {
  return (
    <section
      id="technology"
      className="section bg-surface"
      aria-labelledby="technology-heading"
    >
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{technology.eyebrow}</p>
          <h2 id="technology-heading" className="h2 mt-4 max-w-[18ch] text-balance">
            {technology.heading}
          </h2>
          <p className="lead mt-5 max-w-[60ch]">{technology.body}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {technology.groups.map((group, i) => (
            <Reveal key={group.name} delay={(i % 2) * 80}>
              <article className="card card-hover h-full p-6 sm:p-7">
                <h3 className="h3">{group.name}</h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {group.tools.map((tool) => (
                    <li key={tool} className="chip chip-solid mono">
                      {tool}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink-2">
                  {group.why}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
