const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  name: String,
  unitPrice: Number,
  quantity: Number,
  customizations: [String],
  itemTotal: Number,
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null = guest
    customerName: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    items: [orderItemSchema],
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Preparing", "Out for Delivery", "Delivered"],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);