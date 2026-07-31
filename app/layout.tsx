import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"
import Header from "@/components/site/Header"
import Footer from "@/components/site/Footer"
import { AuthProvider } from "@/lib/auth-context"
import { company } from "@/lib/site-content"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono-face",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const description =
  "Shift Orbit is a software engineering studio in İstanbul. We design, build, and operate custom platforms, internal tools, and the APIs between them — from discovery through to production support."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name} — Software engineering studio`,
    template: `%s — ${company.name}`,
  },
  description,
  keywords: [
    "software development company",
    "custom software development",
    "product engineering",
    "internal tools",
    "software studio İstanbul",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: company.name,
    title: `${company.name} — Software engineering studio`,
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${company.name} — Software engineering studio`,
    description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/logo.png" },
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: company.name,
  legalName: company.legalName,
  description,
  url: siteUrl,
  email: company.email,
  telephone: company.phone,
  foundingDate: String(company.founded),
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.street,
    addressLocality: company.address.locality,
    addressCountry: "TR",
  },
  areaServed: ["TR", "EU", "GB"],
  knowsLanguage: ["tr", "en"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-ink focus:px-4 focus:py-2 focus:text-[0.875rem] focus:text-white"
        >
          Skip to content
        </a>
        <AuthProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </AuthProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </body>
    </html>
  )
}
