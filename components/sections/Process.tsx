import { process } from "@/lib/site-content"
import Reveal from "@/components/site/Reveal"

export default function Process() {
  return (
    <section
      id="process"
      className="section bg-ink text-white"
      aria-labelledby="process-heading"
    >
      <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <Reveal>
              <p className="eyebrow eyebrow-invert">{process.eyebrow}</p>
              <h2
                id="process-heading"
                className="h2 mt-4 text-white text-balance"
              >
                {process.heading}
              </h2>
              <p className="mt-5 text-[1.0625rem] leading-relaxed text-white/60">
                {process.body}
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-8">
          <ol className="border-t border-white/14">
            {process.stages.map((stage, i) => (
              <li key={stage.step} className="border-b border-white/14">
                <Reveal delay={i * 40}>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 py-8 sm:grid-cols-[auto_1fr]">
                    <span className="mono text-[0.75rem] text-white/45 sm:pt-1">
                      {stage.step}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <h3 className="text-[1.0625rem] font-semibold tracking-[-0.011em]">
                          {stage.name}
                        </h3>
                        <span className="mono text-[0.75rem] text-white/55">
                          {stage.duration}
                        </span>
                      </div>
                      <p className="mt-3 max-w-[62ch] text-[0.9375rem] leading-relaxed text-white/72">
                        {stage.detail}
                      </p>
                      <p className="mt-4 text-[0.8125rem] text-white/55">
                        <span className="text-white/45">Deliverable — </span>
                        {stage.deliverable}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
