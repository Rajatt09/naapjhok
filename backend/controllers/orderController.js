const orderService = require('../services/orderService');
const { sendSuccess } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

exports.createOrder = asyncHandler(async (req, res) => {
	if (!req.user) {
		throw { statusCode: STATUS.UNAUTHORIZED, message: 'Not authenticated' };
	}

	const { items, totalAmount, appointment, profileId } = req.body;
	const orderData = { items, totalAmount, appointment, profileId };

	const newOrder = await orderService.createOrder(req.user.id, orderData);

	return sendSuccess(res, STATUS.CREATED, { order: newOrder });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
	const orders = await orderService.getMyOrders(req.user.id);
	return sendSuccess(res, STATUS.OK, { orders }, null, null, orders.length);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
	const orders = await orderService.getAllOrders();
	return sendSuccess(res, STATUS.OK, { orders }, null, null, orders.length);
});
