const API_BASE_URL = "https://kemet-two.vercel.app/";

export const USER_ROLES = ["user", "admin", "guide"];

function getUserArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.data)) return data.data;
  return [];
}

async function handleResponse(res, fallbackMessage, logLabel = "userServices") {
  const data = await res.json().catch(() => null);

  console.log(`[${logLabel}] response status:`, res.status);
  console.log(`[${logLabel}] response body:`, data);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

export async function getAllUsers(cookie = "") {
  const endpoint = `${API_BASE_URL}/api/adminDashboard/AllUsers`;
  console.log("[getAllUsers] endpoint URL:", endpoint);

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

  const endpoint = `$/api/admin/updateUserRole`;
  const payload = { userId, role };

  console.log("[updateUserRole] endpoint URL:", endpoint);
  console.log("[updateUserRole] payload:", payload);

  const res = await fetch(endpoint, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  return handleResponse(res, "User role could not be updated.", "updateUserRole");
}
