const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post("/create", authMiddleware, addressController.addAddressController);
router.get("/get", authMiddleware, addressController.getAddressController);
router.put(
  "/update",
  authMiddleware,
  addressController.updateAddressController
);
router.delete(
  "/disable",
  authMiddleware,
  addressController.deleteAddressController
);

module.exports = router;
