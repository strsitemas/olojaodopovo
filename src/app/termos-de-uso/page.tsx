import { TERMS_VERSION, COMPANY_NAME, DPO_EMAIL } from "@/lib/legal"

export const metadata = {
  title: "Termos de Uso | " + COMPANY_NAME,
}

export default function TermosPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800 text-sm leading-relaxed">
      <h1 className="text-2xl font-bold mb-1">Termos de Uso</h1>
      <p className="text-gray-400 mb-8">Versão {TERMS_VERSION} &mdash; Última atualização: 28 de junho de 2026</p>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">1. Identificação</h2>
        <p>{COMPANY_NAME} é uma plataforma digital de marketplace operada por pessoa física, com sede em Salto/SP, Brasil, acessível pelo domínio olojaodopovo.com.br.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">2. Aceitação</h2>
        <p>Ao criar uma conta, acessar ou utilizar qualquer recurso da Plataforma, o usuário declara ter lido, compreendido e aceitado integralmente estes Termos de Uso, bem como a Política de Privacidade, a Política de Cookies e a Política de Trocas, Devoluções e Reembolsos.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">3. Natureza da Plataforma</h2>
        <p>{COMPANY_NAME} atua exclusivamente como intermediador tecnológico, disponibilizando ferramentas para anúncio de produtos, processamento de pagamentos, gestão de pedidos e comunicação entre compradores e vendedores.</p>
        <p className="mt-2">Salvo quando expressamente informado em contrário, {COMPANY_NAME} não é fabricante, proprietário, fornecedor, importador nem vendedor direto dos produtos anunciados.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">4. Cadastro de Compradores</h2>
        <p>Para utilizar os serviços é necessário realizar cadastro com informações verdadeiras, completas e atualizadas. O usuário é responsável por proteger sua senha e por todas as atividades realizadas em sua conta.</p>
        <p className="mt-2">É vedado utilizar dados falsos, criar múltiplas contas para burlar restrições ou utilizar a Plataforma para atividades ilícitas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">5. Cadastro de Lojistas</h2>
        <p>Para habilitar a venda, o lojista deverá fornecer CPF ou CNPJ válido, dados bancários, endereço e informações fiscais quando exigidas. O lojista é integralmente responsável pela veracidade e legalidade de todas as informações fornecidas.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">6. Produtos Anunciados</h2>
        <p>Cada lojista é exclusivamente responsável por descrição, fotografias, preços, estoque, prazo de envio, qualidade, garantia e legalidade dos produtos anunciados.</p>
        <p className="mt-2">É proibido anunciar produtos ilegais, falsificados, roubados ou que violem direitos de terceiros. {COMPANY_NAME} poderá remover anúncios ou suspender lojas a qualquer momento.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">7. Pedidos e Pagamentos</h2>
        <p>Os pagamentos são processados pelo parceiro Pagar.me. Após confirmação, o pedido é notificado ao lojista, {COMPANY_NAME} retém a comissão e repassa o saldo líquido ao vendedor conforme o calendário vigente.</p>
        <p className="mt-2">{COMPANY_NAME} não se responsabiliza por atrasos ou falhas provocadas por instituições financeiras, parceiro de pagamentos ou casos de força maior.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">8. Entrega</h2>
        <p>A entrega é responsabilidade exclusiva do lojista. Prazos podem ser alterados por fatores externos como transportadoras, greves ou condições climáticas, sem responsabilidade da Plataforma.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">9. Cancelamentos, Trocas e Devoluções</h2>
        <p>As regras sobre cancelamento, troca, devolução e reembolso estão detalhadas na <a href="/politica-de-trocas" className="underline text-gray-600">Política de Trocas, Devoluções e Reembolsos</a>. Os direitos previstos no Código de Defesa do Consumidor são sempre garantidos.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">10. Comissão da Plataforma</h2>
        <p>{COMPANY_NAME} cobra comissão sobre as vendas realizadas. As taxas são apresentadas ao lojista no momento do cadastro. O percentual poderá ser alterado com comunicação prévia de 30 dias.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">11. Responsabilidades e Limitações</h2>
        <p>{COMPANY_NAME} não garante operação ininterrupta. Na máxima extensão permitida pela lei brasileira, não responderá por lucros cessantes, danos indiretos, perda de negócios ou falhas causadas por eventos externos.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">12. Propriedade Intelectual</h2>
        <p>Todo conteúdo de titularidade da Plataforma — logotipo, identidade visual, software, banco de dados, textos e layout — é protegido pelas leis brasileiras de propriedade intelectual. É vedada qualquer reprodução sem autorização expressa.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">13. Privacidade e Cookies</h2>
        <p>O tratamento dos dados pessoais obedece à <a href="/politica-de-privacidade" className="underline text-gray-600">Política de Privacidade</a> e à <a href="/politica-de-cookies" className="underline text-gray-600">Política de Cookies</a>, em conformidade com a LGPD (Lei nº 13.709/2018).</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">14. Suspensão ou Encerramento de Contas</h2>
        <p>{COMPANY_NAME} poderá suspender ou encerrar contas que violem estes Termos, pratiquem fraudes, utilizem documentos falsos ou prejudiquem outros usuários.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">15. Alterações destes Termos</h2>
        <p>Alterações relevantes serão comunicadas com antecedência mínima de 15 dias por e-mail ou aviso na Plataforma. O uso continuado implica concordância com a nova versão.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">16. Legislação e Foro</h2>
        <p>Estes Termos são regidos pelas leis brasileiras. Fica eleito o foro da comarca de Salto/SP, ressalvados os direitos do consumidor.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-base font-semibold mb-2">17. Contato</h2>
        <p>Dúvidas sobre estes Termos: <a href={"mailto:" + DPO_EMAIL} className="underline text-gray-600">{DPO_EMAIL}</a></p>
      </section>
    </div>
  )
}
