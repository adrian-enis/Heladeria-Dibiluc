// src/pages/Checkout.tsx
import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useCheckout } from '../hooks/useCheckout'

export function Checkout() {
    const { items, total } = useCart()
    const { submitOrder, loading, error } = useCheckout()

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [errors, setErrors] = useState<{ name?: string; phone?: string }>({})

    const validate = () => {
        const newErrors: { name?: string; phone?: string } = {}
        if (!name.trim()) newErrors.name = 'El nombre es requerido'
        if (!phone.trim()) newErrors.phone = 'El teléfono es requerido'
        else if (!/^\+?[\d\s\-]{7,15}$/.test(phone)) {
            newErrors.phone = 'Formato de teléfono inválido'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async () => {
        if (!validate()) return
        await submitOrder(name.trim(), phone.trim())
    }

    if (items.length === 0) {
        return (
            <div className="page-empty">
                <span className="empty-icon">🍦</span>
                <h2 className="empty-title">No hay productos en tu pedido</h2>
                <a href="/" className="btn-primary">Ver catálogo</a>
            </div>
        )
    }

    return (
        <div className="page-checkout">
            <header className="page-header">
                <a href="/cart" className="btn-back">← Volver</a>
                <h2 className="page-title">Checkout</h2>
                <div />
            </header>

            <main className="checkout-main">

                <section className="checkout-section">
                    <h3 className="checkout-section-title">Tu selección</h3>
                    <div className="checkout-items">
                        {items.map(item => (
                            <div key={item.product.id} className="checkout-item-row">
                                <span className="checkout-item-name">
                                    {item.product.name} ×{item.quantity}
                                </span>
                                <span className="checkout-item-price">
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="checkout-total-row">
                        <span>Total</span>
                        <span className="checkout-total-amount">${total.toFixed(2)}</span>
                    </div>
                </section>

                <section className="checkout-section">
                    <h3 className="checkout-section-title">Tus datos</h3>

                    <div className="form-group">
                        <label className="form-label">Nombre completo</label>
                        <input
                            className={`form-input ${errors.name ? 'input-error' : ''}`}
                            type="text"
                            placeholder="Juan Pérez"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        {errors.name && <p className="form-error">{errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label">Teléfono</label>
                        <input
                            className={`form-input ${errors.phone ? 'input-error' : ''}`}
                            type="tel"
                            placeholder="+58 412-3456789"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        />
                        {errors.phone && <p className="form-error">{errors.phone}</p>}
                    </div>
                </section>

                {error && <div className="error-banner">⚠️ {error}</div>}

                <button
                    className="btn-whatsapp btn-full"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : '🟢 Confirmar por WhatsApp'}
                </button>

            </main>
        </div>
    )
}