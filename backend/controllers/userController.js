const User = require('../models/User');

// Add a new profile
exports.addProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const newProfile = {
            ...req.body, // name, phone, email, measurements
            _id: undefined // Let Mongo generate subdoc ID
        };
        
        // Check for duplicate name (case-insensitive)
        const duplicate = user.profiles.find(p => p.name.toLowerCase() === newProfile.name.toLowerCase());
        if (duplicate) {
            return res.status(400).json({ message: 'A profile with this name already exists.' });
        }
        
        user.profiles.push(newProfile);
        await user.save();

        // Return the newly created profile (last in array)
        const createdProfile = user.profiles[user.profiles.length - 1];

        res.status(201).json({
            status: 'success',
            profile: createdProfile,
            profiles: user.profiles
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Get all profiles
exports.getProfiles = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            profiles: user.profiles
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// Update a profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const profile = user.profiles.id(req.params.id);

        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Update fields
        Object.assign(profile, req.body);
        await user.save();

        res.status(200).json({
            status: 'success',
            profile,
            profiles: user.profiles
        });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// Delete a profile
exports.deleteProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        
        // Mongoose subdocument pull
        user.profiles.pull(req.params.id);
        await user.save();

        res.status(200).json({
            status: 'success',
            profiles: user.profiles
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
