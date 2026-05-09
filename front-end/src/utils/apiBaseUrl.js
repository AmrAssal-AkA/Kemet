const DEFAULT_API_BASE_URL = "https://kemet-gold.vercel.app";

export function getApiBaseUrl() {
  const value = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return (value || DEFAULT_API_BASE_URL).replace(/\/+$/, "");
}

export function buildApiUrl(path = "") {
  if (!path) return getApiBaseUrl();
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}
