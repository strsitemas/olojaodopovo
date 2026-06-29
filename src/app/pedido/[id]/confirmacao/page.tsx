"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Order = {
  id: string
  status: string
  totalAmount: number
  createdAt: string
  shippingAddress: any
  orderItems: {
    id: string
    quantity: number
    unitPrice: number
    product: { title: string }
    store: { name: string }
  }[]
}

export default function ConfirmacaoPage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log("[Confirmacao] Carregando pedido:", id)
    fetch("/api/orders/" + id)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return }
        setOrder(data.order)
      })
      .catch(() => setError("Erro ao carregar pedido."))
      .finally(() => setLoading(false))
  }, [id])

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  if (loading) return <div className="px-6 py-20 text-center text-sm text-gray-400">Carregando...</div>
  if (error) return <div className="px-6 py-20 text-center text-sm text-red-500">{error}</div>
  if (!order) return null

  const addr = order.shippingAddress

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <div className="mb-8 rounded-lg border bg-white p-8 text-center shadow-sm">
          <div className="mb-4 text-5xl">&#9989;</div>
          <h1 className="text-2xl font-bold text-gray-900">Pedido confirmado!</h1>
          <p className="mt-2 text-sm text-gray-500">Pedido #{order.id.slice(-8).toUpperCase()}</p>
          <p className="mt-1 text-sm text-gray-400">Entre em contato com o vendedor para combinar o pagamento e entrega.</p>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Itens do pedido</h2>
            <div className="space-y-3">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{item.product.title}</p>
                    <p className="text-gray-400">{item.store.name} &middot; Qtd: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">{formatPrice(item.unitPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4 flex justify-between font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-gray-900">Endereco de entrega</h2>
            <p className="text-sm text-gray-600">{addr.name}</p>
            <p className="text-sm text-gray-600">{addr.street}, {addr.number} {addr.complement}</p>
            <p className="text-sm text-gray-600">{addr.neighborhood} — {addr.city}/{addr.state}</p>
            <p className="text-sm text-gray-600">CEP: {addr.zipCode}</p>
          </div>

          <div className="flex gap-3">
            {order.status === "PENDING" || order.status === "AWAITING_PAYMENT" ? (
              <Link href={`/pedido/${order.id}/pagamento`}
                className="flex-1 rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800">
                Ir para pagamento
              </Link>
            ) : null}
            <Link href="/vitrine"
              className="flex-1 rounded-md border px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
              Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
