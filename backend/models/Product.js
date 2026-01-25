const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "A product must have a name"],
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	category: {
		type: String,
		required: [true, "A product must have a category"],
		enum: [
			"Shirt",
			"Pant",
			"Trouser",
			"Blazer",
			"Suit",
			"Kurta",
			"Sherwani",
			"Other",
		],
	},
	gender: {
		type: String,
		enum: ["Male", "Female", "Unisex"],
		default: "Male",
	},
	basePrice: {
		type: Number,
		required: [true, "A product must have a stitching price"],
	},
	fabricPrice: {
		type: Number,
		default: 0,
	},
	image: {
		type: String,
		default: "default-product.jpg", // Placeholder
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Product", productSchema);
