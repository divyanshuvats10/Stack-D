const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
	{
		cartItemId: { type: String, required: true },
		pizzaId: { type: String, required: true },
		name: { type: String, required: true },
		image: String,
		unitPrice: { type: Number, required: true, min: 0 },
		quantity: { type: Number, required: true, min: 1 },
		customizations: [String],
		itemTotal: { type: Number, required: true, min: 0 },
	},
	{ _id: false }
);

const cartSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
		items: [cartItemSchema],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
