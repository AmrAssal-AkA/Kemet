import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

export default function AdminUsers({ AllUser }) {
  const { logout, user } = useAuth();

  return (
    <AdminLayout adminName={user?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <div>
          {AllUser.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {AllUser.map((user) => (
                <li
                  key={user._id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 p-4"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {user.name}
                    </p>
                    <p className="text-sm text-slate-500">{user.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isAdmin ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}
                  >
                    {user.isAdmin ? "Admin" : "User"}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-slate-500">No users found.</p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const { req } = context;

  try {
    const response = await axios.get(
      "http://localhost:3000/api/admin/getusers",
      {
        headers: {
          Cookie: req.headers.cookie || "",
        },
      },
    );
    const AllUser = response.data.users;

    return {
      props: { AllUser },
    };
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return {
      props: {
        AllUser: [],
      },
    };
  }
}
