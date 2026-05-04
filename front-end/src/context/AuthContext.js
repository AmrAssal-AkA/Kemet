import { useContext, useState, createContext, useEffect, } from "react";
import { useRouter } from "next/router";
import {
  loginUser,
  registerUser,
  logout,
  resetPassword,
  confirmResetPassword,
  ApiCall,
  getCurrentUser,
} from "@/services/authServices";


const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const restoredSession = async () => {
      setLoading(true);
      try {
        const backendUser = await getCurrentUser();
        if (backendUser) {
          setUser(backendUser);
          setAdmin(backendUser.role === "admin");
          setRole(backendUser.role || null);
        } else {
          const res = await ApiCall("/api/auth/refresh" , {method: "POST"});
          setUser(res.data.user);
          setAdmin(res.data.user && res.data.user.role === "admin");
          setRole(res.data.user?.role || null);
        }
      } catch (error) {
        setUser(null);
        setAdmin(false);
        setRole(null);
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
      const loggedInUser = data.user;
      const userRole = loggedInUser?.role || null;
      setAdmin(userRole === "admin");
      setRole(userRole);

      if (userRole === "admin") {
        router.push("/admin/dashboard");
      } else if (userRole === "guide") {
        router.push("/guide/dashboard");
      } else {
        router.push("/user-dashboard");
      }
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
      const registeredUser = data.user;
      const registeredRole = registeredUser?.role || null;
      setAdmin(registeredRole === "admin");
      setRole(registeredRole);

      if (registeredRole === "admin") {
        router.push("/admin/dashboard");
      } else if (registeredRole === "guide") {
        router.push("/guide/dashboard");
      } else {
        router.push("/user-dashboard");
      }
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
      setRole(null);
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
        role,
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
