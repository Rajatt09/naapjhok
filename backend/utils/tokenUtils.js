/**
 * JWT token utilities
 */

const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const RefreshToken = require('../models/RefreshToken');

const signAccessToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '15m', // Short lived access token
	});
};

const generateRefreshToken = async (user) => {
	const token = crypto.randomBytes(40).toString('hex');
	const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

	const refreshToken = new RefreshToken({
		user: user._id,
		token,
		expiresAt,
	});

	await refreshToken.save();
	return refreshToken;
};

const revokeRefreshToken = async (token) => {
	const refreshToken = await RefreshToken.findOne({ token });
	if (refreshToken) {
		refreshToken.revoked = Date.now();
		await refreshToken.save();
	}
	return refreshToken;
};

module.exports = {
	signAccessToken,
	generateRefreshToken,
	revokeRefreshToken,
};
