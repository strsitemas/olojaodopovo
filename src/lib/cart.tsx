"use client"

import { createContext, useContext, useEffect, useState } from "react"

export type CartItem = {
  id: string
  title: string
  price: number
  imageUrl: string | null
  storeId: string
  storeName: string
  stock: number
  quantity: number
}

type CartContextType = {
  items: CartItem[]
  total: number
  count: number
  addItem: (item: Omit<CartItem, "quantity">) => { ok: boolean; message?: string }
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => { ok: boolean; message?: string }
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)
const CART_KEY = "lojao_cart"

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        console.log("[Cart] Carregado do localStorage:", parsed.length, "itens")
        setItems(parsed)
      }
    } catch (err) {
      console.error("[Cart] Erro ao carregar localStorage:", err)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(items))
      console.log("[Cart] Salvo no localStorage:", items.length, "itens")
    } catch (err) {
      console.error("[Cart] Erro ao salvar localStorage:", err)
    }
  }, [items, ready])

  function addItem(item: Omit<CartItem, "quantity">): { ok: boolean; message?: string } {
    console.log("[Cart] Tentando adicionar:", item.title, "estoque:", item.stock)
    let result: { ok: boolean; message?: string } = { ok: false }
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      const currentQty = existing ? existing.quantity : 0
      if (currentQty >= item.stock) {
        console.warn("[Cart] Limite de estoque atingido:", item.stock)
        result = { ok: false, message: "Quantidade maxima em estoque atingida (" + item.stock + " unidade(s))." }
        return prev
      }
      result = { ok: true }
      if (existing) {
        return prev.map((i) => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    return result
  }

  function removeItem(id: string) {
    console.log("[Cart] Removendo item:", id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  function updateQuantity(id: string, quantity: number): { ok: boolean; message?: string } {
    console.log("[Cart] Atualizando quantidade:", id, quantity)
    if (quantity <= 0) { removeItem(id); return { ok: true } }
    let result: { ok: boolean; message?: string } = { ok: false }
    setItems((prev) => {
      const item = prev.find((i) => i.id === id)
      if (!item) return prev
      if (quantity > item.stock) {
        console.warn("[Cart] Quantidade excede estoque:", item.stock)
        result = { ok: false, message: "Estoque disponivel: " + item.stock + " unidade(s)." }
        return prev
      }
      result = { ok: true }
      return prev.map((i) => i.id === id ? { ...i, quantity } : i)
    })
    return result
  }

  function clearCart() {
    console.log("[Cart] Limpando carrinho")
    setItems([])
  }

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const count = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, total, count, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart precisa estar dentro de CartProvider")
  return ctx
}
