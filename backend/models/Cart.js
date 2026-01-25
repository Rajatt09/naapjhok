const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true,
	},
	items: [
		{
			product: {
				id: String, // Product ID (can be ObjectId string or number string)
				name: String,
				image: String,
				category: String,
				basePrice: Number,
				fabricPrice: Number,
			},
			withFabric: { type: Boolean, default: false },
			profileId: String, // ID from user.profiles
			quantity: { type: Number, default: 1 },
			customization: {
				fabricType: String,
				color: String,
				description: String,
				referenceImage: String, // URL/Path
			},
		},
	],
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Cart", cartSchema);
