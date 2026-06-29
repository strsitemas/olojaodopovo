"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

type Product = {
  id: string
  title: string
  price: number
  stock: number
  category: string | null
  imageUrl: string | null
  images: string[]
}

type Store = {
  id: string
  name: string
  slug: string
  description: string | null
  city: string
  state: string
  phone: string
  whatsapp: string | null
  products: Product[]
}

export default function LojaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/public/stores/" + slug)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setStore(data.store)
      })
      .catch(() => setError("Erro ao carregar loja."))
      .finally(() => setLoading(false))
  }, [slug])

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  function thumb(p: Product) {
    if (p.images && p.images.length > 0) return p.images[0]
    return p.imageUrl
  }

  if (loading) return <div className="px-6 py-20 text-center text-sm text-gray-400">Carregando...</div>
  if (error) return <div className="px-6 py-20 text-center text-sm text-red-500">{error}</div>
  if (!store) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
          <Link href="/vitrine" className="text-sm text-gray-500 underline">Ver todos os produtos</Link>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8 rounded-lg border bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{store.city}, {store.state}</p>
          {store.description && (
            <p className="mt-3 text-sm text-gray-600">{store.description}</p>
          )}
          <div className="mt-4 flex gap-4 text-sm">
            {store.whatsapp && (
              <a
                href={"https://wa.me/55" + store.whatsapp.replace(/\D/g, "")}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-600"
              >
                WhatsApp
              </a>
            )}
            <a href={"tel:" + store.phone} className="rounded-md border px-4 py-2 text-gray-700 hover:bg-gray-50">
              {store.phone}
            </a>
          </div>
        </div>

        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Produtos ({store.products.length})
        </h2>

        {store.products.length === 0 && (
          <p className="text-sm text-gray-400">Nenhum produto disponivel no momento.</p>
        )}

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {store.products.map((p) => (
            <Link
              key={p.id}
              href={"/vitrine/" + p.id}
              className="flex flex-col overflow-hidden rounded-lg border bg-white shadow-sm hover:shadow-md transition"
            >
              <div className="flex h-40 items-center justify-center bg-gray-100">
                {thumb(p) ? (
                  <img src={thumb(p)!} alt={p.title} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-3xl">&#128722;</span>
                )}
              </div>
              <div className="flex flex-1 flex-col p-3">
                <p className="mb-1 line-clamp-2 text-sm font-medium text-gray-900">{p.title}</p>
                <p className="mt-auto pt-2 text-base font-bold text-gray-900">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
