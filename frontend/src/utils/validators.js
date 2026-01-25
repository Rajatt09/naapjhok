/**
 * Validation utility functions
 */

export const validateEmail = (email) => {
	const emailRegex = /^\S+@\S+\.\S+$/;
	return emailRegex.test(email);
};

export const validatePhone = (phone) => {
	const cleaned = phone.replace(/\D/g, '');
	return cleaned.length === 10;
};

export const validateProfile = (data) => {
	const errors = {};

	if (!data.name?.trim()) {
		errors.name = 'Name is required';
	}

	if (!data.phone?.trim()) {
		errors.phone = 'Phone is required';
	} else if (!validatePhone(data.phone)) {
		errors.phone = 'Enter valid 10-digit phone';
	}

	if (!data.location?.trim()) {
		errors.location = 'Location is required';
	}

	if (data.email && !validateEmail(data.email)) {
		errors.email = 'Invalid email format';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateLogin = (email, password) => {
	const errors = {};

	if (!email?.trim()) {
		errors.email = 'Email is required';
	} else if (!validateEmail(email)) {
		errors.email = 'Invalid email format';
	}

	if (!password?.trim()) {
		errors.password = 'Password is required';
	} else if (password.length < 6) {
		errors.password = 'Password must be at least 6 characters';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

export const validateSignup = (formData) => {
	const errors = {};

	if (!formData.name?.trim()) {
		errors.name = 'Name is required';
	}

	if (!formData.email?.trim()) {
		errors.email = 'Email is required';
	} else if (!validateEmail(formData.email)) {
		errors.email = 'Invalid email format';
	}

	if (!formData.password?.trim()) {
		errors.password = 'Password is required';
	} else if (formData.password.length < 6) {
		errors.password = 'Password must be at least 6 characters';
	}

	if (!formData.phone?.trim()) {
		errors.phone = 'Phone is required';
	} else if (!validatePhone(formData.phone)) {
		errors.phone = 'Enter valid 10-digit phone';
	}

	if (!formData.gender) {
		errors.gender = 'Gender is required';
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};
