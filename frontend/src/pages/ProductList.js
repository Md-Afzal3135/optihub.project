import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [addingId, setAddingId] = useState(null);

    const activeCategory = searchParams.get('category') || '';
    const searchQuery = searchParams.get('search') || '';
    const ordering = searchParams.get('ordering') || '-created_at';

    useEffect(() => {
        API.get('/products/categories/').then(res => setCategories(res.data.results || res.data)).catch(() => { });
    }, []);

    useEffect(() => {
        setLoading(true);
        let url = '/products/?ordering=' + ordering;
        if (activeCategory) url += `&search=${activeCategory}`;
        if (searchQuery) url += `&search=${encodeURIComponent(searchQuery)}`;
        API.get(url)
            .then(res => {
                setProducts(res.data.results || res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [activeCategory, searchQuery, ordering]);

    const handleCategoryFilter = (catId) => {
        const params = new URLSearchParams(searchParams);
        if (catId) {
            params.set('category', catId);
        } else {
            params.delete('category');
        }
        params.delete('search');
        setSearchParams(params);
    };

    const handleSort = (value) => {
        const params = new URLSearchParams(searchParams);
        params.set('ordering', value);
        setSearchParams(params);
    };

    const handleAddToCart = async (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setAddingId(productId);
        try {
            await addToCart(productId);
        } catch { }
        setTimeout(() => setAddingId(null), 800);
    };

    return (
        <div className="products-page">
            <div className="products-header">
                <div className="products-header-content">
                    <h1>{searchQuery ? `Results for "${searchQuery}"` : 'Our Collection'}</h1>
                    <p>{products.length} products found</p>
                </div>
            </div>

            <div className="products-layout">
                {/* Sidebar */}
                <aside className="products-sidebar">
                    <div className="filter-group">
                        <h3>Categories</h3>
                        <button
                            className={`filter-btn ${!activeCategory ? 'active' : ''}`}
                            onClick={() => handleCategoryFilter('')}
                        >
                            All Products
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                className={`filter-btn ${activeCategory === String(cat.id) ? 'active' : ''}`}
                                onClick={() => handleCategoryFilter(cat.id)}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                    <div className="filter-group">
                        <h3>Sort By</h3>
                        <select value={ordering} onChange={(e) => handleSort(e.target.value)} className="sort-select">
                            <option value="-created_at">Newest First</option>
                            <option value="price">Price: Low to High</option>
                            <option value="-price">Price: High to Low</option>
                            <option value="name">Name: A-Z</option>
                        </select>
                    </div>
                </aside>

                {/* Products */}
                <div className="products-content">
                    {loading ? (
                        <div className="loading-grid">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="skeleton-card">
                                    <div className="skeleton-image"></div>
                                    <div className="skeleton-text"></div>
                                    <div className="skeleton-text short"></div>
                                </div>
                            ))}
                        </div>
                    ) : products.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🔍</span>
                            <h3>No products found</h3>
                            <p>Try adjusting your filters or search query</p>
                        </div>
                    ) : (
                        <div className="products-grid-list">
                            {products.map(product => (
                                <Link to={`/products/${product.id}`} key={product.id} className="product-card-list">
                                    <div className="product-image-list">
                                        {product.image ? (
                                            <img src={product.image} alt={product.name} />
                                        ) : (
                                            <div className="product-placeholder-list">👓</div>
                                        )}
                                        <span className="product-tag">{product.category_name}</span>
                                    </div>
                                    <div className="product-info-list">
                                        <h3>{product.name}</h3>
                                        <p className="product-desc">{product.description?.substring(0, 80)}...</p>
                                        <div className="product-bottom">
                                            <span className="product-price-list">₹{parseFloat(product.price).toLocaleString('en-IN')}</span>
                                            <button
                                                className={`add-cart-btn ${addingId === product.id ? 'added' : ''}`}
                                                onClick={(e) => handleAddToCart(e, product.id)}
                                            >
                                                {addingId === product.id ? '✓ Added' : '+ Cart'}
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductList;
