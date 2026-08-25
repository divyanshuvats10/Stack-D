const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  basePrice: { type: Number, required: true },
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Pizza", pizzaSchema);