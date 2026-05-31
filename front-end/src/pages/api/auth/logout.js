import axios from "axios";
import { getApiBaseUrl } from "../../../utils/apiBaseUrl";
import { buildClearAuthCookies } from "../../../utils/authCookies";

const API_BASE_URL = getApiBaseUrl();

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
    res.setHeader("Set-Cookie", buildClearAuthCookies(req));
    return res.status(response.status).json(response.data);
  } catch (error) {
    res.setHeader("Set-Cookie", buildClearAuthCookies(req));
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(500).json({ message: "Internal server error" });
  }
}

export default hundler;
