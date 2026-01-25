/**
 * Authentication service - Business logic for authentication
 */

const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { signAccessToken, generateRefreshToken, revokeRefreshToken } = require('../utils/tokenUtils');
const { sendError } = require('../utils/responseHandler');
const STATUS = require('../constants/statusCodes');

class AuthService {
	async signup(userData) {
		const { name, email, password, phone, gender } = userData;

		const newUser = await User.create({
			name,
			email,
			password,
			phone,
			gender,
		});

		// Remove password from response
		newUser.password = undefined;

		return newUser;
	}

	async login(email, password) {
		if (!email || !password) {
			throw { statusCode: STATUS.BAD_REQUEST, message: 'Please provide email and password!' };
		}

		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await user.correctPassword(password, user.password))) {
			throw { statusCode: STATUS.UNAUTHORIZED, message: 'Incorrect email or password' };
		}

		// Remove password from response
		user.password = undefined;

		return user;
	}

	async refreshToken(token) {
		if (!token) {
			throw { statusCode: STATUS.UNAUTHORIZED, message: 'Token not found' };
		}

		const refreshToken = await RefreshToken.findOne({ token }).populate('user');

		if (!refreshToken || !refreshToken.isActive) {
			throw { statusCode: STATUS.FORBIDDEN, message: 'Invalid token' };
		}

		const { user } = refreshToken;

		// Revoke old token (Rotation)
		await revokeRefreshToken(token);

		// Remove password from response
		user.password = undefined;

		return user;
	}

	async logout(token) {
		if (token) {
			await revokeRefreshToken(token);
		}
	}

	async getMe(userId) {
		const user = await User.findById(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}
		return user;
	}

	async createTokenResponse(user) {
		const accessToken = signAccessToken(user._id);
		const refreshToken = await generateRefreshToken(user);

		return {
			accessToken,
			refreshToken: refreshToken.token,
		};
	}
}

module.exports = new AuthService();
