import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', username: '', password: '', confirm: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (formData.password !== formData.confirm) {
            setError('Passwords do not match');
            return;
        }
        setLoading(true);
        try {
            await register(formData.name, formData.email, formData.username, formData.password);
            navigate('/');
        } catch (err) {
            const data = err.response?.data;
            const msg = data ? Object.values(data).flat().join('. ') : 'Registration failed.';
            setError(msg);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-visual">
                    <div className="auth-visual-content">
                        <span className="auth-logo">◎</span>
                        <h2>Join OptiHub</h2>
                        <p>Create an account to explore premium eyewear</p>
                    </div>
                </div>
                <div className="auth-form-section">
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <h1>Create Account</h1>
                        <p className="auth-subtitle">Fill in your details to get started</p>

                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label>Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" required />
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                        </div>
                        <div className="form-group">
                            <label>Username</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="johndoe" required />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Password</label>
                                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
                            </div>
                            <div className="form-group">
                                <label>Confirm Password</label>
                                <input type="password" name="confirm" value={formData.confirm} onChange={handleChange} placeholder="••••••••" required />
                            </div>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>

                        <p className="auth-switch">
                            Already have an account? <Link to="/login">Sign In</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
