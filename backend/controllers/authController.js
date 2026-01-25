const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

const sendTokenResponse = async (user, statusCode, res) => {
	const { accessToken, refreshToken } = await authService.createTokenResponse(user);

	const cookieOptions = {
		httpOnly: true,
		expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
		secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
	};

	res.cookie('refreshToken', refreshToken, cookieOptions);

	return sendSuccess(res, statusCode, { user }, null, accessToken);
};

exports.signup = asyncHandler(async (req, res) => {
	const newUser = await authService.signup(req.body);
	await sendTokenResponse(newUser, STATUS.CREATED, res);
});

exports.login = asyncHandler(async (req, res) => {
	const user = await authService.login(req.body.email, req.body.password);
	await sendTokenResponse(user, STATUS.OK, res);
});

exports.refreshToken = asyncHandler(async (req, res) => {
	const token = req.cookies.refreshToken;
	const user = await authService.refreshToken(token);
	await sendTokenResponse(user, STATUS.OK, res);
});

exports.logout = asyncHandler(async (req, res) => {
	const token = req.cookies.refreshToken;
	await authService.logout(token);

	res.clearCookie('refreshToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
	});

	return sendSuccess(res, STATUS.OK, null, 'Logged out successfully');
});

exports.getMe = asyncHandler(async (req, res) => {
	const user = await authService.getMe(req.user.id);
	return sendSuccess(res, STATUS.OK, { user });
});
