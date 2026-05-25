// src/context/CartContext.tsx
import { createContext, useContext, useEffect, useState } from 'react'
import type { CartItem, Product } from '../types/index'

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product) => void
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    total: number
}

const CartContext = createContext<CartContextType | null>(null) // El valor inicial es null para detectar uso fuera del provider

const CART_KEY = 'heladeria_cart' // Clave para localStorage, así es fácil cambiarla si queremos usar otro almacenamiento o formato

// El CartProvider maneja el estado del carrito y lo sincroniza con localStorage
export function CartProvider({ children }: { children: React.ReactNode }) { 
    const [items, setItems] = useState<CartItem[]>(() => {
        
        try {
            const stored = localStorage.getItem(CART_KEY)
            return stored ? JSON.parse(stored) : []
        } catch {
            return []
        }
    })

    // Sincroniza localStorage cada vez que items cambia
    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items))
    }, [items])

    const addItem = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(i => i.product.id === product.id)

            if (existing) {
                // Si ya está en el carrito, incrementa quantity
                if (existing.quantity >= product.stock) return prev // respeta stock
                return prev.map(i =>
                    i.product.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                )
            }

            // Si no está, lo agrega con quantity 1
            return [...prev, { product, quantity: 1 }]
        })
    }

    const removeItem = (productId: number) => {
        setItems(prev => prev.filter(i => i.product.id !== productId))
    }

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeItem(productId)
            return
        }
        setItems(prev =>
            prev.map(i =>
                i.product.id === productId ? { ...i, quantity } : i
            )
        )
    }

    const clearCart = () => setItems([])

    const total = items.reduce(
        (acc, i) => acc + i.product.price * i.quantity, 0
    )

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, total }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
    return context
}

/**
 *localStorage se inicializa en el useState — el carrito se restaura automáticamente al recargar 
 la página sin ningún useEffect extra.
addItem respeta el stock — si quantity >= product.stock no agrega más, cumpliendo la user story 2
useCart está en el mismo archivo — no necesita su propio archivo porque es simplemente un 
wrapper del contexto. El hook useProducts sí va separado porque tiene lógica propia (fetch, loading, error)
 * 
 */