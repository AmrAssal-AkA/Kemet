import axios from "axios";

export const ApiCall = async (url, options = {}) => {
 return axios({
    url,
    ...options,
    withCredentials: true,
    headers:{
      "Content-Type": "application/json",
      ...options.headers,
    }
  });
 }

export const loginUser = async (formData) => {
  if (!formData.email || !formData.password) {
    throw new Error("Email and password are required");
  }
  try {
    const res = await ApiCall("/api/auth/login", {
      method: "POST",
      data: formData,
    });
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
    const res = await ApiCall("/api/auth/register", {
      method: "POST",
      data: formData,
    });
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const loginWithGoogle = async () => {
  window.location.href = "http://localhost:8000/api/auth/continueWithGoogle";
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
    const res = await ApiCall(`/api/auth/reset-password-confirm`, {
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
    try{
        const res = await ApiCall("/api/auth/refresh", {method: "POST"});
        return res.data;
      }catch(error){
        throw new Error(error.response?.data?.message || "Session refresh failed");
    }
}

export const ApiCallWithRefresh = async (url, options = {}) => {
  try{
    return await ApiCall(url, options);
  }catch(error){
    if(error.response?.status === 401){
      try{
        await refreshToken();
        return await ApiCall(url, options);
      }catch(refreshError){
        window.location.href = "/auth/auth";
        throw refreshError;
      }
    }
    throw error;
    }
  }