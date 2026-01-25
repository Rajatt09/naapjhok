import React, { useState, useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
	Filter,
	X,
	ChevronDown,
	Star,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import AddToCartDrawer from "../components/AddToCartDrawer";
import api from "../utils/api";

// Enhanced Mock Data
const MOCK_PRODUCTS = [
	// MEN
	{
		id: 1,
		name: "3 Piece Suit",
		description: "Bespoke blazer, trousers, and vest",
		category: "Suit",
		gender: "Men",
		occasion: "Wedding",
		fabric: "Wool",
		basePrice: 4999,
		fabricPrice: 3000,
		rating: 4.8,
		colors: [
			"Dark Teal",
			"Brunette Brown",
			"Deep Black",
			"Charcoal Grey",
			"Forest Green",
		],
		image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 2,
		name: "2 Piece Suit",
		description: "Sharp, custom-tailored blazer and trousers",
		category: "Suit",
		gender: "Men",
		occasion: "Formal",
		fabric: "Wool",
		basePrice: 3999,
		fabricPrice: 2500,
		rating: 4.7,
		colors: ["Khaki", "Navy", "Slate Blue", "Chocolate Mocha", "Graphite"],
		image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887",
	},
	{
		id: 3,
		name: "Blazer",
		description: "Versatile, custom-cut essential formal fit",
		category: "Blazer",
		gender: "Men",
		occasion: "Office",
		fabric: "Wool",
		basePrice: 3249,
		fabricPrice: 2000,
		rating: 4.6,
		colors: ["Navy", "Charcoal Grey", "Deep Black"],
		image: "https://images.unsplash.com/photo-1591728105894-15b936d64bd8?q=80&w=1887",
	},
	{
		id: 4,
		name: "Formal Pant",
		description: "Custom-fit trousers crafted for comfort",
		category: "Trouser",
		gender: "Men",
		occasion: "Office",
		fabric: "Cotton",
		basePrice: 849,
		fabricPrice: 450,
		rating: 4.5,
		colors: [
			"Beige Grey",
			"Navy",
			"Olive Drab",
			"Sandstone",
			"Cool Charcoal",
		],
		image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 5,
		name: "Formal Shirt",
		description: "Precision-stitched for everyday wear",
		category: "Shirt",
		gender: "Men",
		occasion: "Formal",
		fabric: "Cotton",
		basePrice: 649,
		fabricPrice: 400,
		rating: 4.8,
		colors: ["Light Blue", "Light Mauve", "White", "Cream", "Dusty Rose"],
		image: "https://images.unsplash.com/photo-1620012253295-c15cc3fe537d?auto=format&fit=crop&q=80&w=800",
	},
	// WOMEN (Mirrored Data as requested)
	{
		id: 6,
		name: "3 Piece Suit",
		description: "Bespoke blazer, trousers, and vest",
		category: "Suit",
		gender: "Women",
		occasion: "Wedding",
		fabric: "Wool",
		basePrice: 4999,
		fabricPrice: 3000,
		rating: 4.8,
		colors: [
			"Dark Teal",
			"Brunette Brown",
			"Deep Black",
			"Charcoal Grey",
			"Forest Green",
		],
		image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 7,
		name: "2 Piece Suit",
		description: "Sharp, custom-tailored blazer and trousers",
		category: "Suit",
		gender: "Women",
		occasion: "Formal",
		fabric: "Wool",
		basePrice: 3999,
		fabricPrice: 2500,
		rating: 4.7,
		colors: ["Khaki", "Navy", "Slate Blue", "Chocolate Mocha", "Graphite"],
		image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=1887",
	},
	{
		id: 8,
		name: "Blazer",
		description: "Versatile, custom-cut essential formal fit",
		category: "Blazer",
		gender: "Women",
		occasion: "Office",
		fabric: "Wool",
		basePrice: 3249,
		fabricPrice: 2000,
		rating: 4.6,
		colors: ["Navy", "Charcoal Grey", "Deep Black"],
		image: "https://images.unsplash.com/photo-1591728105894-15b936d64bd8?q=80&w=1887",
	},
	{
		id: 9,
		name: "Formal Pant",
		description: "Custom-fit trousers crafted for comfort",
		category: "Trouser",
		gender: "Women",
		occasion: "Office",
		fabric: "Cotton",
		basePrice: 849,
		fabricPrice: 450,
		rating: 4.5,
		colors: [
			"Beige Grey",
			"Navy",
			"Olive Drab",
			"Sandstone",
			"Cool Charcoal",
		],
		image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&q=80&w=800",
	},
	{
		id: 10,
		name: "Formal Shirt",
		description: "Precision-stitched for everyday wear",
		category: "Shirt",
		gender: "Women",
		occasion: "Formal",
		fabric: "Cotton",
		basePrice: 649,
		fabricPrice: 400,
		rating: 4.8,
		colors: ["Light Blue", "Light Mauve", "White", "Cream", "Dusty Rose"],
		image: "https://images.unsplash.com/photo-1620012253295-c15cc3fe537d?auto=format&fit=crop&q=80&w=800",
	},
];

const FILTERS = {
	Category: ["Suit", "Blazer", "Trouser", "Shirt"],
	Gender: ["Men", "Women"],
	Occasion: ["Wedding", "Formal", "Office"],
	Fabric: ["Wool", "Cotton"],
	Price: ["Under ₹1000", "₹1000 - ₹4000", "Above ₹4000"],
};

const ProductListing = () => {
	const { addToCart } = useCart();
	const [products, setProducts] = useState(MOCK_PRODUCTS);
	const [loadingProducts, setLoadingProducts] = useState(true);

	// State
	const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
	const [sortBy, setSortBy] = useState("newest");
	const [activeFilters, setActiveFilters] = useState({
		Category: [],
		Gender: [],
		Occasion: [],
		Fabric: [],
		Price: [],
	});

	// Fetch products from backend
	useEffect(() => {
		const loadProducts = async () => {
			try {
				const res = await api.get("/products");
				const apiProducts = res.data?.data?.products || [];
				const mapped = apiProducts.map((p) => ({
					id: String(p._id || p.id),
					_id: String(p._id || p.id),
					name: p.name,
					description: p.description || "Custom tailored piece",
					category: p.category,
					gender: p.gender || "Men",
					occasion: "Custom",
					fabric: "Custom Fabric",
					basePrice: Number(p.basePrice) || 0,
					fabricPrice: Number(p.fabricPrice) || 0,
					rating: 4.7,
					image:
						p.referenceImage ||
						(p.image
							? p.image.startsWith("http")
								? p.image
								: `/${p.image}`
							: null) ||
						"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800",
				}));
				if (mapped.length > 0) {
					setProducts(mapped);
				}
			} catch (err) {
				console.error("Failed to load products, showing defaults", err);
			} finally {
				setLoadingProducts(false);
			}
		};

		loadProducts();
	}, []);

	// Filter Logic
	const filteredProducts = useMemo(() => {
		return products
			.filter((product) => {
				// Filter Check
				const matchesFilters = Object.entries(activeFilters).every(
					([type, selectedOptions]) => {
						if (selectedOptions.length === 0) return true;
						if (type === "Price") {
							if (
								selectedOptions.includes("Under ₹1000") &&
								product.basePrice < 1000
							)
								return true;
							if (
								selectedOptions.includes("₹1000 - ₹4000") &&
								product.basePrice >= 1000 &&
								product.basePrice <= 4000
							)
								return true;
							if (
								selectedOptions.includes("Above ₹4000") &&
								product.basePrice > 4000
							)
								return true;
							return false;
						}
						return selectedOptions.includes(
							product[type.toLowerCase()],
						); // gender, fabric, occasion, category
					},
				);

				return matchesFilters;
			})
			.sort((a, b) => {
				if (sortBy === "price-low") return a.basePrice - b.basePrice;
				if (sortBy === "price-high") return b.basePrice - a.basePrice;
				return b.id - a.id; // newest
			});
	}, [activeFilters, sortBy, products]);

	const toggleFilter = (type, value) => {
		setActiveFilters((prev) => {
			const current = prev[type];
			const updated = current.includes(value)
				? current.filter((item) => item !== value)
				: [...current, value];
			return { ...prev, [type]: updated };
		});
	};

	const clearFilters = () => {
		setActiveFilters({
			Category: [],
			Gender: [],
			Occasion: [],
			Fabric: [],
			Price: [],
		});
	};

	// Drawer State
	const [drawerState, setDrawerState] = useState({
		isOpen: false,
		product: null,
		withFabric: false,
	});

	const { user } = useAuth();
	const navigate = useNavigate();

	const handleInitialClick = (product, withFabric) => {
		if (!user) {
			navigate("/login");
			return;
		}
		setDrawerState({
			isOpen: true,
			product,
			withFabric,
		});
	};

	if (loadingProducts) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-brand-cream">
				<div className="w-10 h-10 border-4 border-brand-coffee border-t-transparent rounded-full animate-spin"></div>
			</div>
		);
	}

	return (
		<div className="w-full pt-36 pb-16 bg-brand-cream min-h-screen">
			<div className="container-custom px-4 md:px-6">
				{/* Header Phase */}
				<header className="flex flex-col md:flex-row justify-between items-end mb-10 border-b border-brand-brown/10 pb-6 gap-6">
					<div className="w-full sm:w-auto">
						<p className="text-brand-rust uppercase tracking-[0.2em] text-xs font-bold mb-2">
							Bespoke Catalog
						</p>
						<h2 className="text-4xl md:text-5xl font-serif text-brand-espresso">
							The Collection
						</h2>
					</div>

					<div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
						<button
							onClick={() => setIsMobileFilterOpen(true)}
							className="md:hidden flex items-center gap-2 px-4 py-2 border border-brand-brown/30 text-brand-brown uppercase text-xs font-bold tracking-wider"
						>
							<Filter size={16} /> Filters
						</button>

						<div className="flex items-center gap-3">
							<span className="text-brand-taupe text-sm hidden md:inline">
								Sort by:
							</span>
							<div className="relative group">
								<select
									className="appearance-none bg-transparent border-b border-brand-brown/30 pb-1 pr-8 text-brand-coffee font-serif text-lg focus:outline-none cursor-pointer"
									value={sortBy}
									onChange={(e) => setSortBy(e.target.value)}
								>
									<option value="newest">
										Newest Arrivals
									</option>
									<option value="price-low">
										Price: Low to High
									</option>
									<option value="price-high">
										Price: High to Low
									</option>
								</select>
								<ChevronDown
									size={14}
									className="absolute right-0 top-2 text-brand-brown pointer-events-none"
								/>
							</div>
						</div>
					</div>
				</header>

				<div className="flex gap-12 items-start relative">
					{/* Sidebar Filters (Desktop & Mobile Drawer) */}
					<aside
						className={`fixed inset-y-0 left-0 z-[60] w-[80vw] max-w-xs bg-brand-cream/95 backdrop-blur-xl p-8 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) md:duration-300 md:relative md:translate-x-0 md:inset-auto md:w-64 md:shadow-none md:p-0 md:bg-transparent md:block md:sticky md:top-24 md:max-h-[calc(100vh-6rem)] overflow-y-auto ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}`}
					>
						<div className="flex justify-between items-center mb-8">
							<h3 className="font-serif text-2xl text-brand-espresso">
								Filters
							</h3>
							<button
								onClick={() => setIsMobileFilterOpen(false)}
								className="md:hidden p-2 -mr-2 text-brand-coffee hover:text-brand-rust transition-colors"
							>
								<X size={24} />
							</button>
						</div>

						<div className="space-y-8 md:py-6">
							{/* Filter Section Component */}
							{Object.entries(FILTERS).map(([type, options]) => (
								<div key={type}>
									<h4 className="font-sans text-xs font-bold text-brand-rust uppercase tracking-[0.2em] mb-4">
										{type}
									</h4>
									<div className="space-y-3">
										{options.map((option) => (
											<label
												key={option}
												className="flex items-center gap-3 cursor-pointer group select-none"
											>
												<div
													className={`w-5 h-5 border transition-all duration-200 flex items-center justify-center ${activeFilters[type].includes(option) ? "bg-brand-brown border-brand-brown" : "border-brand-taupe group-hover:border-brand-coffee bg-white/50"}`}
												>
													{activeFilters[
														type
													].includes(option) && (
														<span className="text-white text-xs">
															✓
														</span>
													)}
												</div>
												<input
													type="checkbox"
													className="hidden"
													checked={activeFilters[
														type
													].includes(option)}
													onChange={() =>
														toggleFilter(
															type,
															option,
														)
													}
												/>
												<span
													className={`text-sm transition-colors ${activeFilters[type].includes(option) ? "text-brand-espresso font-medium" : "text-brand-taupe group-hover:text-brand-coffee"}`}
												>
													{option}
												</span>
											</label>
										))}
									</div>
								</div>
							))}

							<button
								onClick={clearFilters}
								className="text-xs text-brand-brown underline uppercase tracking-widest hover:text-brand-rust transition-colors pt-4"
							>
								Clear All Filters
							</button>
						</div>
					</aside>

					{/* Filter Overlay (Mobile) */}
					{isMobileFilterOpen && (
						<div
							className="fixed inset-0 bg-brand-black/40 backdrop-blur-sm z-[55] md:hidden transition-opacity duration-500"
							onClick={() => setIsMobileFilterOpen(false)}
						></div>
					)}

					{/* Product Grid */}
					<div className="flex-1 min-h-[50vh]">
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-8 md:gap-y-12">
							{filteredProducts.map((product) => (
								<div
									key={product.id}
									className="group flex flex-col bg-white md:bg-transparent shadow-sm md:shadow-none pb-4 md:pb-0"
								>
									{/* Image Card */}
									<div className="relative overflow-hidden mb-4 bg-brand-brown/5 aspect-[3/4]">
										<img
											src={product.image}
											alt={product.name}
											className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
										/>

										{/* Static Actions (Touch Friendly) */}
										<div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12 md:pt-8">
											<button
												onClick={() =>
													handleInitialClick(
														product,
														false,
													)
												}
												className="flex-1 bg-white/95 backdrop-blur-sm text-brand-coffee text-[10px] sm:text-xs uppercase font-bold py-3 md:py-2.5 hover:bg-brand-coffee hover:text-white transition-colors active:scale-95 duration-200"
											>
												Stitch
											</button>
											<button
												onClick={() =>
													handleInitialClick(
														product,
														true,
													)
												}
												className="flex-1 bg-brand-rust/95 backdrop-blur-sm text-white text-[10px] sm:text-xs uppercase font-bold py-3 md:py-2.5 hover:bg-brand-brown transition-colors active:scale-95 duration-200"
											>
												+ Fabric
											</button>
										</div>

										{/* Badges */}
										<div className="absolute top-3 left-3 flex flex-col gap-2">
											{product.rating >= 4.8 && (
												<div className="bg-white/90 backdrop-blur px-2.5 py-1.5 flex items-center gap-1.5 shadow-sm">
													<Star
														size={10}
														className="fill-brand-gold text-brand-gold"
													/>
													<span className="text-[10px] font-bold tracking-wider text-brand-coffee">
														BESTSELLER
													</span>
												</div>
											)}
											<div className="bg-brand-coffee/90 backdrop-blur px-2.5 py-1.5 shadow-sm w-fit">
												<span className="text-[10px] font-bold tracking-wider text-white uppercase">
													{product.gender}
												</span>
											</div>
										</div>
									</div>

									{/* Info */}
									<div className="flex flex-col gap-1 px-3 md:px-0">
										<div className="flex justify-between items-start mb-1">
											<h3 className="font-serif text-lg text-brand-espresso leading-tight group-hover:text-brand-brown transition-colors">
												{product.name}
											</h3>
											<div className="text-right">
												<p className="font-serif text-brand-coffee font-medium">
													₹{product.basePrice}{" "}
													<span className="text-[10px] text-brand-taupe font-sans font-normal uppercase">
														Stitch
													</span>
												</p>
												<p className="font-serif text-brand-rust text-sm">
													₹
													{product.basePrice +
														product.fabricPrice}{" "}
													<span className="text-[10px] text-brand-rust/70 font-sans font-normal uppercase">
														+ Fabric
													</span>
												</p>
											</div>
										</div>
										<p className="text-xs text-brand-taupe uppercase tracking-wider">
											{product.category} •{" "}
											{product.fabric}
										</p>
									</div>
								</div>
							))}
						</div>

						{filteredProducts.length === 0 && (
							<div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-brand-brown/20 bg-brand-brown/5 rounded-lg mx-4 md:mx-0">
								<Search
									size={48}
									className="text-brand-brown/30 mb-4"
								/>
								<h3 className="font-serif text-2xl text-brand-coffee mb-2">
									No masterpieces found.
								</h3>
								<p className="text-brand-taupe mb-6 max-w-md">
									We couldn't find any items matching your
									exquisite taste. Try adjusting your filters.
								</p>
								<button
									onClick={clearFilters}
									className="text-sm font-bold border-b-2 border-brand-brown/50 text-brand-brown hover:text-brand-rust hover:border-brand-rust transition-all pb-1"
								>
									Clear All Filters
								</button>
							</div>
						)}
					</div>
				</div>

				{/* Add To Cart Drawer */}
				<AddToCartDrawer
					isOpen={drawerState.isOpen}
					onClose={() =>
						setDrawerState({ ...drawerState, isOpen: false })
					}
					product={drawerState.product}
					withFabric={drawerState.withFabric}
				/>
			</div>
		</div>
	);
};

export default ProductListing;
