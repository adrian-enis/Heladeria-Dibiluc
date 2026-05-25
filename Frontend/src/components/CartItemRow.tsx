// src/components/CartItemRow.tsx
import type { CartItem } from '../types/index'
import { useCart } from '../context/CartContext'

interface Props {
  item: CartItem
}

export function CartItemRow({ item }: Props) {
  const { updateQuantity, removeItem } = useCart()
  const { product, quantity } = item
  const subtotal = product.price * quantity

  return (
    <div className="cart-item">
      <div className="cart-item-image-wrapper">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="cart-item-image" />
        ) : (
          <div className="cart-item-placeholder">🍦</div>
        )}
      </div>

      <div className="cart-item-info">
        <p className="cart-item-name">{product.name}</p>
        <p className="cart-item-price">${product.price.toFixed(2)} c/u</p>
      </div>

      <div className="cart-item-controls">
        <div className="quantity-controls">
          <button
            className="qty-btn"
            onClick={() => quantity <= 1 ? removeItem(product.id) : updateQuantity(product.id, quantity - 1)}
          >−</button>
          <span className="qty-value">{quantity}</span>
          <button
            className="qty-btn"
            onClick={() => updateQuantity(product.id, quantity + 1)}
            disabled={quantity >= product.stock}
          >+</button>
        </div>
        <p className="cart-item-subtotal">${subtotal.toFixed(2)}</p>
      </div>
    </div>
  )
}