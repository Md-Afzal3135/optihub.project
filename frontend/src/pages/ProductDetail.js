import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        API.get(`/products/${id}/`)
            .then(res => {
                setProduct(res.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [id]);

    const handleAddToCart = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        try {
            await addToCart(product.id, quantity);
            setAdded(true);
            setTimeout(() => setAdded(false), 2000);
        } catch { }
    };

    if (loading) {
        return (
            <div className="detail-loading">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="detail-error">
                <h2>Product not found</h2>
                <button className="btn-primary" onClick={() => navigate('/products')}>Browse Products</button>
            </div>
        );
    }

    return (
        <div className="product-detail">
            <div className="detail-container">
                <div className="detail-image-section">
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="detail-image" />
                    ) : (
                        <div className="detail-placeholder">
                            <span>👓</span>
                        </div>
                    )}
                </div>

                <div className="detail-info-section">
                    <span className="detail-category">{product.category_name}</span>
                    <h1>{product.name}</h1>
                    <p className="detail-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                    <p className="detail-tax">Inclusive of all taxes</p>

                    <div className="detail-divider"></div>

                    <div className="detail-description">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="detail-divider"></div>

                    <div className="detail-quantity">
                        <span>Quantity:</span>
                        <div className="quantity-controls">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                    </div>

                    <div className="detail-actions">
                        <button
                            className={`btn-add-cart ${added ? 'btn-added' : ''}`}
                            onClick={handleAddToCart}
                        >
                            {added ? '✓ Added to Cart' : 'Add to Cart'}
                        </button>
                        <button className="btn-buy-now" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
                            Buy Now
                        </button>
                    </div>

                    <div className="detail-features">
                        <div className="detail-feature">
                            <span>🚚</span> Free Delivery
                        </div>
                        <div className="detail-feature">
                            <span>🔄</span> 14-day Returns
                        </div>
                        <div className="detail-feature">
                            <span>🛡️</span> 1 Year Warranty
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
