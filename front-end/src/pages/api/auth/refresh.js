import axios from "axios";
import jwt from "jsonwebtoken";

const API_BASE_URL ="https://kemet-gold.vercel.app/";

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

function getCookieValueFromSetCookie(cookies = [], name) {
  const cookie = cookies.find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split(";")[0].slice(name.length + 1));
}

function getUserFromToken(token) {
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

function responseHasUser(data) {
  return Boolean(data?.user || data?.data?.user);
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

async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method not allowed" });
    return;
  }

  const refreshToken = req.cookies["x-refresh-token"];
  const accessToken = req.cookies["x-auth-token"];
  if (!refreshToken) {
    const tokenUser = getUserFromToken(accessToken);
    if (tokenUser) {
      return res.status(200).json({
        message: "Access token session restored",
        user: tokenUser,
      });
    }

    return res.status(401).json({ message: "Refresh token missing" });
  }

  try {

    const response = await axios.post(
      `${API_BASE_URL}/api/auth/refresh`,
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
      res.setHeader("Set-Cookie", normalizeAuthCookies(cookies, req));
    }
    const tokenFromRotatedCookie = getCookieValueFromSetCookie(cookies || [], "x-auth-token");
    const tokenUser = getUserFromToken(tokenFromRotatedCookie || req.cookies["x-auth-token"]);
    const responseData = responseHasUser(response.data) || tokenUser
      ? withTokenUser(response.data, tokenUser)
      : response.data;

    console.debug("[api/auth/refresh] backend response", response.data);
    console.debug("[api/auth/refresh] rotated cookies", Boolean(cookies));
    return res.status(200).json(responseData);
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
