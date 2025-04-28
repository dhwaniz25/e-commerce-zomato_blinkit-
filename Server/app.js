const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");

const connectDB = require("./config/connectDB");
const userRoute = require("./routes/user.routes");
const categoryRoute = require("./routes/category.routes");
const uploadImageRoute = require("./routes/uploadImage.routes");
const subcategoryRoute = require("./routes/subCategory.routes");
const productRoute = require("./routes/product.routes");
const cartRoute = require("./routes/cart.routes");
const addressRoute = require("./routes/address.routes");
const orderRoute = require("./routes/order.routes");

const app = express();

app.use("/api/order/webhook", express.raw({ type: "application/json" }));

app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("combined"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT;

app.get("/", (req, res, next) => {
  res.send("Hello, from Zomato Blinkit😁");
});

app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/file", uploadImageRoute);
app.use("/api/subcategory", subcategoryRoute);
app.use("/api/product", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/address", addressRoute);
app.use("/api/order", orderRoute);

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server started successfully on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error", error);
  });
