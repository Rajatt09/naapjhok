import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AlignLeft, X, ShoppingBag, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo.png";

const Navbar = () => {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const { user, logout } = useAuth();
	const { getCartCount } = useCart(); // Access cart count
	const navigate = useNavigate();
	const location = useLocation();
	const isHome = location.pathname === "/";
	const showSolidNav = scrolled || !isHome;
	const cartCount = getCartCount(); // Get total items

	// Handle Scroll for sticky navbar effect
	useEffect(() => {
		const handleScroll = () => {
			setScrolled(window.scrollY > 50);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const scrollToSection = (id) => {
		if (location.pathname !== "/") {
			navigate("/");
			setTimeout(() => {
				const element = document.getElementById(id);
				if (element) element.scrollIntoView({ behavior: "smooth" });
			}, 300);
		} else {
			const element = document.getElementById(id);
			if (element) element.scrollIntoView({ behavior: "smooth" });
		}
		setIsMenuOpen(false); // Close menu if open
	};

	return (
		<>
			{/* Top Promotion Strip - Dark & Slim */}
			<div className="bg-brand-black text-brand-tan text-center py-2 text-[10px] md:text-xs font-medium tracking-[0.2em] uppercase font-sans relative z-[60]">
				<p>Founding Client Privilege — available for a limited time.</p>
			</div>

			{/* Main Navbar */}
			<nav
				className={`w-full z-[50] transition-all duration-500 ${scrolled ? "fixed top-0 py-3" : "absolute py-4"} ${showSolidNav ? "bg-brand-cream/95 backdrop-blur-md shadow-md" : "bg-transparent opacity-90"}`}
			>
				<div className="container-custom flex justify-between items-center">
					{/* Left: Links (Desktop) */}
					<div className="flex-1 flex items-center gap-6 md:gap-8">
						<div className="hidden md:flex gap-6">
							<Link
								to="/products"
								className={`text-xs cursor-pointer font-bold uppercase tracking-[2px] hover:text-brand-rust transition-colors ${showSolidNav ? "text-brand-coffee" : "text-brand-coffee md:text-white md:mix-blend-difference"}`}
							>
								Collection
							</Link>
							<button
								onClick={() => scrollToSection("how-it-works")}
								className={`text-xs cursor-pointer font-bold uppercase tracking-[2px] hover:text-brand-rust transition-colors ${showSolidNav ? "text-brand-coffee" : "text-brand-coffee md:text-white md:mix-blend-difference"}`}
							>
								The Process
							</button>
						</div>
					</div>

					{/* Center: Logo */}
					<div className="flex-1 flex justify-center">
						<Link to="/">
							<img
								src={logo}
								alt="Naapjhok"
								className={`object-contain transition-all duration-500 ${scrolled ? "h-10" : "h-12 md:h-16"}`}
							/>
						</Link>
					</div>

					{/* Right: Actions & Menu */}
					<div className="flex-1 flex justify-end items-center gap-6">
						{!user ? (
							<button
								onClick={() => navigate("/login")}
								className={`text-xs cursor-pointer font-bold uppercase tracking-[2px] hover:text-brand-rust transition-colors ${showSolidNav ? "text-brand-coffee" : "text-brand-coffee md:text-white md:mix-blend-difference"}`}
							>
								Login
							</button>
						) : (
							<button
								onClick={() => navigate("/profile")}
								className={`transition-colors cursor-pointer ${showSolidNav ? "text-brand-coffee" : "text-brand-coffee md:text-white md:mix-blend-difference"}`}
							>
								<User size={20} />
							</button>
						)}

						{user && (
							<button
								onClick={() => navigate("/cart")}
								className={`transition-colors cursor-pointer relative ${showSolidNav ? "text-brand-coffee" : "text-brand-coffee md:text-white md:mix-blend-difference"}`}
							>
								<ShoppingBag size={20} />
								{cartCount > 0 && (
									<span className="absolute -top-2 -right-2 bg-brand-rust text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
										{cartCount}
									</span>
								)}
							</button>
						)}

						{/* Menu Button - Now on Right */}
						<button
							onClick={toggleMenu}
							className={`group cursor-pointer flex items-center gap-3 text-xs font-bold uppercase tracking-[2px] transition-colors ${showSolidNav ? "text-brand-coffee hover:text-brand-rust" : "text-brand-coffee hover:text-brand-rust md:text-white md:mix-blend-difference"}`}
						>
							<span className="hidden md:inline font-serif italic normal-case text-lg tracking-normal opacity-80 group-hover:opacity-100">
								Menu
							</span>
							<AlignLeft
								size={28}
								strokeWidth={1}
								className={`transition-transform duration-300 group-hover:scale-110`}
							/>
						</button>
					</div>
				</div>
			</nav>

			{/* Full Screen Luxury Menu Overlay */}
			<div
				className={`fixed inset-0 bg-brand-coffee z-[65] flex transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isMenuOpen ? "translate-y-0" : "-translate-y-full"}`}
			>
				{/* Left Side: Image/Brand (Hidden on Mobile) */}
				<div className="hidden md:block w-1/3 h-full bg-[url('https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=2080')] bg-cover bg-center relative">
					<div className="absolute inset-0 bg-black/40"></div>
					<div className="absolute bottom-12 left-12 text-brand-cream">
						<h3 className="font-serif text-4xl mb-2 italic">
							Crafting Legacy.
						</h3>
						<p className="font-sans text-xs tracking-widest uppercase opacity-80">
							Since 2010
						</p>
					</div>
				</div>

				{/* Right Side: Links */}
				<div className="flex-1 h-full bg-brand-cream flex flex-col justify-center px-12 md:px-24 relative">
					{/* Improved Cross Icon */}
					<button
						onClick={toggleMenu}
						className="absolute top-8 right-8 text-brand-coffee hover:text-brand-rust cursor-pointer transition-all duration-500"
					>
						<X size={44} strokeWidth={0.75} />
					</button>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
						{/* Column 1: Main */}
						<div className="space-y-4">
							<span className="text-xs font-bold text-brand-rust uppercase tracking-[0.2em] mb-4 block">
								Explore
							</span>
							<Link
								to="/"
								onClick={toggleMenu}
								className="block text-3xl md:text-4xl font-serif text-brand-coffee hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								Home
							</Link>
							<Link
								to="/products"
								onClick={toggleMenu}
								className="block text-3xl md:text-4xl font-serif text-brand-coffee hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								Collection
							</Link>
							<Link
								to="/book-appointment"
								onClick={toggleMenu}
								className="block text-3xl md:text-4xl font-serif text-brand-coffee hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								Book Visit
							</Link>
						</div>

						{/* Column 2: Content & Brand */}
						<div className="space-y-4">
							<span className="text-xs font-bold text-brand-rust uppercase tracking-[0.2em] mb-4 block">
								Journal
							</span>
							<button
								onClick={() => scrollToSection("how-it-works")}
								className="block text-left text-2xl md:text-3xl font-serif text-brand-coffee/80 hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								How it Works
							</button>
							{/* <button
								onClick={() => scrollToSection("stories")}
								className="block text-left text-2xl md:text-3xl font-serif text-brand-coffee/80 hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								Masterji ke Kisse
							</button> */}
							<button
								onClick={() => scrollToSection("why-naapjhok")}
								className="block text-left text-2xl md:text-3xl font-serif text-brand-coffee/80 hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								Why Naapjhok
							</button>
							<button
								onClick={() => scrollToSection("about-us")}
								className="block text-left text-2xl md:text-3xl font-serif text-brand-coffee/80 hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								About Us
							</button>
							<button
								onClick={() => scrollToSection("faq")}
								className="block text-left text-2xl md:text-3xl font-serif text-brand-coffee/80 hover:text-brand-brown hover:translate-x-2 transition-all"
							>
								FAQ
							</button>
						</div>
					</div>

					{/* User Auth Footer in Menu */}
					<div className="mt-16 pt-8 border-t border-brand-coffee/10 flex gap-8">
						{!user ? (
							<Link
								to="/login"
								onClick={toggleMenu}
								className="text-sm font-sans font-bold text-brand-coffee uppercase tracking-[2px] hover:text-brand-rust"
							>
								Login / Signup
							</Link>
						) : (
							<button
								onClick={() => {
									handleLogout();
									toggleMenu();
								}}
								className="text-sm font-sans font-bold text-brand-coffee uppercase tracking-[2px] hover:text-brand-rust"
							>
								Logout
							</button>
						)}
						{user && (
							<Link
								to="/cart"
								onClick={toggleMenu}
								className="text-sm font-sans font-bold text-brand-coffee uppercase tracking-[2px] hover:text-brand-rust"
							>
								My Cart
							</Link>
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default Navbar;
