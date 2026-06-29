import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user)
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })
    const userId = (session.user as any).id

    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store)
      return NextResponse.json({ error: "Loja nao encontrada." }, { status: 404 })

    // Busca orders que contenham itens da loja deste lojista
    const orders = await db.order.findMany({
      where: {
        orderItems: { some: { storeId: store.id } },
      },
      orderBy: { createdAt: "desc" },
      include: {
        buyer: { select: { name: true, email: true } },
        orderItems: {
          where: { storeId: store.id },
          include: {
            product: { select: { title: true } },
          },
        },
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[GET /api/dashboard/orders]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
