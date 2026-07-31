/**
 * Every piece of site copy lives here so content can be revised without
 * touching component code.
 *
 * PLACEHOLDER DATA — before launch, replace with the company’s real
 * details: founding year, headcount, address, phone, and the engagement
 * facts in `work`. Nothing here should ship unverified.
 */

export const company = {
  name: "Shift Orbit",
  legalName: "Shift Orbit Yazılım A.Ş.",
  tagline: "Software engineering studio",
  founded: 2019,
  headcount: 14,
  email: "hello@shiftorbit.com",
  phone: "+90 212 000 00 00",
  address: {
    street: "Kuştepe Mah. Mecidiyeköy Yolu Cad. No: 12",
    locality: "Şişli, İstanbul",
    country: "Türkiye",
  },
  languages: "Turkish and English",
  responseTime: "We reply within one business day.",
}

export const nav = [
  { href: "#services", label: "Services" },
  { href: "#work", label: "Work" },
  { href: "#process", label: "Process" },
  { href: "#technology", label: "Technology" },
  { href: "#about", label: "About" },
]

export const hero = {
  eyebrow: `${company.tagline} · İstanbul`,
  heading: "We design, build, and operate the software your business runs on.",
  body: "Companies bring us customer-facing platforms, internal operations tools, and the APIs that connect them. We take a project from discovery through to production — then stay on to keep it running.",
  primaryCta: { href: "#contact", label: "Start a project" },
  secondaryCta: { href: "#process", label: "See how we work" },
  meta: [
    "Typical engagement: 8–16 weeks",
    "2–4 engineers per team",
    "Fixed price per phase",
  ],
  footnote:
    "Working with logistics, manufacturing, and B2B software teams since 2019.",
}

/** The hero visual: a real deployment run, not an illustration. */
export const pipeline = {
  repo: "shift-orbit/atlas-platform",
  branch: "main",
  commit: "4f2a9c1",
  message: "billing: move settlement job to a worker queue",
  author: "e.demir",
  steps: [
    { name: "Install & typecheck", duration: "0:42" },
    { name: "Unit tests (612)", duration: "1:18" },
    { name: "Integration tests (94)", duration: "2:07" },
    { name: "End-to-end (Playwright, 48)", duration: "3:04" },
    { name: "Build & container image", duration: "1:06" },
    { name: "Deploy → production", duration: "0:51" },
  ],
  summary: "Deployed to production · 9:08 total · zero downtime",
}

export const services = {
  eyebrow: "Services",
  heading: "Four engagements cover most of what clients ask us for",
  body: "Each one starts with a problem we hear repeatedly — not with a technology we want to use.",
  items: [
    {
      index: "01",
      title: "Product engineering",
      problem:
        "You have a product to build and a date to hit, but assembling an in-house team takes six months you don’t have.",
      approach:
        "One team covering design, front-end, back-end, and infrastructure, working in two-week iterations against acceptance criteria agreed up front.",
      outcome:
        "A production system your own engineers can take over: documented, tested, and deployed on infrastructure you own.",
    },
    {
      index: "02",
      title: "Internal tools",
      problem:
        "Operations run on spreadsheets, a shared inbox, and one person who understands how it all fits together.",
      approach:
        "We work alongside the people doing the job before we design anything, then replace the manual steps in the order that removes the most risk.",
      outcome:
        "Work moves through one system with roles, an audit trail, and reporting your team can query without asking engineering.",
    },
    {
      index: "03",
      title: "Platform & integrations",
      problem:
        "Systems that don’t talk to each other, data re-entered by hand, and no reliable answer to which record is correct.",
      approach:
        "Explicit contracts between services, idempotent jobs, and reconciliation you can run on demand rather than trusting a nightly script.",
      outcome:
        "Documented APIs and dependable data flow between systems, with monitoring on the paths that actually matter to the business.",
    },
    {
      index: "04",
      title: "Modernization & reliability",
      problem:
        "A system that works but is expensive to change, slow under load, or stuck on versions that no longer receive security patches.",
      approach:
        "Incremental migration behind the existing interface — no rewrite freeze — starting with whatever is blocking the roadmap today.",
      outcome:
        "The product keeps shipping while the foundation changes underneath it, on supported versions with a patching routine.",
    },
  ],
}

