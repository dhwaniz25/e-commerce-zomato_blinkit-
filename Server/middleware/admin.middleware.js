const userModel = require("../models/user.model");

const admin = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    if (user.role !== "ADMIN") {
      return res.status(400).json({
        message: "Permission denied, You do not have access!",
        error: true,
        success: false,
      });
    }

    next();
  } catch (error) {
    console.log("Error occured, permission denied! You do not have access!");
    return res.status(500).json({
      message: "Error 500 occured, permission denied! You do not have access!",
      error: true,
      success: false,
    });
  }
};

module.exports = admin
