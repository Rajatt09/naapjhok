const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// --- Helper Functions ---

const signAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m' // Short lived access token
    });
};

const generateRefreshToken = async (user, ipAddress) => {
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

const sendTokenResponse = async (user, statusCode, res) => {
    const accessToken = signAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user);

    const cookieOptions = {
        httpOnly: true,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        // secure: process.env.NODE_ENV === 'production' // Send only over HTTPS in production
        secure: false // Set to true if using HTTPS locally or in prod
    };

    res.cookie('refreshToken', refreshToken.token, cookieOptions);

    // Remove sensitive data
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        data: { user }
    });
};

// --- Controllers ---

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            phone: req.body.phone,
            gender: req.body.gender
        });
        await sendTokenResponse(newUser, 201, res);
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password!' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        await sendTokenResponse(user, 200, res);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.refreshToken = async (req, res) => {
    const token = req.cookies.refreshToken;

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    try {
        const refreshToken = await RefreshToken.findOne({ token }).populate('user');

        if (!refreshToken || !refreshToken.isActive) {
            // Optional: Detect token reuse here if status is revoked
            return res.status(403).json({ message: 'Invalid token' });
        }

        const { user } = refreshToken;
        
        // Revoke old token (Rotation)
        refreshToken.revoked = Date.now();
        refreshToken.replacedByToken = 'new_generated_token_placeholder'; // Ideally store the new one
        await refreshToken.save();

        // Issue new pair
        await sendTokenResponse(user, 200, res);

    } catch (err) {
         res.status(500).json({ message: err.message });
    }
};

exports.logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.sendStatus(204);

    try {
        // Revoke token in DB
        const refreshToken = await RefreshToken.findOne({ token });
        if (refreshToken) {
            refreshToken.revoked = Date.now();
            await refreshToken.save();
        }
    } catch (err) {
        // Continue to clear cookie even if DB fails
    }

    res.clearCookie('refreshToken', {
         httpOnly: true,
         secure: false // Match creation setting
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
    // This route uses authMiddleware, so req.user is populated
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
