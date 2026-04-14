
import { useEffect } from "react";
import { useRouter } from "next/router";
import AuthForm from "@/components/authForms/auth";

export default function Auth() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    const { token, user } = router.query;
    if (!token || !user) return;

    try {
      const parsedUser = JSON.parse(user);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(parsedUser));

      if (parsedUser.role === "admin") {
        router.replace("/admin-dashboard");
        return;
      }

      if (parsedUser.role === "guide") {
        router.replace("/guide-dashboard");
        return;
      }

      router.replace("/user-dashboard");
    } catch (error) {
      console.error("Invalid Google callback user payload:", error);
    }
  }, [router]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <AuthForm />
    </main>
  );
}
