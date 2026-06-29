import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log("[GET /api/public/products/:id] id:", id)

    const product = await db.product.findFirst({
      where: { id, status: "ACTIVE" },
      include: {
        store: {
          select: {
            name: true,
            slug: true,
            city: true,
            state: true,
            phone: true,
            whatsapp: true,
          },
        },
      },
    })

    if (!product) {
      console.warn("[GET /api/public/products/:id] Nao encontrado:", id)
      return NextResponse.json({ error: "Produto nao encontrado." }, { status: 404 })
    }

    console.log("[GET /api/public/products/:id] Retornando:", product.title)
    return NextResponse.json({ product })
  } catch (error) {
    console.error("[GET /api/public/products/:id] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}