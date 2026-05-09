import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminBookings,
  getAdminContacts,
  getAdminUsers,
  getBlogStats,
  requireAdmin,
  getRevenueStats,
  getTripStats,
} from "@/services/adminService";

function StatCard({ card }) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {card.title}
          </p>
          <p className="mt-2 text-4xl font-bold text-slate-900">{card.value}</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          {card.growth}
        </span>
      </div>
      {card.avatars ? (
        <div className="mt-6 flex items-center">
          <div className="flex -space-x-2">
            {card.avatars.map((avatar) => (
              <span
                key={avatar}
                className="grid h-8 w-8 place-items-center rounded-full border-2 border-white bg-slate-200 text-xs font-semibold text-slate-700"
              >
                {avatar}
              </span>
            ))}
          </div>
          <span className="ml-3 text-xs text-slate-500">Live</span>
        </div>
      ) : (
        <div className="mt-6 flex items-end gap-2">
          {card.bars.length > 0 ? (
            card.bars.map((height, index) => (
              <span
                key={`${card.title}-${index}`}
                className={`w-8 rounded-md ${height} ${card.color} opacity-${index === card.bars.length - 1 ? "100" : "50"}`}
              />
            ))
          ) : (
            <span className="text-sm font-semibold text-slate-400">No data</span>
          )}
        </div>
      )}
    </article>
  );
}

