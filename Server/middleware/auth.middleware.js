const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req?.headers?.authorization.split(" ")[1]; //Bearer token then we can use the or part that is authorization, after spliting it will convert to array that is ["Bearer","token"]
    // console.log(req?.headers.authorization.split(" ")[1]);

    // const token = req.cookies.accessToken;

    console.log("token", token);
    if (!token) {
      return res.status(400).json({
        message: "Token not found, Please provid a valid token",
        error: true,
        success: false,
      });
    }
    const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);
    if (!decode) {
      return res.status(400).json({
        message: "Unauthorized access, Access token experied!",
        error: true,
        success: false,
      });
    }
    req.userId = decode.id;
    console.log("decode", decode);
    next();
  } catch (error) {
    console.log("Error occured while authenticating,You have not login!");
    return res.status(500).json({
      message: "Error occured while authenticating, You have not login!",
      error: true,
      success: false,
    });
  }
};

module.exports = auth;
