import express from "express";
import { Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"
import fileUpload from "express-fileupload";

const userRoutes = require("./v1/controllers/user");
const categoryRoutes = require("./v1/controllers/category");
const productRoutes = require("./v1/controllers/product");
const orderRoutes = require("./v1/controllers/order");
const orderItemRoutes = require("./v1/controllers/orderItem");
const cartRoutes = require("./v1/controllers/cart");
const reviewsRoutes = require("./v1/controllers/ratingAndReviews");

dotenv.config();
const app = express();

const PORT = process.env.PORT || 4000;

//mouting middlewares -->parsing purpose
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(
  fileUpload({
    createParentPath: true,
  })
);

//mouting routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/orderItem", orderItemRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/reviews", reviewsRoutes);

//activate server
var server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//default route
app.get("/", (req: Request, res: Response) => {
  res.send(`<h1>Hello server</h1>`);
});

module.exports = server;
