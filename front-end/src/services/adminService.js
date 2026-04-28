const API_BASE_URL = "http://localhost:8000";

async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

function getHeaders(cookie) {
  return cookie ? { Cookie: cookie } : {};
}

export async function getAdminUsers(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/AllUsers`, {
    headers: getHeaders(cookie),
  });
  const data = await handleResponse(res, "Users could not be loaded.");
  return data?.users || [];
}

export async function getAdminBookings(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/bookingDetails`, {
    headers: getHeaders(cookie),
  });
  const data = await handleResponse(res, "Bookings could not be loaded.");
  return data?.bookings || [];
}

export async function getTripStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/trips`, {
    headers: getHeaders(cookie),
  });
  return handleResponse(res, "Trip stats could not be loaded.");
}

export async function getBlogStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/blogs`, {
    headers: getHeaders(cookie),
  });
  return handleResponse(res, "Blog stats could not be loaded.");
}

export async function getRevenueStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/revenue`, {
    headers: getHeaders(cookie),
  });
  return handleResponse(res, "Revenue stats could not be loaded.");
}

export async function getAdminContacts(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/contact/contacts`, {
    headers: getHeaders(cookie),
  });
  const data = await handleResponse(res, "Contacts could not be loaded.");
  return Array.isArray(data) ? data : data?.contacts || [];
}
