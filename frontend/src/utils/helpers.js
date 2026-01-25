/**
 * General helper utility functions
 */

export const formatPrice = (price) => {
	return new Intl.NumberFormat('en-IN', {
		style: 'currency',
		currency: 'INR',
		maximumFractionDigits: 0,
	}).format(price);
};

export const formatDate = (date) => {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleDateString('en-IN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};

export const formatDateTime = (date) => {
	if (!date) return '';
	const d = new Date(date);
	return d.toLocaleString('en-IN', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	});
};

export const getInitials = (name) => {
	if (!name) return '';
	return name
		.split(' ')
		.map((n) => n[0])
		.join('')
		.toUpperCase()
		.slice(0, 2);
};

export const debounce = (func, wait) => {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
};
