import jwt from "jsonwebtoken";

function getUserFromToken(token) {
  const decoded = token ? jwt.decode(token) : null;

  if (!decoded || typeof decoded !== "object") return null;

  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    return null;
  }

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

function normalizeGoogleUser(user, tokenUser) {
  if (!user || typeof user !== "object") return tokenUser;
  return {
    ...tokenUser,
    ...user,
    role: user.role || user.userRole || user.type || tokenUser?.role || "user",
  };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, user } = req.body || {};
  const tokenUser = getUserFromToken(token);
  const sessionUser = normalizeGoogleUser(user, tokenUser);

  if (!token || !sessionUser) {
    return res.status(400).json({ message: "Invalid Google session payload" });
  }

  const host = req.headers.host || "";
  const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");
  const secure = isLocalhost ? "" : "; Secure";
  const sameSite = isLocalhost ? "Lax" : "None";

  res.setHeader(
    "Set-Cookie",
    `x-auth-token=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=${sameSite}${secure}; Max-Age=${15 * 60}`,
  );

  return res.status(200).json({
    message: "Google session stored",
    user: sessionUser,
  });
}
