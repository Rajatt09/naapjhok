/**
 * Standardized response handler for consistent API responses
 */

const sendSuccess = (res, statusCode, data, message = null, accessToken = null, results = null) => {
	const response = {
		status: 'success',
		...(message && { message }),
		...(accessToken && { accessToken }),
		...(results !== null && { results }),
		...(data && { data }),
	};
	return res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
	const response = {
		status: 'fail',
		message,
		...(errors && { errors }),
	};
	return res.status(statusCode).json(response);
};

module.exports = {
	sendSuccess,
	sendError,
};
