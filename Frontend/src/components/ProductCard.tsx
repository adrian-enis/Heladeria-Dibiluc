// src/components/ProductCard.tsx
import { useState } from 'react'
import type { Product } from '../types/index'
import { useCart } from '../context/CartContext'

interface Props {
    product: Product
}

export function ProductCard({ product }: Props) {
    const { items, addItem, updateQuantity, removeItem } = useCart()
    const [imgError, setImgError] = useState(false)

    const cartItem = items.find(i => i.product.id === product.id)
    const quantity = cartItem?.quantity ?? 0
    const outOfStock = product.stock === 0

    const handleAdd = () => {
        if (outOfStock) return
        addItem(product)
    }

    const handleIncrement = () => {
        if (quantity >= product.stock) return
        updateQuantity(product.id, quantity + 1)
    }

    const handleDecrement = () => {
        if (quantity <= 1) {
            removeItem(product.id)
        } else {
            updateQuantity(product.id, quantity - 1)
        }
    }

    return (
        <div className="product-card">
            <div className="product-image-wrapper">
                {product.image_url && !imgError ? (
                    <img
                        src={product.image_url}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="product-image-placeholder">🍦</div>
                )}
                {outOfStock && (
                    <div className="out-of-stock-badge">Agotado</div>
                )}
            </div>

            <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                    <p className="product-description">{product.description}</p>
                )}
                <span className="product-price">${product.price.toFixed(2)}</span>
            </div>

            <div className="product-actions">
                {quantity === 0 ? (
                    <button
                        className="btn-add"
                        onClick={handleAdd}
                        disabled={outOfStock}
                    >
                        + Agregar
                    </button>
                ) : (
                    <div className="quantity-controls">
                        <button className="qty-btn" onClick={handleDecrement}>−</button>
                        <span className="qty-value">{quantity}</span>
                        <button
                            className="qty-btn"
                            onClick={handleIncrement}
                            disabled={quantity >= product.stock}
                        >+</button>
                    </div>
                )}
            </div>
        </div>
    )
}