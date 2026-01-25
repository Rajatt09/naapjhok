/**
 * Centralized error handling middleware
 */

const sendError = require('./responseHandler').sendError;

const handleCastErrorDB = (err) => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return { statusCode: 400, message };
};

const handleDuplicateFieldsDB = (err) => {
	const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
	const message = `Duplicate field value: ${value}. Please use another value!`;
	return { statusCode: 400, message };
};

const handleValidationErrorDB = (err) => {
	const errors = Object.values(err.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join('. ')}`;
	return { statusCode: 400, message, errors };
};

const handleJWTError = () => ({
	statusCode: 401,
	message: 'Invalid token. Please log in again!',
});

const handleJWTExpiredError = () => ({
	statusCode: 401,
	message: 'Your token has expired! Please log in again.',
});

const globalErrorHandler = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || 'error';

	if (process.env.NODE_ENV === 'development') {
		console.error('Error:', err);
	}

	// Handle specific error types
	if (err.name === 'CastError') {
		const error = handleCastErrorDB(err);
		return sendError(res, error.statusCode, error.message);
	}

	if (err.code === 11000) {
		const error = handleDuplicateFieldsDB(err);
		return sendError(res, error.statusCode, error.message);
	}

	if (err.name === 'ValidationError') {
		const error = handleValidationErrorDB(err);
		return sendError(res, error.statusCode, error.message, error.errors);
	}

	if (err.name === 'JsonWebTokenError') {
		const error = handleJWTError();
		return sendError(res, error.statusCode, error.message);
	}

	if (err.name === 'TokenExpiredError') {
		const error = handleJWTExpiredError();
		return sendError(res, error.statusCode, error.message);
	}

	// Default error
	sendError(res, err.statusCode, err.message || 'Something went wrong!');
};

module.exports = globalErrorHandler;
