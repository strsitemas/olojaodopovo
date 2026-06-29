import Link from "next/link"
import { COMPANY_NAME } from "@/lib/legal"

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>&copy; {year} {COMPANY_NAME}. Todos os direitos reservados.</p>
        <nav className="flex flex-wrap gap-4 justify-center">
          <Link href="/termos-de-uso" className="hover:text-gray-800 transition-colors">Termos de Uso</Link>
          <Link href="/politica-de-privacidade" className="hover:text-gray-800 transition-colors">Privacidade</Link>
          <Link href="/politica-de-cookies" className="hover:text-gray-800 transition-colors">Cookies</Link>
          <Link href="/politica-de-trocas" className="hover:text-gray-800 transition-colors">Trocas e Devoluções</Link>
        </nav>
      </div>
    </footer>
  )
}
