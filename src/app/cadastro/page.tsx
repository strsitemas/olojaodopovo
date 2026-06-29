"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function CadastroPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "CUSTOMER",
    acceptTerms: false,
  })

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const target = e.target
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm({ ...form, [target.name]: target.checked })
      return
    }
    setForm({ ...form, [target.name]: target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("As senhas nao coincidem.")
      return
    }

    if (form.password.length < 8) {
      setError("A senha precisa ter no minimo 8 caracteres.")
      return
    }

    if (!form.acceptTerms) {
      setError("Voce precisa aceitar os Termos de Uso e a Politica de Privacidade.")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
          acceptTerms: form.acceptTerms,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? "Erro ao criar conta.")
        setLoading(false)
        return
      }

      router.push("/login?cadastro=sucesso")
    } catch {
      setError("Erro de conexao. Tente novamente.")
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="mb-6 text-sm text-gray-500">Cadastre-se no Lojao do Povo</p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Nome completo</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Senha</label>
            <input
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="Minimo 8 caracteres"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Confirmar senha</label>
            <input
              type="password"
              name="confirmPassword"
              required
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
              placeholder="Repita a senha"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Quero me cadastrar como</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none"
            >
              <option value="CUSTOMER">Cliente (quero comprar)</option>
              <option value="SELLER">Lojista (quero vender)</option>
            </select>
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              name="acceptTerms"
              id="acceptTerms"
              checked={form.acceptTerms}
              onChange={handleChange}
              className="mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="acceptTerms" className="text-xs text-gray-600">
              Li e concordo com os{" "}
              <Link href="/termos-de-uso" target="_blank" className="underline font-medium text-gray-800">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link href="/politica-de-privacidade" target="_blank" className="underline font-medium text-gray-800">
                Politica de Privacidade
              </Link>
              , incluindo o tratamento dos meus dados conforme a LGPD.
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || !form.acceptTerms}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Ja tem conta?{" "}
          <Link href="/login" className="font-medium text-gray-900 underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  )
}
