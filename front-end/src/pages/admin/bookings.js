import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { getAdminBookings, requireAdmin } from "@/services/adminService";

export default function AdminBookings({ admin, bookingData, initialError = "" }) {
  const { user, logout } = useAuth();

  return (
    <AdminLayout adminName={user?.name || admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        {initialError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {initialError}
          </p>
        )}
        <div>
          {bookingData.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {bookingData.map((booking) => (
                <li key={booking.id} className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900">{booking.customer}</h3>
                  <h2 className="text-lg font-semibold text-slate-900">{booking.destination}</h2>
                  <p className="text-sm text-slate-500">Status: {booking.status}</p>
                  <p className="text-slate-600">{booking.details}</p>
                  <p className="text-sm text-slate-500">Payment: {booking.paymentStatus}</p>
                  <p className="text-sm text-slate-500">Total: {booking.currency} {booking.totalPrice.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Created At: {new Date(booking.createdAt).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-600 text-center">No bookings found.</p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

function mapBooking(booking) {
  const trip = Array.isArray(booking.trip) ? booking.trip[0] : booking.trip;
  const customer = booking.user || booking.userId;

  return {
    id: booking._id || booking.id,
    customer: customer?.name || customer?.email || "Guest",
    destination: trip?.name || trip?.city || booking.details?.bookingType || "KEMET Experience",
    details: booking.details?.bookingType || "Booking",
    status: booking.status || "Pending",
    paymentStatus: booking.paymentStatus || "Pending",
    totalPrice: Number(booking.totalPrice || 0),
    currency: booking.currency || "EGP",
    createdAt: booking.createdAt || null,
  };
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const bookings = await getAdminBookings(adminSession.cookie);
    return {
      props: {
        admin: adminSession.admin,
        bookingData: bookings.map(mapBooking),
        initialError: "",
      },
    };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return {
      props: {
        admin: adminSession.admin,
        bookingData: [],
        initialError: error.message || "Bookings could not be loaded.",
      },
    };
  }
}
