import { buildApiUrl } from "@/utils/apiBaseUrl";

async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[contentServices]", {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

function getHeaders(cookie) {
  return cookie ? { Cookie: cookie } : {};
}

function getArray(data, key) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.[key])) return data[key];
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

export async function getBlogs(cookie = "") {
  const res = await fetch(buildApiUrl("/api/blog"), {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Blogs could not be loaded.");
  return getArray(data, "blogs");
}

export async function getContacts(cookie = "") {
  const res = await fetch(buildApiUrl("/api/contact/contacts"), {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Contacts could not be loaded.");
  return getArray(data, "contacts");
}

export async function getHiddenGems(cookie = "") {
  const res = await fetch(buildApiUrl("/api/hiddenGem"), {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Hidden gems could not be loaded.");
  return getArray(data, "allHiddenGem");
}

export async function getOfferings(cookie = "") {
  const res = await fetch(buildApiUrl("/api/offerings"), {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Offerings could not be loaded.");
  const offerings = getArray(data, "allOfferings");
  return offerings.length > 0 ? offerings : getArray(data, "offerings");
}

export async function createOffering(formData) {
  const res = await fetch(buildApiUrl("/api/offerings"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res, "Offering could not be created.");
}

export async function createHiddenGem(formData) {
  const res = await fetch(buildApiUrl("/api/hiddenGem"), {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  return handleResponse(res, "Hidden gem could not be created.");
}
