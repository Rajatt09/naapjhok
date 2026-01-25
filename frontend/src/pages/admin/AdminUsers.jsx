import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
	Search,
	ChevronLeft,
	User,
	Mail,
	Phone,
	MapPin,
	Trash2,
	Eye,
} from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/Button";

const AdminUsers = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [users, setUsers] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [searchTerm, setSearchTerm] = useState("");
	const [loading, setLoading] = useState(true);
	const [selectedUser, setSelectedUser] = useState(null);
	const [userOrders, setUserOrders] = useState([]);
	const [loadingOrders, setLoadingOrders] = useState(false);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/login");
			return;
		}
		fetchUsers();
	}, [user, navigate]);

	const fetchUsers = async () => {
		try {
			const res = await api.get("/admin/users");
			setUsers(res.data.data.users);
			setFilteredUsers(res.data.data.users);
		} catch (error) {
			console.error("Error fetching users:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleSearch = (value) => {
		setSearchTerm(value);
		const filtered = users.filter(
			(u) =>
				u.name.toLowerCase().includes(value.toLowerCase()) ||
				u.email.toLowerCase().includes(value.toLowerCase()) ||
				u.phone.includes(value),
		);
		setFilteredUsers(filtered);
	};

	const fetchUserOrders = async (userId) => {
		setLoadingOrders(true);
		try {
			const res = await api.get(`/admin/users/${userId}`);
			setUserOrders(res.data.data.orders || []);
		} catch (error) {
			console.error("Error fetching user orders:", error);
			setUserOrders([]);
		} finally {
			setLoadingOrders(false);
		}
	};

	const handleViewUser = (usr) => {
		setSelectedUser(usr);
		fetchUserOrders(usr._id);
	};

	const handleDeleteUser = async (userId) => {
		if (
			!window.confirm(
				"Are you sure you want to delete this user and all their data?",
			)
		)
			return;

		try {
			await api.delete(`/admin/users/${userId}`);
			setUsers(users.filter((u) => u._id !== userId));
			setFilteredUsers(filteredUsers.filter((u) => u._id !== userId));
			alert("User deleted successfully");
		} catch (error) {
			console.error("Error deleting user:", error);
			alert("Failed to delete user");
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
					<h1 className="text-3xl font-serif">User Management</h1>
					<p className="text-brand-cream/70 text-sm mt-1">
						{filteredUsers.length} users registered
					</p>
				</div>
			</div>

			<div className="container-custom py-12">
				{/* Search Bar */}
				<div className="mb-8">
					<div className="relative max-w-md">
						<Search
							className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-taupe"
							size={20}
						/>
						<input
							type="text"
							value={searchTerm}
							onChange={(e) => handleSearch(e.target.value)}
							placeholder="Search by name, email or phone..."
							className="w-full pl-12 pr-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none transition-all"
						/>
					</div>
				</div>

				{/* Users Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredUsers.map((usr) => (
						<div
							key={usr._id}
							className="bg-white rounded-xl shadow-md border border-brand-brown/10 overflow-hidden hover:shadow-lg transition-shadow"
						>
							{/* User Header */}
							<div className="bg-brand-coffee/5 p-6 border-b border-brand-brown/10">
								<div className="flex items-center gap-4">
									<div className="w-16 h-16 bg-brand-coffee text-brand-cream rounded-full flex items-center justify-center text-2xl font-serif">
										{usr.name.charAt(0).toUpperCase()}
									</div>
									<div className="flex-1">
										<h3 className="text-lg font-serif text-brand-espresso mb-1">
											{usr.name}
										</h3>
										<span className="text-xs px-2 py-1 bg-brand-rust/10 text-brand-rust rounded-full font-medium">
											{usr.gender}
										</span>
									</div>
								</div>
							</div>

							{/* User Details */}
							<div className="p-6 space-y-3">
								<div className="flex items-center gap-3 text-sm text-brand-taupe">
									<Mail
										size={16}
										className="text-brand-coffee"
									/>
									<span className="truncate">
										{usr.email}
									</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-brand-taupe">
									<Phone
										size={16}
										className="text-brand-coffee"
									/>
									<span>{usr.phone}</span>
								</div>
								<div className="flex items-center gap-3 text-sm text-brand-taupe">
									<MapPin
										size={16}
										className="text-brand-coffee"
									/>
									<span>
										{usr.addresses?.[0]?.city ||
											"No location"}
									</span>
								</div>

								{/* Sub-profiles */}
								{usr.profiles && usr.profiles.length > 0 && (
									<div className="mt-4 pt-4 border-t border-brand-brown/10">
										<p className="text-xs font-bold text-brand-coffee uppercase tracking-wider mb-2">
											Sub-Profiles ({usr.profiles.length})
										</p>
										<div className="space-y-2">
											{usr.profiles
												.slice(0, 3)
												.map((profile) => (
													<div
														key={profile._id}
														className="flex items-center gap-2 text-sm"
													>
														<User
															size={14}
															className="text-brand-taupe"
														/>
														<span className="text-brand-espresso truncate">
															{profile.name}
														</span>
													</div>
												))}
											{usr.profiles.length > 3 && (
												<p className="text-xs text-brand-taupe italic">
													+{usr.profiles.length - 3}{" "}
													more
												</p>
											)}
										</div>
									</div>
								)}
							</div>

							{/* Actions */}
							<div className="p-4 bg-brand-cream/30 border-t border-brand-brown/10 flex gap-2">
								<button
									onClick={() => handleViewUser(usr)}
									className="flex-1 py-2 px-4 bg-brand-coffee text-brand-cream rounded-lg hover:bg-brand-espresso transition-colors text-sm font-medium flex items-center justify-center gap-2"
								>
									<Eye size={16} /> View Details
								</button>
								<button
									onClick={() => handleDeleteUser(usr._id)}
									className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
								>
									<Trash2 size={16} />
								</button>
							</div>
						</div>
					))}
				</div>

				{filteredUsers.length === 0 && (
					<div className="text-center py-12">
						<p className="text-brand-taupe text-lg">
							No users found
						</p>
					</div>
				)}
			</div>

			{/* User Details Modal */}
			{selectedUser && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={() => setSelectedUser(null)}
				>
					<div
						className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6 border-b border-brand-brown/10 flex justify-between items-center sticky top-0 bg-white">
							<h2 className="text-2xl font-serif text-brand-espresso">
								User Details
							</h2>
							<button
								onClick={() => setSelectedUser(null)}
								className="text-brand-taupe hover:text-brand-espresso"
							>
								✕
							</button>
						</div>
						<div className="p-6 space-y-6">
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-4">
									Main Profile
								</h3>
								<div className="space-y-3 bg-brand-cream/30 p-4 rounded-lg">
									<p>
										<span className="font-bold text-brand-coffee">
											Name:
										</span>{" "}
										{selectedUser.name}
									</p>
									<p>
										<span className="font-bold text-brand-coffee">
											Email:
										</span>{" "}
										{selectedUser.email}
									</p>
									<p>
										<span className="font-bold text-brand-coffee">
											Phone:
										</span>{" "}
										{selectedUser.phone}
									</p>
									<p>
										<span className="font-bold text-brand-coffee">
											Gender:
										</span>{" "}
										{selectedUser.gender}
									</p>
									<p>
										<span className="font-bold text-brand-coffee">
											Location:
										</span>{" "}
										{selectedUser.addresses?.[0]?.city ||
											"Not specified"}
									</p>
								</div>
							</div>

							{selectedUser.profiles &&
								selectedUser.profiles.length > 0 && (
									<div>
										<h3 className="text-lg font-serif text-brand-espresso mb-4">
											Sub-Profiles
										</h3>
										<div className="space-y-3">
											{selectedUser.profiles.map(
												(profile) => (
													<div
														key={profile._id}
														className="bg-brand-cream/30 p-4 rounded-lg"
													>
														<p className="font-bold text-brand-espresso mb-2">
															{profile.name}
														</p>
														<p className="text-sm text-brand-taupe">
															Phone:{" "}
															{profile.phone}
														</p>
														{profile.email && (
															<p className="text-sm text-brand-taupe">
																Email:{" "}
																{profile.email}
															</p>
														)}
														{profile.location && (
															<p className="text-sm text-brand-taupe">
																Location:{" "}
																{
																	profile.location
																}
															</p>
														)}
													</div>
												),
											)}
										</div>
									</div>
								)}

							{/* Orders Section */}
							<div>
								<h3 className="text-lg font-serif text-brand-espresso mb-4">
									Order History
								</h3>
								{loadingOrders ? (
									<div className="text-center py-8 text-brand-taupe">
										Loading orders...
									</div>
								) : userOrders.length > 0 ? (
									<div className="space-y-4">
										{/* Main Profile Orders */}
										{userOrders.filter(
											(order) => order.profileId === "me",
										).length > 0 && (
											<div>
												<h4 className="text-sm font-bold text-brand-coffee uppercase tracking-wider mb-3">
													Main Profile Orders (
													{
														userOrders.filter(
															(order) =>
																order.profileId ===
																"me",
														).length
													}
													)
												</h4>
												<div className="space-y-2">
													{userOrders
														.filter(
															(order) =>
																order.profileId ===
																"me",
														)
														.map((order) => (
															<div
																key={order._id}
																className="bg-brand-cream/30 p-3 rounded-lg border border-brand-brown/10"
															>
																<div className="flex justify-between items-center">
																	<div>
																		<p className="text-xs text-brand-taupe">
																			#
																			{order._id.slice(
																				-8,
																			)}
																		</p>
																		<p className="text-sm text-brand-espresso">
																			{order
																				.items
																				?.length ||
																				0}{" "}
																			items
																			• ₹
																			{
																				order.totalAmount
																			}
																		</p>
																	</div>
																	<span className="text-xs px-2 py-1 bg-brand-rust/10 text-brand-rust rounded">
																		{
																			order.status
																		}
																	</span>
																</div>
															</div>
														))}
												</div>
											</div>
										)}

										{/* Sub-Profile Orders */}
										{selectedUser.profiles?.map(
											(profile) => {
												const profileOrders =
													userOrders.filter(
														(order) =>
															order.profileId ===
															profile.name,
													);
												if (profileOrders.length === 0)
													return null;

												return (
													<div key={profile._id}>
														<h4 className="text-sm font-bold text-brand-coffee uppercase tracking-wider mb-3 mt-4">
															{profile.name}'s
															Orders (
															{
																profileOrders.length
															}
															)
														</h4>
														<div className="space-y-2">
															{profileOrders.map(
																(order) => (
																	<div
																		key={
																			order._id
																		}
																		className="bg-brand-cream/30 p-3 rounded-lg border border-brand-brown/10"
																	>
																		<div className="flex justify-between items-center">
																			<div>
																				<p className="text-xs text-brand-taupe">
																					#
																					{order._id.slice(
																						-8,
																					)}
																				</p>
																				<p className="text-sm text-brand-espresso">
																					{order
																						.items
																						?.length ||
																						0}{" "}
																					items
																					•
																					₹
																					{
																						order.totalAmount
																					}
																				</p>
																			</div>
																			<span className="text-xs px-2 py-1 bg-brand-rust/10 text-brand-rust rounded">
																				{
																					order.status
																				}
																			</span>
																		</div>
																	</div>
																),
															)}
														</div>
													</div>
												);
											},
										)}
									</div>
								) : (
									<p className="text-brand-taupe text-sm text-center py-6 bg-brand-cream/20 rounded-lg">
										No orders found
									</p>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminUsers;
