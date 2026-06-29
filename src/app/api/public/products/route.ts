import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = 24
    const skip = (page - 1) * limit

    const where: any = {
      status: "ACTIVE",
      store: { status: "ACTIVE" },
    }

    if (category) where.category = category
    if (search) where.title = { contains: search, mode: "insensitive" }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          price: true,
          stock: true,
          category: true,
          imageUrl: true,
          store: {
            select: { name: true, city: true, state: true },
          },
        },
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({ products, total, page, pages: Math.ceil(total / limit) })
  } catch (error) {
    console.error("[GET /api/public/products]", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}