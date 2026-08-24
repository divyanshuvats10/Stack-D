const User = require("../models/User");

const templateFields = "name base sauce cheese toppings createdAt updatedAt";

const getTemplates = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(`pizzaTemplates`);
    res.status(200).json(user?.pizzaTemplates || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pizza templates", error: err.message });
  }
};

const createTemplate = async (req, res) => {
  try {
    const { name, base, sauce, cheese, toppings = [] } = req.body;
    if (!name || !base || !sauce || !cheese) {
      return res.status(400).json({ message: "A template name, base, sauce, and cheese are required" });
    }

    const user = await User.findById(req.user._id);
    user.pizzaTemplates.push({ name, base, sauce, cheese, toppings });
    await user.save();
    res.status(201).json(user.pizzaTemplates[user.pizzaTemplates.length - 1]);
  } catch (err) {
    res.status(400).json({ message: "Failed to save pizza template", error: err.message });
  }
};

const deleteTemplate = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const template = user.pizzaTemplates.id(req.params.id);
    if (!template) return res.status(404).json({ message: "Pizza template not found" });
    template.deleteOne();
    await user.save();
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ message: "Failed to delete pizza template", error: err.message });
  }
};

module.exports = { getTemplates, createTemplate, deleteTemplate };