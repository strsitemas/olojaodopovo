import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 })
    }

    const { id } = await params
    const { status } = await req.json()
    const allowed = ["PENDING", "ACTIVE", "SUSPENDED"]
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: "Status invalido." }, { status: 400 })
    }

    const store = await db.store.update({
      where: { id },
      data: { status },
    })

    console.log("[PATCH /api/admin/stores]", store.id, "->", status)
    return NextResponse.json({ store })
  } catch (error) {
    console.error("[PATCH /api/admin/stores]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
