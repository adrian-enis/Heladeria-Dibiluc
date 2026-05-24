// src/hooks/useProducts.ts
import { useEffect, useState } from 'react'
import { productService } from '../sevices/productService'
import type { Product } from '../types/index'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProducts() {
      try {
        setLoading(true)
        setError(null)
        const data = await productService.getAll()
        if (!cancelled) setProducts(data)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar productos')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchProducts()

    return () => { cancelled = true }
  }, [])

  return { products, loading, error }
}