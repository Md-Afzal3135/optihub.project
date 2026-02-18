import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import './Checkout.css';

const Checkout = () => {
    const { cartItems, cartTotal, fetchCart } = useCart();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (!address.trim()) {
            setError('Please enter your delivery address');
            return;
        }
        setLoading(true);
        setError('');
        try {
            await API.post('/orders/', { address });
            await fetchCart();
            navigate('/orders', { state: { orderPlaced: true } });
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to place order');
        }
        setLoading(false);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <h2>Your cart is empty</h2>
                <p>Add some products before checkout</p>
                <button className="btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <h1 className="checkout-title">Checkout</h1>

            <div className="checkout-layout">
                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    <div className="checkout-section">
                        <h3>🚚 Delivery Address</h3>
                        {error && <div className="auth-error">{error}</div>}
                        <textarea
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter your full delivery address..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="checkout-section">
                        <h3>💳 Payment</h3>
                        <div className="payment-option active">
                            <input type="radio" checked readOnly />
                            <span>Cash on Delivery</span>
                        </div>
                    </div>

                    <button type="submit" className="btn-place-order" disabled={loading}>
                        {loading ? 'Placing Order...' : `Place Order — ₹${cartTotal.toLocaleString('en-IN')}`}
                    </button>
                </form>

                <div className="checkout-summary">
                    <h3>Order Items</h3>
                    {cartItems.map(item => (
                        <div key={item.id} className="checkout-item">
                            <div className="checkout-item-info">
                                <span className="checkout-item-name">{item.product_detail?.name}</span>
                                <span className="checkout-item-qty">x{item.quantity}</span>
                            </div>
                            <span className="checkout-item-price">₹{item.total?.toLocaleString('en-IN')}</span>
                        </div>
                    ))}
                    <div className="summary-divider"></div>
                    <div className="summary-row total">
                        <span>Total</span>
                        <span>₹{cartTotal.toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
