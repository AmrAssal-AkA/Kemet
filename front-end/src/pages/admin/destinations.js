import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { requireAdmin } from "@/services/adminService";
import { getHiddenGems, getOfferings } from "@/services/contentServices";
import { getAdminTrips } from "@/services/tripServices";

export default function AdminDestinations({ admin, trips = [], hiddenGems = [], offerings = [], initialError = "" }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Destinations</h1>
        {initialError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {initialError}
          </p>
        )}
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Summary title="Trips" value={trips.length} />
          <Summary title="Hidden Gems" value={hiddenGems.length} />
          <Summary title="Offerings" value={offerings.length} />
        </div>
        {trips.length + hiddenGems.length + offerings.length === 0 && (
          <p className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
            No destination data found yet.
          </p>
        )}
      </section>
    </AdminLayout>
  );
}

function Summary({ title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const [trips, hiddenGems, offerings] = await Promise.all([
      getAdminTrips(adminSession.cookie),
      getHiddenGems(adminSession.cookie),
      getOfferings(adminSession.cookie),
    ]);
    const response = await fetch("http://localhost:3000/api/auth/refresh", {
      method: "POST",
      headers: {
        Cookie: cookie,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Session verification failed");
    }

    const data = await response.json();

    return {
      props: {
        admin: adminSession.admin,
        trips,
        hiddenGems,
        offerings,
        initialError: "",
      },
    };
  } catch (error) {
    console.error("Admin verification error:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        trips: [],
        hiddenGems: [],
        offerings: [],
        initialError: error.message || "Destination data could not be loaded.",
      },
    };
  }
}
