import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect("/login")

  const userId = (session.user as any).id
  const userName = session.user.name

  const store = await db.store.findFirst({
    where: { ownerId: userId },
    include: { _count: { select: { products: true } } },
  })

  const statusLabels: Record<string, { label: string; color: string }> = {
    PENDING:   { label: "Pendente de aprovacao", color: "bg-yellow-100 text-yellow-800" },
    ACTIVE:    { label: "Ativa",                 color: "bg-green-100 text-green-800" },
    SUSPENDED: { label: "Suspensa",              color: "bg-red-100 text-red-800" },
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Ola, {userName}</h1>
          <p className="text-sm text-gray-500">Painel do lojista</p>
        </div>
        <Link href="/api/auth/signout" className="text-sm text-gray-500 underline hover:text-gray-700">Sair</Link>
      </div>

      {!store ? (
        <div className="rounded-lg border border-dashed border-gray-300 py-16 text-center">
          <p className="mb-4 text-gray-600">Voce ainda nao tem uma loja cadastrada.</p>
          <Link href="/dashboard/loja/nova"
            className="inline-block rounded-md bg-gray-900 px-5 py-2 text-sm font-medium text-white hover:bg-gray-800">
            Criar minha loja
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">{store.name}</h2>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusLabels[store.status]?.color ?? "bg-gray-100 text-gray-800"
              }`}>
                {statusLabels[store.status]?.label ?? store.status}
              </span>
            </div>
            <p className="text-sm text-gray-500">{store.city}, {store.state}</p>
            <p className="mt-2 text-sm text-gray-600">{store._count.products} produto(s) cadastrado(s)</p>
            {store.status === "PENDING" && (
              <div className="mt-4 rounded-md bg-yellow-50 px-4 py-2 text-sm text-yellow-800">
                Sua loja esta em analise. Voce ja pode cadastrar produtos enquanto aguarda a aprovacao,
                mas eles so aparecerao publicamente depois que a loja for ativada.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Link href="/dashboard/produtos"
              className="rounded-lg border bg-white p-4 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50">
              Ver meus produtos
            </Link>
            <Link href="/dashboard/produtos/novo"
              className="rounded-lg border bg-white p-4 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50">
              Cadastrar novo produto
            </Link>
            <Link href="/dashboard/pedidos"
              className="col-span-2 rounded-lg border bg-white p-4 text-sm font-medium text-gray-900 shadow-sm hover:bg-gray-50 flex items-center justify-between">
              <span>Pedidos recebidos</span>
              <span className="text-xs text-gray-400">Gerencie os pedidos da sua loja →</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
