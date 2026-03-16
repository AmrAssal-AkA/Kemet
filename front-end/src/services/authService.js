import axios from "axios";

export const loginUser = async (formData) => {
  try {
    const res = await axios.post("/api/auth/login", formData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (formData) => {
  try {
    const res = await axios.post("/api/auth/register", formData);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginWithGoogle = () => {
  window.location.href = "http://localhost:8000/auth/continueWithGoogle";
};

export const resetPassword = async (email) => {
  try {
    const res = await axios.post("/api/auth/reset-password", { email });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Reset password failed");
  }
};

export const confirmResetPassword = async (formData) => {
  try {
    const res = await axios.post("/api/auth/reset-passwordConfirm", formData);
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Reset password confirmation failed",
    );
  }
};
