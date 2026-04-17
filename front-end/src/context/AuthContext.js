import { useContext, useState, createContext, useEffect, } from "react";
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
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const restoredSession = async () => {
      setLoading(true);
      try {
        const res = await ApiCall("/api/auth/refresh" , {method: "POST"});
        setUser(res.data.user);
        setAdmin(res.data.user && res.data.user.role === "admin");
      } catch (error) {
        setUser(null);
        setAdmin(false);
      }finally{
        setLoading(false);
      }
    }
      restoredSession();
  }, [])



  const login = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(formData);
      setUser(data.user);
      setAdmin(data.user && data.user.role === "admin");
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
      setAdmin(data.user && data.user.role === "admin");
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
      setAdmin(false);
      router.push("/");
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
        admin,
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
