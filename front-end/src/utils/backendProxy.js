import axios from "axios";
import { getApiBaseUrl } from "@/utils/apiBaseUrl";

const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
]);

function getForwardHeaders(req) {
  const headers = {};

  for (const [name, value] of Object.entries(req.headers)) {
    const lowerName = name.toLowerCase();
    if (HOP_BY_HOP_HEADERS.has(lowerName)) continue;
    if (lowerName === "cookie") continue;
    if (value === undefined) continue;
    headers[name] = value;
  }

  if (req.headers.cookie) {
    headers.Cookie = req.headers.cookie;
  }

  return headers;
}

function buildTargetUrl(basePath, req) {
  const apiBaseUrl = getApiBaseUrl().replace(/\/$/, "");
  const pathParts = Array.isArray(req.query.path)
    ? req.query.path
    : [req.query.path].filter(Boolean);
  const cleanBasePath = basePath.startsWith("/") ? basePath : `/${basePath}`;
  const cleanPath = pathParts
    .map((part) => encodeURIComponent(String(part)))
    .join("/");
  const targetUrl = new URL(
    `${apiBaseUrl}${cleanBasePath}${cleanPath ? `/${cleanPath}` : ""}`,
  );

  Object.entries(req.query).forEach(([key, value]) => {
    if (key === "path") return;

    if (Array.isArray(value)) {
      value.forEach((item) => {
        targetUrl.searchParams.append(key, String(item));
      });
      return;
    }

    if (value !== undefined) {
      targetUrl.searchParams.set(key, String(value));
    }
  });

  return targetUrl.toString();
}

export async function proxyBackendRequest(req, res, basePath) {
  const method = req.method || "GET";
  const hasBody = !["GET", "HEAD"].includes(method.toUpperCase());

  try {
    const response = await axios.request({
      url: buildTargetUrl(basePath, req),
      method,
      headers: getForwardHeaders(req),
      data: hasBody ? req : undefined,
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      responseType: "arraybuffer",
      validateStatus: () => true,
    });

    Object.entries(response.headers || {}).forEach(([name, value]) => {
      const lowerName = name.toLowerCase();
      if (lowerName === "transfer-encoding" || lowerName === "content-encoding") {
        return;
      }
      if (value !== undefined) {
        res.setHeader(name, value);
      }
    });

    res.status(response.status);

    if (!response.data || response.data.length === 0) {
      return res.end();
    }

    return res.send(Buffer.from(response.data));
  } catch (error) {
    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({ message: "Backend service unavailable" });
    }

    return res.status(500).json({
      message: error.message || "Backend proxy request failed",
    });
  }
}
