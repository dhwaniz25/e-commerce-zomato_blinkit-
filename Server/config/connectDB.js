const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

if (!process.env.MONGODB_URI) {
  throw new Error("Please provide mongodb uri in .env file");
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully !!!");
  } catch (error) {
    console.log("Error connecting the database ", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
