export function extractUserFromAuthResponse(data) {
  const candidates = [
    data?.user,
    data?.data?.user,
    data?.data?.data?.user,
    data?.profile,
    data?.data?.profile,
    data?.currentUser,
    data?.data?.currentUser,
    data?.loggedInUser,
    data?.data?.loggedInUser,
    data?.data,
    data,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") continue;
    if (candidate.user && typeof candidate.user === "object") return candidate.user;
    if (
      candidate.email ||
      candidate.role ||
      candidate.userRole ||
      candidate.type ||
      candidate.isAdmin ||
      candidate.name ||
      candidate._id ||
      candidate.userId
    ) {
      return candidate;
    }
  }

  return null;
}

export function getUserRole(user) {
  if (user?.isAdmin === true) return "admin";
  return String(user?.role || user?.userRole || user?.type || "").toLowerCase();
}

export function getAuthRedirectPath(user) {
  const role = getUserRole(user);

  if (role === "admin") return "/admin";
  if (role === "guide" || role === "localguide") return "/guide/dashboard";
  if (user) return "/user-dashboard";
  return "/auth/auth";
}
