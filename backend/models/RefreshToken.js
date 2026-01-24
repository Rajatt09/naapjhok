const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    revoked: {
        type: Date
    },
    replacedByToken: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '7d' // Automatically remove from DB after 7 days
    }
});

refreshTokenSchema.virtual('isExpired').get(function() {
    return Date.now() >= this.expiresAt;
});

refreshTokenSchema.virtual('isActive').get(function() {
    return !this.revoked && !this.isExpired;
});

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
