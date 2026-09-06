import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaBoxOpen } from "react-icons/fa";
import { getMyOrders } from "../../api/orderApi";

function MyOrders({ setShowMyOrders }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyOrders();

        if (!data.success) {
          throw new Error(
            data.message || "Failed to load orders"
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(
          error.response?.data?.message ||
            error.message ||
            "Failed to load your orders."
        );
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-[60] flex items-center justify-center bg-gradient-to-br from-indigo-950/90 via-purple-900/90 to-black/90 p-4 backdrop-blur-sm">
        <div className="w-full max-w-5xl rounded-3xl border border-white/20 bg-white/95 p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg shadow-indigo-200">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600"></div>
          </div>

          <p className="text-2xl font-black text-gray-900">
            Loading your orders...
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Please wait while we fetch your order history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-gradient-to-br from-indigo-950/90 via-purple-900/80 to-black/90 p-4 backdrop-blur-sm">
      <div className="mx-auto mb-8 mt-4 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/30 bg-white shadow-2xl md:mt-8">

        {/* HEADER */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-600 p-6 text-white shadow-xl md:p-8">

          <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10"></div>
          <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-white/10"></div>

          <div className="relative flex items-center justify-between gap-4">

            <div>
              <div className="mb-2 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-lg backdrop-blur">
                  📦
                </div>

                <div>
                  <h2 className="text-2xl font-black md:text-3xl">
                    My Orders
                  </h2>

                  <p className="mt-1 text-sm text-indigo-100">
                    Your shopping journey at a glance
                  </p>
                </div>
              </div>

              <p className="mt-4 max-w-xl text-sm leading-6 text-indigo-100">
                View your order history, products, payment information
                and delivery details all in one place.
              </p>
            </div>

            <button
              onClick={() => setShowMyOrders(false)}
              className="flex shrink-0 items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-4 py-2.5 font-bold text-white shadow-lg backdrop-blur transition hover:bg-white hover:text-indigo-700 hover:shadow-xl"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">
                Back
              </span>
            </button>
          </div>
        </div>

        <div className="p-5 md:p-8">

          {/* ERROR */}
          {error && (
            <div className="mb-6 overflow-hidden rounded-2xl border border-red-200 bg-gradient-to-r from-red-50 to-rose-50 p-5 text-red-700 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-100 text-xl">
                  ⚠️
                </div>

                <div>
                  <p className="font-black">
                    Something went wrong
                  </p>

                  <p className="mt-1 text-sm">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* NO ORDERS */}
          {!error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 text-center">

              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 shadow-inner">
                <FaBoxOpen className="text-6xl text-indigo-400" />
              </div>

              <h3 className="mt-7 text-2xl font-black text-gray-800">
                No Orders Yet
              </h3>

              <p className="mt-2 max-w-md text-gray-500">
                You haven't placed any orders yet. Start shopping
                and your orders will appear here.
              </p>

              <button
                onClick={() => setShowMyOrders(false)}
                className="mt-7 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl"
              >
                Continue Shopping
              </button>
            </div>
          )}

          {/* ORDERS */}
          <div className="space-y-7">

            {orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* ORDER HEADER */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 p-5 text-white md:p-6">

                  <div className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-indigo-500/10"></div>
                  <div className="absolute -bottom-20 left-1/2 h-40 w-40 rounded-full bg-purple-500/10"></div>

                  <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>
                      <div className="mb-3 flex items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-indigo-200">
                          Order
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold shadow-sm ${
                            order.orderStatus === "Delivered"
                              ? "bg-emerald-500 text-white"
                              : order.orderStatus === "Cancelled"
                              ? "bg-red-500 text-white"
                              : "bg-amber-400 text-gray-900"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                        Order ID
                      </p>

                      <p className="mt-1 break-all text-sm font-bold text-white md:text-base">
                        {order._id}
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">

                      <span
                        className={`rounded-xl px-4 py-2 text-sm font-bold shadow-sm ${
                          order.paymentStatus === "Paid"
                            ? "bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30"
                            : order.paymentStatus === "Failed"
                            ? "bg-red-500/20 text-red-300 ring-1 ring-red-400/30"
                            : "bg-white/10 text-gray-200 ring-1 ring-white/10"
                        }`}
                      >
                        💳 Payment: {order.paymentStatus}
                      </span>

                    </div>
                  </div>
                </div>

                {/* PRODUCTS */}
                <div className="p-5 md:p-6">

                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md">
                      📦
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        Products
                      </h3>

                      <p className="text-xs text-gray-500">
                        Items included in this order
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">

                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-4 transition hover:border-indigo-200 hover:bg-indigo-50/30 hover:shadow-md md:flex-row md:items-center md:justify-between"
                      >

                        <div className="flex items-center gap-4">

                          {item.image ? (
                            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-2 border-white bg-gray-100 shadow-md">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover transition duration-300 hover:scale-110"
                              />
                            </div>
                          ) : (
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-gray-100 to-indigo-50 shadow-inner">
                              <FaBoxOpen className="text-2xl text-indigo-300" />
                            </div>
                          )}

                          <div>
                            <h4 className="font-black text-gray-900">
                              {item.name}
                            </h4>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{" "}
                              <span className="font-bold text-indigo-600">
                                {item.quantity}
                              </span>
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Price:{" "}
                              <span className="font-semibold text-gray-700">
                                Rs.{" "}
                                {Number(item.price).toFixed(2)}
                              </span>
                            </p>
                          </div>

                        </div>

                        <div className="rounded-xl bg-indigo-50 px-5 py-3 md:text-right">
                          <p className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                            Item Total
                          </p>

                          <p className="mt-1 text-lg font-black text-indigo-700">
                            Rs.{" "}
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>

                      </div>
                    ))}

                  </div>

                  {/* TOTALS */}
                  <div className="mt-7 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-5 text-white shadow-xl">

                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                        💰
                      </div>

                      <div>
                        <h3 className="font-black">
                          Order Summary
                        </h3>

                        <p className="text-xs text-gray-400">
                          Complete payment breakdown
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">

                      <div className="flex justify-between py-1 text-sm text-gray-300">
                        <span>Subtotal</span>

                        <span className="font-semibold text-white">
                          Rs.{" "}
                          {Number(order.subtotal).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between py-1 text-sm text-gray-300">
                        <span>Shipping</span>

                        <span className="font-semibold text-white">
                          Rs.{" "}
                          {Number(order.shippingCost).toFixed(2)}
                        </span>
                      </div>

                      <div className="mt-3 flex justify-between border-t border-white/10 pt-4">

                        <span className="text-lg font-black">
                          Total
                        </span>

                        <span className="text-2xl font-black text-indigo-300">
                          Rs.{" "}
                          {Number(order.totalAmount).toFixed(2)}
                        </span>

                      </div>

                      <div className="mt-3 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 text-sm text-gray-300">
                        <span>
                          <strong className="text-white">
                            Payment Method:
                          </strong>{" "}
                          {order.paymentMethod === "COD"
                            ? "Cash on Delivery"
                            : "Online Payment"}
                        </span>

                        <span>
                          {order.paymentStatus === "Paid"
                            ? "✓"
                            : ""}
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* SHIPPING ADDRESS */}
                  <div className="mt-7 overflow-hidden rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 via-white to-indigo-50 p-5 shadow-sm">

                    <div className="mb-4 flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-lg text-white shadow-md">
                        📍
                      </div>

                      <div>
                        <h3 className="font-black text-gray-900">
                          Shipping Address
                        </h3>

                        <p className="text-xs text-gray-500">
                          Your delivery information
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-2 rounded-xl bg-white/70 p-4 text-sm text-gray-600">

                      <p className="font-black text-gray-900">
                        {order.shippingAddress.fullName}
                      </p>

                      <p>
                        📞 {order.shippingAddress.phone}
                      </p>

                      <p>
                        🏠 {order.shippingAddress.address}
                      </p>

                      <p>
                        🏙️ {order.shippingAddress.city}
                        {order.shippingAddress.postalCode
                          ? `, ${order.shippingAddress.postalCode}`
                          : ""}
                      </p>

                      <p>
                        🌍 {order.shippingAddress.country}
                      </p>

                    </div>

                  </div>

                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;