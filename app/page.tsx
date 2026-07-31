"use client"
import Image from "next/image"
import { useEffect, useState } from "react"
import { team } from "@/lib/data"
import { getAllGames } from "@/lib/games"
import HomeGamesSection from "@/components/HomeGamesSection"

export default function Home() {
  const [gameCount, setGameCount] = useState<number | null>(null)

  useEffect(() => {
    getAllGames().then((g) => setGameCount(g.length))
  }, [])

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col justify-center px-6 overflow-hidden">
        {/* Background glow orbs */}
        <div className="absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }} />
        <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #06b6d4, transparent)" }} />
        <div className="absolute bottom-0 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-8 pointer-events-none"
          style={{ background: "radial-gradient(circle, #e879f9, transparent)" }} />

        {/* Horizontal grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(124,58,237,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-24 pb-16">
          {/* Split layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* LEFT — Logo */}
            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="float-anim relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-40"
                  style={{ background: "radial-gradient(circle, #7c3aed 0%, #06b6d4 60%, transparent 80%)", transform: "scale(1.3)" }} />
                {/* Logo container — pure black bg matches logo */}
                <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden glow-card"
                  style={{ background: "#000", border: "2px solid rgba(124,58,237,0.5)" }}>
                  <Image
                    src="/logo.png"
                    alt="Shift Orbit Logo"
                    fill
                    className="object-contain p-6"
                    priority
                  />
                </div>
                {/* Orbiting dot */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ animation: "orbit 8s linear infinite" }}>
                  <div className="absolute -top-1 left-1/2 w-3 h-3 rounded-full -translate-x-1/2"
                    style={{ background: "#06b6d4", boxShadow: "0 0 10px #06b6d4" }} />
                </div>
              </div>
            </div>

            {/* RIGHT — Text */}
            <div className="order-2 lg:order-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-widest uppercase"
                style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.4)", color: "#a78bfa" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                Independent Game Studio
              </div>

              <h1 className="font-black leading-none mb-6 tracking-tight" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
                <span className="block text-white">SHIFT</span>
                <span className="block shimmer-text">ORBIT</span>
              </h1>

              <p className="text-xl text-slate-300 mb-3 font-medium">
                Games That Take You Beyond the Stars
              </p>
              <p className="text-slate-500 max-w-lg mb-10 leading-relaxed lg:mx-0 mx-auto">
                We are a passionate independent studio building bold, universe-scale gaming experiences.
                Every orbit begins with a single shift.
              </p>

              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#games"
                  className="px-8 py-3.5 rounded-full font-semibold text-white transition-all hover:scale-105 hover:shadow-lg"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", boxShadow: "0 0 30px rgba(124,58,237,0.3)" }}>
                  Explore Our Games
                </a>
                <a href="#contact"
                  className="px-8 py-3.5 rounded-full font-semibold text-slate-300 border transition-all hover:scale-105 hover:text-white hover:border-purple-400"
                  style={{ borderColor: "rgba(124,58,237,0.4)" }}>
                  Get in Touch
                </a>
              </div>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-20 pt-8 grid grid-cols-2 md:grid-cols-4 gap-6"
            style={{ borderTop: "1px solid rgba(124,58,237,0.15)" }}>
            {[
              { value: gameCount === null ? "…" : String(gameCount), label: "Games" },
              { value: String(team.length), label: "Team Members" },
              { value: "2024", label: "Founded" },
              { value: "∞", label: "Passion" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl font-black shimmer-text mb-1">{stat.value}</div>
                <div className="text-xs text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 text-xs">
          <span className="tracking-widest">SCROLL</span>
          <div className="w-px h-8 bg-gradient-to-b from-purple-500 to-transparent" />
        </div>
      </section>

      {/* ─── GAMES ────────────────────────────────────────────── */}
      <HomeGamesSection />

      {/* ─── TEAM ─────────────────────────────────────────────── */}
      <section id="team" className="py-24 px-6" style={{ background: "rgba(13,13,31,0.5)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-3">The Crew</p>
            <h2 className="section-title text-white mb-4">Meet the Team</h2>
            <p className="text-slate-400 max-w-lg mx-auto">
              The minds behind the mission. We are a small but passionate crew building worlds from scratch.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="glass rounded-2xl p-8 text-center hover-lift w-64 flex flex-col items-center"
              >
                <div className="relative w-24 h-24 rounded-full overflow-hidden mb-5"
                  style={{ boxShadow: "0 0 0 2px rgba(124,58,237,0.6)" }}>
                  {member.photo ? (
                    <Image src={member.photo} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl"
                      style={{ background: "linear-gradient(135deg, #4c1d95, #1e40af)" }}>
                      👤
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-white text-lg mb-1">{member.name}</h3>
                <p className="text-sm text-purple-400 mb-5 font-medium">{member.role}</p>

                <div className="flex gap-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.4)", color: "#c4b5fd" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                  {member.customLink && (
                    <a
                      href={member.customLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: "rgba(6,182,212,0.15)", border: "1px solid rgba(6,182,212,0.3)", color: "#67e8f9" }}
                    >
                      {member.customLinkLabel || "Profile"}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CONTACT ──────────────────────────────────────────── */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-pink-400 text-sm font-semibold tracking-widest uppercase mb-3">Say Hello</p>
          <h2 className="section-title text-white mb-4">Contact Us</h2>
          <p className="text-slate-400 mb-12 leading-relaxed">
            Questions, press inquiries, collaboration ideas, or just want to share something about our games?
            We read every message.
          </p>

          <div className="glass rounded-2xl p-8 text-left space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
              <textarea
                rows={5}
                placeholder="Your message..."
                className="w-full px-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none focus:ring-2 focus:ring-purple-500 transition resize-none"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(124,58,237,0.3)" }}
              />
            </div>
            <button
              className="w-full py-3.5 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}
            >
              Send Message
            </button>

            <p className="text-center text-xs text-slate-600 mt-4">
              Or reach us directly at{" "}
              <a href="mailto:hello@shiftorbit.com" className="text-purple-400 hover:text-purple-300">
                hello@shiftorbit.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
