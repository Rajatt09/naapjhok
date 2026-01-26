import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import api from "../utils/api"; // Import api
import { useToast } from "../context/ToastContext";
import {
	MapPin,
	Phone,
	Calendar,
	User,
	AlertCircle,
	CheckCircle,
	ChevronLeft,
	ShoppingBag,
} from "lucide-react";

const TIME_SLOTS = [
	"10:00 AM - 12:00 PM",
	"12:00 PM - 02:00 PM",
	"02:00 PM - 04:00 PM",
	"04:00 PM - 06:00 PM",
	"06:00 PM - 08:00 PM",
];

const Booking = () => {
	const { cart, profiles, removeFromCart } = useCart(); // Get profiles from context
    const { addToast } = useToast();
	const navigate = useNavigate();
	const location = useLocation();

	const [targetProfileId, setTargetProfileId] = useState(() => {
		// Default to 'me' so direct bookings from navbar don't bounce to cart
		return (
			location.state?.profileId ||
			sessionStorage.getItem("bookingProfileId") ||
			"me"
		);
	});

	// Save to session storage
	useEffect(() => {
		if (targetProfileId) {
			sessionStorage.setItem("bookingProfileId", targetProfileId);
		}
	}, [targetProfileId]);

	// Redirect if no profile selected
	useEffect(() => {
		// If no target profile (e.g., direct navbar click), fall back to first available or 'me'
		if (!targetProfileId) {
			if (profiles.length > 0) {
				setTargetProfileId(profiles[0]._id || "me");
			} else {
				setTargetProfileId("me");
			}
		}
	}, [targetProfileId, profiles]);

	// Derive active profile details
	const profileDetails = useMemo(() => {
		if (!targetProfileId || profiles.length === 0) return null;
		return (
			profiles.find(
				(p) => p._id === targetProfileId || p.name === targetProfileId,
			) || { name: "Valued Customer", isSelf: false }
		);
	}, [profiles, targetProfileId]);

	// ... items calculation
	const bookingItems = useMemo(() => {
		if (!targetProfileId) return [];
		return cart.filter(
			(item) => (item.profileId || "me") === targetProfileId,
		);
	}, [cart, targetProfileId]);

	const bookingTotal = useMemo(() => {
		return bookingItems.reduce((total, item) => {
			const price = item.withFabric
				? Number(item.product.basePrice) +
					Number(item.product.fabricPrice)
				: Number(item.product.basePrice);
			return total + price;
		}, 0);
	}, [bookingItems]);

	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		phone: "",
		address: "",
		date: "",
		timeSlot: "",
	});

	// IMPORTANT: Hydrate form when profileDetails becomes available
	useEffect(() => {
		if (profileDetails) {
			setFormData((prev) => ({
				...prev,
				name: prev.name || profileDetails.name || "",
				phone: prev.phone || profileDetails.phone || "", // Keep existing input if user typed, else user profile
				address: prev.address || profileDetails.location || "", // Keep existing input if user typed, else user profile
			}));
		}
	}, [profileDetails]);

	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		if (errors[e.target.name])
			setErrors({ ...errors, [e.target.name]: null });
	};

	const handleSlotSelect = (slot) => {
		setFormData({ ...formData, timeSlot: slot });
		if (errors.timeSlot) setErrors({ ...errors, timeSlot: null });
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.name.trim()) newErrors.name = "Name is required";
		if (!formData.phone.trim()) newErrors.phone = "Phone is required";
		else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, "")))
			newErrors.phone = "Enter valid 10-digit phone";
		if (!formData.address.trim()) newErrors.address = "Address is required";
		if (!formData.date) newErrors.date = "Date is required";
		if (!formData.timeSlot) newErrors.timeSlot = "Time slot is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;
		if (!bookingItems.length) {
			return;
		}

		setLoading(true);

		// Get profile name to match backend storage
		// IMPORTANT: If booking for main user (targetProfileId === 'me'), always send 'me'
		// Only send actual profile name for sub-profiles
		const profileName =
			targetProfileId === "me"
				? "me"
				: profileDetails?.name || targetProfileId;

		const orderData = {
			items: bookingItems.map((item) => ({
				product: {
					id: item.product._id || item.product.id,
					name: item.product.name,
					category: item.product.category,
					image: item.product.image || item.product.referenceImage,
					basePrice: item.product.basePrice,
					fabricPrice: item.product.fabricPrice,
				},
				quantity: 1,
				withFabric: item.withFabric,
				price: item.withFabric
					? Number(item.product.basePrice) +
						Number(item.product.fabricPrice)
					: Number(item.product.basePrice),
				customization: item.customization
					? JSON.stringify(item.customization)
					: "",
			})),
			totalAmount: bookingTotal,
			profileId: profileName,
			appointment: {
				date: formData.date,
				timeSlot: formData.timeSlot,
				address: {
					street: formData.address,
					city: "New Delhi",
					state: "Delhi",
					zip: "110001",
				},
				contactName: formData.name,
				contactPhone: formData.phone,
			},
		};

		try {
			await api.post("/orders", orderData);

			// Backend now handles cart cleanup for reliability.
			// We just need to refresh the local cart state.
			// Assuming CartContext exposes a way to refresh or we just trigger it.
			// Since we can't easily call 'fetchCart' from here without exposure,
			// we can forcefully reload or use a simpler "clearCart" if the order was for ALL items.
			// But here the order is arguably for a *specific profile* subset.
			// Best pattern: trigger a re-fetch of cart in Context.

			// For now, let's manually remove from UI to be snappy, but real sync happens on refill.

			// For now, let's manually remove from UI to be snappy, but real sync happens on refill.
			bookingItems.forEach((item) => removeFromCart(item._id)); // Keep for UI callback

			addToast(
				`Appointment Booked for ${profileDetails ? profileDetails.name : "you"}!`,
                'success'
			);
			navigate("/profile");
		} catch (error) {
			console.error(error);
			addToast(
				"Booking Failed: " +
					(error.response?.data?.message || "Please try again."),
                'error'
			);
		} finally {
			setLoading(false);
		}
	};

	// Show empty state if no booking items
	if (!bookingItems.length) {
		return (
			<div className="min-h-screen bg-brand-cream pt-32 pb-20 px-4 flex flex-col items-center justify-center">
				<div className="w-32 h-32 bg-brand-brown/10 rounded-full flex items-center justify-center mb-8 animate-pulse">
					<ShoppingBag
						size={64}
						className="text-brand-brown opacity-50"
					/>
				</div>
				<h2 className="text-4xl font-serif text-brand-espresso mb-4 text-center">
					Your Cart is Empty
				</h2>
				<p className="text-brand-taupe mb-8 max-w-md text-lg text-center">
					Add items to your cart before booking an appointment with
					our master tailor.
				</p>
				<div className="flex gap-4 flex-col sm:flex-row">
					<Button
						variant="primary"
						onClick={() => navigate("/products")}
						className="px-8 py-3"
					>
						Browse Collection
					</Button>
					<Button
						variant="outline"
						onClick={() => navigate("/cart")}
						className="px-8 py-3"
					>
						Back to Cart
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-brand-cream pt-32 pb-20 px-4">
			<div className="container-custom max-w-6xl">
				{/* Back Link */}
				<button
					onClick={() => navigate("/cart")}
					className="flex items-center gap-2 text-brand-taupe hover:text-brand-coffee mb-8 transition-colors group text-sm uppercase tracking-wider font-medium"
				>
					<ChevronLeft
						size={16}
						className="group-hover:-translate-x-1 transition-transform"
					/>{" "}
					Back to Cart
				</button>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
					{/* LEFT COLUMN: Booking Form */}
					<div className="lg:col-span-7 space-y-8 animate-in slide-in-from-left duration-500">
						<div>
							<h2 className="text-4xl font-serif text-brand-espresso mb-3 leading-tight">
								Secure Your <br />
								Appointment
							</h2>
							<p className="text-brand-taupe text-lg">
								Booking a master visit for{" "}
								<strong className="text-brand-coffee">
									{profileDetails
										? profileDetails.name
										: "Loading..."}
								</strong>
								.
							</p>
						</div>

						<form
							className="bg-white/50 p-6 md:p-10 rounded-2xl border border-brand-brown/5 space-y-10"
							onSubmit={handleSubmit}
						>
							{/* Contact Section */}
							<div>
								<h3 className="flex items-center gap-3 text-sm font-bold text-brand-rust uppercase tracking-[0.15em] mb-6 pb-2 border-b border-brand-brown/10">
									<User size={16} /> Contact Details
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="space-y-2">
										<label className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
											Name{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="text"
											name="name"
											value={formData.name}
											onChange={handleChange}
											className={`w-full p-4 bg-white border ${errors.name ? "border-red-500" : "border-brand-brown/10"} rounded-lg focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee/20 outline-none transition-all`}
											placeholder="Who are we meeting?"
										/>
										{errors.name && (
											<p className="text-xs text-red-500 flex items-center gap-1">
												<AlertCircle size={10} />{" "}
												{errors.name}
											</p>
										)}
									</div>
									<div className="space-y-2">
										<label className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
											Phone{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<div className="relative">
											<input
												type="tel"
												name="phone"
												value={formData.phone}
												onChange={handleChange}
												className={`w-full p-4 pl-12 bg-white border ${errors.phone ? "border-red-500" : "border-brand-brown/10"} rounded-lg focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee/20 outline-none transition-all`}
												placeholder="10-digit number"
											/>
											<Phone
												className="absolute left-4 top-4 text-brand-taupe/50"
												size={18}
											/>
										</div>
										{errors.phone && (
											<p className="text-xs text-red-500 flex items-center gap-1">
												<AlertCircle size={10} />{" "}
												{errors.phone}
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Address Section */}
							<div>
								<h3 className="flex items-center gap-3 text-sm font-bold text-brand-rust uppercase tracking-[0.15em] mb-6 pb-2 border-b border-brand-brown/10">
									<MapPin size={16} /> Visit Location
								</h3>
								<div className="space-y-2">
									<label className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
										Full Address{" "}
										<span className="text-red-500">*</span>
									</label>
									<div className="relative">
										<textarea
											name="address"
											rows="3"
											value={formData.address}
											onChange={handleChange}
											placeholder="House No., Street, Landmark, Pincode..."
											className={`w-full p-4 bg-white border ${errors.address ? "border-red-500" : "border-brand-brown/10"} rounded-lg focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee/20 outline-none transition-all resize-none shadow-sm`}
										></textarea>
									</div>
									{errors.address && (
										<p className="text-xs text-red-500 flex items-center gap-1">
											<AlertCircle size={10} />{" "}
											{errors.address}
										</p>
									)}
								</div>
							</div>

							{/* Schedule Section */}
							<div>
								<h3 className="flex items-center gap-3 text-sm font-bold text-brand-rust uppercase tracking-[0.15em] mb-6 pb-2 border-b border-brand-brown/10">
									<Calendar size={16} /> Preferred Time
								</h3>
								<div className="space-y-6">
									<div className="space-y-2">
										<label className="text-xs font-bold text-brand-taupe uppercase tracking-wider">
											Date{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="date"
											name="date"
											value={formData.date}
											onChange={handleChange}
											min={
												new Date()
													.toISOString()
													.split("T")[0]
											}
											className={`w-full p-4 bg-white border ${errors.date ? "border-red-500" : "border-brand-brown/10"} rounded-lg focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee/20 outline-none transition-all cursor-pointer`}
										/>
										{errors.date && (
											<p className="text-xs text-red-500 flex items-center gap-1">
												<AlertCircle size={10} />{" "}
												{errors.date}
											</p>
										)}
									</div>

									<div className="space-y-3">
										<label className="text-xs font-bold text-brand-taupe uppercase tracking-wider mb-2 block">
											Time Slot{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
											{TIME_SLOTS.map((slot) => (
												<button
													key={slot}
													type="button"
													className={`w-full py-4 px-4 text-sm font-medium rounded-lg border transition-all duration-200 text-left md:text-center ${
														formData.timeSlot ===
														slot
															? "bg-brand-coffee text-white border-brand-coffee shadow-lg transform scale-[1.01]"
															: "bg-white text-brand-coffee border-brand-brown/10 hover:border-brand-coffee/30 hover:bg-brand-brown/5"
													}`}
													onClick={() =>
														handleSlotSelect(slot)
													}
												>
													{slot}
												</button>
											))}
										</div>
										{errors.timeSlot && (
											<p className="text-xs text-red-500 flex items-center gap-1">
												<AlertCircle size={10} />{" "}
												{errors.timeSlot}
											</p>
										)}
									</div>
								</div>
							</div>

							{/* CONFIRM BUTTON MOVED HERE */}
							<div className="pt-4 border-t border-brand-brown/10">
								<Button
									type="submit"
									variant="primary"
									className="w-full py-5 text-sm tracking-widest uppercase font-bold bg-brand-coffee text-white"
									disabled={loading}
								>
									{loading
										? "Processing..."
										: `Confirm Appointment • ₹${bookingTotal}`}
								</Button>
								<p className="text-[10px] text-brand-taupe text-center mt-3">
									By clicking confirm, our master will be
									notified to visit your location.
								</p>
							</div>
						</form>
					</div>

					{/* RIGHT COLUMN: Order Summary */}
					<div className="lg:col-span-5 animate-in slide-in-from-bottom duration-700 delay-100 hidden lg:block">
						<div className="bg-white p-8 rounded-2xl shadow-xl sticky top-32 border border-brand-brown/10">
							<h3 className="text-xl font-serif text-brand-espresso mb-6 flex items-center gap-2 pb-4 border-b border-brand-brown/10">
								<ShoppingBag size={20} /> Order Summary{" "}
								<span className="text-sm font-sans text-brand-taupe ml-auto font-normal">
									({bookingItems.length} items)
								</span>
							</h3>

							<div className="space-y-6 mb-8">
								{bookingItems.map((item) => (
									<div
										key={item._id}
										className="flex justify-between items-start gap-4"
									>
										<div className="flex gap-4">
											<div className="w-12 h-16 rounded overflow-hidden bg-brand-cream shrink-0">
												<img
													src={
														item.product?.image ||
														item.image ||
														"/placeholder.jpg"
													}
													alt={
														item.product?.name ||
														item.name
													}
													className="w-full h-full object-cover opacity-90"
												/>
											</div>
											<div>
												<h4 className="text-sm font-bold text-brand-espresso leading-tight">
													{item.product?.name ||
														item.name}
												</h4>
												<p className="text-xs text-brand-taupe mt-1">
													{item.product?.category}
												</p>
												<p className="text-xs text-brand-taupe mb-4">
													{item.withFabric
														? "Bespoke Stitching & Fabric"
														: "Stitching Service Only"}
												</p>
												{item.withFabric && (
													<p className="text-[10px] text-brand-rust uppercase tracking-wider font-bold mt-1">
														+ Fabric
													</p>
												)}
											</div>
										</div>
										<div className="text-sm font-medium text-brand-coffee whitespace-nowrap">
											₹
											{item.withFabric
												? Number(
														item.product?.basePrice,
													) +
													Number(
														item.product
															?.fabricPrice,
													)
												: Number(
														item.product?.basePrice,
													)}
										</div>
									</div>
								))}
							</div>

							<div className="bg-brand-cream/30 -mx-8 px-8 py-6 border-t border-dashed border-brand-brown/20 space-y-3">
								<div className="flex justify-between text-sm text-brand-taupe">
									<span>Subtotal</span>
									<span>₹{bookingTotal}</span>
								</div>
								<div className="flex justify-between text-sm text-brand-taupe">
									<span>Home Visit Charges</span>
									<span className="text-brand-green font-bold">
										FREE
									</span>
								</div>
								<div className="flex justify-between text-xl font-serif text-brand-espresso pt-3 border-t border-brand-brown/10 mt-2">
									<span>Total</span>
									<span>₹{bookingTotal}</span>
								</div>
							</div>
						</div>
					</div>

					{/* MOBILE SUMMARY (Simplified) */}
					<div className="lg:hidden mt-8 border-t border-brand-brown/10 pt-8">
						<h4 className="font-serif text-brand-espresso text-lg mb-4">
							Order Summary ({bookingItems.length} Items)
						</h4>
						<div className="space-y-4">
							{bookingItems.map((item) => (
								<div
									key={item._id}
									className="flex items-center justify-between py-2 border-b border-brand-brown/5 last:border-0"
								>
									<span className="text-sm text-brand-coffee">
										{item.product?.name || item.name}
									</span>
									<span className="text-sm font-bold text-brand-espresso">
										₹
										{item.withFabric
											? Number(item.product?.basePrice) +
												Number(
													item.product?.fabricPrice,
												)
											: Number(item.product?.basePrice)}
									</span>
								</div>
							))}
							<div className="flex justify-between text-lg font-serif text-brand-espresso pt-4 border-t border-brand-brown/20">
								<span>Total Payable</span>
								<span>₹{bookingTotal}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Booking;
