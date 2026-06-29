import { COMPANY_NAME } from "@/lib/legal"

export const metadata = {
  title: "Trocas, Devoluções e Reembolsos | " + COMPANY_NAME,
}

export default function TrocasPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-1">Política de Trocas, Devoluções e Reembolsos</h1>
      <p className="text-gray-400 mb-8">Versão 1.0 &mdash; Última atualização: 28 de junho de 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">1. Introdução</h2>
        <p>{COMPANY_NAME} atua como intermediador tecnológico entre compradores e lojistas independentes. Esta Política respeita integralmente o Código de Defesa do Consumidor (CDC — Lei nº 8.078/1990).</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">2. Direito de Arrependimento</h2>
        <p>Compras realizadas pela internet garantem ao comprador o direito de desistir em até <strong>7 dias corridos</strong> após o recebimento, sem necessidade de justificativa (art. 49 do CDC).</p>
        <p className="mt-2"><strong>Como exercer:</strong> acesse Minha Conta → Pedidos → Solicitar devolução, ou envie e-mail para contato@olojaodopovo.com.br com o número do pedido.</p>
        <p className="mt-2"><strong>Condições:</strong> produto em perfeito estado, sem uso, com embalagem original e nota fiscal. O frete de devolução é de responsabilidade do comprador, salvo quando o lojista disponibilizar etiqueta pré-paga.</p>
        <p className="mt-2"><strong>Reembolso:</strong> processado em até 10 dias úteis após recebimento e conferência do produto, na forma de pagamento original.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">3. Produto com Defeito ou Divergente</h2>
        <p>Prazos para reclamação:</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li><strong>Produtos não duráveis</strong> (alimentos, cosméticos): 30 dias após o recebimento</li>
          <li><strong>Produtos duráveis</strong> (eletrônicos, móveis, roupas): 90 dias após o recebimento</li>
        </ul>
        <p className="mt-3">Como solicitar: Minha Conta → Pedidos → Solicitar devolução → motivo "Produto com defeito" ou "Produto diferente do anunciado", com fotos ou vídeo comprobatórios.</p>
        <p className="mt-2">O lojista terá 3 dias úteis para se manifestar e poderá oferecer substituição, reparo (em até 30 dias) ou reembolso integral. O frete de devolução por defeito é responsabilidade do lojista.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">4. Produto Não Recebido</h2>
        <p>Se o produto não chegar no prazo, aguarde 3 dias úteis adicionais e verifique o rastreamento em Minha Conta → Pedidos. Se ainda não recebido, abra uma contestação em Minha Conta → Pedidos → Contestar entrega.</p>
        <p className="mt-2">Confirmado o extravio ou não entrega, o comprador receberá reembolso integral ou reenvio do produto.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">5. Cancelamento de Pedido</h2>
        <p><strong>Pelo comprador:</strong> possível enquanto o status for "Aguardando envio". Após o envio, aguarde a entrega e solicite devolução.</p>
        <p className="mt-2"><strong>Pelo lojista:</strong> em caso de falta de estoque, o lojista deve notificar imediatamente e garantir reembolso integral em até 5 dias úteis. Cancelamentos recorrentes podem resultar em suspensão da conta.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">6. Prazos de Reembolso</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse mt-2">
            <thead>
              <tr className="bg-gray-50">
                <th className="border px-3 py-2 text-left">Forma de pagamento</th>
                <th className="border px-3 py-2 text-left">Prazo estimado</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Pix", "Até 3 dias úteis após aprovação"],
                ["Cartão de crédito", "Até 2 faturas subsequentes (conforme a operadora)"],
                ["Cartão de débito", "Até 5 dias úteis após aprovação"],
              ].map(([forma, prazo], i) => (
                <tr key={i} className={i % 2 === 0 ? "" : "bg-gray-50"}>
                  <td className="border px-3 py-2">{forma}</td>
                  <td className="border px-3 py-2 text-gray-500">{prazo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">7. Produtos Excluídos</h2>
        <p>Não são elegíveis a troca ou devolução (salvo defeito comprovado):</p>
        <ul className="list-disc ml-5 mt-2 space-y-1">
          <li>Produtos personalizados ou feitos sob encomenda</li>
          <li>Alimentos perecíveis abertos ou com embalagem violada</li>
          <li>Produtos com lacre de segurança violado</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">8. {COMPANY_NAME} como Mediador</h2>
        <p>Caso não obtenha resolução com o lojista, o comprador pode acionar a mediação pelo e-mail contato@olojaodopovo.com.br informando o número do pedido. {COMPANY_NAME} poderá cobrar do lojista valores devidos e suspender contas reincidentes.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">9. Contato</h2>
        <p>Portal do cliente: Minha Conta → Pedidos</p>
        <p>E-mail: contato@olojaodopovo.com.br (resposta em até 2 dias úteis)</p>
      </section>
    </div>
  )
}
