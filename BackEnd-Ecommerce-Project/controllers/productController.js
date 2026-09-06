const Product = require("../models/Product");
const asyncHandler = require("../middleware/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {

    const product = await Product.create({

        ...req.body,

        createdBy: req.user._id

    });

    res.status(201).json({

        success: true,

        message: "Product created successfully",

        product

    });

});

// getting the products

const getAllProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 12,
  } = req.query;

  // Build filter
  const filter = {};

  // Search by product name or brand
  if (keyword) {
    filter.$or = [
      {
        name: {
          $regex: keyword,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: keyword,
          $options: "i",
        },
      },
    ];
  }

  // Category filter
  if (category) {
    filter.category = {
      $regex: `^${category}$`,
      $options: "i",
    };
  }

  // Price filtering
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};

    if (minPrice !== undefined) {
      filter.price.$gte = Number(minPrice);
    }

    if (maxPrice !== undefined) {
      filter.price.$lte = Number(maxPrice);
    }
  }

  // Pagination
  const currentPage = Math.max(Number(page), 1);
  const productsPerPage = Math.min(Math.max(Number(limit), 1), 100);

  const skip = (currentPage - 1) * productsPerPage;

  // Sorting
  let sortOption = {
    createdAt: -1,
  };

  if (sort === "price_asc") {
    sortOption = {
      price: 1,
    };
  }

  if (sort === "price_desc") {
    sortOption = {
      price: -1,
    };
  }

  if (sort === "newest") {
    sortOption = {
      createdAt: -1,
    };
  }

  if (sort === "oldest") {
    sortOption = {
      createdAt: 1,
    };
  }

  const totalProducts = await Product.countDocuments(filter);

  const products = await Product.find(filter)
    .sort(sortOption)
    .skip(skip)
    .limit(productsPerPage);

  const totalPages = Math.ceil(totalProducts / productsPerPage);

  res.status(200).json({
    success: true,

    count: products.length,

    totalProducts,

    currentPage,

    totalPages,

    hasNextPage: currentPage < totalPages,

    hasPreviousPage: currentPage > 1,

    products,
  });
});

// finding the product by its id

const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// updating the product by its id

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

 const allowedFields = [
  "name",
  "description",
  "price",
  "oldPrice",
  "onSale",
  "newArrival",
  "category",
  "image",
  "stock",
];
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      product[field] = req.body[field];
    }
  });

  const updatedProduct = await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product: updatedProduct,
  });
});

// deleting the product by its id

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};