import { useEffect } from "react";
import { useRouter } from "next/router";

export default function GuideDashboard() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      router.push("/auth/auth");
      return;
    }

    if (user.role !== "guide") {
      router.push("/auth/auth");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/auth");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Guide Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
