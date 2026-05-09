import axios from "axios";
import { extractUserFromAuthResponse } from "@/utils/authSession";

const API_BASE_URL = "https://kemet-two.vercel.app/";

export const ApiCall = async (url, options = {}) => {
  const requestUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

  return axios({
    url: requestUrl,
    ...options,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

export const apiRequest = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;

  return axios({
    url,
    method: options.method || "GET",
    data: options.data,
    params: options.params,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
};

export const getCurrentUser = async () => {
  try {
    const response = await apiRequest("api/auth/refresh", {
      method: "POST",
    });
    console.debug("[auth] refresh response", response.data);
    return extractUserFromAuthResponse(response.data);
  } catch (error) {
    console.debug(
      "[auth] refresh failed",
      error.response?.data || error.message,
    );
    return null;
  }
};

export const loginUser = async (formData) => {
  if (!formData.email || !formData.password) {
    throw new Error("Email and password are required");
  }

  try {
    const res = await apiRequest("api/auth/login", {
      method: "POST",
      data: formData,
    });
    console.debug("[auth] login response", res.data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const registerUser = async (formData) => {
  if (!formData.name || !formData.email || !formData.password) {
    throw new Error("Name, email and password are required");
  }

  if (formData.password.length < 8) {
    throw new Error("Password must be at least 8 characters long");
  }

  try {
    const res = await apiRequest("api/auth/register", {
      method: "POST",
      data: formData,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginWithGoogle = async () => {
  window.location.href = `${API_BASE_URL}/api/auth/continueWithGoogle`;
};

export const completeGoogleLogin = async ({ token, user }) => {
  if (!token || !user) {
    throw new Error("Google login session is missing.");
  }

  try {
    const res = await apiRequest("api/auth/google-session", {
      method: "POST",
      data: { token, user },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Google login failed");
  }
};

export const logout = async () => {
  try {
    const res = await apiRequest("api/auth/logout", {
      method: "POST",
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Logout failed");
  }
};

export const logoutUser = logout;

export const resetPassword = async (email) => {
  if (!email) {
    throw new Error("Email is required");
  }

  try {
    const res = await apiRequest("api/auth/reset-password", {
      method: "POST",
      data: { email },
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Reset password failed");
  }
};

export const confirmResetPassword = async (formData) => {
  if (!formData.token || !formData.newPassword) {
    throw new Error("Token and new password are required");
  }

  if (formData.newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long");
  }

  try {
    const res = await apiRequest("api/auth/reset-password-confirm", {
      method: "POST",
      data: { token: formData.token, newPassword: formData.newPassword },
    });
    return res.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Reset password confirmation failed",
    );
  }
};

export const refreshToken = async () => {
  try {
    const res = await apiRequest("api/auth/refresh", {
      method: "POST",
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Session refresh failed");
  }
};

export const ApiCallWithRefresh = async (url, options = {}) => {
  try {
    return await ApiCall(url, options);
  } catch (error) {
    if (error.response?.status === 401) {
      try {
        await refreshToken();
        return await ApiCall(url, options);
      } catch (refreshError) {
        window.location.href = "/auth/auth";
        throw refreshError;
      }
    }

    throw error;
  }
};
