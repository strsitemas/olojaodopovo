import { db } from "@/lib/db"
import StoreActions from "./store-actions"

export default async function AdminStoresPage() {
  const stores = await db.store.findMany({
    orderBy: { createdAt: "desc" },
    include: { owner: { select: { name: true, email: true } } },
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Lojas</h2>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Loja</th>
              <th className="px-4 py-3">Lojista</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Comissao</th>
              <th className="px-4 py-3">Acoes</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">{store.name}</td>
                <td className="px-4 py-3 text-gray-600">
                  {store.owner.name} <br />
                  <span className="text-xs text-gray-400">{store.owner.email}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "px-2 py-1 rounded-full text-xs font-medium " +
                      (store.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : store.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700")
                    }
                  >
                    {store.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{(store.commissionRate * 100).toFixed(0)}%</td>
                <td className="px-4 py-3">
                  <StoreActions storeId={store.id} status={store.status} />
                </td>
              </tr>
            ))}
            {stores.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-400">
                  Nenhuma loja cadastrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
