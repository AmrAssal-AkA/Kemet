import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();


async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
      {},
      {
        headers: { Cookie: req.headers.cookie || "" },
        withCredentials: true,
      },
    );

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      // Ensure cookies are properly set for subsequent requests
      res.setHeader("Set-Cookie", cookies);
    }

    return res.status(200).json({
      success: true,
      user: response.data.user,
      message: "Session verified and established",
    });
  } catch (error) {
    if (error.response?.status === 401) {
      return res.status(401).json({
        success: false,
        message:
          "Session verification failed - refresh token missing or invalid",
      });
    }

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        message: "Auth service unavailable",
      });
    }

    console.error("Session verification error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to verify session",
    });
  }
}

export default handler;
