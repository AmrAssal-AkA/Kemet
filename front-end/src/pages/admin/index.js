import { useEffect, useState } from "react";

import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import {
  getAdminBookingDetails,
  getAdminContacts,
  getAdminUsers,
  getBlogStats,
  requireAdmin,
  getRevenueStats,
  getTripStats,
} from "@/services/adminService";

function StatCard({ card }) {
  return (
    <article className="min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
            {card.title}
          </p>
          <p className="mt-2 break-words text-3xl font-bold text-slate-900 sm:text-4xl">{card.value}</p>
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
  const normalized = String(status || "").toLowerCase();
  const isConfirmed = ["confirmed", "paid", "completed", "success", "succeeded"].includes(normalized);
  const isCancelled = ["cancelled", "canceled", "failed", "declined"].includes(normalized);

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        isCancelled
          ? "bg-red-50 text-red-600"
          : isConfirmed
            ? "bg-emerald-50 text-emerald-600"
            : "bg-amber-50 text-amber-600"
      }`}
    >
      {status || "Not provided"}
    </span>
  );
}

function RecentBookingsTable({ initialBookings = [], initialError = "" }) {
  const [recentBookings, setRecentBookings] = useState(initialBookings);
  const [isLoading, setIsLoading] = useState(initialBookings.length === 0 && !initialError);
  const [error, setError] = useState(initialError);

  useEffect(() => {
    let isMounted = true;

    async function loadRecentBookings() {
      setIsLoading(true);

      try {
        const bookings = await getAdminBookingDetails();
        if (!isMounted) return;
        setRecentBookings(getRecentBookings(bookings));
        setError("");
      } catch (loadError) {
        if (!isMounted) return;
        setError("Could not load bookings.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadRecentBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="max-h-[34rem] w-full overflow-auto">
      <table className="w-full min-w-[1024px]">
        <thead>
          <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-[0.14em] text-slate-400">
            <th className="sticky top-0 bg-white pb-3 pr-4">Booking ID</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Customer Email</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Trip title / destination</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Trip Date</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Duration</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Guests</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Total Price</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Payment Status</th>
            <th className="sticky top-0 bg-white pb-3 pr-4">Booking Status</th>
            <th className="sticky top-0 bg-white pb-3">Created Date</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && recentBookings.length === 0 && (
            <tr>
              <td className="py-5 text-sm text-slate-500" colSpan={10}>
                Loading recent bookings...
              </td>
            </tr>
          )}
          {!isLoading && error && (
            <tr>
              <td className="py-5 text-sm text-red-600" colSpan={10}>
                {error}
              </td>
            </tr>
          )}
          {!isLoading &&
            !error &&
            recentBookings.map((booking) => (
              <tr key={booking.rowKey} className="border-b border-slate-100 last:border-0">
                <td className="max-w-44 truncate py-4 pr-4 font-mono text-xs text-slate-500">
                  {booking.id}
                </td>
                <td className="py-4 pr-4 font-semibold text-slate-800">
                  {booking.customerEmail}
                </td>
                <td className="py-4 pr-4 text-slate-600">{booking.tripTitle}</td>
                <td className="py-4 pr-4 text-slate-600">{booking.tripDate}</td>
                <td className="py-4 pr-4 text-slate-600">{booking.tripDuration}</td>
                <td className="py-4 pr-4 text-slate-600">{booking.guests}</td>
                <td className="py-4 pr-4 font-semibold text-slate-700">
                  {booking.totalPrice}
                </td>
                <td className="py-4 pr-4">
                  <BookingStatus status={booking.paymentStatus} />
                </td>
                <td className="py-4 pr-4">
                  <BookingStatus status={booking.bookingStatus} />
                </td>
                <td className="py-4 text-slate-600">
                  {booking.createdDate}
                </td>
              </tr>
            ))}
          {!isLoading && !error && recentBookings.length === 0 && (
            <tr>
              <td className="py-5 text-sm text-slate-500" colSpan={9}>
                No bookings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard({ admin, contacts, loadError, recentBookingsError }) {
  const { logout } = useAuth();

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl bg-[#0b1d3a] p-5 text-white shadow-sm sm:p-8">
        <h1 className="break-words text-3xl font-bold sm:text-4xl">Welcome back, {admin?.name}</h1>
        <p className="mt-3 max-w-2xl text-slate-200">
          Live KEMET admin overview from your current trips, users, bookings,
          and revenue APIs.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <div className="min-w-0 flex-1 rounded-2xl bg-white/10 px-5 py-3 sm:flex-none">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Users and guides</p>
            <p className="mt-1 text-3xl font-bold">{admin.metrics.users.toLocaleString()}</p>
          </div>
          <div className="min-w-0 flex-1 rounded-2xl bg-white/10 px-5 py-3 sm:flex-none">
            <p className="text-xs uppercase tracking-[0.14em] text-slate-300">Pending inquiries</p>
            <p className="mt-1 text-3xl font-bold">{contacts.length.toLocaleString()}</p>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {admin.statCards.map((card) => (
          <StatCard key={card.title} card={card} />
        ))}
      </section>

      {loadError && (
        <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-700">
          {loadError}
        </p>
      )}

      <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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

      <section className="mt-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Bookings</h3>
            <p className="text-sm text-slate-500">Newest bookings from the admin API</p>
          </div>
          <RecentBookingsTable
            initialBookings={admin.recentBookings}
            initialError={recentBookingsError}
          />
        </div>
      </section>
    </AdminLayout>
  );
}

function formatDate(value) {
  if (!value) return "Not provided";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Not provided";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getFirstValue(values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function getBookingId(booking) {
  return booking._id || booking.bookingId || booking.id || "Not provided";
}

function getBookingDate(booking) {
  return booking.createdAt || booking.created || booking.created_at || booking.date || "";
}

function getTripDate(booking) {
  return getFirstValue([
    booking.tripDate,
    booking.trip_date,
    booking.tripSchedule?.date,
  ]);
}

function formatDurationDays(value) {
  const days = Number(value);
  if (!Number.isInteger(days) || days < 1) return "Not provided";

  return `${days} ${days === 1 ? "day" : "days"}`;
}

function getTripDurationDays(booking) {
  return getFirstValue([
    booking.tripDurationDays,
    booking.trip_duration_days,
    booking.durationDays,
  ]);
}

function getCustomerEmail(booking) {
  const user = booking.user || {};
  const customer = booking.customer || {};
  const userId = booking.userId || {};
  return getFirstValue([
    booking.userEmail,
    booking.customerEmail,
    booking.email,
    user?.email,
    customer?.email,
    userId?.email,
  ]) || "Not provided";
}

function getTripTitle(booking) {
  const trip = Array.isArray(booking.trip) ? booking.trip[0] : booking.trip;
  const item = Array.isArray(booking.items) ? booking.items[0] : booking.items;
  const tripId = booking.tripId || booking.tripID || booking.trip_id;
  const tripTitle = getFirstValue([
    trip?.name,
    trip?.title,
    booking.tripName,
    booking.tripTitle,
    item?.name,
    item?.title,
  ]);

  if (tripTitle) return tripTitle;
  if (typeof trip === "string") return `Trip ID: ${trip}`;
  if (typeof tripId === "string") return `Trip ID: ${tripId}`;
  if (trip?._id || trip?.id) return `Trip ID: ${trip._id || trip.id}`;
  if (tripId?._id || tripId?.id) return `Trip ID: ${tripId._id || tripId.id}`;

  return "Not provided";
}

function getGuestCount(booking) {
  if (booking.guestCount !== undefined && booking.guestCount !== null) {
    return booking.guestCount;
  }

  if (Array.isArray(booking.guests)) {
    return booking.guests.length;
  }

  return "Not provided";
}

function formatCurrency(value) {
  if (value === undefined || value === null || value === "") return "Not provided";

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);

  return `EGP ${numericValue.toLocaleString()}`;
}

function getTotalPrice(booking) {
  return formatCurrency(
    getFirstValue([
      booking.totalPrice,
      booking.total,
      booking.amount,
    ])
  );
}

function getPaymentStatus(booking) {
  return getFirstValue([
    booking.paymentStatus,
    booking.payment?.status,
  ]) || "Not provided";
}

function mapBooking(booking, index) {
  return {
    rowKey: getBookingId(booking) !== "Not provided" ? getBookingId(booking) : `booking-${index}`,
    id: getBookingId(booking),
    customerEmail: getCustomerEmail(booking),
    tripTitle: getTripTitle(booking),
    tripDate: formatDate(getTripDate(booking)),
    tripDuration: formatDurationDays(getTripDurationDays(booking)),
    guests: getGuestCount(booking),
    totalPrice: getTotalPrice(booking),
    paymentStatus: getPaymentStatus(booking),
    bookingStatus: booking.status || "Not provided",
    createdDate: formatDate(getBookingDate(booking)),
  };
}

function getRecentBookings(bookings) {
  return [...bookings]
    .sort((first, second) => {
      const firstDate = new Date(getBookingDate(first)).getTime();
      const secondDate = new Date(getBookingDate(second)).getTime();
      const safeFirstDate = Number.isNaN(firstDate) ? 0 : firstDate;
      const safeSecondDate = Number.isNaN(secondDate) ? 0 : secondDate;
      return safeSecondDate - safeFirstDate;
    })
    .map(mapBooking);
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
      getAdminBookingDetails(cookieHeader),
      getTripStats(cookieHeader),
      getBlogStats(cookieHeader),
      getRevenueStats(cookieHeader),
    ]);

    const failedLoads = results.filter((result) => result.status === "rejected");
    const contacts = results[0].status === "fulfilled" ? results[0].value : [];
    const users = results[1].status === "fulfilled" ? results[1].value : [];
    const bookings = results[2].status === "fulfilled" ? results[2].value : [];
    const recentBookingsError =
      results[2].status === "rejected" ? "Could not load bookings." : "";
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
          recentBookings: getRecentBookings(bookings),
        },
        contacts,
        recentBookingsError,
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
        recentBookingsError: "Could not load bookings.",
        loadError: error.message || "Admin overview data could not be loaded.",
      },
    };
  }
}
