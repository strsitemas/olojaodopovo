"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/lib/cart"
import Link from "next/link"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (items.length === 0) {
      setError("Seu carrinho esta vazio.")
      return
    }

    setLoading(true)
    console.log("[Checkout] Enviando pedido, itens:", items.length)

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          shippingAddress: form,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("[Checkout] Erro:", data.error)
        if (res.status === 401) {
          router.push("/login?redirect=/checkout")
          return
        }
        setError(data.error ?? "Erro ao criar pedido.")
        return
      }

      console.log("[Checkout] Pedido criado:", data.orderId)
      clearCart()
      router.push("/pedido/" + data.orderId + "/confirmacao")
    } catch (err) {
      console.error("[Checkout] Falha na requisicao:", err)
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50">
        <p className="text-gray-500">Seu carrinho esta vazio.</p>
        <Link href="/vitrine" className="rounded-md bg-gray-900 px-5 py-2 text-sm text-white hover:bg-gray-800">Ver produtos</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
          <Link href="/carrinho" className="text-sm text-gray-500 underline">Voltar ao carrinho</Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Finalizar compra</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">Dados de contato</h2>
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Nome completo *</label>
                    <input type="text" name="name" required value={form.name} onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Email *</label>
                      <input type="email" name="email" required value={form.email} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Telefone *</label>
                      <input type="tel" name="phone" required value={form.phone} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                        placeholder="(11) 99999-9999" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-base font-semibold text-gray-900">Endereco de entrega</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">CEP *</label>
                      <input type="text" name="zipCode" required value={form.zipCode} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                        placeholder="00000-000" maxLength={9} />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Estado *</label>
                      <input type="text" name="state" required value={form.state} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                        placeholder="SP" maxLength={2} />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Cidade *</label>
                    <input type="text" name="city" required value={form.city} onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Bairro *</label>
                    <input type="text" name="neighborhood" required value={form.neighborhood} onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className="mb-1 block text-sm font-medium text-gray-700">Rua *</label>
                      <input type="text" name="street" required value={form.street} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">Numero *</label>
                      <input type="text" name="number" required value={form.number} onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Complemento</label>
                    <input type="text" name="complement" value={form.complement} onChange={handleChange}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
                      placeholder="Apto, bloco, referencia..." />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
                {loading ? "Processando..." : "Confirmar pedido"}
              </button>
            </form>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm h-fit">
            <h2 className="mb-4 text-base font-semibold text-gray-900">Resumo do pedido</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-gray-600">
                  <span className="line-clamp-1 flex-1 pr-2">{item.title} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex justify-between font-bold text-gray-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              <p className="mt-2 text-xs text-gray-400">Frete a combinar com o vendedor.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
