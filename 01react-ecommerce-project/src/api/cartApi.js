import API from "./api";

// Get logged-in user's cart
export const getCart = async () => {
  const response = await API.get("/cart");
  return response.data;
};

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await API.post("/cart", {
    productId,
    quantity,
  });

  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  const response = await API.put(`/cart/${productId}`, {
    quantity,
  });

  return response.data;
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  const response = await API.delete(`/cart/${productId}`);
  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await API.delete("/cart");
  return response.data;
};