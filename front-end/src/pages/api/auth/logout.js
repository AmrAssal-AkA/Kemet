import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";

const API_BASE_URL = getApiBaseUrl();

const clearAuthCookies = [
  "x-auth-token=; Max-Age=0; Path=/; HttpOnly",
  "x-refresh-token=; Max-Age=0; Path=/; HttpOnly",
  "auth-token=; Max-Age=0; Path=/",
  "token=; Max-Age=0; Path=/",
  "accessToken=; Max-Age=0; Path=/",
];

async function hundler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/logout`,
      {},
      {
        headers: { Cookie: req.headers.cookie || "" },
        withCredentials: true,
      },
    );
    res.setHeader("Set-Cookie", clearAuthCookies);
    return res.status(response.status).json(response.data);
  } catch (error) {
    res.setHeader("Set-Cookie", clearAuthCookies);
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default hundler;
