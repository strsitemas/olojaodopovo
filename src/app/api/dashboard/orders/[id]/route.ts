import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { sendPaymentConfirmedEmail } from "@/lib/email"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })

  const store = await db.store.findFirst({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json({ error: "Loja nao encontrada" }, { status: 404 })

  const order = await db.order.findFirst({
    where: { id: id, orderItems: { some: { storeId: store.id } } },
    include: {
      buyer: { select: { name: true, email: true } },
      orderItems: {
        where: { storeId: store.id },
        include: { product: { select: { title: true } }, store: { select: { name: true } } },
      },
    },
  })

  if (!order) return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 })
  return NextResponse.json({ order })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })

  const store = await db.store.findFirst({ where: { ownerId: session.user.id } })
  if (!store) return NextResponse.json({ error: "Loja nao encontrada" }, { status: 404 })

  const order = await db.order.findFirst({
    where: { id: id, orderItems: { some: { storeId: store.id } } },
    include: {
      buyer: { select: { name: true, email: true } },
      orderItems: {
        where: { storeId: store.id },
        include: { product: { select: { title: true } } },
      },
    },
  })

  if (!order) return NextResponse.json({ error: "Pedido nao encontrado" }, { status: 404 })

  const body = await req.json()
  const { status, confirmPayment } = body

  if (confirmPayment) {
    if (order.status !== "PENDING") {
      return NextResponse.json({ error: "Pedido nao esta pendente" }, { status: 400 })
    }

    const updated = await db.order.update({
      where: { id: id },
      data: { status: "PAID" },
    })

    try {
      await sendPaymentConfirmedEmail({
        buyerEmail: order.buyer.email,
        buyerName: order.buyer.name,
        orderId: order.id,
        orderItems: order.orderItems.map((i) => ({
          title: i.product.title,
          quantity: i.quantity,
          unitPrice: Number(i.unitPrice),
        })),
        totalAmount: Number(order.totalAmount),
        shippingAddress: order.shippingAddress,
      })
    } catch (e) {
      console.error("Erro ao enviar e-mail:", e)
    }

    return NextResponse.json({ order: updated })
  }

  const allowed = ["PROCESSING", "SHIPPED", "DELIVERED"]
  if (!allowed.includes(status)) {
    return NextResponse.json({ error: "Status invalido" }, { status: 400 })
  }

  const updated = await db.order.update({
    where: { id: id },
    data: { status },
  })

  return NextResponse.json({ order: updated })
}
