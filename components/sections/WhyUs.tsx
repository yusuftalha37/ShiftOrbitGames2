import { whyUs } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

export default function WhyUs() {
  return (
    <section className="section" aria-labelledby="why-heading">
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <Reveal className="lg:sticky lg:top-28">
            <p className="eyebrow">{whyUs.eyebrow}</p>
            <h2 id="why-heading" className="h2 mt-4 text-balance">
              {whyUs.heading}
            </h2>
          </Reveal>
        </div>

        <div className="lg:col-span-8">
          <dl className="border-t border-line">
            {whyUs.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 40}>
                <div className="border-b border-line py-7">
                  <dt className="h3">{item.title}</dt>
                  <dd className="mt-2.5 max-w-[68ch] text-[0.9375rem] leading-relaxed text-ink-2">
                    {item.body}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
