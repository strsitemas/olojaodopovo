import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Combina classes do Tailwind sem conflito (padrão shadcn/ui)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata valor em reais (BRL)
export function formatCurrency(value: number | string) {
  const num = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(num)
}

// Formata data no padrão brasileiro
export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d)
}

// Calcula a comissão da plataforma sobre um valor de venda
export function calculatePlatformFee(
  amount: number,
  rate: number = Number(process.env.PLATFORM_COMMISSION_DEFAULT ?? 0.08)
) {
  const fee = amount * rate
  const sellerAmount = amount - fee
  return { fee, sellerAmount, rate }
}
