import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function UserDashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);


  useEffect(() => {
if (typeof window === "undefined") return;
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      router.push("/auth/login");
      return;
    }

    if (storedUser.role !== "user") {
      router.push("/auth/login");
    }

    setUser(storedUser);

  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Hello {user?.name}</h1>

      <button onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}