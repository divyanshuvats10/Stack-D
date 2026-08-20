const Ingredient = require("../models/Ingredient");

const getIngredients = async (req, res) => {
  try {
    const ingredients = await Ingredient.find({});
    res.status(200).json(ingredients);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ingredients", error: err.message });
  }
};

module.exports = { getIngredients };