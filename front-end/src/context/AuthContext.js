import { useContext, useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  loginUser,
  registerUser,
  loginWithGoogle,
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

  useEffect(() => {
    const restoredSession =async () => {
      try{
        const res = await ApiCall("/api/auth/refresh", {method: "POST"});
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }catch(error){
        // Fallback to localStorage if refresh fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch {
            setUser(null);
            localStorage.removeItem("user");
          }
        } else {
          setUser(null);
        }
      }finally{
        setLoading(false);
      }
    }
    restoredSession();
  }, []);

  const getDashboardRoute = (role) => {
    if (role === "admin") return "/admin-dashboard";
    if (role === "guide") return "/guide-dashboard";
    return "/user-dashboard";
  };

  const login = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(formData);
      setUser(data.user);
      // Save to localStorage for persistence across page reloads
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push(getDashboardRoute(data.user?.role));
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
      // Save to localStorage for persistence across page reloads
      localStorage.setItem("user", JSON.stringify(data.user));
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      router.push(getDashboardRoute(data.user?.role));
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
      // Clear localStorage on logout
      localStorage.removeItem("user");
      localStorage.removeItem("token");
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
}