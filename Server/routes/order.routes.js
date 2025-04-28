const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/cash-on-delivery",
  authMiddleware,
  orderController.cashOnDeliveryPaymentController
);
router.post("/checkout", authMiddleware, orderController.paymentController);
router.post("/webhook", orderController.webhookStripe);
router.get("/order-list", authMiddleware, orderController.getOrderDetailsController);

module.exports = router;
