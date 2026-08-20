const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  image: String,
  category: { type: String, enum: ["veg", "non-veg"], default: "veg" },
}, { timestamps: true });

module.exports = mongoose.model("Pizza", pizzaSchema);