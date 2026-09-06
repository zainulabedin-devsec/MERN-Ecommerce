const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/Product");

dotenv.config();

const products = [
  {
    name: "Sports T-Shirt",
    price: 10,
    oldPrice: 15,
    onSale: true,
    newArrival: false,
    category: "Men",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522797/ecommerce-products/sports-t-shirt.jpg",
    stock: 20,
  },

  {
    name: "Casual Jeans",
    price: 25,
    oldPrice: 30,
    onSale: true,
    newArrival: false,
    category: "Men",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522846/ecommerce-products/casual-jeans.jpg",
    stock: 20,
  },

  {
    name: "Formal Shirt",
    price: 20,
    oldPrice: 20,
    onSale: false,
    newArrival: true,
    category: "Men",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522870/ecommerce-products/formal-shirt.jpg",
    stock: 20,
  },

  {
    name: "Summer Dress",
    price: 30,
    oldPrice: 40,
    onSale: true,
    newArrival: false,
    category: "Women",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522897/ecommerce-products/summer-dress.jpg",
    stock: 20,
  },

  {
    name: "Handbag",
    price: 50,
    oldPrice: 55,
    onSale: false,
    newArrival: true,
    category: "Women",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522904/ecommerce-products/handbag.jpg",
    stock: 20,
  },

  {
    name: "High Heels",
    price: 45,
    oldPrice: 60,
    onSale: true,
    newArrival: false,
    category: "Women",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522907/ecommerce-products/high-heels.jpg",
    stock: 20,
  },

  {
    name: "Kids Sneakers",
    price: 15,
    oldPrice: 20,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522953/ecommerce-products/kids-sneakers.jpg",
    stock: 20,
  },

  {
    name: "Cartoon T-Shirt",
    price: 12,
    oldPrice: 12,
    onSale: false,
    newArrival: true,
    category: "Kids",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522974/ecommerce-products/cartoon-t-shirt.jpg",
    stock: 20,
  },

  {
    name: "Toy Car",
    price: 8,
    oldPrice: 10,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788522994/ecommerce-products/toy-car.jpg",
    stock: 20,
  },

  {
    name: "School Backpack",
    price: 18,
    oldPrice: 25,
    onSale: true,
    newArrival: false,
    category: "Kids",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788523061/ecommerce-products/school-backpack.jpg",
    stock: 20,
  },

  {
    name: "Leather Jacket",
    price: 70,
    oldPrice: 90,
    onSale: true,
    newArrival: false,
    category: "Men",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788523062/ecommerce-products/leather-jacket.jpg",
    stock: 20,
  },

  {
    name: "Evening Gown",
    price: 85,
    oldPrice: 100,
    onSale: false,
    newArrival: true,
    category: "Women",
    image:
      "https://res.cloudinary.com/zabercsx/image/upload/v1788523089/ecommerce-products/evening-gown.jpg",
    stock: 20,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    console.log("Existing products deleted");

    await Product.insertMany(products);

    console.log("12 products inserted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);

    process.exit(1);
  }
};

seedProducts();