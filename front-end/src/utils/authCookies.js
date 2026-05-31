import jwt from "jsonwebtoken";

function isLocalRequest(req) {
  const host = req?.headers?.host || "";
  return host.includes("localhost") || host.includes("127.0.0.1");
}

function getSameSiteAttribute(req) {
  return isLocalRequest(req) ? "SameSite=Lax" : "SameSite=None";
}

function getSecureAttribute(req) {
  return isLocalRequest(req) ? "" : "; Secure";
}

export function normalizeAuthCookies(cookies = [], req) {
  const cookieList = Array.isArray(cookies) ? cookies : [cookies].filter(Boolean);

  return cookieList.map((cookie) => {
    const withoutDomain = cookie
      .replace(/;\s*Domain=[^;]+/gi, "")
      .replace(/;\s*SameSite=[^;]+/gi, "")
      .replace(/;\s*Secure/gi, "");

    return `${withoutDomain}; ${getSameSiteAttribute(req)}${getSecureAttribute(req)}`;
  });
}

export function getCookieValue(cookies = [], name) {
  const cookieList = Array.isArray(cookies) ? cookies : [cookies].filter(Boolean);
  const cookie = cookieList.find((item) => item.startsWith(`${name}=`));
  if (!cookie) return null;
  return decodeURIComponent(cookie.split(";")[0].slice(name.length + 1));
}

export function getUserFromToken(token) {
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

export function getUserFromAuthCookies(cookies = []) {
  return getUserFromToken(getCookieValue(cookies, "x-auth-token"));
}

export function withTokenUser(data, tokenUser) {
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

function buildCookie(name, value, maxAge, req) {
  return [
    `${name}=${encodeURIComponent(value)}`,
    `Max-Age=${maxAge}`,
    "Path=/",
    "HttpOnly",
    getSameSiteAttribute(req),
    getSecureAttribute(req).replace(/^; /, ""),
  ]
    .filter(Boolean)
    .join("; ");
}

export function buildGoogleSessionCookies({ accessToken, refreshToken }, req) {
  return [
    buildCookie("x-auth-token", accessToken, 15 * 60, req),
    buildCookie("x-refresh-token", refreshToken, 7 * 24 * 60 * 60, req),
  ];
}

export function buildClearAuthCookies(req) {
  const baseCookies = [
    "x-auth-token=; Max-Age=0; Path=/; HttpOnly",
    "x-refresh-token=; Max-Age=0; Path=/; HttpOnly",
    "userId=; Max-Age=0; Path=/; HttpOnly",
    "auth-token=; Max-Age=0; Path=/",
    "token=; Max-Age=0; Path=/",
    "accessToken=; Max-Age=0; Path=/",
  ];

  return normalizeAuthCookies(baseCookies, req);
}
