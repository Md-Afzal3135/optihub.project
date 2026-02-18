import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-section">
                    <div className="footer-logo">
                        <span className="logo-icon">◎</span>
                        <span className="logo-text">Opti<span className="logo-highlight">Hub</span></span>
                    </div>
                    <p className="footer-desc">
                        Your one-stop destination for premium eyewear. We offer the latest trends in eyeglasses, sunglasses, and contact lenses at unbeatable prices.
                    </p>
                </div>
                <div className="footer-section">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/products">All Products</Link>
                    <Link to="/products?category=eyeglasses">Eyeglasses</Link>
                    <Link to="/products?category=sunglasses">Sunglasses</Link>
                </div>
                <div className="footer-section">
                    <h4>Categories</h4>
                    <Link to="/products?category=contact-lenses">Contact Lenses</Link>
                    <Link to="/products?category=computer-glasses">Computer Glasses</Link>
                    <Link to="/products?category=reading-glasses">Reading Glasses</Link>
                </div>
                <div className="footer-section">
                    <h4>Contact Us</h4>
                    <p>📧 support@optihub.com</p>
                    <p>📞 +91-7525881560</p>
                    <p>📍 lucknow, India</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© 2026 OptiHub. All rights reserved. Made with ❤️ for better vision.</p>
            </div>
        </footer>
    );
};

export default Footer;
