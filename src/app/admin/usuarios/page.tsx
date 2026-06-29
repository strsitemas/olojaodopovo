import { db } from "@/lib/db"

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      document: true,
      createdAt: true,
    },
  })

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Usuarios</h2>
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-left">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Cadastro</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t">
                <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                <td className="px-4 py-3 text-gray-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={
                      "px-2 py-1 rounded-full text-xs font-medium " +
                      (user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "SELLER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700")
                    }
                  >
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{user.document ?? "-"}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
