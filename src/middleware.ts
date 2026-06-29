import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const DASHBOARD_PREFIX = "/dashboard"
const ADMIN_PREFIX = "/admin"

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isDashboard = pathname.startsWith(DASHBOARD_PREFIX)
  const isAdmin = pathname.startsWith(ADMIN_PREFIX)

  if (!isDashboard && !isAdmin) {
    return NextResponse.next()
  }

  console.log("[middleware] Verificando acesso a rota protegida:", pathname)

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })

  if (!token) {
    console.warn("[middleware] Sem sessao. Redirecionando para /login.")
    const loginUrl = new URL("/login", req.url)
    loginUrl.searchParams.set("callbackUrl", pathname)
    return NextResponse.redirect(loginUrl)
  }

  const role = token.role as string | undefined

  if (isAdmin && role !== "ADMIN") {
    console.warn("[middleware] Acesso negado a /admin. Role:", role)
    const homeUrl = new URL("/", req.url)
    homeUrl.searchParams.set("erro", "acesso-negado")
    return NextResponse.redirect(homeUrl)
  }

  if (isDashboard && role !== "SELLER" && role !== "ADMIN") {
    console.warn("[middleware] Role sem permissao:", role, "Redirecionando para /.")
    const homeUrl = new URL("/", req.url)
    homeUrl.searchParams.set("erro", "acesso-negado")
    return NextResponse.redirect(homeUrl)
  }

  console.log("[middleware] Acesso permitido para role:", role)
  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
