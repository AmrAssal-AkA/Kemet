import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";
import {
  getUserFromAuthCookies,
  normalizeAuthCookies,
  withTokenUser,
} from "../../../utils/authCookies";

const API_BASE_URL = getApiBaseUrl();

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const refreshToken = req.cookies["x-refresh-token"];
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token missing" });
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
      res.setHeader("Set-Cookie", normalizeAuthCookies(cookies, req));
    }

    return res
      .status(response.status)
      .json(withTokenUser(response.data, getUserFromAuthCookies(cookies)));
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    if (error.response) {
      const cookies = error.response.headers?.["set-cookie"];
      if (cookies) {
        res.setHeader("Set-Cookie", normalizeAuthCookies(cookies, req));
      }
      return res.status(error.response.status).json(error.response.data);
    }

    return res.status(500).json({ message: "Unable to refresh token" });
  }
}

export default handler;
