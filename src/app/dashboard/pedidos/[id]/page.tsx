"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Order = {
  id: string
  status: string
  paymentMethod: string | null
  totalAmount: number
  createdAt: string
  paidAt: string | null
  shippingAddress: any
  buyer: { name: string | null; email: string }
  orderItems: {
    id: string
    quantity: number
    unitPrice: number
    product: { title: string }
    store: { name: string }
  }[]
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:          { label: "Aguardando pagamento", color: "bg-yellow-100 text-yellow-700" },
  AWAITING_PAYMENT: { label: "Pix gerado",           color: "bg-yellow-100 text-yellow-700" },
  PAID:             { label: "Pago",                 color: "bg-green-100 text-green-700" },
  PROCESSING:       { label: "Em processamento",     color: "bg-blue-100 text-blue-700" },
  SHIPPED:          { label: "Enviado",              color: "bg-blue-100 text-blue-700" },
  DELIVERED:        { label: "Entregue",             color: "bg-green-100 text-green-700" },
  CANCELLED:        { label: "Cancelado",            color: "bg-red-100 text-red-700" },
  PAYMENT_FAILED:   { label: "Pagamento recusado",   color: "bg-red-100 text-red-700" },
}

const NEXT_STATUS: Record<string, { label: string; next: string }> = {
  PAID:       { label: "Marcar como Em processamento", next: "PROCESSING" },
  PROCESSING: { label: "Marcar como Enviado",          next: "SHIPPED" },
  SHIPPED:    { label: "Marcar como Entregue",         next: "DELIVERED" },
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}
function formatDate(d: string) {
  return new Date(d).toLocaleString("pt-BR")
}

export default function DashboardPedidoDetalhePage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  function loadOrder() {
    setLoading(true)
    fetch("/api/dashboard/orders/" + id)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setOrder(data.order)
      })
      .catch(() => setError("Erro ao carregar pedido."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { loadOrder() }, [id])

  async function handleUpdateStatus(nextStatus: string) {
    setUpdating(true)
    setError("")
    setSuccessMsg("")
    try {
      const res = await fetch("/api/dashboard/orders/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao atualizar."); return }
      setSuccessMsg("Status atualizado com sucesso!")
      loadOrder()
    } catch {
      setError("Erro de conexao.")
    } finally {
      setUpdating(false)
    }
  }

  async function handleConfirmPayment() {
    if (!confirm("Confirmar que o pagamento via PIX foi recebido? O cliente recebera um e-mail automatico.")) return
    setConfirming(true)
    setError("")
    setSuccessMsg("")
    try {
      const res = await fetch("/api/dashboard/orders/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmPayment: true }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao confirmar."); return }
      setSuccessMsg("Pagamento confirmado! E-mail enviado ao cliente.")
      loadOrder()
    } catch {
      setError("Erro de conexao.")
    } finally {
      setConfirming(false)
    }
  }

  if (loading) return <div className="px-6 py-20 text-center text-sm text-gray-400">Carregando...</div>
  if (error && !order) return <div className="px-6 py-20 text-center text-sm text-red-500">{error}</div>
  if (!order) return null

  const st = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" }
  const nextAction = NEXT_STATUS[order.status]
  const addr = order.shippingAddress

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/dashboard/pedidos" className="text-sm text-gray-500 hover:text-gray-700">&larr; Voltar aos pedidos</Link>
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">Painel</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Pedido #{order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-medium ${st.color}`}>{st.label}</span>
        </div>

        {error && <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
        {successMsg && <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">{successMsg}</div>}

        {order.status === "PENDING" && (
          <div className="rounded-xl border-2 border-green-200 bg-green-50 p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-green-900">Pagamento via PIX recebido?</p>
                <p className="text-xs text-green-700 mt-1">
                  Clique no botao apos confirmar o recebimento do PIX pelo WhatsApp.
                  O cliente recebera um e-mail automatico de confirmacao.
                </p>
              </div>
              <button
                onClick={handleConfirmPayment}
                disabled={confirming}
                className="shrink-0 rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 transition"
              >
                {confirming ? "Confirmando..." : "Pagamento confirmado"}
              </button>
            </div>
          </div>
        )}

        {nextAction && (
          <div className="rounded-xl border bg-white p-5 shadow-sm flex items-center justify-between">
            <p className="text-sm text-gray-600">Proxima etapa do pedido</p>
            <button onClick={() => handleUpdateStatus(nextAction.next)} disabled={updating}
              className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition">
              {updating ? "Atualizando..." : nextAction.label}
            </button>
          </div>
        )}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Comprador</h2>
          <p className="text-sm text-gray-700">{order.buyer.name ?? "-"}</p>
          <p className="text-sm text-gray-500">{order.buyer.email}</p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">Itens</h2>
          <div className="space-y-2">
            {order.orderItems.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">{item.product.title} <span className="text-gray-400">x{item.quantity}</span></span>
                <span className="text-gray-700">{formatPrice(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t pt-3 flex justify-between font-bold text-gray-900 text-sm">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Endereco de entrega</h2>
          {addr ? (
            <>
              <p className="text-sm text-gray-700 font-medium">{addr.name}</p>
              <p className="text-sm text-gray-600">{addr.street}, {addr.number}{addr.complement ? ", " + addr.complement : ""}</p>
              <p className="text-sm text-gray-600">{addr.neighborhood} - {addr.city}/{addr.state}</p>
              <p className="text-sm text-gray-600">CEP: {addr.zipCode}</p>
            </>
          ) : (
            <p className="text-sm text-gray-400">Endereco nao informado.</p>
          )}
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-gray-900">Pagamento</h2>
          <p className="text-sm text-gray-600">Metodo: {order.paymentMethod ?? "Nao informado"}</p>
          {order.paidAt && <p className="text-sm text-gray-600">Pago em: {formatDate(order.paidAt)}</p>}
        </div>
      </div>
    </div>
  )
}
