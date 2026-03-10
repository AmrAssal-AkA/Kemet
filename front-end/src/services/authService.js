import axios from "axios";

export const loginUser = async (formData) => {
  try {
    const res = await axios.post("/api/auth/login", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Login failed";
  }
};

export const registerUser = async (formData) => {
  try {
    const res = await axios.post("/api/auth/register", formData);
    return res.data;
  } catch (error) {
    throw error.response?.data?.message || "Registration failed";
  }
};

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:8000/auth/continueWithGoogle";
};
