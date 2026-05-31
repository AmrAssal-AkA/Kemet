import { buildApiUrl } from "@/utils/apiBaseUrl";

export const USER_ROLES = ["user", "admin", "guide"];

function getUserArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

function getUserRole(user) {
  if (user?.isAdmin === true) return "admin";
  return String(user?.role || user?.userRole || user?.type || "user").toLowerCase();
}

async function handleResponse(res, fallbackMessage, logLabel = "userServices") {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(`[${logLabel}]`, {
      url: res.url,
      status: res.status,
      body: data,
    });
    const error = new Error(data?.message || data?.error || fallbackMessage);
    error.status = res.status;
    throw error;
  }

  return data;
}

export async function getAllUsers(cookie = "") {
  const endpoint = buildApiUrl("/api/adminDashboard/AllUsers");
  const res = await fetch(endpoint, {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: "include",
  });

  const data = await handleResponse(res, "Users could not be loaded.", "getAllUsers");
  return getUserArray(data).filter((user) => ["user", "guide"].includes(getUserRole(user)));
}

export async function updateUserRole(userId, role) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!USER_ROLES.includes(role)) {
    throw new Error("Invalid role selected.");
  }

  const endpoint = buildApiUrl(`/api/adminDashboard/upgradeUser/${userId}`);
  const payload = { role };
  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "User role could not be updated.", "updateUserRole");
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.trips)) return data.trips;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.savedTrips)) return data.savedTrips;
  if (Array.isArray(data?.blogs)) return data.blogs;
  if (Array.isArray(data?.likedBlogs)) return data.likedBlogs;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.trips)) return data.data.trips;
  if (Array.isArray(data?.data?.bookings)) return data.data.bookings;
  if (Array.isArray(data?.data?.savedTrips)) return data.data.savedTrips;
  if (Array.isArray(data?.data?.blogs)) return data.data.blogs;
  return [];
}

export async function getBookedTrips() {
  const res = await fetch(buildApiUrl("/api/userdashboard/BookedTrips"), {
    credentials: "include",
  });
  const data = await handleResponse(res, "Booked trips could not be loaded.", "getBookedTrips");
  return getArray(data);
}

export async function getSavedTrips() {
  const res = await fetch(buildApiUrl("/api/userdashboard/savedTrips"), {
    credentials: "include",
  });
  const data = await handleResponse(res, "Saved trips could not be loaded.", "getSavedTrips");
  return getArray(data);
}

export async function getLikedBlogs() {
  const res = await fetch(buildApiUrl("/api/userdashboard/blogLikes"), {
    credentials: "include",
  });
  const data = await handleResponse(res, "Liked blogs could not be loaded.", "getLikedBlogs");
  return getArray(data);
}

export async function saveTrip(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  const res = await fetch(buildApiUrl(`/api/userdashboard/saveTrips/${tripId}`), {
    method: "POST",
    credentials: "include",
  });

  return handleResponse(res, "Trip could not be saved.", "saveTrip");
}

export async function removeSavedTrip(tripId) {
  if (!tripId) {
    throw new Error("Trip ID is required.");
  }

  const res = await fetch(buildApiUrl(`/api/userdashboard/removeSavedTrip/${tripId}`), {
    method: "DELETE",
    credentials: "include",
  });

  return handleResponse(res, "Saved trip could not be removed.", "removeSavedTrip");
}

export async function updateProfilePicture(file) {
  if (!file) {
    throw new Error("Profile picture is required.");
  }

  const formData = new FormData();
  formData.append("profilePicture", file);

  const res = await fetch(buildApiUrl("/api/userdashboard/AddProfilePicture"), {
    method: "PATCH",
    credentials: "include",
    body: formData,
  });

  return handleResponse(res, "Profile picture could not be updated.", "updateProfilePicture");
}
