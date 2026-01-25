/**
 * User service - Business logic for user profiles
 */

const User = require('../models/User');
const Order = require('../models/Order');
const STATUS = require('../constants/statusCodes');

class UserService {
	async addProfile(userId, profileData) {
		const user = await User.findById(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		const newProfile = {
			...profileData,
			_id: undefined, // Let Mongo generate subdoc ID
		};

		// Check for duplicate name (case-insensitive)
		const duplicate = user.profiles.find(
			(p) => p.name.toLowerCase() === newProfile.name.toLowerCase(),
		);
		if (duplicate) {
			throw { statusCode: STATUS.BAD_REQUEST, message: 'A profile with this name already exists.' };
		}

		user.profiles.push(newProfile);
		await user.save();

		// Return the newly created profile (last in array)
		const createdProfile = user.profiles[user.profiles.length - 1];

		return {
			profile: createdProfile,
			profiles: user.profiles,
		};
	}

	async getProfiles(userId) {
		const user = await User.findById(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		return {
			profiles: user.profiles,
			user: {
				name: user.name,
				phone: user.phone,
				email: user.email,
				location: user.addresses?.[0]?.city || '',
			},
		};
	}

	async updateProfile(userId, profileId, updateData) {
		const user = await User.findById(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		// Check if updating main user profile (profileId === 'me')
		if (profileId === 'me') {
			// Update main user fields
			if (updateData.name) user.name = updateData.name;
			if (updateData.phone) user.phone = updateData.phone;
			if (updateData.email) user.email = updateData.email;

			// Update or create address with location
			if (updateData.location) {
				if (!user.addresses || user.addresses.length === 0) {
					user.addresses = [{ city: updateData.location }];
				} else {
					user.addresses[0].city = updateData.location;
				}
			}

			await user.save();

			return {
				profile: {
					_id: 'me',
					name: user.name,
					phone: user.phone,
					email: user.email,
					location: user.addresses?.[0]?.city || '',
					isSelf: true,
				},
				profiles: user.profiles,
			};
		}

		// Update sub-profile
		const profile = user.profiles.id(profileId);
		if (!profile) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'Profile not found.' };
		}

		// Update profile details
		Object.assign(profile, updateData);

		// Mark the profiles array as modified
		user.markModified('profiles');
		await user.save();

		return {
			profile,
			profiles: user.profiles,
		};
	}

	async deleteProfile(userId, profileId) {
		const user = await User.findById(userId);
		if (!user) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'User not found' };
		}

		const profileToDelete = user.profiles.id(profileId);
		if (!profileToDelete) {
			throw { statusCode: STATUS.NOT_FOUND, message: 'Profile not found.' };
		}

		const profileName = profileToDelete.name;

		// Delete ALL orders with this profile's NAME (not ID)
		await Order.deleteMany({ profileId: profileName });

		// Also delete by ObjectId in case old orders were stored that way
		await Order.deleteMany({ profileId: profileId });

		// Mongoose subdocument pull
		user.profiles.pull(profileId);
		await user.save();

		return {
			profiles: user.profiles,
		};
	}
}

module.exports = new UserService();
