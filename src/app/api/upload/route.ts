import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { put } from "@vercel/blob"
import sharp from "sharp"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: "Nao autorizado" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato invalido. Use JPEG, PNG ou WebP." },
        { status: 400 }
      )
    }

    const maxSizeBytes = 8 * 1024 * 1024 // 8MB antes do processamento
    if (file.size > maxSizeBytes) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Maximo 8MB." },
        { status: 400 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    console.log("[Upload] Processando imagem:", file.name, "tamanho original:", file.size)

    const processedBuffer = await sharp(buffer)
      .resize(1200, 1200, {
        fit: "cover",
        position: "center",
      })
      .webp({ quality: 82 })
      .toBuffer()

    console.log("[Upload] Imagem processada, novo tamanho:", processedBuffer.length)

    const filename = `produtos/${session.user.id}-${Date.now()}.webp`

    const blob = await put(filename, processedBuffer, {
      access: "public",
      contentType: "image/webp",
    })

    console.log("[Upload] Upload concluido:", blob.url)

    return NextResponse.json({ url: blob.url })
  } catch (err) {
    console.error("[Upload] Erro ao processar upload:", err)
    return NextResponse.json(
      { error: "Erro ao processar a imagem." },
      { status: 500 }
    )
  }
}
