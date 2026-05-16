
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/authForms/auth";
import { useAuth } from "@/context/AuthContext";
import { getAuthRedirectPath } from "@/utils/authSession";

function parseGoogleUser(value) {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(decodeURIComponent(value));
  } catch (error) {
    return JSON.parse(value);
  }
}

export default function Auth() {
  const router = useRouter();
  const { user, sessionReady, completeGoogleSession } = useAuth();

  useEffect(() => {
    if (!router.isReady) return;

    const { token, user } = router.query;
    if (!token || !user) return;

    try {
      const parsedUser = parseGoogleUser(Array.isArray(user) ? user[0] : user);
      const googleToken = Array.isArray(token) ? token[0] : token;
      completeGoogleSession({ token: googleToken, user: parsedUser });
    } catch (error) {
      console.error("Invalid Google callback user payload:", error);
      router.replace("/auth/auth");
    }
  }, [completeGoogleSession, router]);

  useEffect(() => {
    if (!router.isReady || !sessionReady || !user) return;

    const redirectPath = getAuthRedirectPath(user);
    console.debug("[auth] existing session redirect decision", { user, redirectPath });
    router.replace(redirectPath);
  }, [router, sessionReady, user]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      {sessionReady && !user ? <AuthForm /> : null}
    </main>
  );
}

