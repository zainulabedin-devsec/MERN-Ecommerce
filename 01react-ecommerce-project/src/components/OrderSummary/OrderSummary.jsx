import React, { useState } from "react";
import { createOrder } from "../../api/orderApi";

function OrderSummary({
  cart,
  subTotal,
  shipping,
  orderTotal,
  setOrderSummary,
  setShowCartWish,
  setCart,
  setFinalOrder,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
    paymentMethod: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (e) => {
    setFormData((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  // ======================================================
  // SUBMIT ORDER
  // ======================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ----------------------------------------------
    // CART VALIDATION
    // ----------------------------------------------

    if (!cart || cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    // ----------------------------------------------
    // FORM VALIDATION
    // ----------------------------------------------

    if (
      !formData.fullName.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim() ||
      !formData.city.trim()
    ) {
      setError(
        "Please fill in your full name, phone, address and city."
      );

      return;
    }

    try {
      setLoading(true);

      const orderData = {
        shippingAddress: {
          fullName: formData.fullName.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country.trim(),
        },

        paymentMethod: formData.paymentMethod,
      };

      console.log(
        "Sending order request:",
        orderData
      );

      const data = await createOrder(orderData);

      console.log(
        "Create order response:",
        data
      );

      // ----------------------------------------------
      // BACKEND FAILURE
      // ----------------------------------------------

      if (!data || data.success !== true) {
        throw new Error(
          data?.message ||
            "Failed to place order."
        );
      }

      // ----------------------------------------------
      // ORDER SUCCESS
      // ----------------------------------------------

      console.log(
        "Order successfully created:",
        data.order
      );

      /*
       * IMPORTANT:
       *
       * Only after the backend confirms that the
       * order was successfully created do we clear
       * the React cart.
       */

      setCart([]);

      // Close checkout
      setOrderSummary(false);

      // Close cart drawer
      setShowCartWish(null);

      // Show successful-order popup
      setFinalOrder(true);

      // Reset form
      setFormData({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Pakistan",
        paymentMethod: "COD",
      });
    } catch (error) {
      console.error(
        "Order placement error:",
        error
      );

      const backendMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to place order.";

      setError(backendMessage);

      /*
       * VERY IMPORTANT:
       *
       * Do NOT call setCart([]) here.
       *
       * If the backend fails, the customer's cart
       * must remain intact.
       */
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-black/60 p-4">
      <div className="relative max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

        {/* CLOSE BUTTON */}

        <button
          type="button"
          onClick={() => setOrderSummary(false)}
          className="absolute right-4 top-4 text-2xl font-bold text-gray-500 hover:text-black"
        >
          ×
        </button>

        {/* TITLE */}

        <h2 className="mb-6 text-2xl font-bold">
          Order Summary
        </h2>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ORDER ITEMS */}

        <div className="mb-6 space-y-4">
          {cart.map((item) => {
            const productId =
              item._id || item.id;

            return (
              <div
                key={productId}
                className="flex items-center justify-between gap-4 border-b pb-4"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />

                  <div>
                    <h3 className="font-semibold">
                      {item.name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-semibold">
                  Rs.{" "}
                  {(
                    Number(item.price) *
                    item.quantity
                  ).toFixed(2)}
                </p>
              </div>
            );
          })}
        </div>

        {/* TOTALS */}

        <div className="mb-8 rounded-xl bg-gray-50 p-5">
          <div className="mb-2 flex justify-between">
            <span>Subtotal</span>

            <span>
              Rs. {subTotal.toFixed(2)}
            </span>
          </div>

          <div className="mb-2 flex justify-between">
            <span>Shipping</span>

            <span>
              Rs. {shipping.toFixed(2)}
            </span>
          </div>

          <div className="mt-4 flex justify-between border-t pt-4 text-lg font-bold">
            <span>Total</span>

            <span>
              Rs. {orderTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* SHIPPING FORM */}

        <form onSubmit={handleSubmit}>
          <h3 className="mb-4 text-xl font-semibold">
            Shipping Information
          </h3>

          <div className="grid gap-4 md:grid-cols-2">

            {/* FULL NAME */}

            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
              required
            />

            {/* PHONE */}

            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
              required
            />

            {/* ADDRESS */}

            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500 md:col-span-2"
              required
            />

            {/* CITY */}

            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="City"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
              required
            />

            {/* POSTAL CODE */}

            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              placeholder="Postal Code"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
            />

            {/* COUNTRY */}

            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="Country"
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
            />

            {/* PAYMENT */}

            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="rounded-lg border p-3 outline-none focus:border-indigo-500"
            >
              <option value="COD">
                Cash on Delivery
              </option>

              <option value="ONLINE">
                Online Payment
              </option>
            </select>
          </div>

          {/* BUTTONS */}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">

            <button
              type="button"
              onClick={() => {
                setOrderSummary(false);
                setShowCartWish("cart");
              }}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back to Cart
            </button>

            <button
              type="submit"
              disabled={loading || cart.length === 0}
              className="flex-1 rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Placing Order..."
                : `Place Order - Rs. ${orderTotal.toFixed(2)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default OrderSummary;