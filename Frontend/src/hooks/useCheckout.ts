// src/hooks/useCheckout.ts
import { useState } from 'react'
import { orderService } from '../sevices/orderService'
import { useCart } from '../context/CartContext'
import type { Order } from '../types/index'

export function useCheckout() {
  const { items, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submitOrder(customerName: string, customerPhone: string) {
    try {
      setLoading(true)
      setError(null)

      const order: Order = {
        customer_name: customerName,
        customer_phone: customerPhone,
        items: items.map(i => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      }

      await orderService.create(order)

      // Genera el mensaje de WhatsApp
      const lines = items.map(
        i => `• ${i.product.name} x${i.quantity} — $${(i.product.price * i.quantity).toFixed(2)}`
      )
      const message = [
        `🍦 *Pedido Heladería Dibuluc*`,
        ``,
        `👤 ${customerName}`,
        `📞 ${customerPhone}`,
        ``,
        ...lines,
        ``,
        `💰 *Total: $${total.toFixed(2)}*`,
      ].join('\n')

      clearCart()

      const waNumber = import.meta.env.VITE_WA_NUMBER
      const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`
      window.open(waUrl, '_blank')

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido')
    } finally {
      setLoading(false)
    }
  }

  return { submitOrder, loading, error }
}