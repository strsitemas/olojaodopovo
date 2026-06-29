import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"
import { TERMS_VERSION, PRIVACY_VERSION } from "@/lib/legal"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role, acceptTerms } = body

    if (!name || !email || !password)
      return NextResponse.json({ error: "Nome, email e senha sao obrigatorios." }, { status: 400 })

    if (password.length < 8)
      return NextResponse.json({ error: "Senha precisa ter no minimo 8 caracteres." }, { status: 400 })

    if (!acceptTerms)
      return NextResponse.json(
        { error: "E necessario aceitar os Termos de Uso e a Politica de Privacidade." },
        { status: 400 }
      )

    const validRoles = ["CUSTOMER", "SELLER"]
    const userRole = validRoles.includes(role) ? role : "CUSTOMER"

    const existing = await db.user.findUnique({ where: { email } })
    if (existing)
      return NextResponse.json({ error: "Este email ja esta cadastrado." }, { status: 409 })

    const hash = await bcrypt.hash(password, 12)

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      null
    const userAgent = req.headers.get("user-agent")

    const user = await db.user.create({
      data: { name, email, password: hash, role: userRole },
    })

    await db.consentLog.createMany({
      data: [
        {
          userId: user.id,
          type: "TERMS",
          version: TERMS_VERSION,
          accepted: true,
          ipAddress,
          userAgent,
        },
        {
          userId: user.id,
          type: "PRIVACY",
          version: PRIVACY_VERSION,
          accepted: true,
          ipAddress,
          userAgent,
        },
      ],
    })

    console.log("[POST /api/register] Usuario criado com consentimento registrado:", user.id)
    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/register]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
