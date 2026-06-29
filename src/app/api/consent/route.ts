import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user ? (session.user as any).id : null

    const { type, version, accepted, metadata } = await req.json()
    const allowedTypes = ["TERMS", "PRIVACY", "COOKIES"]
    if (!allowedTypes.includes(type) || !version) {
      return NextResponse.json({ error: "Dados de consentimento invalidos." }, { status: 400 })
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null
    const userAgent = req.headers.get("user-agent")

    const log = await db.consentLog.create({
      data: {
        userId,
        type,
        version,
        accepted: accepted ?? true,
        metadata: metadata ?? undefined,
        ipAddress,
        userAgent,
      },
    })

    console.log("[POST /api/consent]", type, version, "userId:", userId ?? "anonimo")
    return NextResponse.json({ ok: true, id: log.id }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/consent]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
