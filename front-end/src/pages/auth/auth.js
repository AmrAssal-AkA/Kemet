
import { useEffect, useRef } from "react";
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

function isRealQueryValue(value) {
  if (typeof value !== "string") return false;

  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.length > 0 &&
    normalizedValue !== "undefined" &&
    normalizedValue !== "null"
  );
}

function getRedirectPath(user) {
  if (user?.isAdmin === true) return "/admin";
  if (user?.localGuide === true) return "/guide/dashboard";

  const role = String(user?.role || user?.userRole || user?.type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (role === "admin") return "/admin";
  if (role === "guide" || role === "localguide") {
    return "/guide/dashboard";
  }

  return "/user-dashboard";
}

export default function Auth() {
  const router = useRouter();
  const hasCompletedGoogleSession = useRef(false);
  const { completeGoogleSession } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;
    if (hasCompletedGoogleSession.current) return;

    const { token, user, refreshToken, refresh_token } = router.query;
    const tokenValue = Array.isArray(token) ? token[0] : token;
    const userValue = Array.isArray(user) ? user[0] : user;
    const refreshTokenValue = Array.isArray(refreshToken)
      ? refreshToken[0]
      : refreshToken;
    const refreshTokenSnakeValue = Array.isArray(refresh_token)
      ? refresh_token[0]
      : refresh_token;

    if (!tokenValue || !userValue) return;

    const completeSession = async () => {
      hasCompletedGoogleSession.current = true;

      try {
        const parsedUser = parseGoogleUser(userValue);
        const response = await fetch("/api/auth/google-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: tokenValue,
            user: parsedUser,
            refreshToken: isRealQueryValue(refreshTokenValue)
              ? refreshTokenValue
              : refreshTokenSnakeValue,
          }),
        });

        if (!response.ok) {
          throw new Error("Google session could not be completed.");
        }

        const data = await response.json();
        const sessionUser = completeGoogleSession(data.user);

        await router.replace(getRedirectPath(sessionUser || data.user));
      } catch (error) {
        console.error("Invalid Google callback session payload:", error);
        hasCompletedGoogleSession.current = false;
        router.replace("/auth/auth");
      }
    };

    completeSession();
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

