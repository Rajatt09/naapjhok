/**
 * Cart service - Business logic for cart operations
 */

const Cart = require('../models/Cart');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

class CartService {
	async getCart(userId) {
		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			cart = await Cart.create({ user: userId, items: [] });
		}
		return cart;
	}

	async addToCart(userId, itemData, file) {
		let cart = await Cart.findOne({ user: userId });
		if (!cart) {
			cart = new Cart({ user: userId, items: [] });
		}

		const { product, withFabric, profileId, customization } = itemData;

		// Parse if strings
		const parsedProduct = typeof product === 'string' ? JSON.parse(product) : product;
		const parsedCustomization = typeof customization === 'string' ? JSON.parse(customization) : customization;
		const isWithFabric = withFabric === 'true' || withFabric === true;

		// Handle Image Upload
		let referenceImageUrl = null;
		if (file) {
			try {
				// Upload to Cloudinary
				const result = await cloudinary.uploader.upload(file.path, {
					folder: 'naapjhok/reference-images',
					use_filename: true,
					unique_filename: true,
				});
				referenceImageUrl = result.secure_url;

				// Remove local file
				if (fs.existsSync(file.path)) {
					fs.unlinkSync(file.path);
				}
			} catch (uploadErr) {
				console.error('Cloudinary Upload Err:', uploadErr);
				// Fallback to local path if Cloudinary fails
				referenceImageUrl = `/uploads/reference-images/${file.filename}`;
			}
		}

		const newItem = {
			product: parsedProduct,
			withFabric: isWithFabric,
			profileId,
			customization: parsedCustomization
				? {
						...parsedCustomization,
						referenceImage: referenceImageUrl || parsedCustomization.referenceImage,
					}
				: null,
		};

		cart.items.push(newItem);
		cart.updatedAt = Date.now();
		await cart.save();

		return cart;
	}

	async removeFromCart(userId, itemId) {
		const cart = await Cart.findOne({ user: userId });

		if (cart) {
			cart.items.pull({ _id: itemId });
			await cart.save();
		}

		return cart;
	}
}

module.exports = new CartService();
