const express = require("express");

const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
  updateProduct,
} = require("../controllers/productController");

const {
    protect,
    authorize
} = require("../middleware/authMiddleware");

router.post(
    "/",
    protect,
    authorize("admin"),
    createProduct
);

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteProduct
);

module.exports = router;