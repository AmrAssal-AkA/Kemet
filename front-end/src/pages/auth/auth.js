
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/authForms/auth";

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

  useEffect(() => {
    if (!router.isReady) return;

    const { token, user } = router.query;
    const tokenValue = Array.isArray(token) ? token[0] : token;
    const userValue = Array.isArray(user) ? user[0] : user;

    if (!tokenValue || !userValue) return;


    try {
      const parsedUser = parseGoogleUser(userValue);
      router.replace(getRedirectPath(parsedUser));
    } catch (error) {
      console.error("Invalid Google callback user payload:", error);
      router.replace("/auth/auth");
    }
  }, [router, router.isReady, router.query.token, router.query.user]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <AuthForm />
    </main>
  );
}

