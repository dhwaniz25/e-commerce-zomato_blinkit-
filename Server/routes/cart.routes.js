const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, cartController.addToCartController);
router.get("/get", authMiddleware, cartController.getCartItemController);
router.put(
  "/update-qty",
  authMiddleware,
  cartController.updateCartItemQtyController
);
router.delete(
  "/delete-cart-item",
  authMiddleware,
  cartController.deleteCartItemQtyController
);

module.exports = router;
