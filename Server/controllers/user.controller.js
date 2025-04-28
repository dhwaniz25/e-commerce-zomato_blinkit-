const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const verifyEmailTemplate = require("../utils/verifyEmailTemplate");
const generateAccessToken = require("../utils/generateAccessToken");
const generateRefreshToken = require("../utils/generateRefreshToken");
const uploadImageCloudinary = require("../utils/uploadImageCloudinary");
const generateOtp = require("../utils/generateOtp");
const forgotPasswordTemplate = require("../utils/forgotPasswordTemplate");
// const sendEmail = require("../config/sendEmail");

//Register User or Sign-Up User
exports.registerUserController = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name,email,password",
        error: true,
        success: false,
      });
    }
    //Email
    const user = await userModel.findOne({ email });
    if (user) {
      return res.json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }
    //Password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashPassword,
    };
    const newUser = new userModel(payload);
    const save = await newUser.save();
    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`; //comes from frontend
    //Send-Email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"Blinkit"<${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Verification email from Blinkit",
      html: verifyEmailTemplate({
        name,
        url: verifyEmailUrl,
      }),
    });
    return res.status(200).json({
      message: "User registerd successfully",
      error: false,
      success: true,
      data: save,
    });
  } catch (error) {
    console.log("Error occured while registering user", error.message);
    return res.status(500).json({
      message: "Error 500 occured while registering user",
      error: true,
      success: false,
    });
  }
};

//Verify-Email
exports.verifyEmailController = async (req, res, next) => {
  try {
    const { code } = req.body;
    const user = await userModel.findOne({ _id: code });
    if (!user) {
      return res.status(400).json({
        message: `No user exists with ${code}`,
        error: true,
        success: false,
      });
    }
    //Verification Success
    const updateUser = await userModel.updateOne(
      { _id: code },
      {
        verify_email: true,
      }
    );
    return res.status(200).json({
      message: "Email verified successfully !",
      updateUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while verifying email", error.message);
    return res.status(500).json({
      message: "Error 500 occured while verifying email",
      error: true,
      success: false,
    });
  }
};

//Login User
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Please enter email and password",
        error: true,
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "User is not registerd yet, Please register or sign up first",
        error: true,
        success: false,
      });
    }
    if (user.status !== "Active") {
      return res.status(400).json({
        message: "Contact to Admin, your account is not Active",
        error: true,
        succes: false,
      });
    }

    //Check Password
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({
        message:
          "Check your password, it does not match with existing password!",
        error: true,
        success: false,
      });
    }

    //Retrieve Token
    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generateRefreshToken(user._id);

    const updateUser = await userModel.findByIdAndUpdate(user?._id, {
      last_login_date: new Date(),
    });

    //Saving in Cookies
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", accessToken, cookiesOption);
    res.cookie("refreshToken", refreshToken, cookiesOption);

    return res.status(200).json({
      message: "Successfully logged in",
      error: false,
      success: true,
      data: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.log("Error occured while logging in user", error.message);
    return res.status(500).json({
      message: "Error 500 occured while logging in the user",
      error: true,
      success: false,
    });
  }
};

//Logout User
exports.logoutController = async (req, res, next) => {
  try {
    const userid = req.userId; //userId from middleware

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("accessToken", cookiesOption);
    res.clearCookie("refreshToken", cookiesOption);

    const removeRefreshToken = await userModel.findByIdAndUpdate(userid, {
      refresh_token: "",
    });

    return res.status(200).json({
      message: "Successfully logged out",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while logging out the user", error.message);
    return res.status(500).json({
      message: "Error 500 occured while logging out the user",
      error: true,
      success: false,
    });
  }
};

//User Avatar
exports.uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.userId; //Auth Middleware
    const image = req.file; //Multer Middleware
    console.log("Incoming file:", req.file); // Debug log

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        error: true,
        success: false,
      });
    }
    const upload = await uploadImageCloudinary(image);
    const updateUser = await userModel.findByIdAndUpdate(userId, {
      avatar: upload.url,
    });
    return res.status(200).json({
      message: "Successfully uploaded your avatar",
      data: {
        _id: userId,
        avatar: upload.url,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while uploading user avatar", error.message);
    return res.status(500).json({
      message: "Error 500 occured while uploading user avatar",
      error: true,
      success: false,
    });
  }
};

//Update User Details
exports.updateUserDetails = async (req, res, next) => {
  try {
    const userId = req.userId; //Auth Middleware
    const { name, email, mobile, password } = req.body;

    let hashPassword = "";
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashPassword = await bcrypt.hash(password, salt);
    }

    const updateUser = await userModel.updateOne(
      { _id: userId },
      {
        ...(name && { name: name }),
        ...(email && { email: email }),
        ...(mobile && { mobile: mobile }),
        ...(password && { password: hashPassword }),
      }
    );
    return res.status(200).json({
      message: "Successfully updated user",
      data: updateUser,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while updating user details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while updating user details",
      error: true,
      success: false,
    });
  }
};

//Forgot Password OTP
exports.forgotPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expiryTime = new Date() + 60 * 60 * 1000; //1 hour

    const update = await userModel.updateOne(
      { _id: user._id },
      {
        forgot_password_otp: otp,
        forgot_password_expiry: new Date(expiryTime).toISOString(),
      }
    );

    // const update = await userModel.findByIdAndUpdate(user._id, {
    //   forgot_password_otp: otp,
    //   forgot_password_expiry: new Date(expiryTime).toISOString(),
    // });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.APP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"Blinkit"<${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Forgot Password Email from Blinkit",
      html: forgotPasswordTemplate(user.name, otp),
    });

    return res.status(200).json({
      message: "Check your email, for further information",
      data: update,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while running forgot password", error.message);
    return res.status(500).json({
      message: "Error 500 occured while running forgot password",
      error: true,
      success: false,
    });
  }
};

//Verify Forgot Password OTP
exports.verifyForgotPasswordOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        message: "Please enter email and otp",
        error: true,
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Please provide valid user email",
        error: true,
        success: false,
      });
    }
    const currentTime = new Date().toISOString();
    if (user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP is expired",
        error: true,
        success: false,
      });
    }
    if (otp.toString() !== user.forgot_password_otp.toString()) {
      return res.status(400).json({
        message: "OTP does not match, Invalid OTP",
        error: true,
        success: false,
      });
    }

    //If OTP is not expire && OTP === user.forgot_password_otp
    // if (Date(
    //   user.forgot_password_expiry > currentTime &&
    //   otp === user.forgot_password_otp
    // )) {}

    const updateUser = await userModel.findByIdAndUpdate(user?._id, {
      forgot_password_otp: "",
      forgot_password_expiry: "",
    });

    return res.status(200).json({
      message: "Successfully verified OTP",
      error: false,
      success: true,
    });
  } catch (error) {
    console.log(
      "Error occured while verifying forgot password OTP",
      error.message
    );
    return res.status(500).json({
      message: "Error 500 occured while verifying forgot password OTP",
      error: true,
      success: false,
    });
  }
};

//Reset Password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Please enter email, newPassword, confirmPassword",
        error: true,
        success: false,
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid user, email is not available",
        error: true,
        success: false,
      });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "NewPassword & ConfirmPassword does not match",
        error: true,
        success: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    const update = await userModel.findByIdAndUpdate(user._id, {
      password: hashPassword,
    });
    return res.status(200).json({
      message: "Successfully updated password ",
      data: update,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while resetting password", error.message);
    return res.status(500).json({
      message: "Error 500 occured while resetting password",
      error: true,
      success: false,
    });
  }
};

//Refresh Token Api
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];
    if (!refreshToken) {
      return res.status(401).json({
        message: "Unauthorized access, refresh token not found",
        error: true,
        success: false,
      });
    }
    // console.log("refresh token", refreshToken);
    const verifyToken = await jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN
    );
    if (!verifyToken) {
      return res.status(400).json({
        message: "Error occured verifying token, token is expired",
        error: true,
        success: false,
      });
    }
    console.log("verify token ", verifyToken);
    const userId = verifyToken?.id;
    const newAccessToken = await generateAccessToken(userId);
    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.cookie("accessToken", newAccessToken, cookiesOption);
    return res.status(200).json({
      message:
        "Successfully generated new access token, from existing refresh token",
      data: {
        accessToken: newAccessToken,
      },
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured for refresh token", error.message);
    return res.status(500).json({
      message: "Error 500 occured for refresh token",
      error: true,
      success: false,
    });
  }
};

//Fetch User Details
exports.userDetails = async (req, res, next) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized - User ID not provided",
        error: true,
        success: false,
      });
    }
    console.log(userId);
    const user = await userModel
      .findById(userId)
      .select("-password -refresh_token");
    return res.status(200).json({
      message: "Successfully fetched user details by id",
      data: user,
      error: false,
      success: true,
    });
  } catch (error) {
    console.log("Error occured while fetching user details", error.message);
    return res.status(500).json({
      message: "Error 500 occured while fetching user details",
      error: true,
      success: false,
    });
  }
};
