import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import './Home.css';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [featuredProducts, setFeaturedProducts] = useState([]);

    useEffect(() => {
        API.get('/products/categories/').then(res => setCategories(res.data.results || res.data)).catch(() => { });
        API.get('/products/?ordering=-created_at').then(res => setFeaturedProducts((res.data.results || res.data).slice(0, 8))).catch(() => { });
    }, []);

    const categoryIcons = {
        'Eyeglasses': '👓',
        'Sunglasses': '🕶️',
        'Contact Lenses': '🔵',
        'Computer Glasses': '💻',
        'Reading Glasses': '📖',
    };

    return (
        <div className="home">
            {/* Hero Banner */}
            <section className="hero">
                <div className="hero-bg">
                    <div className="hero-shape hero-shape-1"></div>
                    <div className="hero-shape hero-shape-2"></div>
                    <div className="hero-shape hero-shape-3"></div>
                </div>
                <div className="hero-content">
                    <span className="hero-tag">Premium Eyewear Collection</span>
                    <h1>See the World<br /><span className="hero-gradient-text">With Perfect Clarity</span></h1>
                    <p>Discover our curated collection of eyeglasses, sunglasses, and contact lenses. Fashion meets function with unbeatable quality.</p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn-primary">Shop Now →</Link>
                        <Link to="/products?category=sunglasses" className="btn-outline">Sunglasses</Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><strong>10K+</strong><span>Happy Customers</span></div>
                        <div className="stat"><strong>500+</strong><span>Products</span></div>
                        <div className="stat"><strong>4.8★</strong><span>Rating</span></div>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="section categories-section">
                <div className="section-header">
                    <span className="section-tag">Browse</span>
                    <h2>Shop By Category</h2>
                    <p>Find the perfect eyewear for every occasion</p>
                </div>
                <div className="categories-grid">
                    {categories.map(cat => (
                        <Link to={`/products?category=${cat.id}`} key={cat.id} className="category-card">
                            <span className="category-icon">{categoryIcons[cat.name] || '👁️'}</span>
                            <h3>{cat.name}</h3>
                            <span className="category-arrow">→</span>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="section featured-section">
                <div className="section-header">
                    <span className="section-tag">Trending</span>
                    <h2>Featured Products</h2>
                    <p>Our most popular picks this season</p>
                </div>
                <div className="products-grid">
                    {featuredProducts.map(product => (
                        <Link to={`/products/${product.id}`} key={product.id} className="product-card">
                            <div className="product-image">
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <div className="product-placeholder">
                                        <span>👓</span>
                                    </div>
                                )}
                                <span className="product-category-tag">{product.category_name}</span>
                            </div>
                            <div className="product-info">
                                <h3>{product.name}</h3>
                                <p className="product-price">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="section-footer">
                    <Link to="/products" className="btn-primary">View All Products →</Link>
                </div>
            </section>

            {/* Features */}
            <section className="section features-section">
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">🚚</div>
                        <h3>Free Shipping</h3>
                        <p>Free delivery on orders above ₹999</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🔄</div>
                        <h3>Easy Returns</h3>
                        <p>14-day hassle-free return policy</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">🛡️</div>
                        <h3>1 Year Warranty</h3>
                        <p>Manufacturing defect warranty on all products</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon">💎</div>
                        <h3>Premium Quality</h3>
                        <p>Handpicked frames from top brands</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
