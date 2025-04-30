const express = require("express");
const router = express.Router();
const { addToCart, getCartForUser } = require("../controllers/cartController");

router.post("/add", addToCart); // endpoint: /api/cart/add
router.get("/user/:user_id", getCartForUser); 
module.exports = router;