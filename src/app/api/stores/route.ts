import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
}

export async function POST(req: Request) {
  console.log("[POST /api/stores] Requisicao recebida.")

  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      console.warn("[POST /api/stores] Sem sessao ativa.")
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })
    }

    const role = (session.user as any).role
    if (role !== "SELLER" && role !== "ADMIN") {
      console.warn("[POST /api/stores] Role sem permissao:", role)
      return NextResponse.json(
        { error: "Apenas lojistas podem criar loja." },
        { status: 403 }
      )
    }

    const userId = (session.user as any).id

    const existingStore = await db.store.findFirst({
      where: { ownerId: userId },
    })

    if (existingStore) {
      console.warn("[POST /api/stores] Usuario ja tem loja:", existingStore.id)
      return NextResponse.json(
        { error: "Voce ja tem uma loja cadastrada." },
        { status: 409 }
      )
    }

    const body = await req.json()
    const { name, description, phone, whatsapp, city, state, zipCode, address } = body

    console.log("[POST /api/stores] Payload:", { name, city, state })

    if (!name || !phone || !city || !state || !zipCode) {
      console.warn("[POST /api/stores] Validacao falhou: campo obrigatorio ausente.")
      return NextResponse.json(
        { error: "Nome, telefone, cidade, estado e CEP sao obrigatorios." },
        { status: 400 }
      )
    }

    let slug = slugify(name)
    console.log("[POST /api/stores] Slug gerado:", slug)

    const slugExists = await db.store.findUnique({ where: { slug } })
    if (slugExists) {
      slug = `${slug}-${Date.now().toString().slice(-5)}`
      console.log("[POST /api/stores] Slug ja existia, ajustado para:", slug)
    }

    console.log("[POST /api/stores] Criando loja no banco...")
    const store = await db.store.create({
      data: {
        name,
        slug,
        description,
        phone,
        whatsapp,
        city,
        state,
        zipCode,
        address,
        ownerId: userId,
        status: "PENDING",
      },
    })

    console.log("[POST /api/stores] Loja criada com sucesso. ID:", store.id)

    return NextResponse.json(
      { id: store.id, slug: store.slug, status: store.status },
      { status: 201 }
    )
  } catch (error) {
    console.error("[POST /api/stores] ERRO:", error)
    return NextResponse.json(
      { error: "Erro interno ao criar loja. Tente novamente." },
      { status: 500 }
    )
  }
}