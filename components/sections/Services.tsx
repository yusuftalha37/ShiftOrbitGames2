import { services } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

function Field({ label, children }: { label: string; children: string }) {
  return (
    <div className="mt-5">
      <dt className="text-[0.6875rem] font-semibold uppercase tracking-[0.09em] text-ink-3">
        {label}
      </dt>
      <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-ink-2">
        {children}
      </dd>
    </div>
  )
}

export default function Services() {
  return (
    <section id="services" className="section" aria-labelledby="services-heading">
      <div className="container-page">
        <Reveal>
          <p className="eyebrow">{services.eyebrow}</p>
          <h2 id="services-heading" className="h2 mt-4 max-w-[20ch] text-balance">
            {services.heading}
          </h2>
          <p className="lead mt-5 max-w-[58ch]">{services.body}</p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2 lg:gap-x-16">
          {services.items.map((item, i) => (
            <Reveal key={item.index} delay={(i % 2) * 80}>
              <article className="border-t border-line pt-7">
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[0.75rem] text-accent">{item.index}</span>
                  <h3 className="h3">{item.title}</h3>
                </div>
                <dl>
                  <Field label="The problem">{item.problem}</Field>
                  <Field label="How we work on it">{item.approach}</Field>
                  <Field label="What you end up with">{item.outcome}</Field>
                </dl>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
