import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { getAdminBookings, getRevenueStats, requireAdmin } from "@/services/adminService";

export default function AdminRevenue({ admin, revenue = 0, paidBookings = 0, initialError = "" }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
        {initialError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {initialError}
          </p>
        )}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            Total Revenue
          </p>
          <p className="mt-2 text-4xl font-extrabold text-slate-900">
            EGP {Number(revenue || 0).toLocaleString()}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {paidBookings > 0 ? `${paidBookings} paid/confirmed bookings` : "No revenue yet."}
          </p>
        </div>
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const [revenueStats, bookings] = await Promise.all([
      getRevenueStats(adminSession.cookie),
      getAdminBookings(adminSession.cookie),
    ]);
    const paidBookings = bookings.filter((booking) => {
      const status = String(booking.status || "").toLowerCase();
      const paymentStatus = String(booking.paymentStatus || "").toLowerCase();
      return status === "confirmed" || paymentStatus === "paid";
    });
    const bookingRevenue = paidBookings.reduce(
      (total, booking) => total + Number(booking.totalPrice || 0),
      0,
    );

    return {
      props: {
        admin: adminSession.admin,
        revenue: bookingRevenue || Number(revenueStats.totalRevenue || 0),
        paidBookings: paidBookings.length,
        initialError: "",
      },
    };
  } catch (error) {
    console.error("Admin verification error:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        revenue: 0,
        paidBookings: 0,
        initialError: error.message || "Revenue could not be loaded.",
      },
    };
  }
}
