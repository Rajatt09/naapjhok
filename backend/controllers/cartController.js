const cartService = require('../services/cartService');
const { sendSuccess } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

exports.getCart = asyncHandler(async (req, res) => {
	const cart = await cartService.getCart(req.user.id);
	return sendSuccess(res, STATUS.OK, { cart });
});

exports.addToCart = asyncHandler(async (req, res) => {
	const { product, withFabric, profileId, customization } = req.body;
	const itemData = { product, withFabric, profileId, customization };

	const cart = await cartService.addToCart(req.user.id, itemData, req.file);

	return sendSuccess(res, STATUS.OK, { cart }, 'Item added to cart');
});

exports.removeFromCart = asyncHandler(async (req, res) => {
	const { itemId } = req.params;
	const cart = await cartService.removeFromCart(req.user.id, itemId);

	return sendSuccess(res, STATUS.OK, { cart });
});
