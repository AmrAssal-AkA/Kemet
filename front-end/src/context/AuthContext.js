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
  normalizeAuthUser,
  normalizeRole,
} from "@/services/authServices";
import { getAuthRedirectPath } from "@/utils/authSession";

const AuthContext = createContext();

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

    const restoredSession = async () => {
      setLoading(true);
      try {
        const backendUser = await getCurrentUser();
        applySessionUser(normalizeAuthUser(backendUser) || backendUser);
      } catch (error) {
        applySessionUser(null);
      } finally {
        setSessionReady(true);
        setLoading(false);
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
      resetPasswordHandler,
      confirmResetPasswordHandler,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
