import React, { useEffect, useMemo, useState } from "react";

import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../../api/adminApi";

const AdminPanel = ({ setShowAdminPanel }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  /* ---------------------------------------------------------
     FETCH ORDERS
  --------------------------------------------------------- */

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllOrders();

      if (data.success) {
        setOrders(data.orders || []);
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (error) {
      console.error("Failed to load admin orders:", error);

      setError(
        error.response?.data?.message ||
          "You are not authorized to access the admin panel."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  /* ---------------------------------------------------------
     STATISTICS
  --------------------------------------------------------- */

  const statistics = useMemo(() => {
    const totalRevenue = orders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0
    );

    return {
      total: orders.length,

      processing: orders.filter(
        (order) => order.orderStatus === "Processing"
      ).length,

      confirmed: orders.filter(
        (order) => order.orderStatus === "Confirmed"
      ).length,

      shipped: orders.filter(
        (order) => order.orderStatus === "Shipped"
      ).length,

      delivered: orders.filter(
        (order) => order.orderStatus === "Delivered"
      ).length,

      cancelled: orders.filter(
        (order) => order.orderStatus === "Cancelled"
      ).length,

      revenue: totalRevenue,
    };
  }, [orders]);

  /* ---------------------------------------------------------
     UPDATE STATUS
  --------------------------------------------------------- */

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrder(orderId);

      const data = await updateOrderStatus(orderId, newStatus);

      if (data.success) {
        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  orderStatus: newStatus,
                }
              : order
          )
        );

        alert(
          "Order status updated successfully. Customer email has been sent."
        );
      } else {
        alert(data.message || "Failed to update order");
      }
    } catch (error) {
      console.error("Status update failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update order status"
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  /* ---------------------------------------------------------
     DELETE ORDER
  --------------------------------------------------------- */

  const handleDelete = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      const data = await deleteOrder(orderId);

      if (data.success) {
        setOrders((previousOrders) =>
          previousOrders.filter(
            (order) => order._id !== orderId
          )
        );

        alert("Order deleted successfully");
      } else {
        alert(data.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("Delete order failed:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete order"
      );
    }
  };

  /* ---------------------------------------------------------
     SEARCH + FILTER
  --------------------------------------------------------- */

  const filteredOrders = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return orders.filter((order) => {
      const orderId = order._id?.toLowerCase() || "";

      const customerEmail =
        order.user?.email?.toLowerCase() || "";

      const customerName =
        `${order.user?.firstName || ""} ${
          order.user?.lastName || ""
        }`.toLowerCase();

      const phone =
        order.shippingAddress?.phone?.toLowerCase() || "";

      const city =
        order.shippingAddress?.city?.toLowerCase() || "";

      const status =
        order.orderStatus?.toLowerCase() || "";

      const paymentMethod =
        order.paymentMethod?.toLowerCase() || "";

      const matchesSearch =
        !searchText ||
        orderId.includes(searchText) ||
        customerEmail.includes(searchText) ||
        customerName.includes(searchText) ||
        phone.includes(searchText) ||
        city.includes(searchText) ||
        status.includes(searchText) ||
        paymentMethod.includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        order.orderStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  /* ---------------------------------------------------------
     STATUS STYLE
  --------------------------------------------------------- */

  const getStatusStyle = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-100 text-amber-800 border-amber-200";

      case "Confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";

      case "Shipped":
        return "bg-purple-100 text-purple-800 border-purple-200";

      case "Delivered":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";

      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";

      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  /* ---------------------------------------------------------
     LOADING
  --------------------------------------------------------- */

  if (loading) {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4">
        <div className="w-full max-w-sm rounded-3xl bg-white p-10 text-center shadow-2xl">
          <div className="mx-auto mb-6 h-14 w-14 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>

          <h2 className="text-2xl font-black text-gray-900">
            Loading Admin Panel
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Fetching your latest orders...
          </p>
        </div>
      </div>
    );
  }

  /* ---------------------------------------------------------
     ADMIN PANEL
  --------------------------------------------------------- */

  return (
    <div className="fixed inset-0 z-[200] overflow-y-auto bg-gradient-to-br from-gray-100 via-white to-gray-200">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-30 border-b border-gray-800 bg-black text-white shadow-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-lg">
              ⚡
            </div>

            <div>
              <h1 className="text-xl font-black sm:text-2xl">
                Admin Dashboard
              </h1>

              <p className="text-xs text-gray-400 sm:text-sm">
                Zain's Store • Management Panel
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAdminPanel(false)}
            className="rounded-xl border border-white/20 bg-white px-4 py-2 text-sm font-bold text-black transition hover:bg-gray-200 sm:px-5"
          >
            ✕ Close
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 shadow-sm">
            <div className="flex gap-3">
              <span className="text-2xl">⚠️</span>

              <div>
                <h3 className="font-black">
                  Access Error
                </h3>

                <p className="mt-1 text-sm">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================
            WELCOME BANNER
        ===================================================== */}

        <section className="mb-7 overflow-hidden rounded-3xl bg-black p-6 text-white shadow-2xl sm:p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gray-400">
                Welcome back
              </p>

              <h2 className="text-3xl font-black sm:text-4xl">
                Store Overview
              </h2>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-400">
                Manage orders, track deliveries, update order
                statuses and monitor your store performance.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Revenue
              </p>

              <p className="mt-1 text-3xl font-black">
                Rs. {statistics.revenue.toLocaleString()}
              </p>
            </div>
          </div>
        </section>

        {/* =====================================================
            STATISTICS
        ===================================================== */}

        <section className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {/* Total */}

          <div className="group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-black text-xl text-white">
                📦
              </div>

              <span className="text-xs font-bold text-gray-400">
                ALL
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Total Orders
            </p>

            <p className="mt-1 text-3xl font-black text-gray-900">
              {statistics.total}
            </p>
          </div>

          {/* Processing */}

          <div className="group rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500 text-xl text-white">
                ⏳
              </div>

              <span className="text-xs font-bold text-amber-600">
                NEW
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Processing
            </p>

            <p className="mt-1 text-3xl font-black text-gray-900">
              {statistics.processing}
            </p>
          </div>

          {/* Shipped */}

          <div className="group rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-xl text-white">
                🚚
              </div>

              <span className="text-xs font-bold text-purple-600">
                DELIVERY
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Shipped
            </p>

            <p className="mt-1 text-3xl font-black text-gray-900">
              {statistics.shipped}
            </p>
          </div>

          {/* Delivered */}

          <div className="group rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-xl text-white">
                ✓
              </div>

              <span className="text-xs font-bold text-emerald-600">
                COMPLETE
              </span>
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Delivered
            </p>

            <p className="mt-1 text-3xl font-black text-gray-900">
              {statistics.delivered}
            </p>
          </div>
        </section>

        {/* =====================================================
            SEARCH + FILTER
        ===================================================== */}

        <section className="mb-8 rounded-3xl border border-gray-200 bg-white p-5 shadow-lg sm:p-6">
          <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black text-gray-900">
                Orders
              </h2>

              <p className="text-sm text-gray-500">
                Search and manage customer orders
              </p>
            </div>

            <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700">
              Showing {filteredOrders.length} of {orders.length}
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row">
            {/* Search */}

            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl">
                🔎
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search order ID, name, email, phone, city..."
                className="w-full rounded-2xl border border-gray-300 bg-gray-50 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter */}

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-2xl border border-gray-300 bg-gray-50 px-5 py-3.5 text-sm font-bold outline-none transition focus:border-black focus:bg-white focus:ring-4 focus:ring-gray-100"
            >
              <option value="All">
                All Statuses
              </option>

              <option value="Processing">
                Processing
              </option>

              <option value="Confirmed">
                Confirmed
              </option>

              <option value="Shipped">
                Shipped
              </option>

              <option value="Delivered">
                Delivered
              </option>

              <option value="Cancelled">
                Cancelled
              </option>
            </select>
          </div>
        </section>

        {/* =====================================================
            NO ORDERS
        ===================================================== */}

        {filteredOrders.length === 0 ? (
          <div className="rounded-3xl border border-gray-200 bg-white p-14 text-center shadow-lg">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
              📦
            </div>

            <h2 className="mt-5 text-2xl font-black text-gray-900">
              No Orders Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {search || statusFilter !== "All"
                ? "Try changing your search or status filter."
                : "There are currently no orders in your store."}
            </p>
          </div>
        ) : (
          <div className="space-y-7">
            {filteredOrders.map((order) => (
              <article
                key={order._id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-lg transition hover:shadow-2xl"
              >
                {/* =================================================
                    ORDER HEADER
                ================================================= */}

                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-950 to-gray-800 p-5 text-white sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-300">
                          Order
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-bold ${getStatusStyle(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </div>

                      <p className="break-all text-sm font-black sm:text-base">
                        #{order._id}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {order.createdAt
                          ? new Date(
                              order.createdAt
                            ).toLocaleString()
                          : "Date unavailable"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {/* Status */}

                      <select
                        value={order.orderStatus}
                        disabled={
                          updatingOrder === order._id
                        }
                        onChange={(e) =>
                          handleStatusChange(
                            order._id,
                            e.target.value
                          )
                        }
                        className="rounded-xl border border-white/20 bg-white px-4 py-2.5 text-sm font-bold text-black outline-none transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <option value="Processing">
                          Processing
                        </option>

                        <option value="Confirmed">
                          Confirmed
                        </option>

                        <option value="Shipped">
                          Shipped
                        </option>

                        <option value="Delivered">
                          Delivered
                        </option>

                        <option value="Cancelled">
                          Cancelled
                        </option>
                      </select>

                      {/* Delete */}

                      <button
                        onClick={() =>
                          handleDelete(order._id)
                        }
                        className="rounded-xl border border-red-400/30 bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
                      >
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    CUSTOMER / PAYMENT / SHIPPING
                ================================================= */}

                <div className="grid gap-5 border-b border-gray-200 p-5 sm:p-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Customer */}

                  <div className="rounded-2xl bg-blue-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                        👤
                      </div>

                      <h3 className="font-black text-gray-900">
                        Customer
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-bold">
                          Name:
                        </span>{" "}
                        {order.user?.firstName || ""}{" "}
                        {order.user?.lastName || ""}
                      </p>

                      <p className="break-all">
                        <span className="font-bold">
                          Email:
                        </span>{" "}
                        {order.user?.email || "N/A"}
                      </p>

                      <p>
                        <span className="font-bold">
                          Phone:
                        </span>{" "}
                        {order.shippingAddress?.phone ||
                          "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Payment */}

                  <div className="rounded-2xl bg-emerald-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white">
                        💳
                      </div>

                      <h3 className="font-black text-gray-900">
                        Payment
                      </h3>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-bold">
                          Method:
                        </span>{" "}
                        {order.paymentMethod || "N/A"}
                      </p>

                      <p>
                        <span className="font-bold">
                          Status:
                        </span>{" "}
                        {order.paymentStatus || "N/A"}
                      </p>

                      <p>
                        <span className="font-bold">
                          Total:
                        </span>{" "}
                        <span className="font-black">
                          Rs.{" "}
                          {Number(
                            order.totalAmount || 0
                          ).toLocaleString()}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Shipping */}

                  <div className="rounded-2xl bg-purple-50 p-5">
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white">
                        📍
                      </div>

                      <h3 className="font-black text-gray-900">
                        Delivery
                      </h3>
                    </div>

                    <div className="space-y-1 text-sm">
                      <p className="font-bold">
                        {order.shippingAddress
                          ?.fullName || "N/A"}
                      </p>

                      <p>
                        {order.shippingAddress?.address ||
                          "N/A"}
                      </p>

                      <p>
                        {order.shippingAddress?.city ||
                          "N/A"}
                      </p>

                      <p>
                        {order.shippingAddress
                          ?.postalCode || ""}
                      </p>

                      <p>
                        {order.shippingAddress?.country ||
                          ""}
                      </p>
                    </div>
                  </div>
                </div>

                {/* =================================================
                    PRODUCTS
                ================================================= */}

                <div className="p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-black text-gray-900">
                        Products
                      </h3>

                      <p className="text-xs text-gray-500">
                        {order.items?.length || 0} item(s)
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {order.items?.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-white hover:shadow-md sm:flex-row sm:items-center"
                        >
                          {/* Image */}

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-gray-200 bg-white">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                No Image
                              </div>
                            )}
                          </div>

                          {/* Details */}

                          <div className="flex-1">
                            <p className="font-black text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Quantity:{" "}
                              <span className="font-bold text-gray-700">
                                {item.quantity}
                              </span>
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              Unit price: Rs.{" "}
                              {Number(
                                item.price || 0
                              ).toLocaleString()}
                            </p>
                          </div>

                          {/* Item Total */}

                          <div className="text-left sm:text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                              Item Total
                            </p>

                            <p className="mt-1 text-lg font-black text-gray-900">
                              Rs.{" "}
                              {Number(
                                (item.price || 0) *
                                  (item.quantity || 0)
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  {/* =================================================
                      ORDER TOTAL
                  ================================================= */}

                  <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-md rounded-2xl bg-gray-950 p-5 text-white shadow-xl">
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between text-gray-400">
                          <span>Subtotal</span>

                          <span>
                            Rs.{" "}
                            {Number(
                              order.subtotal || 0
                            ).toLocaleString()}
                          </span>
                        </div>

                        <div className="flex justify-between text-gray-400">
                          <span>Shipping</span>

                          <span>
                            Rs.{" "}
                            {Number(
                              order.shippingCost || 0
                            ).toLocaleString()}
                          </span>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-black">
                              Total
                            </span>

                            <span className="text-2xl font-black">
                              Rs.{" "}
                              {Number(
                                order.totalAmount || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminPanel;