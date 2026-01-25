/**
 * Admin service - Business logic for admin operations
 */

const User = require('../models/User');
const Order = require('../models/Order');
const Product = require('../models/Product');
const STATUS = require('../constants/statusCodes');

class AdminService {
	async getAllUsers() {
		const users = await User.find({ role: 'user' })
			.select('-password')
			.sort('-createdAt');

		return users;
	}

	async getDashboardStats() {
		const totalUsers = await User.countDocuments({ role: 'user' });
		const totalOrders = await Order.countDocuments();
		const totalProducts = await Product.countDocuments();
		const totalRevenue = await Order.aggregate([
			{ $group: { _id: null, total: { $sum: '$totalAmount' } } },
		]);

		const recentOrders = await Order.find()
			.sort('-createdAt')
			.limit(10)
			.populate('user', 'name email');

		return {
			stats: {
				totalUsers,
				totalOrders,
				totalProducts,
				totalRevenue: totalRevenue[0]?.total || 0,
			},
			recentOrders,
		};
	}

	async getUserDetails(userId) {
		const user = await User.findById(userId).select('-password');
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		const orders = await Order.find({ user: userId }).sort('-createdAt');

		return {
			user,
			orders,
		};
	}

	async deleteUser(userId) {
		const user = await User.findByIdAndDelete(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		// Delete associated orders
		await Order.deleteMany({ user: userId });

		return user;
	}

	async getAllOrders() {
		const orders = await Order.find()
			.populate('user', 'name email phone')
			.sort('-createdAt');

		return orders;
	}
}

module.exports = new AdminService();
