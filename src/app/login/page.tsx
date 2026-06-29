"use client"
import { useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn, getSession } from "next-auth/react"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const cadastroSucesso = searchParams.get("cadastro") === "sucesso"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ email: "", password: "" })
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    const result = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    })
    if (result?.error) {
      setError("Email ou senha invalidos.")
      setLoading(false)
      return
    }
    const session = await getSession()
    const role = (session?.user as any)?.role
    if (role === "ADMIN") {
      router.push("/admin")
    } else if (role === "SELLER") {
      router.push("/dashboard")
    } else {
      router.push("/")
    }
  }
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Entrar</h1>
        <p className="mb-6 text-sm text-gray-500">Acesse sua conta no Lojao do Povo</p>
        {cadastroSucesso && (
          <div className="mb-4 rounded-md bg-green-50 px-4 py-2 text-sm text-green-700">
            Conta criada com sucesso! Faca login para continuar.
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Sua senha"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Nao tem conta?{" "}
          <Link href="/cadastro" className="font-medium text-gray-900 underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-sm text-gray-400">Carregando...</p></div>}>
      <LoginForm />
    </Suspense>
  )
}
