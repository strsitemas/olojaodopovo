"use client"

import { useCart } from "@/lib/cart"
import Link from "next/link"

export default function CarrinhoPage() {
  const { items, total, removeItem, updateQuantity, clearCart } = useCart()

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
          <Link href="/vitrine" className="text-sm text-gray-500 underline">Continuar comprando</Link>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Carrinho</h1>

        {items.length === 0 && (
          <div className="rounded-lg border border-dashed border-gray-300 py-20 text-center">
            <p className="mb-4 text-gray-500">Seu carrinho esta vazio.</p>
            <Link href="/vitrine"
              className="inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Ver produtos
            </Link>
          </div>
        )}

        {items.length > 0 && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 rounded-lg border bg-white p-4 shadow-sm">
                  <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-md bg-gray-100 overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-2xl">&#128722;</span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-400">{item.storeName}</p>
                    <p className="mt-1 text-sm font-bold text-gray-900">{formatPrice(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50">-</button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded border text-gray-600 hover:bg-gray-50">+</button>
                      <button onClick={() => removeItem(item.id)}
                        className="ml-auto text-xs text-red-500 hover:underline">Remover</button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={clearCart}
                className="text-xs text-gray-400 hover:text-red-500 hover:underline">Limpar carrinho</button>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm h-fit">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Resumo</h2>
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
              </div>
              <Link href="/checkout"
                className="mt-6 block rounded-md bg-gray-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-gray-800">
                Finalizar compra
              </Link>
              <Link href="/vitrine"
                className="mt-2 block text-center text-xs text-gray-400 hover:underline">Continuar comprando</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
