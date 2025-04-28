const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const generateAccessToken = async (userId) => {
  const token = await jwt.sign(
    { id: userId },
    process.env.SECRET_KEY_ACCESS_TOKEN,
    { expiresIn: "5H" }
  );
  return token;
};

module.exports = generateAccessToken;
