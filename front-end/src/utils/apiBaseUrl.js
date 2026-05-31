

export function getApiBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_Backend_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL 
  );
}

export function buildApiUrl(path = "") {
  const base = getApiBaseUrl().replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
