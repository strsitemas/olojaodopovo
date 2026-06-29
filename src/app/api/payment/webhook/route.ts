import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createHmac } from "crypto"

export async function POST(req: Request) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get("x-pagarme-signature") ?? ""
    const secret = process.env.PAGARME_WEBHOOK_SECRET ?? ""

    // Valida assinatura apenas se o secret estiver configurado
    if (secret) {
      const expected = createHmac("sha256", secret).update(rawBody).digest("hex")
      if (signature !== expected) {
        console.warn("[webhook] Assinatura invalida")
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    const body = JSON.parse(rawBody)
    console.log("[webhook] evento:", body.type)

    if (body.type === "order.paid") {
      const pagarmeOrderId = body.data?.id
      if (pagarmeOrderId) {
        await db.order.updateMany({
          where: { pagarmeOrderId },
          data: { status: "PAID", paidAt: new Date() },
        })
        console.log("[webhook] Pedido marcado como PAID:", pagarmeOrderId)
      }
    }

    if (body.type === "order.payment_failed") {
      const pagarmeOrderId = body.data?.id
      if (pagarmeOrderId) {
        await db.order.updateMany({
          where: { pagarmeOrderId },
          data: { status: "PAYMENT_FAILED" },
        })
        console.log("[webhook] Pedido marcado como PAYMENT_FAILED:", pagarmeOrderId)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("[webhook] ERRO:", error)
    return NextResponse.json({ error: "Erro interno." }, { status: 500 })
  }
}
