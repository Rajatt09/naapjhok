import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ChevronLeft, Plus, Edit, Trash2, X, Upload } from "lucide-react";
import api from "../../utils/api";
import Button from "../../components/Button";

const AdminProducts = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editingProduct, setEditingProduct] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		category: "Shirt",
		basePrice: "",
		fabricPrice: "",
		description: "",
		referenceImage: null,
	});
	const [imagePreview, setImagePreview] = useState(null);

	useEffect(() => {
		if (!user || user.role !== "admin") {
			navigate("/login");
			return;
		}
		fetchProducts();
	}, [user, navigate]);

	const fetchProducts = async () => {
		try {
			const res = await api.get("/products");
			setProducts(res.data.data.products);
		} catch (error) {
			console.error("Error fetching products:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setFormData((prev) => ({ ...prev, referenceImage: file }));
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const data = new FormData();
		data.append("name", formData.name);
		data.append("category", formData.category);
		data.append("basePrice", formData.basePrice);
		data.append("fabricPrice", formData.fabricPrice);
		data.append("description", formData.description);
		if (formData.referenceImage) {
			data.append("referenceImage", formData.referenceImage);
		}

		try {
			if (editingProduct) {
				await api.put(`/products/${editingProduct._id}`, data, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				alert("Product updated successfully");
			} else {
				await api.post("/products", data, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				alert("Product added successfully");
			}
			fetchProducts();
			closeModal();
		} catch (error) {
			console.error("Error saving product:", error);
			alert("Failed to save product");
		}
	};

	const handleEdit = (product) => {
		setEditingProduct(product);
		setFormData({
			name: product.name,
			category: product.category,
			basePrice: product.basePrice,
			fabricPrice: product.fabricPrice,
			description: product.description || "",
			referenceImage: null,
		});
		setImagePreview(product.referenceImage);
		setShowModal(true);
	};

	const handleDelete = async (productId) => {
		if (!window.confirm("Are you sure you want to delete this product?"))
			return;

		try {
			await api.delete(`/products/${productId}`);
			setProducts(products.filter((p) => p._id !== productId));
			alert("Product deleted successfully");
		} catch (error) {
			console.error("Error deleting product:", error);
			alert("Failed to delete product");
		}
	};

	const closeModal = () => {
		setShowModal(false);
		setEditingProduct(null);
		setFormData({
			name: "",
			category: "Shirt",
			basePrice: "",
			fabricPrice: "",
			description: "",
			referenceImage: null,
		});
		setImagePreview(null);
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
					<div className="flex justify-between items-center">
						<div>
							<h1 className="text-3xl font-serif">
								Product Management
							</h1>
							<p className="text-brand-cream/70 text-sm mt-1">
								{products.length} products in catalog
							</p>
						</div>
						<Button
							onClick={() => setShowModal(true)}
							className="flex items-center gap-2"
						>
							<Plus size={20} /> Add Product
						</Button>
					</div>
				</div>
			</div>

			<div className="container-custom py-12">
				{/* Products Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
						<div
							key={product._id}
							className="bg-white rounded-xl shadow-md border border-brand-brown/10 overflow-hidden hover:shadow-lg transition-shadow"
						>
							{/* Product Image */}
							<div className="h-48 bg-brand-cream/50 overflow-hidden">
								{product.referenceImage ? (
									<img
										src={product.referenceImage}
										alt={product.name}
										className="w-full h-full object-cover"
									/>
								) : (
									<div className="w-full h-full flex items-center justify-center text-brand-taupe">
										No Image
									</div>
								)}
							</div>

							{/* Product Details */}
							<div className="p-4">
								<div className="flex items-start justify-between mb-2">
									<h3 className="text-lg font-serif text-brand-espresso">
										{product.name}
									</h3>
									<span className="text-xs px-2 py-1 bg-brand-rust/10 text-brand-rust rounded-full">
										{product.category}
									</span>
								</div>
								<div className="space-y-1 text-sm text-brand-taupe mb-4">
									<p>Base: ₹{product.basePrice}</p>
									<p>Fabric: ₹{product.fabricPrice}/m</p>
								</div>
								{product.description && (
									<p className="text-sm text-brand-taupe mb-4 line-clamp-2">
										{product.description}
									</p>
								)}

								{/* Actions */}
								<div className="flex gap-2">
									<button
										onClick={() => handleEdit(product)}
										className="flex-1 py-2 px-3 bg-brand-coffee text-brand-cream rounded-lg hover:bg-brand-espresso transition-colors text-sm flex items-center justify-center gap-2"
									>
										<Edit size={14} /> Edit
									</button>
									<button
										onClick={() =>
											handleDelete(product._id)
										}
										className="py-2 px-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
									>
										<Trash2 size={14} />
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{products.length === 0 && (
					<div className="text-center py-12">
						<p className="text-brand-taupe text-lg mb-4">
							No products yet
						</p>
						<Button onClick={() => setShowModal(true)}>
							Add Your First Product
						</Button>
					</div>
				)}
			</div>

			{/* Add/Edit Product Modal */}
			{showModal && (
				<div
					className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
					onClick={closeModal}
				>
					<div
						className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<div className="p-6 border-b border-brand-brown/10 flex justify-between items-center sticky top-0 bg-white">
							<h2 className="text-2xl font-serif text-brand-espresso">
								{editingProduct
									? "Edit Product"
									: "Add New Product"}
							</h2>
							<button
								onClick={closeModal}
								className="text-brand-taupe hover:text-brand-espresso"
							>
								<X size={24} />
							</button>
						</div>

						<form onSubmit={handleSubmit} className="p-6 space-y-6">
							{/* Image Upload */}
							<div>
								<label className="block text-sm font-bold text-brand-coffee mb-2">
									Product Image
								</label>
								<div className="border-2 border-dashed border-brand-brown/20 rounded-lg p-6 text-center">
									{imagePreview ? (
										<div className="relative">
											<img
												src={imagePreview}
												alt="Preview"
												className="max-h-48 mx-auto rounded-lg"
											/>
											<button
												type="button"
												onClick={() => {
													setImagePreview(null);
													setFormData((prev) => ({
														...prev,
														referenceImage: null,
													}));
												}}
												className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
											>
												<X size={16} />
											</button>
										</div>
									) : (
										<label className="cursor-pointer">
											<Upload
												className="mx-auto mb-2 text-brand-taupe"
												size={32}
											/>
											<p className="text-brand-taupe">
												Click to upload image
											</p>
											<input
												type="file"
												accept="image/*"
												onChange={handleImageChange}
												className="hidden"
											/>
										</label>
									)}
								</div>
							</div>

							{/* Product Name */}
							<div>
								<label className="block text-sm font-bold text-brand-coffee mb-2">
									Product Name *
								</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none"
									placeholder="e.g., Premium Cotton Shirt"
								/>
							</div>

							{/* Category */}
							<div>
								<label className="block text-sm font-bold text-brand-coffee mb-2">
									Category *
								</label>
								<select
									name="category"
									value={formData.category}
									onChange={handleInputChange}
									required
									className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none"
								>
									<option value="Shirt">Shirt</option>
									<option value="Pant">Pant</option>
									<option value="Suit">Suit</option>
									<option value="Blazer">Blazer</option>
									<option value="Kurta">Kurta</option>
									<option value="Sherwani">Sherwani</option>
								</select>
							</div>

							{/* Prices */}
							<div className="grid grid-cols-2 gap-4">
								<div>
									<label className="block text-sm font-bold text-brand-coffee mb-2">
										Base Price (₹) *
									</label>
									<input
										type="number"
										name="basePrice"
										value={formData.basePrice}
										onChange={handleInputChange}
										required
										min="0"
										className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none"
										placeholder="500"
									/>
								</div>
								<div>
									<label className="block text-sm font-bold text-brand-coffee mb-2">
										Fabric Price (₹/m) *
									</label>
									<input
										type="number"
										name="fabricPrice"
										value={formData.fabricPrice}
										onChange={handleInputChange}
										required
										min="0"
										className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none"
										placeholder="300"
									/>
								</div>
							</div>

							{/* Description */}
							<div>
								<label className="block text-sm font-bold text-brand-coffee mb-2">
									Description
								</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleInputChange}
									rows="3"
									className="w-full px-4 py-3 rounded-lg border border-brand-brown/20 focus:border-brand-coffee focus:ring-2 focus:ring-brand-coffee/20 outline-none resize-none"
									placeholder="Optional product description..."
								/>
							</div>

							{/* Submit Button */}
							<div className="flex gap-3">
								<Button type="submit" className="flex-1">
									{editingProduct
										? "Update Product"
										: "Add Product"}
								</Button>
								<button
									type="button"
									onClick={closeModal}
									className="px-6 py-3 border-2 border-brand-coffee text-brand-coffee rounded-lg hover:bg-brand-coffee/5 transition-colors"
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default AdminProducts;
