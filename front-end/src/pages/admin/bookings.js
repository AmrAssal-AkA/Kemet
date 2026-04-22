import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";

export default function AdminBookings({ bookingData }) {
  const {user, logout } = useAuth();

  return (
    <AdminLayout adminName={user?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <div>
          {bookingData.length > 0 ? (
            <ul className="mt-4 space-y-4">
              {bookingData.map((booking) => (
                <li key={booking.id} className="border border-slate-200 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-slate-900">{booking.user}</h3>
                  <h2 className="text-lg font-semibold text-slate-900">{booking.title}</h2>
                  <p className="text-sm text-slate-500">Status: {booking.status}</p>
                  <p className="text-slate-600">{booking.details}</p>
                  <p className="text-sm text-slate-500">Status: {booking.status}</p>
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

export async function getServerSideProps(context) {
  const { req } = context;

  try{
    const response = await fetch("http://localhost:3000/api/admin/getBookingDetails", {
      headers: {
        Cookie: req.headers.cookie || "",
      },
    });
    const data = await response.json();
    return {
      props: {
        bookingData: data.bookings || [], 
      },
    };
  } catch (error) {
    console.error("Error fetching booking details:", error);
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }
}
