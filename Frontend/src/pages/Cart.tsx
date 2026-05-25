// src/pages/Cart.tsx
import { useCart } from '../context/CartContext'
import { CartItemRow } from '../components/CartItemRow'

export function Cart() {
    const { items, total, clearCart } = useCart()

    if (items.length === 0) {
        return (
            <div className="page-empty">
                <span className="empty-icon">🍦</span>
                <h2 className="empty-title">Tu carrito está vacío</h2>
                <p className="empty-desc">Agrega algunos helados para continuar</p>
                <a href="/" className="btn-primary">Ver catálogo</a>
            </div>
        )
    }

    return (
        <div className="page-cart">
            <header className="page-header">
                <a href="/" className="btn-back">← Volver</a>
                <h2 className="page-title">Tu pedido</h2>
                <button className="btn-clear" onClick={clearCart}>Vaciar</button>
            </header>

            <main className="cart-main">
                <div className="cart-items-list">
                    {items.map(item => (
                        <CartItemRow key={item.product.id} item={item} />
                    ))}
                </div>

                <div className="cart-summary">
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                    <div className="summary-row summary-total">
                        <span>Total</span>
                        <span className="total-amount">${total.toFixed(2)}</span>
                    </div>
                </div>

                <a href="/checkout" className="btn-primary btn-full">
                    Continuar al checkout →
                </a>
            </main>
        </div>
    )
}