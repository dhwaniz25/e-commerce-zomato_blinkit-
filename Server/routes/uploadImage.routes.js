const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth.middleware");
const uploadImgController = require("../controllers/uploadImage.controller");
const upload = require("../middleware/multer.middleware");

router.post(
  "/upload-image",
  authMiddleware,
  upload.single("image"),
  uploadImgController.uploadImageController
);

module.exports = router;
