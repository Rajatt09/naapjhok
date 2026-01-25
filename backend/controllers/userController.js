const userService = require('../services/userService');
const { sendSuccess } = require('../utils/responseHandler');
const asyncHandler = require('../utils/asyncHandler');
const STATUS = require('../constants/statusCodes');

exports.addProfile = asyncHandler(async (req, res) => {
	const result = await userService.addProfile(req.user.id, req.body);
	return sendSuccess(res, STATUS.CREATED, {
		profile: result.profile,
		profiles: result.profiles,
	});
});

exports.getProfiles = asyncHandler(async (req, res) => {
	const result = await userService.getProfiles(req.user.id);
	return sendSuccess(res, STATUS.OK, {
		profiles: result.profiles,
		user: result.user,
	});
});

exports.updateProfile = asyncHandler(async (req, res) => {
	const result = await userService.updateProfile(req.user.id, req.params.id, req.body);
	return sendSuccess(res, STATUS.OK, {
		profile: result.profile,
		profiles: result.profiles,
	});
});

exports.deleteProfile = asyncHandler(async (req, res) => {
	const result = await userService.deleteProfile(req.user.id, req.params.id);
	return sendSuccess(res, STATUS.OK, {
		profiles: result.profiles,
	}, 'Profile and all associated orders deleted.');
});
