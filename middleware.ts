import { NextResponse } from "next/server"

// Siteyi kapatmak için true, açmak için false yap
const MAINTENANCE_MODE = true

export function middleware() {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  return new NextResponse(null, { status: 503, statusText: "Service Unavailable" })
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
