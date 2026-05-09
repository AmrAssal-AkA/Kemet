import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function hundler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: {
          Authorization: authToken ? `Bearer ${authToken}` : "",
          cookies: req.headers.cookie || "",
        },
        withCredentials: true,
      },
    );
  } catch (error) {
    if (error.response?.status && error.response.status !== 401) {
      console.error("Logout error:", error.response?.data || error.message);
      return res.status(error.response.status).json(error.response.data);
    }
  } finally {
    res.setHeader("Set-Cookie", [
      "x-auth-token=; Max-Age=0; Path=/; HttpOnly",
      "x-refresh-token=; Max-Age=0; Path=/; HttpOnly",
      "connect.sid=; Max-Age=0; Path=/; HttpOnly",
    ]);
  }

  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

export default hundler;
