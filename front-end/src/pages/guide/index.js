import { useRouter } from "next/router";

import { useAuth } from "@/context/AuthContext";

export default function GuideDashboard() {
  const router = useRouter();
  const {  logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div style={{ padding: "40px" }}>
      <h1>Guide Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
