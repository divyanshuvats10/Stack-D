require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Pizza = require("./models/Pizza");
const Ingredient = require("./models/Ingredient");

const pizzas = [
  {
    name: "Margherita",
    description: "Classic delight with 100% real mozzarella cheese",
    basePrice: 199,
    image: "/pizzas/margherita.jpg",
    category: "veg",
  },
  {
    name: "Farmhouse",
    description: "Loaded with onion, capsicum, tomato & mushroom",
    basePrice: 249,
    image: "/pizzas/farmhouse.jpg",
    category: "veg",
  },
  {
    name: "Peppy Paneer",
    description: "Paneer, capsicum & red paprika on tomato sauce",
    basePrice: 269,
    image: "/pizzas/peppy-paneer.jpg",
    category: "veg",
  },
  {
    name: "Pepper Barbecue Chicken",
    description: "Chicken tikka, onion & barbecue sauce",
    basePrice: 329,
    image: "/pizzas/pepper-barbecue-chicken.jpg",
    category: "non-veg",
  },
  {
    name: "Chicken Dominator",
    description: "Loaded with double chicken toppings",
    basePrice: 349,
    image: "/pizzas/chicken-dominator.jpg",
    category: "non-veg",
  },
  {
    name: "Pepperoni Feast",
    description: "Classic pepperoni with extra cheese",
    basePrice: 319,
    image: "/pizzas/pepperoni-feast.jpg",
    category: "non-veg",
  },
  {
    name: "Cheese Burst",
    description: "Extra cheesy pizza with molten cheese core",
    basePrice: 289,
    image: "/pizzas/cheese-burst.jpg",
    category: "veg",
  },
  {
    name: "Mexican Wave",
    description: "Jalapeno, capsicum, onion with Mexican herbs",
    basePrice: 259,
    image: "/pizzas/mexican-wave.jpg",
    category: "veg",
  },
];

const ingredients = [
  // Base
  { name: "Thin Crust", type: "base", price: 0 },
  { name: "Hand Tossed", type: "base", price: 20 },
  { name: "Cheese Burst Base", type: "base", price: 60 },

  // Sauce
  { name: "Tomato Sauce", type: "sauce", price: 0 },
  { name: "Peri Peri Sauce", type: "sauce", price: 15 },
  { name: "BBQ Sauce", type: "sauce", price: 20 },

  // Cheese
  { name: "Mozzarella", type: "cheese", price: 0 },
  { name: "Extra Cheese", type: "cheese", price: 40 },
  { name: "Cheddar Blend", type: "cheese", price: 45 },

  // Toppings
  { name: "Onion", type: "topping", price: 15 },
  { name: "Capsicum", type: "topping", price: 15 },
  { name: "Mushroom", type: "topping", price: 25 },
  { name: "Paneer", type: "topping", price: 35 },
  { name: "Corn", type: "topping", price: 20 },
  { name: "Jalapeno", type: "topping", price: 20 },
  { name: "Chicken Tikka", type: "topping", price: 50 },
  { name: "Pepperoni", type: "topping", price: 55 },
  { name: "Grilled Chicken", type: "topping", price: 50 },
  { name: "Olives", type: "topping", price: 20 },
];

const seedData = async () => {
  try {
    const dnsServers = process.env.MONGO_DNS_SERVERS?.split(",").map((server) => server.trim()).filter(Boolean);
    if (dnsServers?.length) dns.setServers(dnsServers);

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected for seeding...");

    await Pizza.deleteMany();
    await Ingredient.deleteMany();
    console.log("Old data cleared");

    await Pizza.insertMany(pizzas);
    await Ingredient.insertMany(ingredients);
    console.log("Seed data inserted successfully");

    process.exit();
  } catch (err) {
    console.error("Seeding failed:", err.message);
    process.exit(1);
  }
};

seedData();