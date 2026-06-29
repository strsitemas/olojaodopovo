import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const role = (session.user as any).role
    if (role !== "SELLER" && role !== "ADMIN") return NextResponse.json({ error: "Sem permissao." }, { status: 403 })

    const userId = (session.user as any).id
    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store) return NextResponse.json({ error: "Crie uma loja antes de cadastrar produtos." }, { status: 400 })

    const body = await req.json()
    const { title, description, price, stock, category, imageUrl } = body

    if (!title || price === undefined || price === null)
      return NextResponse.json({ error: "Titulo e preco sao obrigatorios." }, { status: 400 })

    const parsedPrice = Number(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0)
      return NextResponse.json({ error: "Preco invalido." }, { status: 400 })

    const parsedStock = stock !== undefined ? Number(stock) : 0

    const product = await db.product.create({
      data: {
        title,
        description,
        price: parsedPrice,
        stock: parsedStock,
        category,
        imageUrl,
        storeId: store.id,
        status: parsedStock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
      },
    })

    return NextResponse.json({ id: product.id, title: product.title, status: product.status }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/products]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const userId = (session.user as any).id
    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store) return NextResponse.json({ products: [] })

    const products = await db.product.findMany({
      where: { storeId: store.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        price: true,
        stock: true,
        status: true,
        category: true,
        imageUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json({ products })
  } catch (error) {
    console.error("[GET /api/products]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}