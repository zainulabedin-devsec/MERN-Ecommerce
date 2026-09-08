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
    <div className="fixed inset-0 z-[50] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-5">

      <div className="relative max-h-[96vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-white/40 bg-white shadow-[0_25px_80px_rgba(0,0,0,0.3)]">

        {/* TOP HEADER */}

        <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 px-6 py-7 text-white sm:px-8">

          <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-white/10"></div>

          <div className="relative pr-10">

            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 text-2xl backdrop-blur-sm">
                🛍️
              </div>

              <div>
                <p className="text-sm font-medium text-indigo-100">
                  Secure Checkout
                </p>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Order Summary
                </h2>
              </div>
            </div>

            <p className="mt-3 max-w-xl text-sm leading-6 text-indigo-100">
              Review your items, provide your shipping information,
              and place your order securely.
            </p>

          </div>

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setOrderSummary(false)}
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl font-light text-white transition hover:bg-white/20 hover:rotate-90"
          >
            ×
          </button>

        </div>

        <div className="p-5 sm:p-8">

          {/* ERROR */}

          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 shadow-sm">
              <span className="text-lg">⚠️</span>

              <div>
                <p className="font-semibold">
                  Unable to place order
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* MAIN CONTENT */}

          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">

            {/* LEFT SIDE */}

            <div>

              {/* ORDER ITEMS */}

              <div className="mb-8">

                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                      Your Cart
                    </p>

                    <h3 className="text-xl font-bold text-slate-900">
                      Order Items
                    </h3>
                  </div>

                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                  </span>
                </div>

                <div className="space-y-3">

                  {cart.map((item) => {
                    const productId =
                      item._id || item.id;

                    return (
                      <div
                        key={productId}
                        className="group flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md sm:p-4"
                      >

                        <div className="flex min-w-0 items-center gap-4">

                          <div className="relative flex-shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-16 w-16 rounded-xl object-cover ring-1 ring-slate-200 sm:h-20 sm:w-20"
                            />

                            <span className="absolute -right-2 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-xs font-bold text-white shadow">
                              {item.quantity}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <h3 className="truncate font-semibold text-slate-900">
                              {item.name}
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                              Quantity: {item.quantity}
                            </p>

                            <p className="mt-1 text-sm font-medium text-indigo-600">
                              Rs. {Number(item.price).toFixed(2)} each
                            </p>
                          </div>

                        </div>

                        <p className="whitespace-nowrap text-sm font-bold text-slate-900 sm:text-base">
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

              </div>

              {/* SHIPPING FORM */}

              <form onSubmit={handleSubmit}>

                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
                    Delivery
                  </p>

                  <h3 className="text-xl font-bold text-slate-900">
                    Shipping Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Enter the details where you would like your order delivered.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  {/* FULL NAME */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Phone Number
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="03XX XXXXXXX"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Delivery Address
                    </label>

                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="House number, street, area..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />
                  </div>

                  {/* CITY */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      City
                    </label>

                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                      required
                    />
                  </div>

                  {/* POSTAL CODE */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Postal Code
                    </label>

                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  {/* COUNTRY */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Country
                    </label>

                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Country"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    />
                  </div>

                  {/* PAYMENT */}

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                      Payment Method
                    </label>

                    <select
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm font-medium text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                    >
                      <option value="COD">
                        Cash on Delivery
                      </option>

                      <option value="ONLINE">
                        Online Payment
                      </option>
                    </select>
                  </div>

                </div>

                {/* BUTTONS */}

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">

                  <button
                    type="button"
                    onClick={() => {
                      setOrderSummary(false);
                      setShowCartWish("cart");
                    }}
                    disabled={loading}
                    className="rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-semibold text-slate-700 transition hover:bg-slate-50 hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    ← Back to Cart
                  </button>

                  <button
                    type="submit"
                    disabled={loading || cart.length === 0}
                    className="flex-1 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {loading
                      ? "Placing Order..."
                      : `Place Order - Rs. ${orderTotal.toFixed(2)}`}
                  </button>

                </div>

              </form>

            </div>

            {/* RIGHT SIDE - ORDER TOTAL */}

            <div className="lg:sticky lg:top-0 lg:self-start">

              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm">

                <div className="bg-slate-900 px-5 py-5 text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
                      🧾
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                        Checkout
                      </p>

                      <h3 className="text-lg font-bold">
                        Order Total
                      </h3>
                    </div>
                  </div>
                </div>

                <div className="p-5">

                  <div className="space-y-4">

                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Subtotal</span>

                      <span className="font-semibold text-slate-900">
                        Rs. {subTotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Shipping</span>

                      <span className="font-semibold text-slate-900">
                        Rs. {shipping.toFixed(2)}
                      </span>
                    </div>

                    <div className="border-t border-dashed border-slate-300 pt-4">
                      <div className="flex items-end justify-between gap-4">
                        <span className="text-base font-bold text-slate-900">
                          Total
                        </span>

                        <span className="text-2xl font-extrabold text-indigo-600">
                          Rs. {orderTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* SECURITY INFO */}

                  <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-4">

                    <div className="flex gap-3">

                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                        🔒
                      </div>

                      <div>
                        <p className="text-sm font-bold text-indigo-900">
                          Secure Checkout
                        </p>

                        <p className="mt-1 text-xs leading-5 text-indigo-700">
                          Your order information is securely processed and protected.
                        </p>
                      </div>

                    </div>

                  </div>

                  {/* PAYMENT INFO */}

                  <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
                    <span className="text-xl">
                      💳
                    </span>

                    <div>
                      <p className="text-xs font-semibold text-slate-800">
                        Payment
                      </p>

                      <p className="text-xs text-slate-500">
                        {formData.paymentMethod === "COD"
                          ? "Cash on Delivery"
                          : "Online Payment"}
                      </p>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OrderSummary;