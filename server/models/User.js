const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pizzaTemplateIngredientSchema = new mongoose.Schema(
  {
    ingredientId: { type: mongoose.Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const pizzaTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    base: { type: pizzaTemplateIngredientSchema, required: true },
    sauce: { type: pizzaTemplateIngredientSchema, required: true },
    cheese: { type: pizzaTemplateIngredientSchema, required: true },
    toppings: { type: [pizzaTemplateIngredientSchema], default: [] },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    pizzaTemplates: { type: [pizzaTemplateSchema], default: [] },
  },
  { timestamps: true }
);

// hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// instance method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);