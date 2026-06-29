"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type OrderItem = {
  id: string
  quantity: number
  unitPrice: number
  product: { title: string }
}

type Order = {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  buyer: { name: string | null; email: string }
  orderItems: OrderItem[]
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

function formatPrice(v: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })
}

export default function DashboardPedidosPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/dashboard/orders")
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
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-gray-900">Painel do lojista</Link>
          <Link href="/dashboard/produtos" className="text-sm text-gray-500 hover:text-gray-700">Produtos</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pedidos recebidos</h1>

        {loading && <p className="text-sm text-gray-400">Carregando...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {!loading && orders.length === 0 && (
          <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
            <p className="text-gray-400 text-sm">Nenhum pedido recebido ainda.</p>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => {
            const st = STATUS_LABEL[order.status] ?? { label: order.status, color: "bg-gray-100 text-gray-600" }
            const subtotal = order.orderItems.reduce((acc, i) => acc + i.unitPrice * i.quantity, 0)
            return (
              <div key={order.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                    <p className="text-xs text-gray-400">{formatDate(order.createdAt)}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.buyer.name ?? order.buyer.email}</p>
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
                  <span className="text-sm font-bold text-gray-900">{formatPrice(subtotal)}</span>
                  <Link href={"/dashboard/pedidos/" + order.id}
                    className="rounded-md border px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50">
                    Gerenciar
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
