import axios from "axios";

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  try {
    console.log("Refreshing token with cookie:", req.headers.cookie);

    const response = await axios.post(
      "https://kemet-two.vercel.app/api/auth/refresh",
      {},
      {
        headers: { 
          Cookie: req.headers.cookie || "",
        },
        withCredentials: true,
        maxRedirects: 5,
      },
    );

    const cookies = response.headers["set-cookie"];
    if (cookies) {
      cookies.forEach((cookie) => {
        res.setHeader("Set-Cookie", cookie);
      });
    }

    console.log("Token refresh successful");
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Token refresh error:", error.response?.status, error.response?.data || error.message);
    
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    const status = error.response?.status || 401;
    const message = error.response?.data?.message || "Unable to refresh token";
    return res.status(status).json({ message });
  }
}

export default handler;
