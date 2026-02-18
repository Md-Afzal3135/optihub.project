import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/axios';
import './Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const orderPlaced = location.state?.orderPlaced;

    useEffect(() => {
        API.get('/orders/')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const statusColor = {
        pending: '#f0ad4e',
        processing: '#329af0',
        shipped: '#a855f7',
        delivered: '#06d6a0',
        cancelled: '#e74c3c',
    };

    if (loading) {
        return <div className="orders-loading"><div className="spinner"></div></div>;
    }

    return (
        <div className="orders-page">
            <h1 className="orders-title">My Orders</h1>

            {orderPlaced && (
                <div className="order-success">
                    <span>🎉</span> Order placed successfully! We'll process it shortly.
                </div>
            )}

            {orders.length === 0 ? (
                <div className="cart-empty">
                    <span className="cart-empty-icon">📦</span>
                    <h2>No orders yet</h2>
                    <p>Start shopping to see your orders here</p>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <span className="order-id">Order #{order.id}</span>
                                    <span className="order-date">
                                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <span className="order-status" style={{ background: statusColor[order.status] + '20', color: statusColor[order.status] }}>
                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                </span>
                            </div>
                            <div className="order-items">
                                {order.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <span className="order-item-name">{item.product_name}</span>
                                        <span className="order-item-details">x{item.quantity} · ₹{parseFloat(item.product_price).toLocaleString('en-IN')}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="order-footer">
                                <span>Delivery: {order.address?.substring(0, 50)}{order.address?.length > 50 ? '...' : ''}</span>
                                <span className="order-total">₹{parseFloat(order.total_price).toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;