export const process = {
  eyebrow: "Process",
  heading: "How a project is delivered",
  body: "Every engagement runs through the same six stages. The stages are fixed; how long each one takes depends on the work.",
  stages: [
    {
      step: "01",
      name: "Discovery",
      duration: "1–2 weeks",
      detail:
        "Interviews with the people who will use the system, a review of what already exists, and a written definition of the problem. If we think the project shouldn’t be built the way it was described, this is where we say so.",
      deliverable: "Scope document, risk register, estimate range",
    },
    {
      step: "02",
      name: "Planning",
      duration: "About 1 week",
      detail:
        "Architecture decisions recorded with their trade-offs, a milestone plan, and the acceptance criteria we agree to be measured against.",
      deliverable: "Technical plan, milestone schedule, fixed phase price",
    },
    {
      step: "03",
      name: "Development",
      duration: "Two-week iterations",
      detail:
        "Working software at the end of every iteration, deployed to a staging environment you can use yourself. Scope changes are priced against the plan before they enter an iteration.",
      deliverable: "Demo, changelog, updated backlog and budget position",
    },
    {
      step: "04",
      name: "Testing",
      duration: "Continuous",
      detail:
        "Automated tests on the paths that would cost you money if they broke, a manual review of each release candidate, and load testing where traffic patterns justify it.",
      deliverable: "Test suite running in CI, release checklist",
    },
    {
      step: "05",
      name: "Deployment",
      duration: "Per release",
      detail:
        "Infrastructure defined in code, staged rollout, and a rollback path tested before it is needed. Production credentials stay in your accounts throughout.",
      deliverable: "Deployment pipelines, runbooks, monitoring and alerts",
    },
    {
      step: "06",
      name: "Support",
      duration: "Ongoing",
      detail:
        "Defined response times and a named engineer who already knows the system. If you decide to bring the work in-house, the handover is planned rather than improvised.",
      deliverable: "Support agreement, on-call rota, handover documentation",
    },
  ],
}

export const work = {
  eyebrow: "Selected work",
  heading: "Three engagements, described the way we’d describe them to you",
  note: "Client names are withheld under NDA.",
  items: [
    {
      sector: "Logistics operator",
      title: "Dispatch operations tool",
      duration: "14 weeks · 3 engineers",
      challenge:
        "Dispatch ran on a shared spreadsheet and a phone. Two coordinators held the routing logic in their heads, and nobody could say where a shipment was without calling the driver.",
      solution:
        "We spent three weeks in the dispatch office before writing any code, then built a single operations tool: shipments, driver assignment, status updates from a mobile view, and a full audit trail. Rollout ran region by region, with the spreadsheet kept as a fallback until each region signed off.",
      outcome:
        "Dispatch runs in one system with a complete history per shipment. Coordinators handle the same volume without the spreadsheet, and customer service answers status questions directly instead of relaying calls to drivers.",
      stack: ["Next.js", "PostgreSQL", "AWS"],
    },
    {
      sector: "B2B software company",
      title: "Billing and subscription rebuild",
      duration: "18 weeks · 3 engineers",
      challenge:
        "Billing logic had spread across three services and a set of scheduled scripts. Invoice corrections were made by hand in the database, and finance closed each month with engineering support.",
      solution:
        "We extracted billing into one service with an explicit state machine, backfilled and reconciled historical subscriptions, then ran the new engine in shadow mode for two billing cycles and compared every invoice before switching over.",
      outcome:
        "Month-end close no longer requires an engineer. Corrections are a supported operation with an audit record instead of a manual database edit, and finance reconciles from a single report.",
      stack: ["Node.js", "PostgreSQL", "Terraform"],
    },
    {
      sector: "Industrial manufacturer",
      title: "Customer order portal modernization",
      duration: "11 weeks · 2 engineers",
      challenge:
        "The order portal ran on a framework version that no longer received security patches. A security review blocked a planned ERP integration, and the application was hosted on a single server nobody was monitoring.",
      solution:
        "A strangler-fig migration: new pages served from a supported stack behind the same domain and session, moved onto containerized infrastructure with automated deploys, dependency scanning, and monitoring added before any feature work started.",
      outcome:
        "The portal is on supported versions with a monthly patching routine. Deploys take minutes rather than a scheduled evening, and the integration cleared the client’s security review on the second pass.",
      stack: ["TypeScript", "Docker", "GitHub Actions"],
    },
  ],
}

