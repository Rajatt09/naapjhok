import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import {
	User,
	Calendar,
	Scissors,
	Trash2,
	ArrowRight,
	ShoppingBag,
} from "lucide-react";
import Button from "../components/Button";
import { useToast } from "../context/ToastContext";

const Cart = () => {
	const { user } = useAuth();
	const { cart, profiles, removeFromCart, getCartTotal } = useCart();
    const { addToast } = useToast();
	const navigate = useNavigate();
	const location = useLocation();

	// Redirect if not logged in
	if (!user) {
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-brand-cream pt-36">
				<div className="w-24 h-24 bg-brand-brown/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
					<ShoppingBag
						size={48}
						className="text-brand-brown opacity-50"
					/>
				</div>
				<h2 className="text-4xl font-serif text-brand-espresso mb-4">
					You're not logged in.
				</h2>
				<p className="text-brand-taupe mb-8 max-w-md text-lg">
					Sign in to view your cart and start your bespoke journey.
				</p>
				<Button
					variant="primary"
					onClick={() => navigate("/login")}
					className="px-8 py-3"
				>
					Login / Sign Up
				</Button>
			</div>
		);
	}

	// Group items by profile to identify which profiles have active orders
	const groupedCart = useMemo(() => {
		const groups = {};
		cart.forEach((item) => {
			const pid = item.profileId || "me";
			if (!groups[pid]) groups[pid] = [];
			groups[pid].push(item);
		});
		return groups;
	}, [cart]);

	// Active Profile State
	const [activeProfileId, setActiveProfileId] = useState(null);
	const [removingIds, setRemovingIds] = useState([]);

	// Initialize active profile (default to first one in the list or 'me')
	useEffect(() => {
		const activeProfiles = Object.keys(groupedCart);

		// If current active profile is no longer valid (has no items)
		if (activeProfileId && !activeProfiles.includes(activeProfileId)) {
			// Switch to first available profile if any
			if (activeProfiles.length > 0) {
				setActiveProfileId(activeProfiles[0]);
			} else {
				setActiveProfileId(null);
			}
		}
		// Initial load or if no active profile set
		else if (activeProfiles.length > 0 && !activeProfileId) {
			// If passed active profile state from navigation
			if (
				location.state?.activeProfileId &&
				activeProfiles.includes(location.state.activeProfileId)
			) {
				setActiveProfileId(location.state.activeProfileId);
			} else {
				setActiveProfileId(activeProfiles[0]);
			}
		} else if (activeProfiles.length === 0) {
			setActiveProfileId(null);
		}
	}, [groupedCart, activeProfileId, location.state]);

	const getProfileDetails = (pid) => {
		const profile = profiles.find((p) => p._id === pid || p.name === pid);
		return profile || { name: "Unknown", isSelf: false };
	};

	const activeProfileItems = useMemo(() => {
		return activeProfileId ? groupedCart[activeProfileId] || [] : [];
	}, [activeProfileId, groupedCart]);

	const activeProfileSubtotal = useMemo(() => {
		return activeProfileItems.reduce(
			(sum, i) =>
				sum +
				(i.withFabric
					? Number(i.product?.basePrice || 0) +
						Number(i.product?.fabricPrice || 0)
					: Number(i.product?.basePrice || 0)),
			0,
		);
	}, [activeProfileItems]);

	if (cart.length === 0) {
		return (
			<div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-brand-cream pt-36">
				<div className="w-24 h-24 bg-brand-brown/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
					<ShoppingBag
						size={48}
						className="text-brand-brown opacity-50"
					/>
				</div>
				<h2 className="text-4xl font-serif text-brand-espresso mb-4">
					Your cart is waiting.
				</h2>
				<p className="text-brand-taupe mb-8 max-w-md text-lg">
					Start your bespoke journey by exploring our exclusive
					handcrafted collection.
				</p>
				<Button
					variant="primary"
					onClick={() => navigate("/products")}
					className="px-8 py-3"
				>
					Browse Collection
				</Button>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-brand-cream pt-36 pb-20 px-4 md:px-8">
			<div className="container-custom max-w-7xl mx-auto">
				{/* Global Header */}
				<div className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-brand-brown/20 pb-6 gap-6">
					<div>
						<p className="text-brand-rust uppercase tracking-[0.2em] text-xs font-bold mb-2">
							Bespoke Orders
						</p>
						<h2 className="text-4xl md:text-5xl font-serif text-brand-espresso">
							Your Cart
						</h2>
					</div>
					<div className="text-right">
						<p className="text-xs text-brand-taupe uppercase tracking-widest mb-1">
							Grand Total
						</p>
						<p className="text-3xl font-serif text-brand-coffee">
							₹{getCartTotal()}
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
					{/* LEFT SIDEBAR: PROFILE TABS */}
					<div className="lg:col-span-1 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-4 pb-4 lg:pb-0 sticky top-32 z-40 lg:pr-4 no-scrollbar">
						{Object.keys(groupedCart).map((pid) => {
							const details = getProfileDetails(pid);
							const items = groupedCart[pid];
							const isActive = activeProfileId === pid;

							return (
								<button
									key={pid}
									onClick={() => setActiveProfileId(pid)}
									className={`flex-shrink-0 lg:flex-shrink w-64 lg:w-full p-4 rounded-xl text-left transition-all duration-300 border ${
										isActive
											? "bg-brand-coffee text-brand-cream shadow-lg border-brand-coffee transform scale-[1.02]"
											: "bg-white text-brand-espresso border-brand-brown/10 hover:border-brand-coffee/30 hover:bg-brand-brown/5"
									}`}
								>
									<div className="flex justify-between items-start mb-2">
										<div
											className={`w-8 h-8 rounded-full flex items-center justify-center ${isActive ? "bg-brand-cream/20 text-brand-cream" : "bg-brand-brown/10 text-brand-brown"}`}
										>
											<User size={16} />
										</div>
										<span
											className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? "text-brand-cream/60" : "text-brand-taupe"}`}
										>
											{items.length} Items
										</span>
									</div>
									<h4 className="font-serif text-lg truncate mb-1">
										{details.name}{" "}
										{details.isSelf && "(You)"}
									</h4>
									<p
										className={`text-xs ${isActive ? "text-brand-cream/80" : "text-brand-coffee/70"}`}
									>
										Subtotal: ₹
										{items.reduce(
											(s, i) =>
												s +
												(i.withFabric
													? Number(
															i.product.basePrice,
														) +
														Number(
															i.product
																.fabricPrice,
														)
													: Number(
															i.product.basePrice,
														)),
											0,
										)}
									</p>
								</button>
							);
						})}
					</div>

					{/* RIGHT CONTENT: ACTIVE ITEMS */}
					<div className="lg:col-span-3 space-y-6">
						{activeProfileId && activeProfileItems.length > 0 && (
							<div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
								{/* Active Profile Header Card */}
								<div className="bg-white rounded-xl shadow-sm border border-brand-brown/10 p-6 flex flex-col sm:flex-row justify-between items-center gap-6 mb-6">
									<div className="flex items-center gap-4">
										<div className="w-16 h-16 bg-brand-rust/10 text-brand-rust rounded-full flex items-center justify-center">
											<User size={32} />
										</div>
										<div>
											<p className="text-xs text-brand-taupe uppercase tracking-wider mb-1">
												Ordering For
											</p>
											<h3 className="text-2xl font-serif text-brand-espresso">
												{
													getProfileDetails(
														activeProfileId,
													).name
												}
											</h3>
										</div>
									</div>
									<Button
										variant="primary"
										onClick={() =>
											navigate("/book-appointment", {
												state: {
													profileId: activeProfileId,
												},
											})
										}
										className="w-full sm:w-auto px-8 py-3"
									>
										<div className="flex items-center gap-2">
											<Calendar size={18} /> Book
											Appointment
										</div>
									</Button>
								</div>

								{/* Items List */}
								<div className="bg-white rounded-xl shadow-sm border border-brand-brown/10 divide-y divide-brand-brown/5 overflow-hidden">
									{activeProfileItems.map((item) => (
										<div
											key={item._id}
											className="p-6 md:p-8 flex flex-col md:flex-row gap-6 group hover:bg-brand-cream/20 transition-colors"
										>
											{/* Image */}
											<div className="w-full md:w-32 h-40 bg-brand-brown/10 flex-shrink-0 overflow-hidden rounded-lg relative">
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
													className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
												/>
												{item.withFabric && (
													<div className="absolute top-2 right-2 bg-brand-rust text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
														+ FABRIC
													</div>
												)}
											</div>

											{/* Details */}
											<div className="flex-1 flex flex-col justify-between">
												<div>
													<div className="flex justify-between items-start mb-2">
														<h4 className="text-xl font-serif text-brand-espresso">
															{item.product
																?.name ||
																item.name}
														</h4>
														<p className="font-serif text-xl text-brand-coffee">
															₹
															{item.withFabric
																? Number(
																		item
																			.product
																			?.basePrice ||
																			0,
																	) +
																	Number(
																		item
																			.product
																			?.fabricPrice ||
																			0,
																	)
																: Number(
																		item
																			.product
																			?.basePrice ||
																			0,
																	)}
														</p>
													</div>
													<p className="text-sm text-brand-taupe mb-4">
														{item.product?.category}{" "}
														•{" "}
														{item.withFabric
															? "Bespoke Stitching & Fabric"
															: "Stitching Service Only"}
													</p>

													{/* Customization Chips */}
													{item.withFabric &&
														item.customization && (
															<div className="flex flex-wrap gap-3">
																{item
																	.customization
																	.fabricType && (
																	<span className="px-3 py-1 bg-brand-brown/5 border border-brand-brown/10 rounded text-xs text-brand-coffee">
																		<span className="font-bold">
																			Fabric:
																		</span>{" "}
																		{
																			item
																				.customization
																				.fabricType
																		}
																	</span>
																)}
																{item
																	.customization
																	.color && (
																	<span className="px-3 py-1 bg-brand-brown/5 border border-brand-brown/10 rounded text-xs text-brand-coffee">
																		<span className="font-bold">
																			Color:
																		</span>{" "}
																		{
																			item
																				.customization
																				.color
																		}
																	</span>
																)}
																{item
																	.customization
																	.referenceImage && (
																	<span className="px-3 py-1 bg-brand-brown/5 border border-brand-brown/10 rounded text-xs text-brand-coffee flex items-center gap-1">
																		<span className="font-bold">
																			Ref:
																		</span>{" "}
																		Uploaded
																	</span>
																)}
															</div>
														)}
												</div>

												<div className="mt-4 md:mt-0 pt-4 flex justify-end">
													<button
														onClick={async () => {
															if (
																removingIds.includes(
																	item._id,
																)
															)
																return;
															setRemovingIds(
																(prev) => [
																	...prev,
																	item._id,
																],
															);
															const success =
																await removeFromCart(
																	item._id,
																);
															if (!success) {
																addToast(
																	"Failed to remove item. Please try again.",
                                                                    "error"
																);
																setRemovingIds(
																	(prev) =>
																		prev.filter(
																			(
																				id,
																			) =>
																				id !==
																				item._id,
																		),
																); // Reset on fail
															}
															// On success, item disappears from list naturally
														}}
														disabled={removingIds.includes(
															item._id,
														)}
														className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors group/delete ${
															removingIds.includes(
																item._id,
															)
																? "text-brand-taupe/50 cursor-wait"
																: "text-brand-taupe hover:text-red-600 cursor-pointer"
														}`}
													>
														{removingIds.includes(
															item._id,
														) ? (
															<span>
																Removing...
															</span>
														) : (
															<>
																<Trash2
																	size={16}
																	className="group-hover/delete:stroke-red-600"
																/>{" "}
																Remove Item
															</>
														)}
													</button>
												</div>
											</div>
										</div>
									))}
								</div>

								{/* Active Profile Footer */}
								<div className="mt-6 flex justify-end items-center gap-4 text-brand-coffee">
									<span className="text-sm uppercase tracking-widest opacity-70">
										Total for{" "}
										{
											getProfileDetails(activeProfileId)
												.name
										}
									</span>
									<span className="text-3xl font-serif">
										₹{activeProfileSubtotal}
									</span>
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default Cart;
