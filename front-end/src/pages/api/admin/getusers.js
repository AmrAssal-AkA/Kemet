import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

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
    return res.status(405).json({ message: "Method not allowed" });
  }

  const cookies = parseCookies(req.headers.cookie || "") || req.cookies || {};

  let token = cookies["x-auth-token"];
  const refreshToken = cookies["x-refresh-token"];

  if (!token) {
    console.log("NO TOKEN FOUND");
    return res.status(401).json({ message: "Unauthorized - No token" });
  }


  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/adminDashboard/AllUsers`,
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      },
    );
    res.status(200).json({ users: response.data.users });
  } catch (error) {
    console.error(
      "Error fetching users:",
      error.response?.status,
      error.message,
    );

    if (error.response?.status === 401 && refreshToken) {
      console.log("Token expired, attempting refresh with refresh token...");
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          {},
          {
            headers: {
              Cookie: req.headers.cookie || "",
            },
          },
        );

        
        const setCookieHeaders = refreshResponse.headers["set-cookie"];
        if (setCookieHeaders) {
          setCookieHeaders.forEach((cookie) => {
            res.setHeader("Set-Cookie", cookie);
          });
        }

        try {
          const retryResponse = await axios.get(
            `${API_BASE_URL}/api/adminDashboard/AllUsers`,
            {
              headers: {
                Cookie: req.headers.cookie || "",
              },
            },
          );
          return res.status(200).json({ users: retryResponse.data.users });
        } catch (retryError) {
          console.error(
            "Retry failed:",
            retryError.response?.status,
            retryError.message,
          );
          return res.status(500).json({ message: "Internal server error" });
        }
      } catch (refreshError) {
        console.log(
          "Token refresh failed:",
          refreshError.response?.status,
          refreshError.message,
        );
        return res
          .status(401)
          .json({ message: "Token expired and refresh failed" });
      }
    }

    if (error.response?.status === 401) {
      return res.status(401).json({ message: "Token expired or invalid" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
}

export default handler;
