const express = require("express");

const router = express.Router();

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

/*
|--------------------------------------------------------------------------
| USER ROUTES
|--------------------------------------------------------------------------
*/

// Create order
router.post(
  "/",
  protect,
  createOrder
);

// My orders
router.get(
  "/",
  protect,
  getMyOrders
);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTES
|--------------------------------------------------------------------------
*/

// Get all orders
router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllOrders
);

// Update order status
router.put(
  "/admin/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus
);

// Delete order
router.delete(
  "/admin/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

/*
|--------------------------------------------------------------------------
| SINGLE ORDER
|--------------------------------------------------------------------------
*/

router.get(
  "/:id",
  protect,
  getOrderById
);

module.exports = router;