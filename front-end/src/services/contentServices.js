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

function getJsonHeaders(cookie = "") {
  return {
    "Content-Type": "application/json",
    ...getHeaders(cookie),
  };
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

export async function updateBlog(blogId, payload) {
  if (!blogId) throw new Error("Blog ID is required.");

  const res = await fetch(buildApiUrl(`/api/blog/updateBlog/${blogId}`), {
    method: "PUT",
    credentials: "include",
    body: payload,
  });

  return handleResponse(res, "Blog could not be updated.");
}

export async function deleteBlog(blogId) {
  if (!blogId) throw new Error("Blog ID is required.");

  const res = await fetch(buildApiUrl(`/api/blog/deleteBlog/${blogId}`), {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Blog could not be deleted.");
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

export async function updateHiddenGem(id, payload) {
  if (!id) throw new Error("Hidden gem ID is required.");

  const res = await fetch(buildApiUrl(`/api/hiddenGem/${id}`), {
    method: "PUT",
    headers: getJsonHeaders(),
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "Hidden gem could not be updated.");
}

export async function deleteHiddenGem(id) {
  if (!id) throw new Error("Hidden gem ID is required.");

  const res = await fetch(buildApiUrl(`/api/hiddenGem/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Hidden gem could not be deleted.");
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

export async function updateOffering(id, payload) {
  if (!id) throw new Error("Offering ID is required.");
  const isFormData = typeof FormData !== "undefined" && payload instanceof FormData;

  const res = await fetch(buildApiUrl(`/api/offerings/${id}`), {
    method: "PUT",
    headers: isFormData ? undefined : getJsonHeaders(),
    credentials: "include",
    body: isFormData ? payload : JSON.stringify(payload),
  });

  return handleResponse(res, "Offering could not be updated.");
}

export async function deleteOffering(id) {
  if (!id) throw new Error("Offering ID is required.");

  const res = await fetch(buildApiUrl(`/api/offerings/${id}`), {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Offering could not be deleted.");
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
