import axios from "axios";
import jwt from "jsonwebtoken";

const API_BASE_URL =
  process.env.Backend_URL ||
  "http://localhost:8000";

function normalizeAuthCookies(cookies = [], req) {
  const host = req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

  return cookies.map((cookie) =>
    cookie
      .replace(/;\s*Domain=[^;]+/gi, "")
      .replace(/;\s*Secure/gi, isLocalhost ? "" : "; Secure")
      .replace(/;\s*SameSite=None/gi, isLocalhost ? "; SameSite=Lax" : "; SameSite=None"),
  );
}

function getCookieValue(cookies = [], name) {
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split(";")[0].slice(name.length + 1));
}

function getUserFromToken(cookies = []) {
  const token = getCookieValue(cookies, "x-auth-token");
  const decoded = token ? jwt.decode(token) : null;

  if (!decoded || typeof decoded !== "object") return null;

  return {
    _id: decoded._id || decoded.id || decoded.userId,
    userId: decoded.userId || decoded.id || decoded._id,
    name: decoded.name,
    email: decoded.email,
    role: decoded.role || decoded.userRole || decoded.type || "user",
    userRole: decoded.userRole,
    type: decoded.type,
    isAdmin: decoded.isAdmin,
  };
}

function withTokenUser(data, tokenUser) {
  if (!tokenUser) return data;

  if (data?.user && typeof data.user === "object") {
    return { ...data, user: { ...tokenUser, ...data.user } };
  }

  if (data?.data?.user && typeof data.data.user === "object") {
    return {
      ...data,
      data: { ...data.data, user: { ...tokenUser, ...data.data.user } },
    };
  }

  return { ...data, user: tokenUser };
}

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Name, email and password are required" });
  }

  if (password.length < 8) {
    return res
      .status(400)
      .json({ message: "Password must be at least 8 characters long" });
  }
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/auth/register`,
      { name, email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      },
    );
    const cookie = response.headers["set-cookie"];
    if (cookie) {
      res.setHeader("Set-Cookie", normalizeAuthCookies(cookie, req));
    }

    return res.status(201).json(withTokenUser(response.data, getUserFromToken(cookie)));
  } catch (error) {
    console.error("Register Error:", error.message);
    console.error(
      "Register Error Details:",
      error.response?.data || error.message,
    );

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Auth service unavailable" });
    }

    if (error.response) {
      console.error("Backend Response Status:", error.response.status);
      console.error("Backend Response Data:", error.response.data);
      return res.status(error.response.status).json(error.response.data);
    }

    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

export default handler;
