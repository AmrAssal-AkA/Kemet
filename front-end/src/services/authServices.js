import axios from "axios";
import { buildApiUrl } from "@/utils/apiBaseUrl";

export const normalizeRole = (user) => {
  if (user?.isAdmin === true) return "admin";

  const rawRole = String(user?.role || user?.userRole || user?.type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (rawRole === "localguide" || rawRole === "guide") return "guide";
  return rawRole || "user";
};

export const normalizeAuthUser = (data) => {
  const candidates = [
    data?.user,
    data?.data?.user,
    data?.data?.data?.user,
    data?.profile,
    data?.data?.profile,
    data?.currentUser,
    data?.data?.currentUser,
    data?.loggedInUser,
    data?.data?.loggedInUser,
    data?.data,
    data,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;

    const nestedUser = candidate.user;
    if (nestedUser && typeof nestedUser === "object") {
      return { ...nestedUser, role: normalizeRole(nestedUser) };
    }

    if (
      candidate.email ||
      candidate.name ||
      candidate._id ||
      candidate.userId ||
      candidate.role ||
      candidate.userRole ||
      candidate.type ||
      candidate.isAdmin
    ) {
      return { ...candidate, role: normalizeRole(candidate) };
    }
  }

  return null;
};

const normalizeAuthResponse = (data) => {
  const user = normalizeAuthUser(data);
  return user ? { ...data, user } : data;
};

export const ApiCall = async (url, options = {}) => {
  return axios({
    url,
    ...options,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
};

export const apiRequest = async (path, options = {}) => {
  const url = path.startsWith("http") ? path : buildApiUrl(path);

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
    const response = await ApiCall("/api/auth/refresh", { method: "POST" });
    return normalizeAuthUser(response.data);
  } catch {
    return null;
  }
};

export const loginUser = async (formData) => {
  if (!formData.email || !formData.password) {
    throw new Error("Email and password are required");
  }

  try {
    const res = await ApiCall("/api/auth/login", {
      method: "POST",
      data: formData,
    });
    return normalizeAuthResponse(res.data);
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
    const res = await ApiCall("/api/auth/register", {
      method: "POST",
      data: formData,
    });
    return normalizeAuthResponse(res.data);
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginWithGoogle = async () => {
  window.location.href = buildApiUrl("/api/auth/continueWithGoogle");
};

export const completeGoogleSession = async ({ token, refreshToken, user }) => {
  if (!token || !refreshToken) {
    throw new Error("Google session tokens are missing");
  }

  const res = await ApiCall("/api/auth/google-session", {
    method: "POST",
    data: { token, refreshToken, user },
  });

  return normalizeAuthResponse(res.data);
};

export const logout = async () => {
  try {
    const res = await ApiCall("/api/auth/logout", {
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
    const res = await ApiCall("/api/auth/reset-password", {
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
    const res = await ApiCall("/api/auth/reset-password-confirm", {
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
    const res = await ApiCall("/api/auth/refresh", { method: "POST" });
    return normalizeAuthResponse(res.data);
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
