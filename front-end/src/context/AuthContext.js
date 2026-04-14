import { useContext, useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  loginUser,
  registerUser,
  logout,
  resetPassword,
  confirmResetPassword,
  ApiCall,
} from "@/services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(formData);
      setUser(data.user);
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(formData);
      setUser(data.user);
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const logouthundler = async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      setUser(null);
      router.push("/auth/auth");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordHandler = async (email) => {
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      router.push("/auth/auth");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmResetPasswordHandler = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await confirmResetPassword(formData);
      router.push("/auth/auth");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        register,
        logout: logouthundler,
        resetPassword: resetPasswordHandler,
        confirmResetPassword: confirmResetPasswordHandler,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
