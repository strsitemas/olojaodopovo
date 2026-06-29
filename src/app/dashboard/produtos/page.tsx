"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type Product = {
  id: string
  title: string
  price: number
  stock: number
  status: string
  category: string | null
  imageUrl: string | null
  createdAt: string
}

const statusLabels: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Ativo", color: "bg-green-100 text-green-800" },
  OUT_OF_STOCK: { label: "Sem estoque", color: "bg-yellow-100 text-yellow-800" },
  INACTIVE: { label: "Inativo", color: "bg-gray-100 text-gray-600" },
}

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setProducts(data.products ?? [])
      })
      .catch(() => setError("Erro ao carregar produtos."))
      .finally(() => setLoading(false))
  }, [])

  function formatPrice(value: number) {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
  }

  function statusClass(status: string) {
    return statusLabels[status]?.color ?? "bg-gray-100 text-gray-600"
  }

  function statusLabel(status: string) {
    return statusLabels[status]?.label ?? status
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Meus produtos</h1>
          <p className="text-sm text-gray-500">{products.length} produto(s) cadastrado(s)</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard" className="text-sm text-gray-500 underline hover:text-gray-700">
            Painel
          </Link>
          <Link
            href="/dashboard/produtos/novo"
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + Novo produto
          </Link>
        </div>
      </div>

      {loading && <p className="text-sm text-gray-400">Carregando...</p>}

      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="mb-4 text-gray-500">Nenhum produto cadastrado ainda.</p>
          <Link
            href="/dashboard/produtos/novo"
            className="inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            Cadastrar primeiro produto
          </Link>
        </div>
      )}

      {!loading && products.length > 0 && (
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3">Produto</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Preco</th>
                <th className="px-4 py-3">Estoque</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.title}</td>
                  <td className="px-4 py-3 text-gray-500">{p.category ?? "—"}</td>
                  <td className="px-4 py-3 text-gray-700">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-gray-700">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={"rounded-full px-2 py-0.5 text-xs font-medium " + statusClass(p.status)}>
                      {statusLabel(p.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={"/dashboard/produtos/" + p.id + "/editar"}
                      className="text-xs text-gray-500 underline hover:text-gray-700"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
