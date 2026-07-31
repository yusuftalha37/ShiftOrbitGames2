import type { Metadata } from "next"
import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import StarField from "@/components/StarField"
import { AuthProvider } from "@/lib/auth-context"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Shift Orbit — Independent Game Studio",
  description: "We craft immersive gaming experiences from the stars. Shift Orbit is an independent game studio.",
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Shift Orbit",
    description: "Independent Game Studio",
    images: ["/logo.png"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="nebula-bg min-h-screen">
        <AuthProvider>
          <StarField />
          <Navbar />
          <main className="relative z-10">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
