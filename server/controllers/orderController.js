const Order = require("../models/Order");

const createOrder = async (req, res) => {
  try {
    const { customerName, phone, address, city, pincode, items, grandTotal } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // server-side recalculation — never trust client-sent totals blindly
    const recalculatedTotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );

    if (Math.abs(recalculatedTotal - grandTotal) > 0.01) {
      return res.status(400).json({ message: "Price mismatch detected" });
    }

    const order = await Order.create({
      customerName,
      phone,
      address,
      city,
      pincode,
      items,
      grandTotal: recalculatedTotal,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch order", error: err.message });
  }
};

module.exports = { createOrder, getOrderById };