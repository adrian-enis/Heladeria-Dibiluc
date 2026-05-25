// src/pages/Home.tsx
import { useProducts } from '../hooks/useProducts'
import { ProductCard } from '../components/ProductCard'
import { SkeletonCard } from '../components/SkeletonCard'
import { useCart } from '../context/CartContext'

export function Home() {
    const { products, loading, error } = useProducts()
    const { items, total } = useCart()
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

    return (
        <div className="page-home">
            <header className="home-header">
                <div className="home-header-title">
                    <h1 className="brand-name">Heladería<br />Dibuluc</h1>
                    <p className="brand-tagline">Sabores que enamoran 🍦</p>
                </div>
                {totalItems > 0 && (
                    <a href="/cart" className="cart-pill">
                        <span className="cart-pill-icon">🛒</span>
                        <span className="cart-pill-count">{totalItems}</span>
                        <span className="cart-pill-total">${total.toFixed(2)}</span>
                    </a>
                )}
            </header>

            <main className="home-main">
                {error && (
                    <div className="error-banner">
                        ⚠️ {error}
                    </div>
                )}

                <h2 className="section-title">Nuestros sabores</h2>

                <div className="products-grid">
                    {loading
                        ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
                        : products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    }
                </div>
            </main>
        </div>
    )
}