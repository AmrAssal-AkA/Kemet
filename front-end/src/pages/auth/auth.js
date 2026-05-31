
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/authForms/auth";
import {refreshToken} from "@/services/authServices";

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

    const isGoogleCallback = router.query.google === "true";
    if (!isGoogleCallback) return;

    const fetchUser = async () => {
      try {
        const data = await refreshToken();
        const user = data?.user;
        if (user) {
          router.replace(getRedirectPath(user));
        } else {
          router.replace("/auth/auth");
        }
      } catch (error) {
        console.error("Failed to get user after Google login:", error);
        router.replace("/auth/auth");
      }
    };

    fetchUser();
  }, [router.isReady, router.query.google]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <AuthForm />
    </main>
  );
}

