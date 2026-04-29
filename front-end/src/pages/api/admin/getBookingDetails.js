import axios from "axios";

function parseCookies(cookieHeader) {
  const cookies = {};

  if (cookieHeader) {
    cookieHeader.split(";").forEach((cookie) => {
      const [key, value] = cookie.trim().split("=");
      if (key) cookies[key] = decodeURIComponent(value || "");
    });
  }

  return cookies;
}

async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(400).json({ message: "Invalid method" });
  }

  const cookies = parseCookies(req.headers.cookie || "") || req.cookies || {};

  let token = cookies["x-auth-token"];
  const refreshToken = cookies["x-refresh-token"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const response = await axios.get(
      "http://localhost:8000/api/adminDashboard/bookingDetails",
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      },
    );
    return res.status(200).json(response.data);
  } catch (error) {
    if (error.response?.status === 401 && refreshToken) {
      try {
        const refreshResponse = await axios.post(
          "http://localhost:8000/api/auth/refresh",
          {},
          {
            headers: {
              Cookie: req.headers.cookie || "",
            },
          },
        );
        token = refreshResponse.data.token;
        const retryResponse = await axios.get(
          "http://localhost:8000/api/adminDashboard/bookingDetails",
          {
            headers: {
              Cookie: req.headers.cookie || "",
              "x-auth-token": token,
            },
          },
        );
        return res.status(200).json(retryResponse.data);
      } catch (error) {
        return res
          .status(401)
          .json({ message: "Unauthorized - Invalid token" });
      }
    }
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "Server error";
    return res.status(status).json({ message });
  }
}

export default handler;
