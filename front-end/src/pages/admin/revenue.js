import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { getRevenueStats, requireAdmin } from "@/services/adminService";

const revenueCards = [
  { key: "totalRevenue", label: "Total Revenue" },
  { key: "kemetRevenue", label: "Kemet Revenue / Profit" },
  { key: "hotelExpenses", label: "Hotel Expenses" },
  { key: "flightExpenses", label: "Flight Expenses" },
  { key: "refundsTotal", label: "Refunds Total" },
];

function formatMoney(value) {
  return `EGP ${Number(value || 0).toLocaleString()}`;
}

function normalizeRevenueStats(revenueStats) {
  const data = revenueStats?.data || revenueStats || {};

  return {
    totalRevenue: Number(data.totalRevenue ?? data.revenue ?? 0),
    kemetRevenue: Number(data.kemetRevenue ?? data.profit ?? 0),
    hotelExpenses: Number(data.hotelExpenses ?? 0),
    flightExpenses: Number(data.flightExpenses ?? 0),
    refundsTotal: Number(data.refundsTotal ?? 0),
    validBookingCount: Number(data.validBookingCount ?? 0),
    refundedBookingCount: Number(data.refundedBookingCount ?? 0),
  };
}

export default function AdminRevenue({
  admin,
  revenueStats = normalizeRevenueStats(),
  initialError = "",
}) {
  const { logout } = useAuth();
  const hasRevenue = Number(revenueStats.totalRevenue || 0) > 0;

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Revenue</h1>
        {initialError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {initialError}
          </p>
        )}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {revenueCards.map((card) => (
            <article
              key={card.key}
              className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 break-words text-3xl font-extrabold text-slate-900">
                {formatMoney(revenueStats[card.key])}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-600">
          <p>
            {hasRevenue
              ? `${revenueStats.validBookingCount.toLocaleString()} confirmed paid bookings counted as active revenue.`
              : "No active confirmed paid revenue yet."}
          </p>
          <p className="mt-2">
            {revenueStats.refundedBookingCount.toLocaleString()} cancelled or
            refunded bookings tracked separately.
          </p>
          {(revenueStats.hotelExpenses === 0 ||
            revenueStats.flightExpenses === 0) && (
            <p className="mt-2 text-slate-500">
              Kemet Revenue may be approximate because no saved hotel and/or
              flight expense fields were found for the counted bookings.
            </p>
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
    const revenueStats = await getRevenueStats(adminSession.cookie);

    return {
      props: {
        admin: adminSession.admin,
        revenueStats: normalizeRevenueStats(revenueStats),
        initialError: "",
      },
    };
  } catch (error) {
    console.error("Admin verification error:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        revenueStats: normalizeRevenueStats(),
        initialError: error.message || "Revenue could not be loaded.",
      },
    };
  }
}
