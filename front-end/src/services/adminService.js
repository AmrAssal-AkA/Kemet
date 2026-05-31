import { extractUserFromAuthResponse, getUserRole } from "@/utils/authSession";
import { buildApiUrl } from "@/utils/apiBaseUrl";

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

function getBookingArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.data?.bookings)) return data.data.bookings;
  if (Array.isArray(data?.bookingDetails)) return data.bookingDetails;
  return [];
}

function getRequestOrigin(context) {
  const host = context.req.headers.host;
  const proto = context.req.headers["x-forwarded-proto"] || "http";
  return `${proto}://${host}`;
}

export async function getAdminFromSession(cookie = "", origin = "") {
  const sessionUrl = origin
    ? `${origin}/api/auth/refresh`
    : "/api/auth/refresh";

  const res = await fetch(sessionUrl, {
    method: "POST",
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(
    res,
    "Admin session could not be verified.",
  );
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
    const admin = await getAdminFromSession(cookie, getRequestOrigin(context));

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
  const endpoint = cookie
    ? buildApiUrl("/api/adminDashboard/AllUsers")
    : "/api/admin/getusers";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Users could not be loaded.");
  return data?.users || [];
}

export async function getAdminBookingDetails(cookie = "") {
  const endpoint = cookie
    ? buildApiUrl("/api/adminDashboard/bookingDetails")
    : "/api/admin/getBookingDetails";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Bookings could not be loaded.");
  const bookings = getBookingArray(data);

  if (process.env.NODE_ENV !== "production") {
    console.log("Normalized admin bookings:", {
      count: bookings.length,
      firstBookingKeys: bookings[0] ? Object.keys(bookings[0]) : [],
    });
  }

  return bookings;
}

export async function getAdminBookings(cookie = "") {
  return getAdminBookingDetails(cookie);
}

export async function confirmAdminBooking(bookingId) {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const res = await fetch(`/api/admin/confirmBooking/${bookingId}`, {
    method: "PATCH",
    credentials: "include",
  });

  return handleResponse(res, "Booking could not be confirmed.");
}

export async function cancelAdminBooking(bookingId) {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const res = await fetch(`/api/booking/${bookingId}`, {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Booking could not be cancelled.");
}

export async function getAvailableGuidesForBooking(bookingId) {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  const res = await fetch(
    `/api/admin/bookings/${bookingId}/available-guides`,
    {
      credentials: "include",
    },
  );

  return handleResponse(res, "Available guides could not be loaded.");
}

export async function assignGuideToBooking(bookingId, guideId) {
  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  if (!guideId) {
    throw new Error("Guide ID is required.");
  }

  const res = await fetch(
    `/api/admin/bookings/${bookingId}/assign-guide`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ guideId }),
    },
  );

  return handleResponse(res, "Guide could not be assigned.");
}

export async function getTripStats(cookie = "") {
  const endpoint = cookie
    ? buildApiUrl("/api/adminDashboard/stats/trips")
    : "/api/admin/stats/trips";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Trip stats could not be loaded.");
}

export async function getBlogStats(cookie = "") {
  const endpoint = cookie
    ? buildApiUrl("/api/adminDashboard/stats/blogs")
    : "/api/admin/stats/blogs";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Blog stats could not be loaded.");
}

export async function getRevenueStats(cookie = "") {
  const endpoint = cookie
    ? buildApiUrl("/api/adminDashboard/stats/revenue")
    : "/api/admin/stats/revenue";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  return handleResponse(res, "Revenue stats could not be loaded.");
}

export async function getAdminContacts(cookie = "") {
  const endpoint = cookie
    ? buildApiUrl("/api/contact/contacts")
    : "/api/admin/getContactus";
  const res = await fetch(endpoint, {
    headers: getHeaders(cookie),
    credentials: "include",
  });
  const data = await handleResponse(res, "Contacts could not be loaded.");
  return Array.isArray(data) ? data : data?.contacts || [];
}
