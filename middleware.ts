import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Siteyi kapatmak için true, açmak için false yap
const MAINTENANCE_MODE = true

export function middleware(request: NextRequest) {
  if (!MAINTENANCE_MODE) return NextResponse.next()

  const { pathname } = request.nextUrl
  if (pathname === "/maintenance" || pathname.startsWith("/_next") || pathname.startsWith("/logo.png") || pathname === "/favicon.ico") {
    return NextResponse.next()
  }

  const url = request.nextUrl.clone()
  url.pathname = "/maintenance"
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
