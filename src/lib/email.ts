import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendPaymentConfirmedEmail({
  buyerEmail,
  buyerName,
  orderId,
  orderItems,
  totalAmount,
  shippingAddress,
}: {
  buyerEmail: string
  buyerName: string | null
  orderId: string
  orderItems: { title: string; quantity: number; unitPrice: number }[]
  totalAmount: number
  shippingAddress: any
}) {
  const fmt = (v: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)

  const itemsHtml = orderItems
    .map(
      (i) => `
      <tr>
        <td style="padding:8px 0;color:#374151;font-size:14px;">${i.title} x${i.quantity}</td>
        <td style="padding:8px 0;color:#374151;font-size:14px;text-align:right;">${fmt(i.unitPrice * i.quantity)}</td>
      </tr>`
    )
    .join("")

  const addr = shippingAddress
  const addressHtml = addr
    ? `<p style="margin:4px 0;color:#6b7280;font-size:14px;">${addr.street}, ${addr.number}${addr.complement ? " " + addr.complement : ""}</p>
       <p style="margin:4px 0;color:#6b7280;font-size:14px;">${addr.neighborhood} — ${addr.city}/${addr.state}</p>
       <p style="margin:4px 0;color:#6b7280;font-size:14px;">CEP: ${addr.zipCode}</p>`
    : `<p style="color:#6b7280;font-size:14px;">Endereço não informado.</p>`

  const html = `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
  <body style="margin:0;padding:0;background:#f9fafb;font-family:sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:40px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06);">

          <!-- Header -->
          <tr><td style="background:#111827;padding:28px 40px;">
            <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;">O Lojão do Povo</h1>
          </td></tr>

          <!-- Body -->
          <tr><td style="padding:36px 40px;">
            <h2 style="margin:0 0 8px;color:#111827;font-size:18px;">Pagamento confirmado! 🎉</h2>
            <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
              Olá, ${buyerName ?? "cliente"}! Seu pagamento foi confirmado pelo lojista.
              Seu pedido está sendo preparado para envio.
            </p>

            <!-- Numero do pedido -->
            <div style="background:#f3f4f6;border-radius:8px;padding:12px 16px;margin-bottom:24px;">
              <p style="margin:0;font-size:13px;color:#6b7280;">Número do pedido</p>
              <p style="margin:4px 0 0;font-size:16px;font-weight:700;color:#111827;">#${orderId.slice(-8).toUpperCase()}</p>
            </div>

            <!-- Itens -->
            <h3 style="margin:0 0 12px;font-size:14px;font-weight:600;color:#111827;">Itens do pedido</h3>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e5e7eb;margin-bottom:8px;">
              ${itemsHtml}
              <tr style="border-top:1px solid #e5e7eb;">
                <td style="padding:12px 0;font-weight:700;color:#111827;font-size:14px;">Total</td>
                <td style="padding:12px 0;font-weight:700;color:#111827;font-size:14px;text-align:right;">${fmt(totalAmount)}</td>
              </tr>
            </table>

            <!-- Endereco -->
            <h3 style="margin:24px 0 8px;font-size:14px;font-weight:600;color:#111827;">Endereço de entrega</h3>
            ${addressHtml}

            <p style="margin:32px 0 0;color:#9ca3af;font-size:12px;">
              Este e-mail foi enviado automaticamente pelo O Lojão do Povo. Em caso de dúvidas, entre em contato com o lojista.
            </p>
          </td></tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  await resend.emails.send({
    from: "O Lojão do Povo <noreply@imobiliariaperto.com.br>",
    to: buyerEmail,
    subject: `Pagamento confirmado — Pedido #${orderId.slice(-8).toUpperCase()}`,
    html,
  })
}
