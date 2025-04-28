const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

router.post(
  "/create",
  authMiddleware,
  adminMiddleware,
  productController.createProductController
);
router.post("/get", productController.getProductController); //we used POST method while fetching data that is because we need page and limit from req.body for pagination
router.post(
  "/get-product-by-category",
  productController.getProductByCategoryController
);
router.post(
  "/get-product-by-category-and-subcategory",
  productController.getProductByCategoryAndSubCategoryController
);
router.post("/get-product-detail", productController.getProductDetails);
router.put(
  "/update-product-detail",
  authMiddleware,
  adminMiddleware,
  productController.updateProductDetails
);
router.delete(
  "/delete-product",
  authMiddleware,
  adminMiddleware,
  productController.deleteProductDetails
);
router.post("/search-product", productController.searchProduct);

module.exports = router;
