import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { data } = await API.post('/users/login/', { email, password });
        localStorage.setItem('tokens', JSON.stringify(data));
        const profileRes = await API.get('/users/profile/');
        localStorage.setItem('user', JSON.stringify(profileRes.data));
        setUser(profileRes.data);
        return profileRes.data;
    };

    const register = async (name, email, username, password) => {
        const { data } = await API.post('/users/register/', { name, email, username, password });
        localStorage.setItem('tokens', JSON.stringify(data.tokens));
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return data.user;
    };

    const logout = () => {
        localStorage.removeItem('tokens');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
