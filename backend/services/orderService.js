/**
 * Order service - Business logic for orders
 */

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const STATUS = require('../constants/statusCodes');
const ORDER_STATUS = require('../constants/orderStatus');

class OrderService {
	async createOrder(userId, orderData) {
		const { items, totalAmount, appointment, profileId } = orderData;

		// Prevent booking with an empty cart
		if (!Array.isArray(items) || items.length === 0) {
			throw {
				statusCode: STATUS.BAD_REQUEST,
				message: 'Cart is empty. Add items before booking.',
			};
		}

		const newOrder = await Order.create({
			user: userId,
			profileId,
			items: items.map((item) => ({
				product: item.product,
				name: item.product?.name || item.name,
				image: item.product?.image || item.image,
				quantity: item.quantity || 1,
				withFabric: item.withFabric,
				price: item.price,
				customization: item.customization,
			})),
			totalAmount,
			appointment,
			status: ORDER_STATUS.PENDING,
		});

		// Remove ordered items from cart
		await this.clearCartItems(userId, items, profileId);

		return newOrder;
	}

	async clearCartItems(userId, orderedItems, profileId) {
		const cart = await Cart.findOne({ user: userId });

		if (cart) {
			const orderedProductIds = orderedItems.map((i) => i.product.toString());

			cart.items = cart.items.filter((cartItem) => {
				const isOrdered =
					orderedProductIds.includes(
						cartItem.product.id
							? cartItem.product.id.toString()
							: cartItem.product.toString(),
					) && cartItem.profileId === profileId;
				return !isOrdered;
			});

			await cart.save();
		}
	}

	async getMyOrders(userId) {
		const orders = await Order.find({ user: userId }).sort('-createdAt');
		return orders;
	}

	async getAllOrders() {
		const orders = await Order.find().sort('-createdAt');
		return orders;
	}
}

module.exports = new OrderService();
