const express = require("express");
const router = express.Router();
const subCategoryController = require("../controllers/subCategory.controller");
const authMiddleware = require("../middleware/auth.middleware");

router.post(
  "/create",
  authMiddleware,
  subCategoryController.addSubCategoryController
);
router.post("/get", subCategoryController.getSubCategoryController); //here used post method instead of get method because we need to add pagination , and also limit per page items
router.put(
  "/update",
  authMiddleware,
  subCategoryController.updateSubCategoryController
);
router.delete(
  "/delete",
  authMiddleware,
  subCategoryController.deleteSubCategoryController
);

module.exports = router;
