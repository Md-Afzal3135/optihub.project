import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const Cart = () => {
    const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything yet</p>
                <Link to="/products" className="btn-primary">Browse Products</Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1 className="cart-title">Shopping Cart <span>({cartItems.length} items)</span></h1>

            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map(item => (
                        <div key={item.id} className="cart-item">
                            <div className="cart-item-image">
                                {item.product_detail?.image ? (
                                    <img src={item.product_detail.image} alt={item.product_detail.name} />
                                ) : (
                                    <div className="cart-item-placeholder">👓</div>
                                )}
                            </div>
                            <div className="cart-item-info">
                                <Link to={`/products/${item.product}`} className="cart-item-name">
                                    {item.product_detail?.name}
                                </Link>
                                <span className="cart-item-category">{item.product_detail?.category_name}</span>
                                <span className="cart-item-price">₹{parseFloat(item.product_detail?.price).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="cart-item-actions">
                                <div className="quantity-controls">
                                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}>−</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                </div>
                                <span className="cart-item-total">₹{item.total?.toLocaleString('en-IN')}</span>
                                <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>
                                    ✕ Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span className="free">FREE</span>
                    </div>
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                    <button className="btn-checkout" onClick={() => navigate('/checkout')}>
                        Proceed to Checkout →
                    </button>
                    <Link to="/products" className="continue-shopping">← Continue Shopping</Link>
                </div>
            </div>
        </div>
    );
};

export default Cart;
