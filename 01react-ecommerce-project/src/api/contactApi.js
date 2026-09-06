import API from "./api";

export const sendContactMessage = async (contactData) => {
  const response = await API.post("/contact", contactData);

  return response.data;
};