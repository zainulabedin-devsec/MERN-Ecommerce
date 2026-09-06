const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorHandler");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use(compression());

app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "E-Commerce Backend API Running Successfully"
    });
});


// for handling error automatically
app.use(errorHandler);

//for product route
app.use("/api/products", productRoutes);

//for cart routes
app.use("/api/cart", cartRoutes);

//for wishlist route
app.use("/api/wishlist", wishlistRoutes);

//for order route
app.use("/api/orders", orderRoutes);

//for contact routes
app.use("/api/contact", contactRoutes);

module.exports = app;