import { about } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

export default function About() {
  return (
    <section id="about" className="section bg-surface" aria-labelledby="about-heading">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow">{about.eyebrow}</p>
            <h2 id="about-heading" className="h2 mt-4 max-w-[16ch] text-balance">
              {about.heading}
            </h2>

            <dl className="mt-9 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line">
              {about.facts.map((fact) => (
                <div key={fact.label} className="bg-paper px-4 py-4">
                  <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.9375rem] font-medium">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={80}>
            <div className="space-y-5 lg:pt-11">
              {about.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="max-w-[64ch] text-[1.0625rem] leading-relaxed text-ink-2"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
