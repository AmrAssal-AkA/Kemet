import axios from "axios";

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
      "http://localhost:8000/api/auth/refresh",
      {},
      {
        headers: { Cookie: req.headers.cookie },
        withCredentials: true,
      },
    );
    const cookies = response.headers["set-cookie"];
    if (cookies) {
      cookies.forEach((cookie) => {
        res.setHeader("Set-Cookie", cookie);
      });
    }
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    const status = error.response?.status || 401;
    const message = error.response?.data?.message || "Unable to refresh token";
    return res.status(status).json({ message });
  }
}

export default handler;
