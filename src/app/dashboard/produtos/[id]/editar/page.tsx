"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"

const CATEGORIES = [
  "Roupas", "Calcados", "Eletronicos", "Casa e Decoracao",
  "Alimentos", "Brinquedos", "Esportes", "Beleza", "Ferramentas", "Outros",
]

export default function EditarProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const [novaUrl, setNovaUrl] = useState("")
  const [urlError, setUrlError] = useState("")

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [] as string[],
  })

  useEffect(() => {
    console.log("[EditarProduto] Carregando produto:", id)
    fetch("/api/products/" + id)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) {
          console.error("[EditarProduto] Erro ao carregar:", data.error)
          setError(data.error)
          return
        }
        console.log("[EditarProduto] Produto carregado:", data.product.title)
        const p = data.product
        const imgs = p.images && p.images.length > 0
          ? p.images
          : (p.imageUrl ? [p.imageUrl] : [])
        setForm({
          title: p.title ?? "",
          description: p.description ?? "",
          price: String(p.price ?? ""),
          stock: String(p.stock ?? "0"),
          category: p.category ?? "",
          images: imgs,
        })
      })
      .catch((err) => {
        console.error("[EditarProduto] Falha na requisicao:", err)
        setError("Erro ao carregar produto.")
      })
      .finally(() => setLoading(false))
  }, [id])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function adicionarImagem() {
    setUrlError("")
    const url = novaUrl.trim()
    if (!url) return
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setUrlError("URL invalida. Precisa comecar com http:// ou https://")
      return
    }
    if (form.images.includes(url)) {
      setUrlError("Essa imagem ja foi adicionada.")
      return
    }
    if (form.images.length >= 8) {
      setUrlError("Limite de 8 imagens por produto.")
      return
    }
    console.log("[EditarProduto] Adicionando imagem:", url)
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }))
    setNovaUrl("")
  }

  function removerImagem(index: number) {
    console.log("[EditarProduto] Removendo imagem index:", index)
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  function moverImagem(index: number, direcao: -1 | 1) {
    const novo = [...form.images]
    const alvo = index + direcao
    if (alvo < 0 || alvo >= novo.length) return
    ;[novo[index], novo[alvo]] = [novo[alvo], novo[index]]
    setForm((prev) => ({ ...prev, images: novo }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setSaving(true)
    console.log("[EditarProduto] Salvando produto:", id, "imagens:", form.images.length)
    try {
      const res = await fetch("/api/products/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description || undefined,
          price: parseFloat(form.price),
          stock: form.stock !== "" ? parseInt(form.stock) : 0,
          category: form.category || undefined,
          images: form.images,
          imageUrl: form.images[0] || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        console.error("[EditarProduto] Erro ao salvar:", data.error)
        setError(data.error ?? "Erro ao salvar.")
        return
      }
      console.log("[EditarProduto] Produto salvo com sucesso.")
      router.push("/dashboard/produtos")
    } catch (err) {
      console.error("[EditarProduto] Falha na requisicao:", err)
      setError("Erro de conexao.")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return
    setDeleting(true)
    console.log("[EditarProduto] Excluindo produto:", id)
    try {
      const res = await fetch("/api/products/" + id, { method: "DELETE" })
      if (!res.ok) {
        console.error("[EditarProduto] Erro ao excluir.")
        setError("Erro ao excluir.")
        return
      }
      console.log("[EditarProduto] Produto excluido.")
      router.push("/dashboard/produtos")
    } catch (err) {
      console.error("[EditarProduto] Falha ao excluir:", err)
      setError("Erro de conexao.")
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="px-6 py-10 text-sm text-gray-400">Carregando...</div>

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Editar produto</h1>
        <Link href="/dashboard/produtos" className="text-sm text-gray-500 underline hover:text-gray-700">
          Voltar
        </Link>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Titulo *</label>
          <input type="text" name="title" required value={form.title} onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Descricao</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Preco (R$) *</label>
            <input type="number" name="price" required min="0.01" step="0.01" value={form.price} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Estoque</label>
            <input type="number" name="stock" min="0" value={form.stock} onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Categoria</label>
          <select name="category" value={form.category} onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none">
            <option value="">Selecione...</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Fotos do produto
            <span className="ml-1 font-normal text-gray-400">({form.images.length}/8) — primeira e a capa</span>
          </label>

          {form.images.length > 0 && (
            <div className="mb-3 grid grid-cols-4 gap-2">
              {form.images.map((img, i) => (
                <div key={i} className="relative">
                  <img
                    src={img}
                    alt=""
                    className={"h-20 w-full rounded-md object-cover border-2 " +
                      (i === 0 ? "border-gray-900" : "border-gray-200")}
                    onError={(e) => {
                      console.warn("[EditarProduto] Imagem falhou ao carregar:", img)
                      ;(e.target as HTMLImageElement).src = ""
                    }}
                  />
                  {i === 0 && (
                    <span className="absolute left-1 top-1 rounded bg-gray-900 px-1 text-xs text-white">capa</span>
                  )}
                  <div className="mt-1 flex justify-between gap-1">
                    <button type="button" onClick={() => moverImagem(i, -1)} disabled={i === 0}
                      className="flex-1 rounded border text-xs py-0.5 disabled:opacity-30 hover:bg-gray-50">←</button>
                    <button type="button" onClick={() => moverImagem(i, 1)} disabled={i === form.images.length - 1}
                      className="flex-1 rounded border text-xs py-0.5 disabled:opacity-30 hover:bg-gray-50">→</button>
                    <button type="button" onClick={() => removerImagem(i)}
                      className="flex-1 rounded border border-red-200 text-xs py-0.5 text-red-500 hover:bg-red-50">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={novaUrl}
              onChange={(e) => setNovaUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); adicionarImagem() } }}
              placeholder="https://... cole a URL da imagem"
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            />
            <button type="button" onClick={adicionarImagem}
              className="rounded-md bg-gray-700 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600">
              Adicionar
            </button>
          </div>
          {urlError && <p className="mt-1 text-xs text-red-500">{urlError}</p>}
          <p className="mt-1 text-xs text-gray-400">Cole a URL e pressione Enter ou clique Adicionar. Use setas para reordenar.</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="flex-1 rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50">
            {saving ? "Salvando..." : "Salvar alteracoes"}
          </button>
          <button type="button" onClick={handleDelete} disabled={deleting}
            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50">
            {deleting ? "Excluindo..." : "Excluir"}
          </button>
        </div>
      </form>
    </div>
  )
}
