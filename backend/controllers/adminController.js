const adminService = require('../services/adminService');
const { sendSuccess } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

exports.getAllUsers = asyncHandler(async (req, res) => {
	const users = await adminService.getAllUsers();
	return sendSuccess(res, STATUS.OK, { users }, null, null, users.length);
});

exports.getDashboardStats = asyncHandler(async (req, res) => {
	const result = await adminService.getDashboardStats();
	return sendSuccess(res, STATUS.OK, result);
});

exports.getUserDetails = asyncHandler(async (req, res) => {
	const result = await adminService.getUserDetails(req.params.id);
	return sendSuccess(res, STATUS.OK, result);
});

exports.deleteUser = asyncHandler(async (req, res) => {
	await adminService.deleteUser(req.params.id);
	return sendSuccess(res, STATUS.NO_CONTENT, null);
});

exports.getAllOrders = asyncHandler(async (req, res) => {
	const orders = await adminService.getAllOrders();
	return sendSuccess(res, STATUS.OK, { orders }, null, null, orders.length);
});
