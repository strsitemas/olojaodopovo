"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StoreActions({ storeId, status }: { storeId: string; status: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function updateStatus(newStatus: string) {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/stores/${storeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error ?? "Erro ao atualizar loja.")
        return
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      {status !== "ACTIVE" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("ACTIVE")}
          className="text-xs px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
        >
          Aprovar
        </button>
      )}
      {status !== "SUSPENDED" && (
        <button
          disabled={loading}
          onClick={() => updateStatus("SUSPENDED")}
          className="text-xs px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
        >
          Suspender
        </button>
      )}
    </div>
  )
}
