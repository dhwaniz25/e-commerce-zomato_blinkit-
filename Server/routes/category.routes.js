const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const categoryController = require("../controllers/category.controller");

router.post(
  "/add-category",
  authMiddleware,
  categoryController.addCategoryController
);
router.get("/get-category", categoryController.getCategoryController);
router.put(
  "/update-category",
  authMiddleware,
  categoryController.updateCategoryController
);
router.delete(
  "/delete-category",
  authMiddleware,
  categoryController.deleteCategoryController
);

module.exports = router;
