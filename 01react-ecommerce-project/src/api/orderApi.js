import API from "./api";

// Create order
export const createOrder = async (orderData) => {
  const response = await API.post("/orders", orderData);
  return response.data;
};

// Get logged-in user's orders
export const getMyOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};

// Get one order
export const getOrderById = async (orderId) => {
  const response = await API.get(`/orders/${orderId}`);
  return response.data;
};