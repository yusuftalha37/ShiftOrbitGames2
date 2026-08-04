import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maintenance — Shift Orbit",
  robots: { index: false, follow: false },
}

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background: "#0a0a0a",
        color: "#e5e5e5",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1.5rem" }}>🔧</div>
      <h1
        style={{
          fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        We&apos;ll be back soon
      </h1>
      <p
        style={{
          marginTop: "1rem",
          fontSize: "1.125rem",
          color: "#a3a3a3",
          maxWidth: "40ch",
          lineHeight: 1.6,
        }}
      >
        Shift Orbit is currently undergoing scheduled maintenance.
        We&apos;ll be back shortly.
      </p>
    </div>
  )
}
