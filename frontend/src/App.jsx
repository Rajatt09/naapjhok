import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProductListing from "./pages/ProductListing";
import Cart from "./pages/Cart";
import Booking from "./pages/Booking";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";
import "./index.css";

const ProtectedRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-brand-coffee border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	if (!user) return <Navigate to="/login" replace />;
	if (user.role === "admin") return <Navigate to="/admin" replace />;

	return children;
};

const AdminRoute = ({ children }) => {
	const { user, loading } = useAuth();

	if (loading)
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="w-8 h-8 border-4 border-brand-coffee border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	if (!user) return <Navigate to="/login" replace />;
	if (user.role !== "admin") return <Navigate to="/" replace />;

	return children;
};

function App() {
	return (
		<AuthProvider>
			<CartProvider>
				<Router>
					<div className="app-container">
						<Navbar />
						<Routes>
							<Route path="/" element={<LandingPage />} />
							<Route path="/login" element={<Login />} />
							<Route path="/signup" element={<Signup />} />
							<Route
								path="/products"
								element={<ProductListing />}
							/>

							{/* Protected Routes */}
							<Route
								path="/cart"
								element={
									<ProtectedRoute>
										<Cart />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/book-appointment"
								element={
									<ProtectedRoute>
										<Booking />
									</ProtectedRoute>
								}
							/>
							<Route
								path="/profile"
								element={
									<ProtectedRoute>
										<Profile />
									</ProtectedRoute>
								}
							/>
						</Routes>

						{/* Admin Routes */}
						<Routes>
							<Route
								path="/admin"
								element={
									<AdminRoute>
										<AdminDashboard />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/users"
								element={
									<AdminRoute>
										<AdminUsers />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/products"
								element={
									<AdminRoute>
										<AdminProducts />
									</AdminRoute>
								}
							/>
							<Route
								path="/admin/orders"
								element={
									<AdminRoute>
										<AdminOrders />
									</AdminRoute>
								}
							/>
						</Routes>
					</div>
				</Router>
			</CartProvider>
		</AuthProvider>
	);
}

export default App;
