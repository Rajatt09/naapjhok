import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
	ChevronLeft,
	Calendar,
	User,
	Package,
	MapPin,
	Phone,
} from "lucide-react";
import api from "../../utils/api";

const AdminOrders = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [orders, setOrders] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedOrder, setSelectedOrder] = useState(null);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/login");
			return;
		}
		fetchOrders();
	}, [user, navigate]);

	const fetchOrders = async () => {
		try {
			const res = await api.get("/admin/orders");
			setOrders(res.data.data.orders || []);
		} catch (error) {
			console.error("Error fetching orders:", error);
		} finally {
			setLoading(false);
		}
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Pending":
				return "bg-yellow-100 text-yellow-700";
			case "Completed":
				return "bg-green-100 text-green-700";
			case "Cancelled":
				return "bg-red-100 text-red-700";
			default:
				return "bg-gray-100 text-gray-700";
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-brand-cream flex items-center justify-center">
				<div className="text-brand-coffee text-xl">Loading...</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-brand-cream">
			{/* Header */}
			<div className="bg-brand-coffee text-brand-cream shadow-lg">
				<div className="container-custom py-6">
					<button
						onClick={() => navigate("/admin")}
						className="flex items-center gap-2 text-brand-cream/70 hover:text-brand-cream mb-4 text-sm transition-colors"
					>
						<ChevronLeft size={16} /> Back to Dashboard
					</button>
					<h1 className="text-3xl font-serif">Orders Management</h1>
					<p className="text-brand-cream/70 text-sm mt-1">
						{orders.length} total orders
					</p>
				</div>
			</div>

			<div className="container-custom py-12">
				{/* Orders Table */}
				<div className="bg-white rounded-xl shadow-md border border-brand-brown/10 overflow-hidden">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="bg-brand-cream/50">
								<tr>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Order ID
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Customer
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Profile
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Items
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Amount
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Status
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Date
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-brown/5">
								{orders.map((order) => (
									<tr
										key={order._id}
										className="hover:bg-brand-cream/30 transition-colors"
									>
										<td className="p-4 text-sm text-brand-espresso font-mono">
											#{order._id.slice(-8)}
										</td>
										<td className="p-4 text-sm text-brand-espresso">
											{order.user?.name || "Unknown"}
										</td>
										<td className="p-4 text-sm text-brand-taupe">
											{order.profileId || "Main"}
										</td>
										<td className="p-4 text-sm text-brand-taupe">
											{order.items?.length || 0} items
										</td>
										<td className="p-4 text-sm text-brand-coffee font-semibold">
											₹{order.totalAmount}
										</td>
										<td className="p-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}
											>
												{order.status}
											</span>
										</td>
										<td className="p-4 text-sm text-brand-taupe">
											{new Date(
												order.createdAt,
											).toLocaleDateString()}
										</td>
										<td className="p-4">
											<button
												onClick={() =>
													setSelectedOrder(order)
												}
												className="text-brand-coffee hover:text-brand-rust text-sm font-medium underline"
											>
												View Details
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{orders.length === 0 && (
					<div className="text-center py-12 bg-white rounded-xl shadow-md">
						<Package
							size={48}
							className="mx-auto text-brand-taupe mb-4"
						/>
						<p className="text-brand-taupe text-lg">
							No orders yet
						</p>
					</div>
				)}
			</div>

			{/* Order Details Modal */}
			{selectedOrder && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedOrder(null)}
				>
					<div
						className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6 border-b border-brand-brown/10 flex justify-between items-center sticky top-0 bg-white">
							<div>
								<h2 className="text-2xl font-serif text-brand-espresso">
									Order Details
								</h2>
								<p className="text-sm text-brand-taupe mt-1">
									Order #{selectedOrder._id.slice(-8)}
								</p>
							</div>
							<button
								onClick={() => setSelectedOrder(null)}
								className="text-brand-taupe hover:text-brand-espresso"
							>
								✕
							</button>
						</div>

						<div className="p-6 space-y-6">
							{/* Customer Info */}
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="bg-brand-cream/30 p-4 rounded-lg">
									<h3 className="text-sm font-bold text-brand-coffee uppercase tracking-wider mb-3">
										Customer Information
									</h3>
									<div className="space-y-2">
										<p className="flex items-center gap-2 text-sm">
											<User
												size={16}
												className="text-brand-coffee"
											/>
											<span className="text-brand-espresso">
												{selectedOrder.user?.name ||
													"Unknown"}
											</span>
										</p>
										<p className="flex items-center gap-2 text-sm">
											<Phone
												size={16}
												className="text-brand-coffee"
											/>
											<span className="text-brand-taupe">
												{selectedOrder.user?.phone ||
													"N/A"}
											</span>
										</p>
									</div>
								</div>

								<div className="bg-brand-cream/30 p-4 rounded-lg">
									<h3 className="text-sm font-bold text-brand-coffee uppercase tracking-wider mb-3">
										Appointment Details
									</h3>
									<div className="space-y-2">
										<p className="flex items-center gap-2 text-sm">
											<Calendar
												size={16}
												className="text-brand-coffee"
											/>
											<span className="text-brand-espresso">
												{selectedOrder.appointment?.date
													? new Date(
															selectedOrder
																.appointment
																.date,
														).toLocaleDateString()
													: "Not scheduled"}
											</span>
										</p>
										{selectedOrder.appointment?.address && (
											<p className="flex items-start gap-2 text-sm">
												<MapPin
													size={16}
													className="text-brand-coffee mt-0.5"
												/>
												<span className="text-brand-taupe">
													{selectedOrder.appointment
														.address.street &&
														`${selectedOrder.appointment.address.street}, `}
													{selectedOrder.appointment
														.address.city &&
														`${selectedOrder.appointment.address.city}, `}
													{selectedOrder.appointment
														.address.state &&
														selectedOrder
															.appointment.address
															.state}
													{selectedOrder.appointment
														.address.zip &&
														` - ${selectedOrder.appointment.address.zip}`}
												</span>
											</p>
										)}
									</div>
								</div>
							</div>

							{/* Order Items */}
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-4">
									Order Items
								</h3>
								<div className="space-y-3">
									{selectedOrder.items?.map((item, idx) => (
										<div
											key={idx}
											className="bg-brand-cream/20 p-4 rounded-lg border border-brand-brown/10"
										>
											<div className="flex gap-4 mb-3">
												{item.image && (
													<div className="w-24 h-32 bg-brand-cream rounded-lg overflow-hidden shrink-0 border border-brand-brown/10">
														<img
															src={item.image}
															alt={
																item.name ||
																"Order Item"
															}
															className="w-full h-full object-cover"
														/>
													</div>
												)}
												<div className="flex-1">
													<h4 className="font-serif text-brand-espresso font-bold">
														{item.name ||
															item.product
																?.name ||
															"Custom Garment"}
													</h4>
													<p className="text-xs text-brand-taupe mt-1">
														Quantity:{" "}
														<span className="font-bold">
															{item.quantity || 1}
														</span>
													</p>
													<div className="flex flex-wrap gap-2 mt-2 text-xs">
														{item.withFabric && (
															<span className="bg-brand-coffee/10 text-brand-coffee px-2 py-1 rounded">
																+ Fabric
																Included
															</span>
														)}
														{item.customization && (
															<span className="bg-brand-rust/10 text-brand-rust px-2 py-1 rounded">
																Customization
															</span>
														)}
													</div>
													<p className="text-brand-coffee font-semibold mt-2 text-lg">
														₹{item.price || 0}
													</p>
												</div>
											</div>

											{item.customization && (
												<div className="mt-3 pt-3 border-t border-brand-brown/10">
													<p className="text-xs font-bold text-brand-coffee uppercase tracking-wider mb-2">
														Customization Details
													</p>
													<p className="text-sm text-brand-taupe">
														{item.customization}
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							</div>

							{/* Total */}
							<div className="border-t border-brand-brown/10 pt-4">
								<div className="flex justify-between items-center">
									<span className="text-lg font-serif text-brand-espresso">
										Total Amount
									</span>
									<span className="text-2xl font-bold text-brand-coffee">
										₹{selectedOrder.totalAmount}
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminOrders;
