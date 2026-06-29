import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("[GET /api/orders/:id] id:", id)

    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const userId = (session.user as any).id

    const order = await db.order.findFirst({
      where: { id, buyerId: userId },
      include: {
        orderItems: {
          include: {
            product: { select: { title: true } },
            store: { select: { name: true } },
          },
        },
      },
    })

    if (!order) {
      console.warn("[GET /api/orders/:id] Pedido nao encontrado:", id)
      return NextResponse.json({ error: "Pedido nao encontrado." }, { status: 404 })
    }

    console.log("[GET /api/orders/:id] Retornando pedido:", order.id)
    return NextResponse.json({ order })
  } catch (error) {
    console.error("[GET /api/orders/:id] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
