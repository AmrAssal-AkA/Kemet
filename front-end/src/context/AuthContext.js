import {
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  createContext,
  useEffect,
} from "react";
import { useRouter } from "next/router";
import {
  loginUser,
  registerUser,
  logout,
  resetPassword,
  confirmResetPassword,
  getCurrentUser,
  completeGoogleSession as completeGoogleSessionRequest,
  normalizeAuthUser,
  normalizeRole,
} from "@/services/authServices";
import { getAuthRedirectPath } from "@/utils/authSession";

const AuthContext = createContext();
const AUTH_STORAGE_KEYS = [
  "user",
  "authUser",
  "currentUser",
  "token",
  "auth-token",
  "accessToken",
  "x-auth-token",
  "x-refresh-token",
];

function clearStoredAuth() {
  if (typeof window === "undefined") return;

  try {
    AUTH_STORAGE_KEYS.forEach((key) => {
      window.localStorage.removeItem(key);
      window.sessionStorage.removeItem(key);
    });
  } catch {
    // Some browsers can block storage access; cookie logout still handles auth.
  }
}

export const AuthProvider = ({ children }) => {
  const didRestoreSession = useRef(false);
  const isLoggingOut = useRef(false);
  const sessionRequestId = useRef(0);
  const [user, setUser] = useState(null);
  const [admin, setAdmin] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionReady, setSessionReady] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const applySessionUser = useCallback((sessionUser) => {
    const userRole = normalizeRole(sessionUser);
    setUser(sessionUser || null);
    setAdmin(userRole === "admin");
    setRole(sessionUser ? userRole : null);
    return sessionUser;
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const hasGoogleCallback =
      router.pathname === "/auth/auth" &&
      Boolean(router.query.token) &&
      Boolean(router.query.user);

    if (hasGoogleCallback) {
      setSessionReady(false);
      setLoading(false);
      return;
    }

    if (didRestoreSession.current) return;
    didRestoreSession.current = true;

    const restoreRequestId = sessionRequestId.current + 1;
    sessionRequestId.current = restoreRequestId;

    const restoredSession = async () => {
      setLoading(true);
      try {
        const backendUser = await getCurrentUser();
        if (isLoggingOut.current || restoreRequestId !== sessionRequestId.current) return;
        const restoredUser = normalizeAuthUser(backendUser) || backendUser;
        if (!restoredUser) {
          clearStoredAuth();
        }
        applySessionUser(restoredUser);
      } catch (error) {
        if (isLoggingOut.current || restoreRequestId !== sessionRequestId.current) return;
        applySessionUser(null);
      } finally {
        if (!isLoggingOut.current && restoreRequestId === sessionRequestId.current) {
          setSessionReady(true);
          setLoading(false);
        }
      }
    };

    restoredSession();
  }, [
    applySessionUser,
    router.isReady,
    router.pathname,
    router.query.token,
    router.query.user,
  ]);

  const login = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await loginUser(formData);
        const loggedInUser = applySessionUser(normalizeAuthUser(data));

        if (!loggedInUser) {
          throw new Error("Login succeeded, but the user data was missing.");
        }

        setSessionReady(true);
        await router.replace(getAuthRedirectPath(loggedInUser));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [applySessionUser, router],
  );

  const register = useCallback(
    async (formData) => {
      setLoading(true);
      setError(null);
      try {
        const data = await registerUser(formData);
        const registeredUser = applySessionUser(normalizeAuthUser(data));

        if (!registeredUser) {
          throw new Error(
            "Registration succeeded, but the user data was missing.",
          );
        }

        setSessionReady(true);
        await router.replace(getAuthRedirectPath(registeredUser));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [applySessionUser, router],
  );

  const logouthundler = useCallback(async () => {
    isLoggingOut.current = true;
    sessionRequestId.current += 1;
    setLoading(true);
    setError(null);
    applySessionUser(null);
    setSessionReady(true);
    clearStoredAuth();

    try {
      await logout();
    } catch (error) {
      setError(error.message);
    } finally {
      await router.replace("/auth/auth");
      isLoggingOut.current = false;
      setLoading(false);
    }
  }, [applySessionUser, router]);

  const completeGoogleSession = useCallback(
    async ({ token, refreshToken, user: callbackUser }) => {
      setLoading(true);
      setSessionReady(false);
      setError(null);

      try {
        const data = await completeGoogleSessionRequest({
          token,
          refreshToken,
          user: callbackUser,
        });
        const googleUser =
          applySessionUser(normalizeAuthUser(data) || normalizeAuthUser(callbackUser));

        if (!googleUser) {
          throw new Error("Google login succeeded, but the user data was missing.");
        }

        setSessionReady(true);
        return googleUser;
      } catch (error) {
        clearStoredAuth();
        applySessionUser(null);
        setSessionReady(true);
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [applySessionUser],
  );

  const resetPasswordHandler = useCallback(
    async (email) => {
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
    },
    [router],
  );

  const confirmResetPasswordHandler = useCallback(
    async (formData) => {
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
    },
    [router],
  );

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
      logout: logouthundler,
      completeGoogleSession,
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
      logouthundler,
      completeGoogleSession,
      resetPasswordHandler,
      confirmResetPasswordHandler,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
