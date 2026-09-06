import API from "./api";

// Register
export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

// Login
export const loginUser = async (credentials) => {
  const response = await API.post("/auth/login", credentials);
  return response.data;
};

// Get logged-in user's profile
export const getProfile = async () => {
  const response = await API.get("/auth/profile");
  return response.data;
};