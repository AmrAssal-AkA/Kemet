const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const USER_ROLES = ["user", "admin", "guide"];

function getUserArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

async function handleResponse(res, fallbackMessage, logLabel = "userServices") {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error(`[${logLabel}]`, {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

export async function getAllUsers(cookie = "") {
  const endpoint = `${API_BASE_URL}/api/adminDashboard/AllUsers`;
  const res = await fetch(endpoint, {
    headers: cookie ? { Cookie: cookie } : {},
    credentials: "include",
  });

  const data = await handleResponse(res, "Users could not be loaded.", "getAllUsers");
  return getUserArray(data).filter((user) => ["user", "guide"].includes(user.role));
}

export async function updateUserRole(userId, role) {
  if (!userId) {
    throw new Error("User ID is required.");
  }

  if (!USER_ROLES.includes(role)) {
    throw new Error("Invalid role selected.");
  }

  const endpoint = `${API_BASE_URL}/api/adminDashboard/upgradeUser/${userId}`;
  const payload = { role };
  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "User role could not be updated.", "updateUserRole");
}
