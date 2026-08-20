const Pizza = require("../models/Pizza");

// @desc   Get all pizzas
// @route  GET /api/pizzas
const getPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find({});
    res.status(200).json(pizzas);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pizzas", error: err.message });
  }
};

// @desc   Get single pizza by ID
// @route  GET /api/pizzas/:id
const getPizzaById = async (req, res) => {
  try {
    const pizza = await Pizza.findById(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.status(200).json(pizza);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch pizza", error: err.message });
  }
};

module.exports = { getPizzas, getPizzaById };