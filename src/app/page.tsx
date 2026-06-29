"use client"
import { useEffect, useState, useCallback } from "react"
import Link from "next/link"

type Product = {
  id: string
  title: string
  price: number
  stock: number
  category: string | null
  imageUrl: string | null
  images: string[]
  store: { name: string; slug: string; city: string; state: string }
}

const CATEGORIES = [
  "Todos","Roupas","Calcados","Eletronicos","Casa e Decoracao",
  "Alimentos","Brinquedos","Esportes","Beleza","Ferramentas","Outros",
]

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("Todos")
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (category !== "Todos") params.set("category", category)
    params.set("page", String(page))
    fetch("/api/public/products?" + params.toString())
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? [])
        setPages(data.pages ?? 1)
        setTotal(data.total ?? 0)
      })
      .finally(() => setLoading(false))
  }, [search, category, page])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  function formatPrice(v: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v)
  }

  function thumb(p: Product) {
    if (p.images && p.images.length > 0) return p.images[0]
    return p.imageUrl
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Header ── */}
      <header className="border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <Link href="/" className="text-lg font-bold text-gray-900 whitespace-nowrap shrink-0">
            O Lojão do Povo
          </Link>
          <form onSubmit={handleSearch} className="flex flex-1 gap-0 max-w-2xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produtos..."
              className="flex-1 rounded-l-md border border-gray-300 border-r-0 px-4 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-r-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-700 whitespace-nowrap"
            >
              Buscar
            </button>
          </form>
          <div className="flex items-center gap-4 text-sm shrink-0">
            <Link href="/minha-conta/pedidos" className="text-gray-500 hover:text-gray-800 hidden md:block">
              Meus pedidos
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-gray-900">
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-md bg-gray-900 px-4 py-1.5 text-sm font-medium text-white hover:bg-gray-700"
            >
              Vender aqui
            </Link>
          </div>
        </div>
      </header>

      {/* ── Categorias ── */}
      <div className="bg-white border-b overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1) }}
              className={
                "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-colors " +
                (category === c
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* ── Conteúdo ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">{total} produto(s) encontrado(s)</p>
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="rounded-lg bg-gray-200 animate-pulse aspect-[3/4]" />
            ))}
          </div>
        )}

        {/* Vazio */}
        {!loading && products.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-gray-400 mb-4 text-sm">Nenhum produto encontrado.</p>
            <Link
              href="/cadastro"
              className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700"
            >
              Cadastrar minha loja
            </Link>
          </div>
        )}

        {/* Grid */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {products.map((p) => (
              <Link
                key={p.id}
                href={"/vitrine/" + p.id}
                className="flex flex-col bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-gray-300 transition-all"
              >
                {/* Imagem — quadrada, sem corte */}
                <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                  {thumb(p) ? (
                    <img
                      src={thumb(p)!}
                      alt={p.title}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-4xl">🛒</span>
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5 flex flex-col gap-1 flex-1">
                  <p className="text-xs font-medium text-gray-900 line-clamp-2 leading-snug min-h-[32px]">
                    {p.title}
                  </p>
                  <p className="text-[10px] text-gray-400 truncate">
                    {p.store.name} · {p.store.city}/{p.store.state}
                  </p>
                  <p className="mt-auto text-sm font-bold text-gray-900 pt-1">
                    {formatPrice(p.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Paginação */}
        {pages > 1 && (
          <div className="mt-10 flex justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Anterior
            </button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={
                  "rounded-md border px-4 py-2 text-sm " +
                  (n === page ? "bg-gray-900 text-white border-gray-900" : "hover:bg-gray-100")
                }
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="rounded-md border px-4 py-2 text-sm disabled:opacity-40 hover:bg-gray-100"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
