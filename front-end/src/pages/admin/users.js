import { useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { requireAdmin } from "@/services/adminService";
import { getAllUsers, updateUserRole, USER_ROLES } from "@/services/userServices";

function getRole(user) {
  if (user?.isAdmin === true) return "admin";
  return String(user?.role || user?.userRole || user?.type || "user").toLowerCase();
}

export default function AdminUsers({ admin, AllUser, initialError = "" }) {
  const { logout } = useAuth();
  const [users, setUsers] = useState(AllUser || []);
  const [roleStatus, setRoleStatus] = useState({});
  const [pageError, setPageError] = useState(initialError);
  const [isLoading, setIsLoading] = useState(false);
  const canChangeRoles = getRole(admin) === "admin";

  const handleRefresh = async () => {
    setIsLoading(true);
    setPageError("");
    try {
      setUsers(await getAllUsers());
    } catch (error) {
      setPageError(error.message || "Users could not be loaded.");
      toast.error("Failed to load users.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, role) => {
    setRoleStatus((current) => ({
      ...current,
      [userId]: { loading: true, success: "", error: "" },
    }));

    try {
      await updateUserRole(userId, role);
      setUsers((current) =>
        current.map((user) =>
          user._id === userId ? { ...user, role, isAdmin: role === "admin" } : user,
        ),
      );
      setRoleStatus((current) => ({
        ...current,
        [userId]: { loading: false, success: "Role updated.", error: "" },
      }));
      toast.success("Role updated successfully.");
    } catch (error) {
      setRoleStatus((current) => ({
        ...current,
        [userId]: {
          loading: false,
          success: "",
          error: error.message || "Role update failed.",
        },
      }));
      toast.error("Failed to update role.");
    }
  };

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
            <p className="mt-1 text-sm text-slate-500">
              Normal users and guide accounts from the admin account endpoint.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
            {users.length} accounts
          </span>
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isLoading}
            className="rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {pageError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {pageError}
          </p>
        )}

        <div>
          {isLoading ? (
            <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
              Loading accounts...
            </p>
          ) : users.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {users.map((user) => {
                const status = roleStatus[user._id] || {};

                return (
                  <li
                    key={user._id}
                    className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500">{user.email}</p>
                      {user.phone && <p className="text-sm text-slate-500">{user.phone}</p>}
                      <p className="mt-1 max-w-72 truncate text-xs text-slate-400">
                        ID: {user._id || user.userId || "N/A"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          getRole(user) === "guide"
                            ? "bg-blue-50 text-blue-600"
                            : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {getRole(user)}
                      </span>
                      <span className="text-sm text-slate-500">
                        {user.isVerified ? "Verified" : "Unverified"}
                      </span>
                      <select
                        value={getRole(user)}
                        disabled={!canChangeRoles || status.loading}
                        onChange={(event) => handleRoleChange(user._id, event.target.value)}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        {USER_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(status.loading || status.success || status.error) && (
                      <p
                        className={`text-sm font-medium ${
                          status.error ? "text-red-600" : "text-emerald-600"
                        }`}
                      >
                        {status.loading ? "Updating role..." : status.error || status.success}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : pageError ? null : (
            <p className="mt-4 text-sm text-slate-500">No users found.</p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const AllUser = await getAllUsers(adminSession.cookie);

    return {
      props: { admin: adminSession.admin, AllUser, initialError: "" },
    };
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        AllUser: [],
        initialError: error.message || "Users could not be loaded.",
      },
    };
  }
}
