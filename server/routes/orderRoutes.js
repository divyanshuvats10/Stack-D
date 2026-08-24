const express = require("express");
const router = express.Router();
const { createOrder, getOrderById } = require("../controllers/orderController");
const { optionalAuth } = require("../middleware/authMiddleware");

router.post("/", optionalAuth, createOrder);
router.get("/:id", getOrderById);

module.exports = router;