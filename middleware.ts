import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Siteyi kapatmak için true, açmak için false yap
const MAINTENANCE_MODE = true

// Rate limiting: IP başına dakikada max istek sayısı
const RATE_LIMIT = 60
const WINDOW_MS = 60_000

const hits = new Map<string, { count: number; reset: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = hits.get(ip)

  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS })
    return false
  }

  entry.count++
  return entry.count > RATE_LIMIT
}

// Eski kayıtları temizle (bellek sızıntısını önle)
function cleanup() {
  const now = Date.now()
  for (const [ip, entry] of hits) {
    if (now > entry.reset) hits.delete(ip)
  }
}

let lastCleanup = 0

export function middleware(request: NextRequest) {
  // Bakım modu açıksa tüm istekleri engelle
  if (MAINTENANCE_MODE) {
    return new NextResponse(null, { status: 503, statusText: "Service Unavailable" })
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"

  // Her 5 dakikada eski kayıtları temizle
  const now = Date.now()
  if (now - lastCleanup > 300_000) {
    cleanup()
    lastCleanup = now
  }

  if (isRateLimited(ip)) {
    return new NextResponse("Too Many Requests", {
      status: 429,
      headers: { "Retry-After": "60" },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
