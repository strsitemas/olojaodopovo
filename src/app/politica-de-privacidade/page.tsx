import { PRIVACY_VERSION, COMPANY_NAME, DPO_EMAIL } from "@/lib/legal"

export const metadata = {
  title: "Política de Privacidade | " + COMPANY_NAME,
}

export default function PrivacidadePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-1">Política de Privacidade</h1>
      <p className="text-gray-400 mb-8">Versão {PRIVACY_VERSION} &mdash; Última atualização: 28 de junho de 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">1. Identificação do Controlador</h2>
        <p>{COMPANY_NAME} é operado por pessoa física com sede em Salto/SP, Brasil.</p>
        <p className="mt-2">Encarregado de Dados (DPO): <a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">2. Dados Coletados</h2>
        <p className="font-medium mt-2">Fornecidos pelo usuário:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Identificação: nome, e-mail, senha (armazenada em hash), foto de perfil</li>
          <li>Contato: telefone/WhatsApp (lojistas)</li>
          <li>Fiscal/Financeiro: CPF ou CNPJ, dados bancários (lojistas)</li>
          <li>Endereço: CEP, logradouro, cidade, estado (lojistas e compradores no checkout)</li>
        </ul>
        <p className="font-medium mt-3">Coletados automaticamente:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Endereço IP e logs de acesso</li>
          <li>Tipo de dispositivo, sistema operacional e navegador</li>
          <li>Páginas visitadas e ações realizadas</li>
          <li>Cookies e tecnologias similares</li>
        </ul>
        <p className="font-medium mt-3">De terceiros:</p>
        <ul className="list-disc ml-5 mt-1 space-y-1">
          <li>Perfil do Google (quando autenticado via Google OAuth)</li>
          <li>Dados de transação fornecidos pelo Pagar.me</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">3. Finalidades e Bases Legais</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Finalidade</th>
                <th className="border px-3 py-2 text-left">Base legal (LGPD)</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Criar e gerenciar contas", "Execução de contrato (art. 7º, V)"],
                ["Processar pedidos e pagamentos", "Execução de contrato (art. 7º, V)"],
                ["Repassar valores aos lojistas", "Execução de contrato (art. 7º, V)"],
                ["Prevenir fraudes e verificar identidade", "Legítimo interesse / Obrigação legal (art. 7º, II e IX)"],
                ["Cumprir obrigações fiscais", "Obrigação legal (art. 7º, II)"],
                ["Notificações transacionais", "Execução de contrato (art. 7º, V)"],
                ["Marketing e comunicações opcionais", "Consentimento (art. 7º, I)"],
                ["Registrar consentimentos (log de aceite)", "Legítimo interesse / Obrigação legal (art. 7º, II e IX)"],
                ["Melhorar a Plataforma", "Legítimo interesse (art. 7º, IX)"],
              ].map(([fin, base], i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="border px-3 py-2">{fin}</td>
                  <td className="border px-3 py-2 text-gray-500">{base}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">4. Compartilhamento de Dados</h2>
        <p>Os dados poderão ser compartilhados com:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Pagar.me:</strong> dados para processar transações e repasses financeiros</li>
          <li><strong>Provedores de infraestrutura:</strong> hospedagem e banco de dados, sob obrigação de confidencialidade</li>
          <li><strong>Autoridades públicas:</strong> quando exigido por lei ou ordem judicial</li>
          <li><strong>Lojistas:</strong> dados de entrega do comprador, estritamente para cumprimento do pedido</li>
        </ul>
        <p className="mt-3 font-medium">{COMPANY_NAME} não vende dados pessoais a terceiros.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">5. Retenção dos Dados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Categoria</th>
                <th className="border px-3 py-2 text-left">Prazo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Dados de conta ativa", "Enquanto a conta estiver ativa"],
                ["Dados de transações financeiras", "5 anos (obrigação fiscal)"],
                ["Logs de acesso", "6 meses (Marco Civil da Internet)"],
                ["Logs de consentimento", "5 anos"],
                ["Dados de conta encerrada", "5 anos após o encerramento"],
              ].map(([cat, prazo], i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="border px-3 py-2">{cat}</td>
                  <td className="border px-3 py-2 text-gray-500">{prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">6. Seus Direitos (art. 18 da LGPD)</h2>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Confirmação da existência de tratamento</li>
          <li>Acesso aos seus dados pessoais</li>
          <li>Correção de dados incompletos ou inexatos</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
          <li>Portabilidade dos dados a outro fornecedor</li>
          <li>Eliminação dos dados tratados com base no consentimento</li>
          <li>Informação sobre terceiros com quem os dados são compartilhados</li>
          <li>Revogação do consentimento a qualquer momento</li>
          <li>Oposição ao tratamento por legítimo interesse</li>
          <li>Revisão de decisões automatizadas</li>
        </ul>
        <p className="mt-3">Para exercer qualquer direito: <a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a>. Respondemos em até 15 dias úteis.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">7. Segurança</h2>
        <p>Adotamos senhas em hash (bcrypt), comunicações criptografadas (HTTPS/TLS), controle de acesso por função (RBAC) e registros de auditoria. Em caso de incidente relevante, notificaremos a ANPD e os usuários afetados nos prazos previstos na LGPD.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">8. Menores de Idade</h2>
        <p>A Plataforma não é destinada a menores de 18 anos. Caso identifiquemos dados de menor coletados sem consentimento dos responsáveis, procederemos à exclusão imediata.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">9. Encarregado de Dados (DPO)</h2>
        <p>Contato do DPO: <a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a></p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">10. Alterações desta Política</h2>
        <p>Alterações relevantes serão comunicadas com antecedência mínima de 15 dias. O uso continuado implica concordância com a nova versão.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">11. Legislação e Foro</h2>
        <p>Regida pela LGPD (Lei nº 13.709/2018) e demais leis brasileiras. Foro: comarca de Salto/SP.</p>
      </section>
    </div>
  )
}
