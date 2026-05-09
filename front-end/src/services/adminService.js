import { extractUserFromAuthResponse, getUserRole } from "@/utils/authSession";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[adminService]", {
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

export async function getAdminFromSession(cookie = "") {
  const res = await fetch(`/api/auth/refresh`, {
    method: "POST",
    headers: cookie ? { Cookie: cookie } : {},
    credentials: "include",
  });
  const data = await handleResponse(res, "Admin session could not be verified.");
  return extractUserFromAuthResponse(data);
}

export async function requireAdmin(context) {
  const cookie = context.req.headers.cookie || "";

  if (!cookie) {
    return {
      redirect: { destination: "/auth/auth", permanent: false },
    };
  }

  try {
    const admin = await getAdminFromSession(cookie);

    if (getUserRole(admin) !== "admin") {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    return { admin, cookie };
  } catch (error) {
    console.error("[requireAdmin]", error.message);
    return {
      redirect: { destination: "/auth/auth", permanent: false },
    };
  }
}

export async function getAdminUsers(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/AllUsers`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Users could not be loaded.");
  return data?.users || [];
}

export async function getAdminBookings(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/bookingDetails`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Bookings could not be loaded.");
  return data?.bookings || [];
}

export async function getTripStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/trips`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Trip stats could not be loaded.");
}

export async function getBlogStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/blogs`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Blog stats could not be loaded.");
}

export async function getRevenueStats(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/adminDashboard/stats/revenue`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Revenue stats could not be loaded.");
}

export async function getAdminContacts(cookie = "") {
  const res = await fetch(`${API_BASE_URL}/api/contact/contacts`, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Contacts could not be loaded.");
  return Array.isArray(data) ? data : data?.contacts || [];
}
