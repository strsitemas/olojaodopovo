"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useCart } from "@/lib/cart"

type Product = {
  id: string
  title: string
  description: string | null
  price: number
  stock: number
  category: string | null
  imageUrl: string | null
  images: string[]
  storeId: string
  store: {
    name: string
    slug: string
    city: string
    state: string
    phone: string
    whatsapp: string | null
  }
}

export default function ProdutoDetalhePage() {
  const params = useParams()
  const id = params.id as string
  const { addItem, items } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [foto, setFoto] = useState(0)
  const [cartMsg, setCartMsg] = useState("")
  const [cartOk, setCartOk] = useState(false)

  useEffect(() => {
    console.log("[ProdutoDetalhe] Carregando produto:", id)
    fetch("/api/public/products/" + id)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { console.error("[ProdutoDetalhe] Erro:", data.error); setError(data.error); return }
        console.log("[ProdutoDetalhe] Produto carregado:", data.product.title)
        setProduct(data.product)
      })
      .catch((err) => { console.error("[ProdutoDetalhe] Falha:", err); setError("Erro ao carregar produto.") })
      .finally(() => setLoading(false))
  }, [id])

  const noCarrinho = items.find((i) => i.id === id)

  function handleAddToCart() {
    if (!product) return
    const result = addItem({
      id: product.id,
      title: product.title,
      price: Number(product.price),
      imageUrl: product.images?.[0] || product.imageUrl || null,
      storeId: product.storeId,
      storeName: product.store.name,
      stock: product.stock,
    })
    if (result.ok) {
      setCartOk(true)
      setCartMsg("Adicionado ao carrinho!")
    } else {
      setCartOk(false)
      setCartMsg(result.message ?? "Erro ao adicionar.")
    }
    setTimeout(() => setCartMsg(""), 3000)
  }

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  if (loading) return <div className="px-6 py-20 text-center text-sm text-gray-400">Carregando...</div>
  if (error) return <div className="px-6 py-20 text-center text-sm text-red-500">{error}</div>
  if (!product) return null

  const allImages = product.images && product.images.length > 0 ? product.images : (product.imageUrl ? [product.imageUrl] : [])
  const estoqueRestante = product.stock - (noCarrinho?.quantity ?? 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
          <div className="flex items-center gap-4">
            <Link href="/vitrine" className="text-sm text-gray-500 underline">Voltar a vitrine</Link>
            <Link href="/carrinho" className="relative text-sm font-medium text-gray-700 hover:text-gray-900">
              Carrinho
              {items.length > 0 && (
                <span className="ml-1 rounded-full bg-gray-900 px-1.5 py-0.5 text-xs text-white">
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <div className="overflow-hidden rounded-lg border bg-gray-100">
              {allImages.length > 0 ? (
                <img src={allImages[foto]} alt={product.title} className="h-80 w-full object-cover" />
              ) : (
                <div className="flex h-80 items-center justify-center text-5xl">&#128722;</div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {allImages.map((img, i) => (
                  <button key={i} onClick={() => setFoto(i)}
                    className={"h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 " +
                      (foto === i ? "border-gray-900" : "border-transparent")}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.category && (
              <span className="mb-2 text-xs font-medium uppercase text-gray-400">{product.category}</span>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
            <p className="mt-3 text-3xl font-bold text-gray-900">{formatPrice(Number(product.price))}</p>
            <p className="mt-1 text-sm text-gray-400">
              {product.stock > 0 ? (
                estoqueRestante > 0
                  ? product.stock + " em estoque"
                  : "Voce ja tem o maximo disponivel no carrinho"
              ) : "Sem estoque"}
            </p>

            {product.description && (
              <div className="mt-4 border-t pt-4">
                <h2 className="mb-2 text-sm font-semibold text-gray-700">Descricao</h2>
                <p className="whitespace-pre-line text-sm text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="mt-6 border-t pt-4">
              <h2 className="mb-2 text-sm font-semibold text-gray-700">Vendido por</h2>
              <Link href={"/lojas/" + product.store.slug}
                className="font-medium text-gray-900 underline hover:text-gray-700">
                {product.store.name}
              </Link>
              <p className="text-sm text-gray-400">{product.store.city}, {product.store.state}</p>
            </div>

            {cartMsg && (
              <div className={"mt-4 rounded-md px-4 py-2 text-sm " +
                (cartOk ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700")}>
                {cartMsg}
              </div>
            )}

            <div className="mt-4 flex flex-col gap-3">
              {product.stock > 0 && estoqueRestante > 0 ? (
                <button onClick={handleAddToCart}
                  className="rounded-md bg-gray-900 px-4 py-3 text-center font-medium text-white hover:bg-gray-800">
                  {noCarrinho ? "Adicionar mais um" : "Adicionar ao carrinho"}
                </button>
              ) : product.stock === 0 ? (
                <div className="rounded-md bg-gray-100 px-4 py-3 text-center text-sm text-gray-400">Produto sem estoque</div>
              ) : (
                <div className="rounded-md bg-yellow-50 px-4 py-3 text-center text-sm text-yellow-700">Maximo disponivel ja no carrinho</div>
              )}
              {noCarrinho && (
                <Link href="/carrinho"
                  className="rounded-md border border-gray-900 px-4 py-3 text-center text-sm font-medium text-gray-900 hover:bg-gray-50">
                  Ver carrinho ({noCarrinho.quantity} no carrinho)
                </Link>
              )}
              {product.store.whatsapp && (
                <a href={"https://wa.me/55" + product.store.whatsapp.replace(/\D/g, "") +
                    "?text=Ola!%20Tenho%20interesse%20no%20produto%3A%20" + encodeURIComponent(product.title)}
                  target="_blank" rel="noopener noreferrer"
                  className="rounded-md bg-green-500 px-4 py-3 text-center font-medium text-white hover:bg-green-600">
                  Comprar pelo WhatsApp
                </a>
              )}
              <Link href={"/lojas/" + product.store.slug}
                className="rounded-md border px-4 py-3 text-center text-sm font-medium text-gray-700 hover:bg-gray-50">
                Ver mais produtos desta loja
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
