import React, { createContext, useState, useContext, useEffect } from "react";
import api from "../utils/api";
import { useAuth } from "./AuthContext";

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
			const res = await api.get("/user/profiles");

			// Backend returns: { status: 'success', data: { profiles: [...], user: {...} } }
			const responseData = res.data.data || {};
			const userData = responseData.user || {
				name: user?.name || "Me",
				phone: user?.phone,
				email: user?.email,
				location: user?.addresses?.[0]?.city || "",
			};

			// Create "Me" profile from fresh user data
			const meProfile = {
				_id: "me", // Static ID for self
				id: "me", // fallback
				name: userData.name,
				isSelf: true,
				phone: userData.phone,
				email: userData.email,
				location: userData.location,
			};

			const backendProfiles = (responseData.profiles || []).map(profile => ({
				...profile,
				_id: profile._id || profile.id,
				id: profile.id || profile._id,
			}));

			// Merge: Me + Others
			setProfiles([meProfile, ...backendProfiles]);
		} catch (err) {
			console.error(err);
		}
	};

	const fetchCart = async () => {
		try {
			const res = await api.get("/cart");
			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { cart: { items: [...] } } }
				const cart = res.data.data?.cart || {};
				setCart(cart.items || []);
			}
		} catch (error) {
			console.error("Failed to fetch cart", error);
		}
	};

	const addProfile = async (profileData) => {
		setLoading(true);
		try {
			const res = await api.post("/user/profiles", profileData);
			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { profile: {...}, profiles: [...] } }
				const responseData = res.data.data || {};
				
				// Create "Me" profile from main user data (same as fetchProfiles)
				const meProfile = {
					_id: "me",
					id: "me",
					name: user?.name || "Me",
					isSelf: true,
					phone: user?.phone,
					email: user?.email,
					location: user?.addresses?.[0]?.city || "",
				};

				// Get the backend profiles (which now include the newly created one)
				const backendProfiles = (responseData.profiles || []).map(profile => ({
					...profile,
					_id: profile._id || profile.id,
					id: profile.id || profile._id,
				}));

				// Merge: Me + Others (same as fetchProfiles)
				setProfiles([meProfile, ...backendProfiles]);
				return responseData.profile;
			}
		} catch (err) {
			console.error("Add profile failed", err);
			const message =
				err.response?.data?.message || "Failed to add profile";
			throw new Error(message);
		} finally {
			setLoading(false);
		}
	};

	const updateProfile = async (id, updatedData) => {
		try {
			const res = await api.put(`/user/profiles/${id}`, updatedData);
			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { profile: {...}, profiles: [...] } }
				const responseData = res.data.data || {};
				
				// If updating main profile, refetch to get fresh data
				if (id === "me") {
					// Refetch profiles to ensure we have the latest data
					await fetchProfiles();
				} else {
					// For sub-profiles, create "Me" profile from user data
					const meProfile = {
						_id: "me",
						id: "me",
						name: user?.name || "Me",
						isSelf: true,
						phone: user?.phone,
						email: user?.email,
						location: user?.addresses?.[0]?.city || "",
					};

					const backendProfiles = (responseData.profiles || []).map(profile => ({
						...profile,
						_id: profile._id || profile.id,
						id: profile.id || profile._id,
					}));
					setProfiles([meProfile, ...backendProfiles]);
				}
			}
		} catch (err) {
			console.error("Update profile failed", err);
		}
	};

	const deleteProfile = async (id) => {
		try {
			const res = await api.delete(`/user/profiles/${id}`);
			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { profiles: [...] } }
				const responseData = res.data.data || {};
				
				// Create "Me" profile from main user data
				const meProfile = {
					_id: "me",
					id: "me",
					name: user?.name || "Me",
					isSelf: true,
					phone: user?.phone,
					email: user?.email,
					location: user?.addresses?.[0]?.city || "",
				};

				const backendProfiles = (responseData.profiles || []).map(profile => ({
					...profile,
					_id: profile._id || profile.id,
					id: profile.id || profile._id,
				}));
				setProfiles([meProfile, ...backendProfiles]);
			}
		} catch (err) {
			console.error("Delete profile failed", err);
		}
	};

	const addToCart = async (product, options, profileId, customization) => {
		try {
			const formData = new FormData();
			formData.append("product", JSON.stringify(product));
			formData.append("withFabric", options.withFabric);
			formData.append("profileId", profileId);

			// Separate file from other customization data
			if (customization) {
				const { referenceImage, ...restCustomization } = customization;
				formData.append(
					"customization",
					JSON.stringify(restCustomization),
				);
				if (referenceImage instanceof File) {
					formData.append("referenceImage", referenceImage);
				}
			}

			const res = await api.post("/cart", formData, {
				headers: { "Content-Type": "multipart/form-data" },
			});

			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { cart: { items: [...] } } }
				const cart = res.data.data?.cart || {};
				setCart(cart.items || []);
				alert("Item added to cart successfully!");
			}
			return true; // Success
		} catch (error) {
			console.error("Add to cart failed", error);
			alert("Failed to add item to cart. Please try again.");
			return false;
		}
	};

	const removeFromCart = async (itemId) => {
		try {
			const res = await api.delete(`/cart/${itemId}`);
			if (res.data.status === "success") {
				// Backend returns: { status: 'success', data: { cart: { items: [...] } } }
				const cart = res.data.data?.cart || {};
				setCart(cart.items || []);
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
			const price = item.withFabric
				? Number(item.product.basePrice) +
					Number(item.product.fabricPrice)
				: Number(item.product.basePrice);
			return total + price;
		}, 0);
	};

	const getCartCount = () => cart.length;

	const clearCart = () => setCart([]);

	return (
		<CartContext.Provider
			value={{
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
				loading,
			}}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = () => useContext(CartContext);
