import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import { pagarmePost } from "@/lib/pagarme"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user)
      return NextResponse.json({ error: "Nao autenticado." }, { status: 401 })
    const userId = (session.user as any).id

    const { orderId, paymentMethod, card } = await req.json()

    const order = await db.order.findFirst({
      where: { id: orderId, buyerId: userId },
      include: {
        orderItems: {
          include: { product: true, store: { include: { owner: true } } },
        },
      },
    })

    if (!order)
      return NextResponse.json({ error: "Pedido nao encontrado." }, { status: 404 })
    if (order.status !== "PENDING")
      return NextResponse.json({ error: "Pedido ja processado." }, { status: 400 })

    // Monta split por loja (so inclui lojas com recipientId cadastrado)
    const splitMap: Record<string, number> = {}
    for (const item of order.orderItems) {
      const rid = item.store.owner.pagarmeRecipientId
      if (!rid) continue
      splitMap[rid] = (splitMap[rid] ?? 0) + Math.round(Number(item.unitPrice) * Number(item.quantity) * 100)
    }
    const split = Object.entries(splitMap).map(([recipient_id, amount]) => ({
      recipient_id,
      amount,
      type: "flat",
      options: {
        charge_processing_fee: false,
        liable: true,
        charge_remainder_fee: false,
      },
    }))

    const totalCents = Math.round(order.totalAmount * 100)

    const pagarmeBody: any = {
      customer: {
        name: (session.user as any).name ?? "Cliente",
        email: session.user.email!,
        type: "individual",
      },
      items: order.orderItems.map((item) => ({
        amount: Math.round(item.unitPrice * 100),
        description: item.product.title,
        quantity: item.quantity,
        code: item.product.id,
      })),
      payments: [],
    }

    if (paymentMethod === "pix") {
      pagarmeBody.payments = [{
        payment_method: "pix",
        pix: { expires_in: 3600 },
        amount: totalCents,
        ...(split.length > 0 && { split }),
      }]
    } else {
      pagarmeBody.payments = [{
        payment_method: "credit_card",
        credit_card: {
          installments: card?.installments ?? 1,
          statement_descriptor: "LOJAO DO POVO",
          card: {
            number: card.number.replace(/\s/g, ""),
            holder_name: card.holderName,
            exp_month: Number(card.expMonth),
            exp_year: Number(card.expYear),
            cvv: card.cvv,
          },
        },
        amount: totalCents,
        ...(split.length > 0 && { split }),
      }]
    }

    const pagarmeOrder = await pagarmePost("/orders", pagarmeBody)
    console.log("[payment] Pagar.me order:", pagarmeOrder.id, pagarmeOrder.status)

    const charge = pagarmeOrder.charges?.[0]
    const lastTx = charge?.last_transaction

    const updateData: any = {
      paymentMethod,
      pagarmeOrderId: pagarmeOrder.id,
      pagarmeChargeId: charge?.id ?? null,
    }

    if (paymentMethod === "pix") {
      updateData.pixQrCode = lastTx?.qr_code ?? null
      updateData.pixQrCodeUrl = lastTx?.qr_code_url ?? null
      updateData.status = "AWAITING_PAYMENT"
    } else {
      updateData.status = pagarmeOrder.status === "paid" ? "PAID" : "PAYMENT_FAILED"
      if (updateData.status === "PAID") updateData.paidAt = new Date()
    }

    await db.order.update({ where: { id: orderId }, data: updateData })

    return NextResponse.json({
      success: true,
      status: updateData.status,
      pixQrCode: updateData.pixQrCode ?? null,
      pixQrCodeUrl: updateData.pixQrCodeUrl ?? null,
      pagarmeOrderId: pagarmeOrder.id,
    })
  } catch (error: any) {
    console.error("[payment] ERRO:", error.message)
    return NextResponse.json(
      { error: "Erro ao processar pagamento.", detail: error.message },
      { status: 500 }
    )
  }
}
