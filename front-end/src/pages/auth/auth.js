
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/authForms/auth";
import { useAuth } from "@/context/AuthContext";

function parseGoogleUser(userValue) {
  try {
    return JSON.parse(userValue);
  } catch (error) {
    return JSON.parse(decodeURIComponent(userValue));
  }
}

function getRedirectPath(user) {
  if (user?.isAdmin === true) return "/admin";

  const role = String(user?.role || user?.userRole || user?.type || "")
    .trim()
    .toLowerCase();

  if (role === "admin") return "/admin";
  if (role === "guide" || role === "localguide" || role === "local_guide") {
    return "/guide/dashboard";
  }

  return "/user-dashboard";
}

export default function Auth() {
  const router = useRouter();
  const { completeGoogleSession } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const { token, user, refreshToken, refresh_token } = router.query;
    const tokenValue = Array.isArray(token) ? token[0] : token;
    const userValue = Array.isArray(user) ? user[0] : user;
    const refreshTokenValue = Array.isArray(refreshToken)
      ? refreshToken[0]
      : refreshToken || (Array.isArray(refresh_token) ? refresh_token[0] : refresh_token);

    if (!tokenValue || !userValue) return;

    async function establishGoogleSession() {
      try {
        const parsedUser = parseGoogleUser(userValue);
        const sessionUser = await completeGoogleSession({
          token: tokenValue,
          refreshToken: refreshTokenValue,
          user: parsedUser,
        });
        router.replace(getRedirectPath(sessionUser || parsedUser));
      } catch (error) {
        console.error("Google session could not be completed:", error);
        router.replace("/auth/auth");
      }
    }

    establishGoogleSession();
  }, [
    completeGoogleSession,
    router,
    router.isReady,
    router.query.refreshToken,
    router.query.refresh_token,
    router.query.token,
    router.query.user,
  ]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <AuthForm />
    </main>
  );
}

