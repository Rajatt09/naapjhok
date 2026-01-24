import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [profiles, setProfiles] = useState([]);
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Fetch Cart & Profiles on load/user-change
    useEffect(() => {
        if (user) {
            fetchProfiles();
            fetchCart();
        } else {
            setCart([]);
            setProfiles([]);
        }
    }, [user]);

    const fetchProfiles = async () => {
        try {
            const res = await api.get('/user/profiles');
            
            // Create "Me" profile from main user data
            const meProfile = {
                _id: 'me', // Static ID for self
                id: 'me',  // fallback
                name: user?.name || 'Me',
                isSelf: true,
                phone: user?.phone,
                email: user?.email,
                location: user?.addresses?.[0]?.city || ''
            };

            const backendProfiles = res.data.profiles || [];
            
            // Merge: Me + Others
            setProfiles([meProfile, ...backendProfiles]);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchCart = async () => {
        try {
            const res = await api.get('/cart');
            if (res.data.status === 'success') {
                setCart(res.data.cart.items || []);
            }
        } catch (error) {
            console.error("Failed to fetch cart", error);
        }
    };

    const addProfile = async (profileData) => {
        setLoading(true);
        try {
            const res = await api.post('/user/profiles', profileData);
            if (res.data.status === 'success') {
                // Re-fetch to get correct state or manual merge
                // Manual merge is safer for "Me" persistence
                 const meProfile = {
                    _id: 'me',
                    id: 'me',
                    name: user?.name || 'Me',
                    isSelf: true,
                    phone: user?.phone,
                    email: user?.email,
                    location: user?.addresses?.[0]?.city || ''
                };
                setProfiles([meProfile, ...res.data.profiles]);
                return res.data.profile; 
            }
        } catch (err) {
            console.error("Add profile failed", err);
            const message = err.response?.data?.message || "Failed to add profile";
            throw new Error(message);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (id, updatedData) => {
        try {
            const res = await api.put(`/user/profiles/${id}`, updatedData);
            if (res.data.status === 'success') {
                setProfiles(res.data.profiles);
            }
        } catch (err) {
            console.error("Update profile failed", err);
        }
    };

    const deleteProfile = async (id) => {
        try {
            const res = await api.delete(`/user/profiles/${id}`);
            if (res.data.status === 'success') {
                setProfiles(res.data.profiles);
            }
        } catch (err) {
            console.error("Delete profile failed", err);
        }
    };

    const addToCart = async (product, options, profileId, customization) => {
        try {
            const formData = new FormData();
            formData.append('product', JSON.stringify(product));
            formData.append('withFabric', options.withFabric);
            formData.append('profileId', profileId);
            
            // Separate file from other customization data
            if (customization) {
                const { referenceImage, ...restCustomization } = customization;
                formData.append('customization', JSON.stringify(restCustomization));
                if (referenceImage instanceof File) {
                    formData.append('referenceImage', referenceImage);
                }
            }

            const res = await api.post('/cart', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.status === 'success') {
                setCart(res.data.cart.items);
            }
            return true; // Success
        } catch (error) {
            console.error("Add to cart failed", error);
            return false;
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const res = await api.delete(`/cart/${itemId}`);
            if (res.data.status === 'success') {
                setCart(res.data.cart.items);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Remove from cart failed", error);
            return false;
        }
    };

    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.withFabric ? (Number(item.product.basePrice) + Number(item.product.fabricPrice)) : Number(item.product.basePrice);
            return total + price;
        }, 0);
    };

    const getCartCount = () => cart.length;

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ 
            cart, 
            profiles, 
            addToCart, 
            removeFromCart, 
            clearCart, 
            getCartTotal, 
            addProfile, 
            updateProfile, 
            deleteProfile, 
            getCartCount,
            loading
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
