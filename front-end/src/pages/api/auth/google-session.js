import { extractUserFromAuthResponse, getUserRole } from "@/utils/authSession";

function isRealValue(value) {
  if (typeof value !== "string") return false;

  const normalizedValue = value.trim().toLowerCase();
  return (
    normalizedValue.length > 0 &&
    normalizedValue !== "undefined" &&
    normalizedValue !== "null"
  );
}

function parseUserPayload(user) {
  if (!user) return null;
  if (typeof user === "object") return user;

  if (typeof user !== "string") return null;

  try {
    return JSON.parse(user);
  } catch {
    try {
      return JSON.parse(decodeURIComponent(user));
    } catch {
      return null;
    }
  }
}

function buildCookie(name, value) {
  const secureAttribute =
    process.env.NODE_ENV === "production" ? "; Secure" : "";

  return `${name}=${encodeURIComponent(
    value,
  )}; Path=/; HttpOnly; SameSite=Lax${secureAttribute}`;
}

function normalizeGoogleUser(user) {
  const extractedUser = extractUserFromAuthResponse(user);
  if (!extractedUser) return null;

  const role = extractedUser.localGuide === true ? "guide" : getUserRole(extractedUser);

  return {
    ...extractedUser,
    role,
  };
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { token, user, refreshToken } = req.body || {};
  const parsedUser = parseUserPayload(user);
  const normalizedUser = normalizeGoogleUser(parsedUser);

  if (!isRealValue(token) || !normalizedUser) {
    return res.status(400).json({ message: "Token and user are required" });
  }

  const cookies = [buildCookie("x-auth-token", token.trim())];

  if (isRealValue(refreshToken)) {
    cookies.push(buildCookie("x-refresh-token", refreshToken.trim()));
  }

  res.setHeader("Set-Cookie", cookies);

  return res.status(200).json({ user: normalizedUser });
}
