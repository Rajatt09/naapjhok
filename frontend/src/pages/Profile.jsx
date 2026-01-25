import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
	User,
	Phone,
	Plus,
	MapPin,
	LogOut,
	Settings,
	Trash2,
	ShoppingBag,
	ChevronRight,
	Clock,
	Package,
	Mail,
	Save,
	X,
} from "lucide-react";
import Button from "../components/Button";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useNavigate } from "react-router-dom";
import api from "../utils/api"; // Import api

const Profile = () => {
	const { user, logout } = useAuth();
	const { profiles, addProfile, updateProfile, deleteProfile } = useCart();
	const navigate = useNavigate();

	const [activeProfileId, setActiveProfileId] = useState("me");
	const [orders, setOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(false);

	// UI States
	const [isAddingProfile, setIsAddingProfile] = useState(false);
	const [isEditing, setIsEditing] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);

	// Form States
	const [newProfileData, setNewProfileData] = useState({
		name: "",
		phone: "",
		email: "",
		location: "",
	});
	const [editFormData, setEditFormData] = useState({
		name: "",
		phone: "",
		email: "",
		location: "",
	});
	const [errors, setErrors] = useState({});

	// Active Profile Object (handle MongoDB _id)
	const activeProfile = profiles.find((p) => p._id === activeProfileId) ||
		profiles[0] || { _id: "me", name: "Me", isSelf: true };

	// Reset edit state when changing profiles
	useEffect(() => {
		setIsEditing(false);
		setErrors({});
	}, [activeProfileId]);

	// Fetch Orders function (memoized to avoid unnecessary re-renders)
	const fetchOrders = useCallback(async () => {
		setLoadingOrders(true);
		try {
			const res = await api.get("/orders");
			// The backend returns: { status: 'success', data: { orders: [...] } }
			const fetchedOrders = res.data.data?.orders || [];
			setOrders(fetchedOrders);
		} catch (error) {
			console.error("Error fetching orders:", error);
			setOrders([]);
		} finally {
			setLoadingOrders(false);
		}
	}, []);

	// Fetch Orders on Mount and when profiles change
	useEffect(() => {
		if (user) {
			fetchOrders();
		}
	}, [user, profiles.length, fetchOrders]); // Refetch when profiles change (delete/add)

	// Filter Orders for Active Profile
	const activeProfileOrders = orders.filter((order) => {
		// Backend stores profileId as profile name or 'me'
		// Frontend activeProfileId can be either _id or 'me'
		// Match by comparing the profile name with order.profileId
		const orderPid = String(order.profileId || "me");

		// If activeProfileId is 'me', match directly
		if (activeProfileId === "me") {
			return orderPid === "me";
		}

		// Otherwise, find the profile and compare by name
		// Only show orders if the profile actually exists
		const activeProf = profiles.find((p) => p._id === activeProfileId);
		if (!activeProf) {
			return false; // Profile doesn't exist, don't show orders
		}
		
		const activeProfName = activeProf.name;
		return orderPid === activeProfName;
	});

	// Validation Helper for creating new profiles (stricter)
	const validateNewProfile = (data) => {
		const newErrors = {};
		if (!data.name.trim()) newErrors.name = "Name is required";
		if (!data.phone.trim()) newErrors.phone = "Phone is required";
		else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, "")))
			newErrors.phone = "Enter valid 10-digit phone";
		if (!data.location.trim()) newErrors.location = "Location is required";
		if (data.email && !/\S+@\S+\.\S+/.test(data.email))
			newErrors.email = "Invalid email format";

		return newErrors;
	};

	// Validation Helper for editing profiles (less strict)
	const validateEditProfile = (data) => {
		const newErrors = {};
		if (!data.name.trim()) newErrors.name = "Name is required";
		if (!data.phone.trim()) newErrors.phone = "Phone is required";
		else if (!/^\d{10}$/.test(data.phone.replace(/\D/g, "")))
			newErrors.phone = "Enter valid 10-digit phone";
		if (data.email && !/\S+@\S+\.\S+/.test(data.email))
			newErrors.email = "Invalid email format";
		// Location is optional when editing

		return newErrors;
	};

	const handleAddProfile = async (e) => {
		e.preventDefault();
		const validationErrors = validateNewProfile(newProfileData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		try {
			const newP = await addProfile({ ...newProfileData, isSelf: false });
			if (newP && newP._id) {
				// Redirect to main owner (me) instead of the newly created profile
				setActiveProfileId("me");
			}
			setNewProfileData({ name: "", phone: "", email: "", location: "" });
			setIsAddingProfile(false);
			setErrors({});
			// Refetch orders after profile creation to ensure fresh data
			await fetchOrders();
		} catch (err) {
			setErrors({ name: err.message }); // Or general error
		}
	};

	const handleEditToggle = () => {
		if (!isEditing) {
			// Enter edit mode: populate form
			setEditFormData({
				name: activeProfile.name || "",
				phone: activeProfile.phone || "",
				email: activeProfile.email || "",
				location: activeProfile.location || "", // Ensure backend supports location or map it
			});
		}
		setIsEditing(!isEditing);
		setErrors({});
	};

	const handleSaveEdit = async () => {
		const validationErrors = validateEditProfile(editFormData);
		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		await updateProfile(activeProfileId, editFormData);
		setIsEditing(false);
	};

	const triggerDelete = () => {
		setShowDeleteModal(true);
	};

	const confirmDelete = async () => {
		await deleteProfile(activeProfileId);
		setActiveProfileId("me");
		setShowDeleteModal(false);
		// Refetch orders after profile deletion (since orders are deleted too)
		await fetchOrders();
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	return (
		<div className="min-h-screen bg-brand-cream pt-32 pb-20 px-4">
			<DeleteConfirmationModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onConfirm={confirmDelete}
				profileName={activeProfile.name}
			/>

			<div className="container-custom max-w-7xl">
				{/* Header with Logout */}
				<div className="flex justify-between items-end mb-8 border-b border-brand-brown/10 pb-6">
					<div>
						<h1 className="text-4xl font-serif text-brand-espresso mb-1">
							My Dashboard
						</h1>
						<p className="text-brand-taupe">
							Manage profiles and view specific order history.
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="text-brand-coffee hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-pointer"
					>
						<LogOut size={16} /> Logout
					</button>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
					{/* LEFT SIDEBAR: PROFILE LIST */}
					<div className="lg:col-span-4 space-y-8">
						<div className="bg-white rounded-2xl shadow-lg border border-brand-brown/10 overflow-hidden">
							<div className="p-6 bg-brand-coffee text-brand-cream flex justify-between items-center">
								<h3 className="font-serif text-xl">Profiles</h3>
								<button
									onClick={() =>
										setIsAddingProfile(!isAddingProfile)
									}
									className="text-brand-cream/80 hover:text-white transition-colors cursor-pointer"
								>
									<Plus
										size={20}
										className={
											isAddingProfile
												? "rotate-45 transition-transform"
												: "transition-transform"
										}
									/>
								</button>
							</div>

							{/* Add Profile Form */}
							{isAddingProfile && (
								<div className="p-4 bg-brand-cream/50 border-b border-brand-brown/10 animate-in slide-in-from-top-2">
									<h4 className="text-xs font-bold uppercase text-brand-coffee mb-3">
										New Profile Details
									</h4>
									<div className="space-y-3">
										<div>
											<input
												type="text"
												value={newProfileData.name}
												onChange={(e) =>
													setNewProfileData({
														...newProfileData,
														name: e.target.value,
													})
												}
												placeholder="Name *"
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.name ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.name && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.name}
												</p>
											)}
										</div>
										<div>
											<input
												type="text"
												value={newProfileData.phone}
												onChange={(e) =>
													setNewProfileData({
														...newProfileData,
														phone: e.target.value,
													})
												}
												placeholder="Phone *"
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.phone ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.phone && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.phone}
												</p>
											)}
										</div>
										<div>
											<input
												type="email"
												value={newProfileData.email}
												onChange={(e) =>
													setNewProfileData({
														...newProfileData,
														email: e.target.value,
													})
												}
												placeholder="Email"
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.email ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.email && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.email}
												</p>
											)}
										</div>
										<div>
											<input
												type="text"
												value={newProfileData.location}
												onChange={(e) =>
													setNewProfileData({
														...newProfileData,
														location:
															e.target.value,
													})
												}
												placeholder="Location (City/Area) *"
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.location ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.location && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.location}
												</p>
											)}
										</div>
										<Button
											onClick={handleAddProfile}
											variant="primary"
											className="w-full text-xs py-2 cursor-pointer"
										>
											Add Profile
										</Button>
									</div>
								</div>
							)}

							<div className="divide-y divide-brand-brown/5">
								{profiles.map((profile) => (
									<button
										key={profile._id}
										onClick={() => {
											setActiveProfileId(profile._id);
										}}
										className={`w-full text-left p-4 flex items-center gap-4 transition-all cursor-pointer ${
											activeProfileId === profile._id
												? "bg-brand-brown/5 border-l-4 border-brand-coffee"
												: "hover:bg-brand-cream/50 border-l-4 border-transparent"
										}`}
									>
										<div
											className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg ${
												activeProfileId === profile._id
													? "bg-brand-coffee text-white"
													: "bg-brand-cream text-brand-coffee"
											}`}
										>
											{profile.name.charAt(0)}
										</div>
										<div className="flex-1">
											<h4
												className={`font-bold text-sm ${activeProfileId === profile._id ? "text-brand-espresso" : "text-brand-coffee"}`}
											>
												{profile.name}{" "}
												{profile.isSelf && "(You)"}
											</h4>
											<p className="text-[10px] text-brand-taupe uppercase tracking-wider">
												{profile.isSelf
													? "Primary Account"
													: "Measurement Profile"}
											</p>
										</div>
										{activeProfileId === profile._id && (
											<ChevronRight
												size={16}
												className="text-brand-rust"
											/>
										)}
									</button>
								))}
							</div>
						</div>

						<div className="bg-white rounded-xl shadow border border-brand-brown/10 p-2">
							<button className="w-full text-left p-3 hover:bg-brand-cream/50 transition-colors flex items-center gap-3 text-brand-coffee/80 text-sm cursor-pointer rounded-lg">
								<Settings size={16} /> Account Settings
							</button>
						</div>
					</div>

					{/* RIGHT CONTENT: ACTIVE PROFILE DETAILS */}
					<div
						className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
						key={activeProfileId}
					>
						{/* Selected Profile Header / Edit Form */}
						<div className="bg-white rounded-2xl shadow border border-brand-brown/10 p-6 relative overflow-hidden">
							{!isEditing ? (
								// VIEW MODE
								<div className="flex flex-col md:flex-row md:items-center gap-6">
									<div className="w-20 h-20 bg-brand-coffee text-brand-cream rounded-full flex items-center justify-center text-4xl font-serif shadow-lg shrink-0">
										{activeProfile.name.charAt(0)}
									</div>
									<div className="flex-1 space-y-2">
										<div className="flex items-start justify-between">
											<div>
												<h2 className="text-3xl font-serif text-brand-espresso">
													{activeProfile.name}
												</h2>
												<p className="text-brand-taupe flex items-center gap-2 text-sm mt-1">
													<User size={14} />{" "}
													{activeProfile.isSelf
														? "Personal Profile"
														: "Sub-profile"}
												</p>
											</div>
											{/* Actions */}
											<div className="flex gap-2">
												<Button
													onClick={handleEditToggle}
													variant="outline"
													className="text-xs py-2 px-3 h-9 border-brand-brown/20 text-brand-taupe hover:border-brand-coffee hover:text-brand-coffee cursor-pointer"
												>
													Edit Details
												</Button>
												{!activeProfile.isSelf && (
													<button
														onClick={triggerDelete}
														className="h-9 w-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
														title="Delete Profile"
													>
														<Trash2 size={16} />
													</button>
												)}
											</div>
										</div>

										{/* Details Grid */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-brand-brown/5">
											<p className="flex items-center gap-2 text-brand-coffee text-sm">
												<Phone
													size={14}
													className="text-brand-taupe"
												/>
												{activeProfile.phone || (
													<span className="text-brand-taupe italic">
														No phone added
													</span>
												)}
											</p>
											<p className="flex items-center gap-2 text-brand-coffee text-sm">
												<Mail
													size={14}
													className="text-brand-taupe"
												/>
												{activeProfile.email || (
													<span className="text-brand-taupe italic">
														No email added
													</span>
												)}
											</p>
											<p className="flex items-center gap-2 text-brand-coffee text-sm">
												<MapPin
													size={14}
													className="text-brand-taupe"
												/>
												{activeProfile.location || (
													<span className="text-brand-taupe italic">
														No location added
													</span>
												)}
											</p>
										</div>
									</div>
								</div>
							) : (
								// EDIT MODE
								<div className="space-y-4">
									<div className="flex justify-between items-center mb-2 pb-2 border-b border-brand-brown/10">
										<h3 className="font-serif text-xl text-brand-espresso">
											Edit Profile
										</h3>
										<button
											onClick={handleEditToggle}
											className="text-brand-taupe hover:text-brand-coffee cursor-pointer"
										>
											<X size={20} />
										</button>
									</div>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">
												Name
											</label>
											<input
												type="text"
												value={editFormData.name}
												onChange={(e) =>
													setEditFormData({
														...editFormData,
														name: e.target.value,
													})
												}
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.name ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.name && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.name}
												</p>
											)}
										</div>
										<div>
											<label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">
												Phone
											</label>
											<input
												type="text"
												value={editFormData.phone}
												onChange={(e) =>
													setEditFormData({
														...editFormData,
														phone: e.target.value,
													})
												}
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.phone ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.phone && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.phone}
												</p>
											)}
										</div>
										<div>
											<label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">
												Email
											</label>
											<input
												type="email"
												value={editFormData.email}
												onChange={(e) =>
													setEditFormData({
														...editFormData,
														email: e.target.value,
													})
												}
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.email ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.email && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.email}
												</p>
											)}
										</div>
										<div>
											<label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">
												Location
											</label>
											<input
												type="text"
												value={editFormData.location}
												onChange={(e) =>
													setEditFormData({
														...editFormData,
														location:
															e.target.value,
													})
												}
												className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.location ? "border-red-400" : "border-brand-brown/20"}`}
											/>
											{errors.location && (
												<p className="text-red-500 text-[10px] mt-1">
													{errors.location}
												</p>
											)}
										</div>
									</div>
									<div className="flex gap-3 justify-end pt-2">
										<Button
											onClick={handleEditToggle}
											variant="outline"
											className="text-xs py-2 px-4 cursor-pointer"
										>
											Cancel
										</Button>
										<Button
											onClick={handleSaveEdit}
											variant="primary"
											className="text-xs py-2 px-6 cursor-pointer"
										>
											Save Changes
										</Button>
									</div>
								</div>
							)}
						</div>

						{/* Order History Section */}
						<div>
							<h3 className="text-xl font-serif text-brand-espresso mb-6 flex items-center gap-2">
								<Clock size={20} /> Order History
							</h3>

							{loadingOrders ? (
								<div className="text-center py-12 text-brand-taupe">
									Loading orders...
								</div>
							) : activeProfileOrders.length > 0 ? (
								<div className="space-y-4">
									{activeProfileOrders.map((order) => (
										<div
											key={order._id}
											className="bg-white rounded-xl border border-brand-brown/10 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
										>
											{/* Header */}
											<div className="bg-brand-coffee/5 p-6 border-b border-brand-brown/10">
												<div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
													<div>
														<p className="text-[10px] text-brand-taupe uppercase tracking-widest mb-1">
															Order #
															{order._id
																.slice(-6)
																.toUpperCase()}
														</p>
														<h4 className="font-serif text-lg text-brand-espresso">
															{new Date(
																order.createdAt,
															).toLocaleDateString(
																"en-IN",
																{
																	day: "numeric",
																	month: "long",
																	year: "numeric",
																},
															)}
														</h4>
													</div>
													<div className="flex items-center gap-4">
														<span
															className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
																order.status ===
																"Pending"
																	? "bg-yellow-50 text-yellow-700 border-yellow-200"
																	: order.status ===
																		  "Confirmed"
																		? "bg-green-50 text-green-700 border-green-200"
																		: order.status ===
																			  "Delivered"
																			? "bg-blue-50 text-blue-700 border-blue-200"
																			: "bg-gray-50 text-gray-600 border-gray-200"
															}`}
														>
															{order.status}
														</span>
														<span className="font-serif text-xl text-brand-coffee">
															₹{order.totalAmount}
														</span>
													</div>
												</div>
											</div>

											{/* Order Items Section */}
											<div className="p-6 border-b border-brand-brown/10">
												<h5 className="font-serif text-brand-espresso font-bold mb-4 flex items-center gap-2">
													<Package size={16} /> Order
													Items
												</h5>
												<div className="space-y-4">
													{order.items.map(
														(item, idx) => (
															<div
																key={idx}
																className="bg-brand-cream/30 rounded-lg p-4"
															>
																<div className="flex gap-4 mb-3">
																	{item.image && (
																		<div className="w-24 h-32 bg-brand-cream rounded-lg overflow-hidden shrink-0 border border-brand-brown/10">
																			<img
																				src={
																					item.image
																				}
																				alt={
																					item.name ||
																					"Order Item"
																				}
																				className="w-full h-full object-cover"
																			/>
																		</div>
																	)}
																	<div className="flex-1">
																		<p className="font-bold text-brand-coffee">
																			{item.name ||
																				item
																					.product
																					?.name ||
																				"Custom Garment"}
																		</p>
																		<p className="text-xs text-brand-taupe mt-1">
																			Quantity:{" "}
																			<span className="font-bold">
																				{
																					item.quantity
																				}
																			</span>
																		</p>
																		<p className="font-serif text-lg text-brand-coffee mt-2">
																			₹
																			{
																				item.price
																			}
																		</p>
																	</div>
																</div>
																<div className="flex flex-wrap gap-2 mt-2 text-xs">
																	{item.withFabric && (
																		<span className="bg-brand-coffee/10 text-brand-coffee px-2 py-1 rounded">
																			+
																			Fabric
																			Included
																		</span>
																	)}
																	{item.customization && (
																		<span className="bg-brand-rust/10 text-brand-rust px-2 py-1 rounded">
																			Customization
																		</span>
																	)}
																</div>
																{item.customization && (
																	<p className="text-xs text-brand-taupe mt-2 pt-2 border-t border-brand-brown/10">
																		<span className="font-bold">
																			Details:{" "}
																		</span>
																		{
																			item.customization
																		}
																	</p>
																)}
															</div>
														),
													)}
												</div>
											</div>

											{/* Appointment Details Section */}
											{order.appointment && (
												<div className="p-6 border-b border-brand-brown/10">
													<h5 className="font-serif text-brand-espresso font-bold mb-4 flex items-center gap-2">
														<Clock size={16} />{" "}
														Appointment Details
													</h5>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div className="bg-brand-cream/30 rounded-lg p-4">
															<p className="text-xs text-brand-taupe uppercase tracking-wider font-bold mb-1">
																Appointment Date
															</p>
															<p className="text-brand-coffee font-bold">
																{new Date(
																	order
																		.appointment
																		.date,
																).toLocaleDateString(
																	"en-IN",
																	{
																		day: "numeric",
																		month: "short",
																		year: "numeric",
																	},
																)}
															</p>
														</div>
														<div className="bg-brand-cream/30 rounded-lg p-4">
															<p className="text-xs text-brand-taupe uppercase tracking-wider font-bold mb-1">
																Time Slot
															</p>
															<p className="text-brand-coffee font-bold">
																{
																	order
																		.appointment
																		.timeSlot
																}
															</p>
														</div>
														{order.appointment
															.contactName && (
															<div className="bg-brand-cream/30 rounded-lg p-4">
																<p className="text-xs text-brand-taupe uppercase tracking-wider font-bold mb-1">
																	Contact Name
																</p>
																<p className="text-brand-coffee font-bold">
																	{
																		order
																			.appointment
																			.contactName
																	}
																</p>
															</div>
														)}
														{order.appointment
															.contactPhone && (
															<div className="bg-brand-cream/30 rounded-lg p-4">
																<p className="text-xs text-brand-taupe uppercase tracking-wider font-bold mb-1">
																	Contact
																	Phone
																</p>
																<p className="text-brand-coffee font-bold">
																	{
																		order
																			.appointment
																			.contactPhone
																	}
																</p>
															</div>
														)}
													</div>
												</div>
											)}

											{/* Address Details Section */}
											{order.appointment?.address && (
												<div className="p-6 border-b border-brand-brown/10">
													<h5 className="font-serif text-brand-espresso font-bold mb-4 flex items-center gap-2">
														<MapPin size={16} />{" "}
														Delivery Address
													</h5>
													<div className="bg-brand-cream/30 rounded-lg p-4 text-sm text-brand-coffee">
														{order.appointment
															.address.street && (
															<p>
																{
																	order
																		.appointment
																		.address
																		.street
																}
															</p>
														)}
														<p>
															{order.appointment
																.address.city &&
																`${order.appointment.address.city}, `}
															{order.appointment
																.address
																.state &&
																`${order.appointment.address.state}`}
														</p>
														{order.appointment
															.address.zip && (
															<p>
																Zip Code:{" "}
																{
																	order
																		.appointment
																		.address
																		.zip
																}
															</p>
														)}
													</div>
												</div>
											)}

											{/* Order Summary */}
											<div className="p-6 bg-brand-brown/5">
												<div className="flex justify-between items-center">
													<span className="text-brand-coffee font-bold">
														Total Amount:
													</span>
													<span className="font-serif text-2xl text-brand-coffee">
														₹{order.totalAmount}
													</span>
												</div>
											</div>
										</div>
									))}
								</div>
							) : (
								<div className="bg-brand-cream/30 border border-brand-brown/5 rounded-xl p-12 text-center">
									<div className="w-16 h-16 bg-brand-brown/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-taupe">
										<ShoppingBag size={24} />
									</div>
									<h4 className="font-serif text-lg text-brand-coffee mb-2">
										No Previous Orders
									</h4>
									<p className="text-brand-taupe text-sm mb-6 max-w-xs mx-auto">
										There are no completed orders linked to{" "}
										<strong>{activeProfile.name}</strong>{" "}
										yet.
									</p>
									<Button
										onClick={() => navigate("/products")}
										variant="primary"
										className="text-xs py-3 px-6 cursor-pointer"
									>
										Browse Collection
									</Button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
