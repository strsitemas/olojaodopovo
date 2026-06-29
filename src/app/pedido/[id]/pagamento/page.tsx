"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

type Method = "pix" | "credit_card"

export default function PagamentoPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [method, setMethod] = useState<Method>("pix")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [card, setCard] = useState({
    number: "", holderName: "", expMonth: "", expYear: "", cvv: "", installments: "1",
  })

  async function handlePagar() {
    setError("")
    setLoading(true)
    try {
      const body: any = { orderId: id, paymentMethod: method }
      if (method === "credit_card") {
        body.card = {
          number: card.number.replace(/\D/g, ""),
          holderName: card.holderName,
          expMonth: parseInt(card.expMonth),
          expYear: parseInt(card.expYear),
          cvv: card.cvv,
          installments: parseInt(card.installments),
        }
      }
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? "Erro ao processar pagamento."); return }
      if (method === "pix") {
        setPixData({ qrCode: data.pixQrCode, qrCodeUrl: data.pixQrCodeUrl })
      } else {
        router.push("/pedido/" + id + "/confirmacao")
      }
    } catch {
      setError("Erro de conexao. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    if (!pixData) return
    navigator.clipboard.writeText(pixData.qrCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Tela do QR Code Pix
  if (pixData) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-xl border shadow-sm p-8 text-center">
        <div className="text-4xl mb-3">⚡</div>
        <h1 className="text-xl font-bold text-gray-900 mb-1">Pague com Pix</h1>
        <p className="text-sm text-gray-500 mb-6">Escaneie o QR Code ou copie o codigo. Validade: 1 hora.</p>
        {pixData.qrCodeUrl && (
          <img src={pixData.qrCodeUrl} alt="QR Code Pix" className="mx-auto mb-5 w-48 h-48 rounded-lg border" />
        )}
        <div className="rounded-md bg-gray-100 px-3 py-2 text-xs text-gray-600 break-all mb-4 select-all">
          {pixData.qrCode}
        </div>
        <button onClick={handleCopy}
          className="w-full mb-3 rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
          {copied ? "Copiado!" : "Copiar codigo Pix"}
        </button>
        <Link href={"/pedido/" + id + "/confirmacao"}
          className="block text-sm text-gray-400 underline hover:text-gray-600">
          Ja paguei — ver confirmacao
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900">O Lojao do Povo</Link>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Pagamento</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {/* Seletor de metodo */}
        <div className="flex gap-3 mb-8">
          {(["pix", "credit_card"] as Method[]).map((m) => (
            <button key={m} onClick={() => setMethod(m)}
              className={`flex-1 rounded-lg border-2 py-3 text-sm font-medium transition ${
                method === m
                  ? "border-gray-900 bg-gray-900 text-white"
                  : "border-gray-200 text-gray-600 hover:border-gray-400"
              }`}>
              {m === "pix" ? "⚡ Pix" : "💳 Cartao de credito"}
            </button>
          ))}
        </div>

        {/* Formulario cartao */}
        {method === "credit_card" && (
          <div className="space-y-4 mb-8 rounded-xl border bg-white p-6 shadow-sm">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Numero do cartao</label>
              <input value={card.number}
                onChange={e => setCard(p => ({ ...p, number: e.target.value }))}
                placeholder="0000 0000 0000 0000" maxLength={19}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Nome no cartao</label>
              <input value={card.holderName}
                onChange={e => setCard(p => ({ ...p, holderName: e.target.value.toUpperCase() }))}
                placeholder="NOME SOBRENOME"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Mes</label>
                <input value={card.expMonth}
                  onChange={e => setCard(p => ({ ...p, expMonth: e.target.value }))}
                  placeholder="MM" maxLength={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Ano</label>
                <input value={card.expYear}
                  onChange={e => setCard(p => ({ ...p, expYear: e.target.value }))}
                  placeholder="AAAA" maxLength={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">CVV</label>
                <input value={card.cvv}
                  onChange={e => setCard(p => ({ ...p, cvv: e.target.value }))}
                  placeholder="123" maxLength={4}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Parcelas</label>
              <select value={card.installments}
                onChange={e => setCard(p => ({ ...p, installments: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-gray-500">
                {[1, 2, 3, 4, 5, 6, 12].map(n => (
                  <option key={n} value={n}>{n}x sem juros</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Info Pix */}
        {method === "pix" && (
          <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm text-center">
            <p className="text-4xl mb-3">⚡</p>
            <p className="text-sm text-gray-600">Apos clicar em pagar, um QR Code Pix sera gerado.</p>
            <p className="text-xs text-gray-400 mt-1">Validade: 1 hora</p>
          </div>
        )}

        <button onClick={handlePagar} disabled={loading}
          className="w-full rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50 transition">
          {loading ? "Processando..." : "Pagar agora"}
        </button>
      </div>
    </div>
  )
}
