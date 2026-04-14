import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function GuideDashboard() {
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (!user) {
      router.push("/auth/auth");
      return;
    }

    if (user.role !== "guide") {
      router.push("/auth/auth");
    }
  }, [router, user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth/auth");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Guide Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || "";

  if (!cookie || !cookie.includes("x-auth-token")) {
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
