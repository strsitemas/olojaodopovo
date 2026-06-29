import { COOKIES_VERSION, COMPANY_NAME, DPO_EMAIL } from "@/lib/legal"

export const metadata = {
  title: "Política de Cookies | " + COMPANY_NAME,
}

export default function CookiesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-1">Política de Cookies</h1>
      <p className="text-gray-400 mb-8">Versão {COOKIES_VERSION} &mdash; Última atualização: 28 de junho de 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">1. O que são Cookies?</h2>
        <p>Cookies são pequenos arquivos de texto armazenados no seu dispositivo quando você acessa um site. Permitem que o site reconheça seu dispositivo em visitas subsequentes e armazene preferências.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">2. Como o {COMPANY_NAME} usa Cookies</h2>
        <p>Utilizamos cookies para manter sua sessão autenticada, lembrar itens do carrinho, registrar preferências de consentimento, analisar desempenho da Plataforma e garantir a segurança das transações.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">3. Categorias de Cookies</h2>

        <p className="font-medium mt-3">3.1 Estritamente Necessários (sem necessidade de consentimento)</p>
        <div className="overflow-x-auto mt-2">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Cookie</th>
                <th className="border px-3 py-2 text-left">Finalidade</th>
                <th className="border px-3 py-2 text-left">Duração</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["next-auth.session-token", "Mantém a sessão autenticada", "Sessão / 30 dias"],
                ["next-auth.csrf-token", "Proteção contra ataques CSRF", "Sessão"],
                ["next-auth.callback-url", "URL de retorno após login", "Sessão"],
                ["cart (localStorage)", "Itens no carrinho de compras", "Até ser limpo"],
                ["consent_preferences", "Preferências de cookies aceitas", "1 ano"],
              ].map(([c, f, d], i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="border px-3 py-2 font-mono text-xs">{c}</td>
                  <td className="border px-3 py-2">{f}</td>
                  <td className="border px-3 py-2 text-gray-500">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-medium mt-5">3.2 Analíticos (requerem consentimento)</p>
        <p className="mt-1">Logs de acesso do servidor são usados de forma agregada para análise de tráfego e desempenho (retenção: 6 meses). No momento, a Plataforma não utiliza ferramentas de analytics de terceiros como Google Analytics.</p>

        <p className="font-medium mt-5">3.3 Marketing e Publicidade</p>
        <p className="mt-1">No momento, {COMPANY_NAME} não utiliza cookies de marketing ou rastreamento publicitário de terceiros.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">4. Cookies de Terceiros</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Serviço</th>
                <th className="border px-3 py-2 text-left">Finalidade</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-3 py-2">Google OAuth</td>
                <td className="border px-3 py-2">Autenticação via conta Google</td>
              </tr>
              <tr className="bg-gray-50">
                <td className="border px-3 py-2">Pagar.me</td>
                <td className="border px-3 py-2">Processamento seguro de pagamentos</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">5. Como Gerenciar Cookies</h2>
        <p>Você pode configurar seu navegador para bloquear ou excluir cookies:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Chrome:</strong> Configurações → Privacidade e segurança → Cookies</li>
          <li><strong>Firefox:</strong> Configurações → Privacidade e segurança → Cookies</li>
          <li><strong>Safari:</strong> Preferências → Privacidade → Cookies</li>
          <li><strong>Edge:</strong> Configurações → Cookies e permissões do site</li>
        </ul>
        <p className="mt-3 text-gray-500">Atenção: bloquear cookies estritamente necessários pode impedir o funcionamento correto da Plataforma (login, carrinho, checkout).</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">6. Consentimento e Revogação</h2>
        <p>Ao clicar em &quot;Aceitar todos os cookies&quot; no banner, você consente com cookies analíticos. Você pode revogar a qualquer momento via configurações de cookies no rodapé da Plataforma ou em contato com: <a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a>.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">7. Contato</h2>
        <p><a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a></p>
      </section>
    </div>
  )
}
