import API from "./api";

// Get all orders
export const getAllOrders = async () => {
  const response = await API.get("/orders/admin/all");
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await API.put(
    `/orders/admin/${orderId}/status`,
    { status }
  );

  return response.data;
};

// Delete order
export const deleteOrder = async (orderId) => {
  const response = await API.delete(`/orders/admin/${orderId}`);

  return response.data;
};