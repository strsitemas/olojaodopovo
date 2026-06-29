import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params
    const store = await db.store.findUnique({
      where: { slug },
      include: {
        products: {
          where: { status: "ACTIVE" },
          orderBy: { createdAt: "desc" },
          select: {
            id: true, title: true, price: true,
            stock: true, category: true, imageUrl: true, images: true,
          },
        },
      },
    })
    if (!store) return NextResponse.json({ error: "Loja nao encontrada." }, { status: 404 })
    return NextResponse.json({ store })
  } catch (error) {
    console.error("[GET /api/public/stores/:slug]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
