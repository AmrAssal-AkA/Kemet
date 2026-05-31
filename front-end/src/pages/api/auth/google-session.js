import {
  buildGoogleSessionCookies,
  getUserFromToken,
  withTokenUser,
} from "../../../utils/authCookies";

function parseUserPayload(value) {
  if (!value) return null;
  if (typeof value === "object") return value;

  try {
    return JSON.parse(value);
  } catch {
    return JSON.parse(decodeURIComponent(value));
  }
}

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const accessToken = req.body?.token || req.body?.accessToken;
  const refreshToken = req.body?.refreshToken || req.body?.refresh_token;

  if (!accessToken || !refreshToken) {
    return res.status(400).json({
      message: "Google session requires both access and refresh tokens.",
    });
  }

  let callbackUser = null;
  try {
    callbackUser = parseUserPayload(req.body?.user);
  } catch {
    return res.status(400).json({ message: "Invalid Google user payload." });
  }

  const tokenUser = getUserFromToken(accessToken);
  const responseData = withTokenUser(
    { user: callbackUser || tokenUser, message: "Google session established" },
    tokenUser,
  );

  res.setHeader(
    "Set-Cookie",
    buildGoogleSessionCookies({ accessToken, refreshToken }, req),
  );
  return res.status(200).json(responseData);
}
