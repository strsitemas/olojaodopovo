import { ReactNode } from "react"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import Link from "next/link"

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session?.user || (session.user as any).role !== "ADMIN") {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-6">
          <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
          <nav className="flex gap-4 text-sm">
            <Link href="/admin" className="text-gray-600 hover:text-gray-900">Visao geral</Link>
            <Link href="/admin/lojas" className="text-gray-600 hover:text-gray-900">Lojas</Link>
            <Link href="/admin/usuarios" className="text-gray-600 hover:text-gray-900">Usuarios</Link>
          </nav>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">{children}</div>
    </div>
  )
}
