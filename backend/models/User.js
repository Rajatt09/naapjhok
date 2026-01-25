const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["user", "admin", "tailor"],
		default: "user",
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Other"],
		default: "Male",
	},
	addresses: [
		{
			street: String,
			city: String,
			state: String,
			zip: String,
			country: String,
		},
	],
	profiles: [
		{
			name: { type: String, required: true },
			phone: { type: String, required: true },
			email: String,
			location: String,
			measurements: String, // JSON string or simple text for now
		},
	],
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

// Hash password before saving
userSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 12);
});

// Method to check password
userSchema.methods.correctPassword = async function (
	candidatePassword,
	userPassword,
) {
	return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("User", userSchema);
