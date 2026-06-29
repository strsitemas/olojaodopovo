"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type OrderItem = {
  id: string
  quantity: number
  unitPrice: number
  product: { title: string }
  store: { name: string }
}

type Order = {
  id: string
  status: string
  paymentMethod: string | null
  totalAmount: number
  createdAt: string
  orderItems: OrderItem[]
}

const STATUS_LABEL: Record<string, { label: string; color: string }> = {
  PENDING:         { label: "Aguardando pagamento", color: "bg-yellow-100 text-yellow-700" },
  AWAITING_PAYMENT:{ label: "Pix gerado",           color: "bg-yellow-100 text-yellow-700" },
  PAID:            { label: "Pago",                 color: "bg-green-100 text-green-700" },
  PROCESSING:      { label: "Em processamento",     color: "bg-blue-100 text-blue-700" },
  SHIPPED:         { label: "Enviado",              color: "bg-blue-100 text-blue-700" },
  DELIVERED:       { label: "Entregue",             color: "bg-green-100 text-green-700" },
  CANCELLED:       { label: "Cancelado",            color: "bg-red-100 text-red-700" },
  PAYMENT_FAILED:  { label: "Pagamento recusado",   color: "bg-red-100 text-red-700" },
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function MeusPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/orders")
      .then(r => r.json())
      .then(data => {
        if (data.error) { setError(data.error); return }
        setOrders(data.orders)
      })
      .catch(() => setError("Erro ao carregar pedidos."))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
          <Link href="/vitrine" className="text-sm text-gray-500 hover:text-gray-700">Vitrine</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Meus pedidos</h1>

        {loading && <p className="text-sm text-gray-400">Carregando...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && orders.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">Voce ainda nao fez nenhum pedido.</p>
            <Link href="/vitrine" className="mt-4 inline-block text-sm font-medium text-gray-900 underline">Ver produtos</Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => {
            const st = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" }
            return (
              <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Pedido #{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${st.color}`}>{st.label}</span>
                </div>

                <div className="space-y-1 mb-4">
                  {order.orderItems.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.product.title} <span className="text-gray-400">x{item.quantity}</span></span>
                      <span className="text-gray-700">{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t pt-3">
                  <span className="text-sm font-bold text-gray-900">{formatPrice(order.totalAmount)}</span>
                  <div className="flex gap-2">
                    {(order.status === "PENDING" || order.status === "AWAITING_PAYMENT") && (
                      <Link href={"/pedido/" + order.id + "/pagamento"}
                        className="rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800">
                        Pagar
                      </Link>
                    )}
                    <Link href={"/pedido/" + order.id + "/confirmacao"}
                      className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                      Ver detalhes
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
