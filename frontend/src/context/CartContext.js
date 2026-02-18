import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartCount, setCartCount] = useState(0);
    const { user } = useAuth();

    const fetchCart = useCallback(async () => {
        if (!user) {
            setCartItems([]);
            setCartTotal(0);
            setCartCount(0);
            return;
        }
        try {
            const { data } = await API.get('/orders/cart/');
            setCartItems(data.items);
            setCartTotal(data.cart_total);
            setCartCount(data.items.reduce((sum, item) => sum + item.quantity, 0));
        } catch {
            setCartItems([]);
            setCartTotal(0);
            setCartCount(0);
        }
    }, [user]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addToCart = async (productId, quantity = 1) => {
        await API.post('/orders/cart/add/', { product_id: productId, quantity });
        await fetchCart();
    };

    const updateQuantity = async (cartItemId, quantity) => {
        await API.put(`/orders/cart/${cartItemId}/`, { quantity });
        await fetchCart();
    };

    const removeFromCart = async (cartItemId) => {
        await API.delete(`/orders/cart/${cartItemId}/`);
        await fetchCart();
    };

    return (
        <CartContext.Provider value={{ cartItems, cartTotal, cartCount, addToCart, updateQuantity, removeFromCart, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};