function BookingStatus({ status }) {
  const isConfirmed = status === "Confirmed";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isConfirmed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
      }`}
    >
      {status}
    </span>
  );
}

export default function AdminDashboard({ admin, contacts, loadError }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl bg-[#0b1d3a] p-8 text-white shadow-sm">
        <h1 className="text-4xl font-bold">Welcome back, {admin?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Live KEMET admin overview from your current trips, users, bookings,
          and revenue APIs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-white/10 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Users and guides</p>
            <p className="mt-1 text-3xl font-bold">{admin.metrics.users.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl bg-white/10 px-5 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Pending inquiries</p>
            <p className="mt-1 text-3xl font-bold">{contacts.length.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        {admin.statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </section>

      {loadError && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          {loadError}
        </p>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Engagement Trends</h2>
            <p className="text-sm text-slate-500">Real activity based on recent bookings</p>
          </div>
          <div className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-500">30d</div>
        </div>

        {admin.activityBars.length > 0 ? (
          <div className="mt-8 flex h-60 items-end gap-3 overflow-hidden">
            {admin.activityBars.map((value, index) => (
              <span
                key={`trend-${index}`}
                className="flex-1 rounded-t-full bg-linear-to-t from-amber-200 to-amber-400"
                style={{ height: `${Math.max(value, 4)}%` }}
              />
            ))}
          </div>
        ) : (
          <p className="mt-8 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            No activity data yet.
          </p>
        )}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-140">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-[0.14em] text-slate-400">
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Destination</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {admin.recentBookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100">
                    <td className="py-4 pr-3 font-semibold text-slate-800">{booking.customer}</td>
                    <td className="py-4 pr-3 text-slate-600">{booking.destination}</td>
                    <td className="py-4 pr-3 text-slate-600">{booking.date}</td>
                    <td className="py-4">
                      <BookingStatus status={booking.status} />
                    </td>
                  </tr>
                ))}
                {admin.recentBookings.length === 0 && (
                  <tr>
                    <td className="py-5 text-sm text-slate-500" colSpan={4}>
                      No bookings found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900">Customer Contact</h3>
          <div className="mt-4 space-y-4">
            {contacts.slice(0, 5).map((contact) => (
              <div key={contact._id || contact.id || contact.email} className="rounded-lg bg-slate-50 p-4">
                <p className="font-semibold text-slate-800">{contact.name}</p>
                <p className="text-sm text-slate-500">{contact.subject}</p>
              </div>
            ))}
            {contacts.length === 0 && (
              <p className="rounded-lg bg-slate-50 p-4 text-sm text-slate-500">
                No customer contacts found.
              </p>
            )}
          </div>
        </aside>
      </section>
    </AdminLayout>
  );
}

function formatDate(value) {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function mapBooking(booking) {
  const trip = Array.isArray(booking.trip) ? booking.trip[0] : booking.trip;
  const customer = booking.user || booking.userId;

  return {
    id: booking._id || booking.id,
    customer: customer?.name || customer?.email || "Guest",
    destination: trip?.name || trip?.city || booking.details?.bookingType || "KEMET Experience",
    date: formatDate(booking.createdAt),
    status: booking.status || "Pending",
  };
}

function getRealRevenueValue(revenueStats) {
  const rawRevenue =
    revenueStats?.totalRevenue ??
    revenueStats?.revenue ??
    revenueStats?.data?.totalRevenue ??
    revenueStats?.data?.revenue;

  return Number(rawRevenue || 0);
}

function buildActivityBars(bookings) {
  if (!bookings.length) return [];

  const dayCounts = new Map();
  const today = new Date();
  const days = Array.from({ length: 10 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (9 - index));
    const key = date.toISOString().slice(0, 10);
    dayCounts.set(key, 0);
    return key;
  });

  bookings.forEach((booking) => {
    const date = new Date(booking.createdAt);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toISOString().slice(0, 10);
    if (dayCounts.has(key)) dayCounts.set(key, dayCounts.get(key) + 1);
  });

  const max = Math.max(...dayCounts.values(), 0);
  if (max === 0) return [];

  return days.map((day) => Math.round((dayCounts.get(day) / max) * 100));
}

function buildStatCards(metrics) {
  return [
    {
      title: "Total Bookings",
      value: metrics.bookings.toLocaleString(),
      growth: "Live",
      bars: metrics.bookings > 0 ? ["h-4", "h-6", "h-8", "h-10"] : [],
      color: "bg-emerald-400",
    },
    {
      title: "Revenue",
      value: metrics.revenue > 0 ? `EGP ${metrics.revenue.toLocaleString()}` : "EGP 0",
      growth: metrics.revenue > 0 ? "Live" : "No revenue yet",
      bars: metrics.revenue > 0 ? ["h-3", "h-5", "h-7", "h-9"] : [],
      color: "bg-amber-400",
    },
    {
      title: "Active Users",
      value: metrics.users.toLocaleString(),
      growth: `${metrics.trips.toLocaleString()} trips`,
      avatars: ["KM", "EG", "TR"],
    },
  ];
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const { admin: user, cookie: cookieHeader } = adminSession;
    const results = await Promise.allSettled([
      getAdminContacts(cookieHeader),
      getAdminUsers(cookieHeader),
      getAdminBookings(cookieHeader),
      getTripStats(cookieHeader),
      getBlogStats(cookieHeader),
      getRevenueStats(cookieHeader),
    ]);

    const failedLoads = results.filter((result) => result.status === "rejected");
    const contacts = results[0].status === "fulfilled" ? results[0].value : [];
    const users = results[1].status === "fulfilled" ? results[1].value : [];
    const bookings = results[2].status === "fulfilled" ? results[2].value : [];
    const tripStats = results[3].status === "fulfilled" ? results[3].value : {};
    const blogStats = results[4].status === "fulfilled" ? results[4].value : {};
    const revenueStats = results[5].status === "fulfilled" ? results[5].value : {};
    const endpointRevenue = getRealRevenueValue(revenueStats);

    const metrics = {
      bookings: Number(bookings.length || 0),
      trips: Number(tripStats.totalTrips || 0),
      users: Number(users.length || tripStats.totalUsers || 0),
      blogs: Number(blogStats.totalBlogs || 0),
      revenue: endpointRevenue,
    };

    return {
      props: {
        admin: {
          ...user,
          metrics,
          statCards: buildStatCards(metrics),
          activityBars: buildActivityBars(bookings),
          recentBookings: bookings.slice(0, 5).map(mapBooking),
        },
        contacts,
        loadError: failedLoads.length
          ? "Some admin overview data could not be loaded. Showing available real data only."
          : "",
      },
    };
  } catch (error) {
    console.error("Admin overview data error:", error.message);
    const metrics = {
      bookings: 0,
      trips: 0,
      users: 0,
      blogs: 0,
      revenue: 0,
    };
    return {
      props: {
        admin: {
          ...adminSession.admin,
          metrics,
          statCards: buildStatCards(metrics),
          activityBars: [],
          recentBookings: [],
        },
        contacts: [],
        loadError: error.message || "Admin overview data could not be loaded.",
      },
    };
  }
}
