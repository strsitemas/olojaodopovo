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

    const orders = await db.order.findMany({
      where: { buyerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        orderItems: {
          include: {
            product: { select: { title: true } },
            store: { select: { name: true } },
          },
        },
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[GET /api/orders]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}


const PLATFORM_FEE_RATE = 0.10 // 10% de taxa da plataforma

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user)
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })
    const userId = (session.user as any).id

    const { items, shippingAddress } = await req.json()

    if (!items || items.length === 0)
      return NextResponse.json({ error: "Carrinho vazio." }, { status: 400 })

    const productIds = items.map((i: any) => i.id)
    const products = await db.product.findMany({
      where: { id: { in: productIds } },
      include: { store: true },
    })

    if (products.length !== productIds.length)
      return NextResponse.json({ error: "Um ou mais produtos nao encontrados." }, { status: 400 })

    for (const item of items) {
      const product = products.find((p) => p.id === item.id)!
      if (product.stock < item.quantity)
        return NextResponse.json(
          { error: `Estoque insuficiente para "${product.title}". Disponivel: ${product.stock}` },
          { status: 400 }
        )
    }

    const totalAmount = items.reduce((acc: number, item: any) => {
      const product = products.find((p) => p.id === item.id)!
      return acc + Number(product.price) * item.quantity
    }, 0)

    const platformFee = parseFloat((totalAmount * PLATFORM_FEE_RATE).toFixed(2))

    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          buyerId: userId,
          totalAmount,
          platformFee,
          shippingAddress,
          status: "PENDING",
          orderItems: {
            create: items.map((item: any) => {
              const product = products.find((p) => p.id === item.id)!
              const unitPrice = Number(product.price)
              const itemTotal = unitPrice * item.quantity
              const commission = parseFloat((itemTotal * PLATFORM_FEE_RATE).toFixed(2))
              const sellerAmount = parseFloat((itemTotal - commission).toFixed(2))
              return {
                productId: product.id,
                storeId: product.storeId,
                quantity: item.quantity,
                unitPrice,
                commission,
                sellerAmount,
              }
            }),
          },
        },
      })

      for (const item of items) {
        await tx.product.update({
          where: { id: item.id },
          data: { stock: { decrement: item.quantity } },
        })
      }

      return newOrder
    })

    console.log("[POST /api/orders] Pedido criado:", order.id)
    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error("[POST /api/orders]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
