const express = require("express");
const router = express.Router();
const { getCart, updateCart, clearCart } = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

router.use(protect);
router.get("/", getCart);
router.put("/", updateCart);
router.delete("/", clearCart);

module.exports = router;