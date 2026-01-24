import React, { createContext, useState, useContext, useEffect } from 'react';
import api, { setAccessToken } from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        try {
            // Try to refresh token immediately
            const res = await api.post('/auth/refresh-token');
            const { accessToken, data } = res.data;
            
            setAccessToken(accessToken);
            setUser(data.user);
        } catch (err) {
            // Check failed, user is not logged in
            setUser(null);
            setAccessToken(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            const { accessToken, data } = res.data;
            
            setAccessToken(accessToken);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const signup = async (userData) => {
        try {
            const res = await api.post('/auth/signup', userData);
            const { accessToken, data } = res.data;
            
            setAccessToken(accessToken);
            setUser(data.user);
            return { success: true };
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Signup failed' 
            };
        }
    };

    const logout = async () => {
        try {
            await api.post('/auth/logout');
        } catch (err) {
            console.error('Logout failed', err);
        }
        setAccessToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
