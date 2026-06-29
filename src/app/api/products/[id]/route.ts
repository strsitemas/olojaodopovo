import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log("[GET /api/products/:id] id:", id)
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const userId = (session.user as any).id
    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store) return NextResponse.json({ error: "Loja nao encontrada." }, { status: 404 })

    const product = await db.product.findFirst({
      where: { id, storeId: store.id },
    })
    if (!product) {
      console.warn("[GET /api/products/:id] Produto nao encontrado:", id)
      return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 })
    }
    console.log("[GET /api/products/:id] Retornando produto:", product.title)
    return NextResponse.json({ product })
  } catch (error) {
    console.error("[GET /api/products/:id] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log("[PATCH /api/products/:id] id:", id)
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const userId = (session.user as any).id
    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store) return NextResponse.json({ error: "Loja nao encontrada." }, { status: 404 })

    const product = await db.product.findFirst({
      where: { id, storeId: store.id },
    })
    if (!product) {
      console.warn("[PATCH /api/products/:id] Produto nao encontrado:", id)
      return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 })
    }

    const body = await req.json()
    const { title, description, price, stock, category, images, imageUrl } = body
    console.log("[PATCH /api/products/:id] Payload:", { title, price, stock, imagens: images?.length })

    if (!title || price === undefined || price === null)
      return NextResponse.json({ error: "Titulo e preco sao obrigatorios." }, { status: 400 })

    const parsedPrice = Number(price)
    if (isNaN(parsedPrice) || parsedPrice <= 0)
      return NextResponse.json({ error: "Preco invalido." }, { status: 400 })

    const parsedStock = stock !== undefined ? Number(stock) : product.stock
    const parsedImages = Array.isArray(images) ? images.filter((i: any) => typeof i === "string" && i.startsWith("http")) : []

    const updated = await db.product.update({
      where: { id },
      data: {
        title,
        description: description || null,
        price: parsedPrice,
        stock: parsedStock,
        category: category || null,
        images: parsedImages,
        imageUrl: imageUrl || parsedImages[0] || null,
        status: parsedStock > 0 ? "ACTIVE" : "OUT_OF_STOCK",
      },
    })
    console.log("[PATCH /api/products/:id] Atualizado:", updated.id, "imagens:", updated.images.length)
    return NextResponse.json({ product: updated })
  } catch (error) {
    console.error("[PATCH /api/products/:id] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    console.log("[DELETE /api/products/:id] id:", id)
    const session = await getServerSession(authOptions)
    if (!session?.user) return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })

    const userId = (session.user as any).id
    const store = await db.store.findFirst({ where: { ownerId: userId } })
    if (!store) return NextResponse.json({ error: "Loja nao encontrada." }, { status: 404 })

    const product = await db.product.findFirst({
      where: { id, storeId: store.id },
    })
    if (!product) {
      console.warn("[DELETE /api/products/:id] Produto nao encontrado:", id)
      return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 })
    }

    await db.product.delete({ where: { id } })
    console.log("[DELETE /api/products/:id] Produto excluido:", id)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[DELETE /api/products/:id] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
