import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
	Users,
	Package,
	ShoppingBag,
	TrendingUp,
	LogOut,
	ChevronRight,
} from "lucide-react";
import api from "../../utils/api";

const AdminDashboard = () => {
	const { user, logout } = useAuth();
	const navigate = useNavigate();
	const [stats, setStats] = useState(null);
	const [recentOrders, setRecentOrders] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/login");
			return;
		}
		fetchDashboardData();
	}, [user, navigate]);

	const fetchDashboardData = async () => {
		try {
			const res = await api.get("/admin/stats");
			setStats(res.data.data.stats);
			setRecentOrders(res.data.data.recentOrders);
		} catch (error) {
			console.error("Error fetching dashboard data:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		logout();
		navigate("/login");
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
				<div className="container-custom py-6 flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-serif">Admin Dashboard</h1>
						<p className="text-brand-cream/70 text-sm mt-1">
							Welcome back, {user?.name}
						</p>
					</div>
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 px-4 py-2 bg-brand-cream/10 hover:bg-brand-cream/20 rounded-lg transition-colors text-sm font-medium"
					>
						<LogOut size={16} /> Logout
					</button>
				</div>
			</div>

			<div className="container-custom py-12">
				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
					<div className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-brand-rust/10 rounded-lg flex items-center justify-center">
								<Users size={24} className="text-brand-rust" />
							</div>
							<TrendingUp size={20} className="text-green-500" />
						</div>
						<h3 className="text-2xl font-bold text-brand-espresso mb-1">
							{stats?.totalUsers || 0}
						</h3>
						<p className="text-brand-taupe text-sm">Total Users</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-brand-coffee/10 rounded-lg flex items-center justify-center">
								<ShoppingBag
									size={24}
									className="text-brand-coffee"
								/>
							</div>
							<TrendingUp size={20} className="text-green-500" />
						</div>
						<h3 className="text-2xl font-bold text-brand-espresso mb-1">
							{stats?.totalOrders || 0}
						</h3>
						<p className="text-brand-taupe text-sm">Total Orders</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-brand-brown/10 rounded-lg flex items-center justify-center">
								<Package
									size={24}
									className="text-brand-brown"
								/>
							</div>
						</div>
						<h3 className="text-2xl font-bold text-brand-espresso mb-1">
							{stats?.totalProducts || 0}
						</h3>
						<p className="text-brand-taupe text-sm">
							Total Products
						</p>
					</div>

					<div className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10">
						<div className="flex items-center justify-between mb-4">
							<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
								<span className="text-xl font-bold text-green-600">
									₹
								</span>
							</div>
							<TrendingUp size={20} className="text-green-500" />
						</div>
						<h3 className="text-2xl font-bold text-brand-espresso mb-1">
							₹{stats?.totalRevenue || 0}
						</h3>
						<p className="text-brand-taupe text-sm">
							Total Revenue
						</p>
					</div>
				</div>

				{/* Quick Actions */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
					<button
						onClick={() => navigate("/admin/users")}
						className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10 hover:border-brand-coffee transition-all text-left group"
					>
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-2">
									Manage Users
								</h3>
								<p className="text-brand-taupe text-sm">
									View all users and their profiles
								</p>
							</div>
							<ChevronRight className="text-brand-taupe group-hover:text-brand-coffee group-hover:translate-x-1 transition-all" />
						</div>
					</button>

					<button
						onClick={() => navigate("/admin/products")}
						className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10 hover:border-brand-coffee transition-all text-left group"
					>
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-2">
									Manage Products
								</h3>
								<p className="text-brand-taupe text-sm">
									Add, edit or remove products
								</p>
							</div>
							<ChevronRight className="text-brand-taupe group-hover:text-brand-coffee group-hover:translate-x-1 transition-all" />
						</div>
					</button>

					<button
						onClick={() => navigate("/admin/orders")}
						className="bg-white p-6 rounded-xl shadow-md border border-brand-brown/10 hover:border-brand-coffee transition-all text-left group"
					>
						<div className="flex items-center justify-between">
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-2">
									All Orders
								</h3>
								<p className="text-brand-taupe text-sm">
									View and manage all orders
								</p>
							</div>
							<ChevronRight className="text-brand-taupe group-hover:text-brand-coffee group-hover:translate-x-1 transition-all" />
						</div>
					</button>
				</div>

				{/* Recent Orders */}
				<div className="bg-white rounded-xl shadow-md border border-brand-brown/10 overflow-hidden">
					<div className="p-6 border-b border-brand-brown/10">
						<h2 className="text-2xl font-serif text-brand-espresso">
							Recent Orders
						</h2>
					</div>
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
										Amount
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Status
									</th>
									<th className="text-left p-4 text-sm font-bold text-brand-coffee uppercase tracking-wider">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-brand-brown/5">
								{recentOrders.map((order) => (
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
										<td className="p-4 text-sm text-brand-coffee font-semibold">
											₹{order.totalAmount}
										</td>
										<td className="p-4">
											<span
												className={`px-3 py-1 rounded-full text-xs font-bold ${
													order.status === "Pending"
														? "bg-yellow-100 text-yellow-700"
														: order.status ===
															  "Completed"
															? "bg-green-100 text-green-700"
															: "bg-gray-100 text-gray-700"
												}`}
											>
												{order.status}
											</span>
										</td>
										<td className="p-4 text-sm text-brand-taupe">
											{new Date(
												order.createdAt,
											).toLocaleDateString()}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AdminDashboard;
