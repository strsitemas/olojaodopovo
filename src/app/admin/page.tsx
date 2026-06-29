import { db } from "@/lib/db"

export default async function AdminOverviewPage() {
  const [storesByStatus, usersByRole, totalOrders, revenue] = await Promise.all([
    db.store.groupBy({ by: ["status"], _count: { _all: true } }),
    db.user.groupBy({ by: ["role"], _count: { _all: true } }),
    db.order.count(),
    db.order.aggregate({ _sum: { totalAmount: true } }),
  ])

  const getStoreCount = (status: string) =>
    storesByStatus.find((s) => s.status === status)?._count._all ?? 0

  const getUserCount = (role: string) =>
    usersByRole.find((u) => u.role === role)?._count._all ?? 0

  const totalRevenue = Number(revenue._sum.totalAmount ?? 0)

  const cards = [
    { label: "Lojas pendentes", value: getStoreCount("PENDING") },
    { label: "Lojas ativas", value: getStoreCount("ACTIVE") },
    { label: "Lojas suspensas", value: getStoreCount("SUSPENDED") },
    { label: "Clientes", value: getUserCount("CUSTOMER") },
    { label: "Lojistas", value: getUserCount("SELLER") },
    { label: "Pedidos totais", value: totalOrders },
  ]

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Visao geral</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white border rounded-lg p-5">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white border rounded-lg p-5">
        <p className="text-sm text-gray-500">Faturamento total (bruto)</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {totalRevenue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
        </p>
      </div>
    </div>
  )
}
