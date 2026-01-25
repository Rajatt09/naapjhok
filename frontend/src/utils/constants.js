/**
 * Application constants
 */

export const API_ENDPOINTS = {
	AUTH: {
		LOGIN: '/auth/login',
		SIGNUP: '/auth/signup',
		LOGOUT: '/auth/logout',
		REFRESH_TOKEN: '/auth/refresh-token',
		ME: '/auth/me',
	},
	PRODUCTS: {
		BASE: '/products',
		BY_ID: (id) => `/products/${id}`,
	},
	CART: {
		BASE: '/cart',
		ITEM: (itemId) => `/cart/${itemId}`,
	},
	ORDERS: {
		BASE: '/orders',
	},
	USER: {
		PROFILES: '/user/profiles',
		PROFILE: (id) => `/user/profiles/${id}`,
	},
	ADMIN: {
		STATS: '/admin/stats',
		USERS: '/admin/users',
		USER: (id) => `/admin/users/${id}`,
		ORDERS: '/admin/orders',
	},
};

export const ORDER_STATUS = {
	PENDING: 'Pending',
	CONFIRMED: 'Confirmed',
	MASTER_ASSIGNED: 'Master Assigned',
	MEASUREMENTS_TAKEN: 'Measurements Taken',
	IN_STITCHING: 'In Stitching',
	TRIAL_READY: 'Trial Ready',
	DELIVERED: 'Delivered',
	CANCELLED: 'Cancelled',
};

export const USER_ROLES = {
	USER: 'user',
	ADMIN: 'admin',
	TAILOR: 'tailor',
};
