const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
// const multerMiddleware = require("../middleware/multer.middleware");
const upload = require("../middleware/multer.middleware");

router.post("/register", userController.registerUserController);
router.post("/verify-email", userController.verifyEmailController);
router.post("/login", userController.loginController);
router.get("/logout", authMiddleware, userController.logoutController);
router.put(
  "/upload-avatar",
  authMiddleware,
  upload.single("avatar"),
  userController.uploadAvatar
);
router.put("/update-user", authMiddleware, userController.updateUserDetails);
router.put("/forgot-password", userController.forgotPasswordController); //can also use post method for this route
router.put(
  "/verify-forgot-password-otp",
  userController.verifyForgotPasswordOTP
); //can also use post method for this route
router.put("/reset-password", userController.resetPassword);
router.post("/refresh-token", userController.refreshToken);
router.get("/user-details", authMiddleware, userController.userDetails);

module.exports = router;
