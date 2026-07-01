"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ImageUploader from "@/components/image-uploader"

const CATEGORIES = [
  "Roupas",
  "Calcados",
  "Eletronicos",
  "Casa e Decoracao",
  "Alimentos",
  "Brinquedos",
  "Esportes",
  "Beleza",
  "Ferramentas",
  "Outros",
]

export default function NovoProdutoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (images.length === 0) {
      setError("Adicione pelo menos uma foto do produto.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          price: parseFloat(form.price),
          stock: form.stock !== "" ? parseInt(form.stock) : 0,
          category: form.category || undefined,
          images,
          imageUrl: images[0],
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erro ao cadastrar produto.")
        return
      }

      router.push("/dashboard/produtos")
    } catch {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Novo produto</h1>
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 underline hover:text-gray-700"
        >
          Voltar ao painel
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <ImageUploader images={images} onChange={setImages} />

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Titulo do produto *
          </label>
          <input
            type="text"
            name="title"
            required
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            placeholder="Ex: Camiseta polo masculina"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Descricao
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            placeholder="Detalhe o produto: tamanhos, cores, material..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Preco (R$) *
            </label>
            <input
              type="number"
              name="price"
              required
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="29.90"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Estoque
            </label>
            <input
              type="number"
              name="stock"
              min="0"
              value={form.stock}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Categoria
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
          >
            <option value="">Selecione...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
        >
          {loading ? "Salvando..." : "Cadastrar produto"}
        </button>
      </form>
    </div>
  )
}
