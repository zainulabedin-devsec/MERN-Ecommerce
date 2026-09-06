const mongoose = require("mongoose");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const {
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
} = require("../utils/sendEmail");

// ======================================================
// CREATE ORDER FROM CART - CUSTOMER
// ======================================================
const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { shippingAddress, paymentMethod = "COD" } = req.body;

    // Validate shipping address
    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Full name, phone, address and city are required",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Your cart is empty",
      });
    }

    let subtotal = 0;
    const orderItems = [];

    // Check products and stock
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id).session(session);

      if (!product) {
        throw new Error(`Product ${item.product.name} no longer exists`);
      }

      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      subtotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
      });

      // Reduce stock
      product.stock -= item.quantity;

      await product.save({ session });
    }

    // Calculate shipping
    const shippingCost = cart.items.reduce(
      (total, item) => total + item.quantity * 3,
      0,
    );

    const totalAmount = subtotal + shippingCost;

    // ==================================================
    // CREATE ORDER
    // ==================================================

    const [order] = await Order.create(
      [
        {
          user: req.user._id,
          items: orderItems,
          shippingAddress,
          paymentMethod,
          paymentStatus: "Pending",
          orderStatus: "Processing",
          subtotal,
          shippingCost,
          totalAmount,
        },
      ],
      { session },
    );

    // Clear cart
    cart.items = [];

    await cart.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // ==================================================
    // POPULATE ORDER AFTER IT EXISTS
    // ==================================================

    await order.populate("user", "firstName lastName email");
    await order.populate("items.product");

    // ==================================================
    // SEND ORDER CONFIRMATION EMAIL
    // ==================================================

    try {
      console.log("========================================");
      console.log("📧 ORDER EMAIL PROCESS");
      console.log("Order ID:", order._id);
      console.log("Customer Email:", order.user?.email);
      console.log("Admin Email:", "toprojecttesting@gmail.com");
      console.log("========================================");

      await sendOrderConfirmationEmail(order);

      console.log("✅ Customer + Admin emails sent");
    } catch (emailError) {
      console.error("❌ Order email failed");
      console.error(emailError);
    }
    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    // Abort only if transaction is still active
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// ======================================================
// GET LOGGED-IN USER'S ORDERS
// ======================================================
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// ======================================================
// GET SINGLE ORDER - CUSTOMER
// ======================================================
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "firstName lastName email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    const totalRevenue = orders.reduce(
      (total, order) => total + order.totalAmount,
      0,
    );

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalRevenue,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================
const updateOrderStatus = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const { status } = req.body;

    const allowedStatuses = [
      "Processing",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    // Validate status
    if (!allowedStatuses.includes(status)) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    // Find order
    const order = await Order.findById(req.params.id)
      .populate("items.product")
      .session(session);

    if (!order) {
      await session.abortTransaction();

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Prevent changes to completed/cancelled orders
    if (
      order.orderStatus === "Delivered" ||
      order.orderStatus === "Cancelled"
    ) {
      await session.abortTransaction();

      return res.status(400).json({
        success: false,
        message: `Order is already ${order.orderStatus}`,
      });
    }

    // ==================================================
    // RESTORE STOCK IF ORDER IS CANCELLED
    // ==================================================

    if (status === "Cancelled") {
      for (const item of order.items) {
        const product = await Product.findById(item.product._id).session(
          session,
        );

        if (product) {
          product.stock += item.quantity;

          await product.save({ session });
        }
      }
    }

    // Update order status
    order.orderStatus = status;

    // COD payment becomes paid when delivered
    if (status === "Delivered") {
      order.paymentStatus = "Paid";
    }

    await order.save({ session });

    // Populate user before email
    await order.populate("user", "firstName lastName email");

    await order.populate("items.product");

    // Commit database transaction
    await session.commitTransaction();

    /*
|--------------------------------------------------------------------------
| Send Status Update Email
|--------------------------------------------------------------------------
*/

    try {
      await order.populate("user", "firstName lastName email");

      console.log("========================================");
      console.log("📧 STATUS UPDATE EMAIL");
      console.log("Order ID:", order._id);
      console.log("Customer Email:", order.user?.email);
      console.log("New Status:", order.orderStatus);
      console.log("========================================");

      await sendOrderStatusEmail(order);

      console.log("✅ Status email sent to customer");
    } catch (emailError) {
      console.error("❌ Status email failed:");

      console.error(emailError);
    }

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  } finally {
    await session.endSession();
  }
};

// ======================================================
// DELETE ORDER - ADMIN
// ======================================================
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    await order.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete order",
      error: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
};