export const technology = {
  eyebrow: "Technology",
  heading: "A deliberately small stack",
  body: "Fewer technologies mean faster onboarding, longer support windows, and less risk when someone leaves the project. We use what we can operate well rather than what is newest.",
  groups: [
    {
      name: "Application",
      tools: ["TypeScript", "React", "Next.js"],
      why: "One language across the browser and the server. Reviews are faster, engineers move between layers without a hand-off, and the hiring pool for maintenance afterwards is large.",
    },
    {
      name: "Services & data",
      tools: ["Node.js", "Python", "PostgreSQL", "Redis"],
      why: "PostgreSQL handles the large majority of workloads we see, including search and queuing at moderate volume. Running one database instead of four keeps operational cost and failure modes down.",
    },
    {
      name: "Infrastructure",
      tools: ["AWS", "Docker", "Terraform", "GitHub Actions"],
      why: "Infrastructure is defined in code and lives in accounts you own. Any competent team can pick it up — there is no dependency on us to keep the system running.",
    },
    {
      name: "Quality & operations",
      tools: ["Vitest", "Playwright", "OpenTelemetry", "Sentry"],
      why: "Tests run on every branch and traces cover the critical paths, so failures surface as alerts within minutes instead of arriving as support tickets the next morning.",
    },
  ],
}

export const whyUs = {
  eyebrow: "Why teams work with us",
  heading: "What you can hold us to",
  items: [
    {
      title: "The engineers you meet are the engineers who build it",
      body: "No bench staffing and no rotating juniors onto the account after the contract is signed. Everyone we put on a client project has built and operated production systems before.",
    },
    {
      title: "Standards are written down, not implied",
      body: "Every change is reviewed by a second engineer, CI runs on every branch, and architectural decisions are recorded with the alternatives we rejected and why.",
    },
    {
      title: "A written update every Friday",
      body: "What shipped, what is blocked, and where the budget stands — in writing, weekly, with a working demo every second week. Nothing about an invoice should be a surprise.",
    },
    {
      title: "Security is part of the work, not a phase at the end",
      body: "Least-privilege access from day one, secrets in a managed store, dependency and secret scanning in CI, and work performed under your NDA and data processing agreement, in the regions you specify.",
    },
    {
      title: "You own everything we produce",
      body: "Code in your repositories, infrastructure in your cloud accounts, and documentation written for the engineer who takes over after us — whether that is your team or another supplier.",
    },
  ],
}

export const about = {
  eyebrow: "About",
  heading: `${company.name} is a software studio in İstanbul`,
  paragraphs: [
    "We started in 2019, after years of working inside product teams where good software was held up by process rather than by anything technical. The studio was built around a simple preference: small teams, direct access to the people making decisions, and responsibility for the system after it goes live.",
    "We are fourteen people, most of them engineers, working on a handful of projects at a time. We turn down work that would need more people than we have, and we say so early rather than staffing a project thinly and hoping.",
    "Our clients are mostly mid-sized companies in logistics, manufacturing, and B2B software — organizations with real operations, existing systems to integrate with, and good reason to care about what maintaining the software costs three years from now.",
  ],
  facts: [
    { label: "Founded", value: "2019" },
    { label: "Team", value: "14 people" },
    { label: "Based in", value: "İstanbul" },
    { label: "Working languages", value: "Turkish, English" },
  ],
}

export const contact = {
  eyebrow: "Contact",
  heading: "Tell us what you’re building or fixing",
  body: "If the project is a fit, we’ll set up a 45-minute call with the engineers who would actually work on it. If it isn’t, we’ll tell you and point you somewhere more suitable.",
  budgets: [
    "Not sure yet",
    "Under €25,000",
    "€25,000 – €75,000",
    "€75,000 – €150,000",
    "Over €150,000",
  ],
}
