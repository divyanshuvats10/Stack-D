const Cart = require("../models/Cart");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    res.status(200).json({ items: cart?.items || [] });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch cart", error: err.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const items = Array.isArray(req.body.items) ? req.body.items : [];
    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { user: req.user._id, items },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ items: cart.items });
  } catch (err) {
    res.status(400).json({ message: "Failed to update cart", error: err.message });
  }
};

const clearCart = async (req, res) => {
  try {
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] }, { upsert: true });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: "Failed to clear cart", error: err.message });
  }
};

module.exports = { getCart, updateCart, clearCart };