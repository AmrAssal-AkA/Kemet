import { useCallback, useContext, useMemo, useRef, useState, createContext, useEffect } from "react";
import { useRouter } from "next/router";
import {
  loginUser,
  registerUser,
  logout,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  completeGoogleLogin,
} from "@/services/authServices";
import {
  extractUserFromAuthResponse,
  getAuthRedirectPath,
  getUserRole,
} from "@/utils/authSession";


const AuthContext = createContext();
const SESSION_RESTORE_TIMEOUT_MS = 3000;

async function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new Error("Session restore timed out"));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const AuthProvider = ({ children }) => {
  const didRestoreSession = useRef(false);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const applySessionUser = useCallback((sessionUser) => {
    const userRole = getUserRole(sessionUser);
    console.debug("[auth] stored user/session", {
      user: sessionUser,
      role: userRole || null,
      redirect: sessionUser ? getAuthRedirectPath(sessionUser) : null,
    });

    setUser(sessionUser || null);
    setAdmin(userRole === "admin");
    setRole(userRole || null);
    return sessionUser;
  }, []);

  useEffect(() => {
    if (didRestoreSession.current) return;
    didRestoreSession.current = true;

    const restoredSession = async () => {
      setLoading(true);
      try {
        const backendUser = await withTimeout(
          getCurrentUser(),
          SESSION_RESTORE_TIMEOUT_MS,
        );
        applySessionUser(backendUser);
      } catch (error) {
        console.debug("[auth] silent session restore skipped", error.message);
        applySessionUser(null);
      }finally{
        setSessionReady(true);
        setLoading(false);
      }
    };

    restoredSession();
  }, [applySessionUser]);



  const login = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(formData);
      const loggedInUser = applySessionUser(extractUserFromAuthResponse(data));

      if (!loggedInUser) {
        throw new Error("Login succeeded, but the session could not be restored.");
      }

      const redirectPath = getAuthRedirectPath(loggedInUser);
      console.debug("[auth] redirect decision", { user: loggedInUser, redirectPath });
      await router.replace(redirectPath);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [applySessionUser, router]);

  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await registerUser(formData);
      const registeredUser = applySessionUser(extractUserFromAuthResponse(data));

      if (!registeredUser) {
        throw new Error("Registration succeeded, but the session could not be restored.");
      }

      const redirectPath = getAuthRedirectPath(registeredUser);
      console.debug("[auth] redirect decision", { user: registeredUser, redirectPath });
      await router.replace(redirectPath);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [applySessionUser, router]);

  const completeGoogleSession = useCallback(async ({ token, user }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await completeGoogleLogin({ token, user });
      const googleUser = applySessionUser(extractUserFromAuthResponse(data));

      if (!googleUser) {
        throw new Error("Google login succeeded, but the session could not be restored.");
      }

      const redirectPath = getAuthRedirectPath(googleUser);
      console.debug("[auth] google redirect decision", { user: googleUser, redirectPath });
      await router.replace(redirectPath);
    } catch (error) {
      setError(error.message);
      router.replace("/auth/auth");
    } finally {
      setLoading(false);
    }
  }, [applySessionUser, router]);

  const logouthundler = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await logout();
      applySessionUser(null);
      router.push("/");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [applySessionUser, router]);

  const resetPasswordHandler = useCallback(async (email) => {
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
  }, [router]);

  const confirmResetPasswordHandler = useCallback(async (formData) => {
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
  }, [router]);

  const value = useMemo(
    () => ({
      user,
      admin,
      role,
      loading,
      sessionReady,
      error,
      login,
      register,
      completeGoogleSession,
      logout: logouthundler,
      resetPassword: resetPasswordHandler,
      confirmResetPassword: confirmResetPasswordHandler,
    }),
    [
      user,
      admin,
      role,
      loading,
      sessionReady,
      error,
      login,
      register,
      completeGoogleSession,
      logouthundler,
      resetPasswordHandler,
      confirmResetPasswordHandler,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
