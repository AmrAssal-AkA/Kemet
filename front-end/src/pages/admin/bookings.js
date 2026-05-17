import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import {
  confirmAdminBooking,
  getAdminBookings,
  requireAdmin,
} from "@/services/adminService";

const PENDING_STATUSES = ["pending", "waiting for confirmation"];
const CONFIRMED_STATUSES = ["confirmed"];

function isPendingBooking(booking) {
  return PENDING_STATUSES.includes(String(booking.status || "").trim().toLowerCase());
}

function isConfirmedBooking(booking) {
  return CONFIRMED_STATUSES.includes(String(booking.status || "").trim().toLowerCase());
}

function isVisibleBooking(booking) {
  return isPendingBooking(booking) || isConfirmedBooking(booking);
}

function getBookingId(booking) {
  return booking._id || booking.bookingId || booking.id || "";
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString();
}

function formatTotalPrice(amount, currency) {
  if (amount === null || amount === undefined || amount === "") return "N/A";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return String(amount);

  return `${currency || "EGP"} ${numericAmount.toLocaleString()}`;
}

function getFirstValue(values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function normalizePaymentStatus(value) {
  if (!value) return "Not provided";

  const normalized = String(value).trim().toLowerCase();

  if (["paid", "succeeded", "complete"].includes(normalized)) return "Paid";
  if (normalized === "pending") return "Pending";

  return String(value);
}

function getPaymentStatus(booking) {
  const statuses = [
    booking.paymentStatus,
    booking.payment?.status,
    booking.payment?.paymentStatus,
    booking.payment_status,
    booking.stripePaymentStatus,
    booking.checkoutSession?.payment_status,
    booking.transaction?.status,
    booking.paymentIntent?.status,
  ].filter((value) => value !== undefined && value !== null && value !== "");
  const normalizedStatuses = statuses.map((value) => String(value).trim().toLowerCase());
  const paidStatus = normalizedStatuses.find((value) =>
    ["paid", "succeeded", "complete"].includes(value),
  );
  const pendingStatus = normalizedStatuses.find((value) => value === "pending");

  if (paidStatus) return "Paid";
  if (pendingStatus) return "Pending";

  return normalizePaymentStatus(statuses[0]);
}

function getTripTitle(booking) {
  const trip = Array.isArray(booking.trip) ? booking.trip[0] : booking.trip;
  const item = Array.isArray(booking.items) ? booking.items[0] : booking.items;
  const packageDetails = booking.package;
  const tripTitle = getFirstValue([
    trip?.name,
    trip?.title,
    booking.tripName,
    booking.tripTitle,
    item?.name,
    item?.title,
    packageDetails?.name,
    packageDetails?.title,
  ]);

  if (tripTitle) return tripTitle;
  if (typeof trip === "string") return `Trip ID: ${trip}`;
  if (trip?._id || trip?.id) return `Trip ID: ${trip._id || trip.id}`;

  return "Not provided";
}

function getGuestCount(booking) {
  if (booking.guestCount !== undefined && booking.guestCount !== null) {
    return booking.guestCount;
  }
  if (Array.isArray(booking.guests)) return booking.guests.length;
  if (Array.isArray(booking.guestDetails)) return booking.guestDetails.length;
  if (Array.isArray(booking.travelers)) return booking.travelers.length;
  if (Array.isArray(booking.passengers)) return booking.passengers.length;
  if (booking.numberOfGuests !== undefined && booking.numberOfGuests !== null) {
    return booking.numberOfGuests;
  }
  if (booking.guestsCount !== undefined && booking.guestsCount !== null) {
    return booking.guestsCount;
  }
  if (booking.NumberOfGuests !== undefined && booking.NumberOfGuests !== null) {
    return booking.NumberOfGuests;
  }
  if (booking.PassportNumber || booking.passportNumber) return "1";

  return "Not provided";
}

function mapBooking(booking) {
  const customer = booking.user || booking.customer || booking.userId || {};

  return {
    id: getBookingId(booking),
    customerName:
      customer?.name ||
      booking.userName ||
      booking.customerName ||
      booking.name ||
      "",
    customerEmail:
      booking.userEmail ||
      booking.customerEmail ||
      booking.email ||
      customer?.email ||
      "",
    tripName: getTripTitle(booking),
    guestCount: getGuestCount(booking),
    totalPrice: formatTotalPrice(
      booking.totalPrice ?? booking.price ?? booking.amount,
      booking.currency,
    ),
    paymentStatus: getPaymentStatus(booking),
    status: booking.status || "Pending",
    createdDate: formatDate(booking.createdAt || booking.created_at || booking.date),
  };
}

export default function AdminBookings({ admin }) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [confirmStatus, setConfirmStatus] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const displayedBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return bookings
      .filter(isVisibleBooking)
      .filter((booking) => {
        if (!normalizedSearch) return true;
        return String(getBookingId(booking)).toLowerCase().includes(normalizedSearch);
      })
      .map(mapBooking);
  }, [bookings, searchQuery]);

  const pendingBookings = useMemo(
    () => displayedBookings.filter(isPendingBooking),
    [displayedBookings],
  );
  const confirmedBookings = useMemo(
    () => displayedBookings.filter(isConfirmedBooking),
    [displayedBookings],
  );
  const hasActiveSearch = searchQuery.trim().length > 0;

  useEffect(() => {
    let isMounted = true;

    async function loadPendingBookings() {
      setIsLoading(true);
      setPageError("");

      try {
        const bookingDetails = await getAdminBookings();
        if (isMounted) setBookings(bookingDetails);
      } catch (error) {
        if (isMounted) {
          setPageError(error.message || "Pending bookings could not be loaded.");
          setBookings([]);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadPendingBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleConfirmBooking = async (bookingId) => {
    setSuccessMessage("");
    setPageError("");
    setConfirmStatus((current) => ({
      ...current,
      [bookingId]: { loading: true, error: "" },
    }));

    try {
      await confirmAdminBooking(bookingId);
      setBookings((current) =>
        current.map((booking) =>
          (booking._id || booking.id || booking.bookingId) === bookingId
            ? { ...booking, status: "Confirmed" }
            : booking,
        ),
      );
      setSuccessMessage("Booking confirmed successfully.");
      toast.success("Booking confirmed successfully.");
    } catch (error) {
      const message = error.message || "Booking could not be confirmed.";
      setConfirmStatus((current) => ({
        ...current,
        [bookingId]: { loading: false, error: message },
      }));
      toast.error(message);
      return;
    }

    setConfirmStatus((current) => ({
      ...current,
      [bookingId]: { loading: false, error: "" },
    }));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchQuery(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const renderBookingCard = (booking, index) => {
    const status = confirmStatus[booking.id] || {};
    const canConfirm = isPendingBooking(booking);

    return (
      <li
        key={booking.id || `booking-${index}`}
        className="rounded-2xl border border-slate-200 p-4 transition hover:border-amber-200 hover:shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Booking ID: {booking.id || "N/A"}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">
              {booking.tripName}
            </h2>
            <p className="mt-1 text-sm font-medium text-slate-700">
              Customer Email: {booking.customerEmail || "Not provided"}
            </p>
          </div>

          {canConfirm && (
            <button
              type="button"
              onClick={() => handleConfirmBooking(booking.id)}
              disabled={!booking.id || status.loading}
              className="rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {status.loading ? "Confirming..." : "Confirm Booking"}
            </button>
          )}
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">Guests</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.guestCount}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Total price
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.totalPrice}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">Payment</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.paymentStatus}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">Status</dt>
            <dd
              className={`mt-1 text-sm font-semibold ${
                isConfirmedBooking(booking) ? "text-emerald-700" : "text-amber-700"
              }`}
            >
              {booking.status}
            </dd>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">Created</dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.createdDate}
            </dd>
          </div>
        </dl>

        {status.error && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {status.error}
          </p>
        )}
      </li>
    );
  };

  return (
    <AdminLayout adminName={user?.name || admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Pending and confirmed customer bookings from the admin booking endpoint.
            </p>
          </div>
          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
            {pendingBookings.length} pending / {confirmedBookings.length} confirmed
          </span>
        </div>

        <form
          onSubmit={handleSearch}
          className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50 p-4 sm:flex-row sm:items-center"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by Booking ID"
            className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
          <button
            type="submit"
            className="rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52]"
          >
            Search
          </button>
          {hasActiveSearch && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-100"
            >
              Clear
            </button>
          )}
        </form>

        {pageError && (
          <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {pageError}
          </p>
        )}

        {successMessage && (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        )}

        {isLoading ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
            Loading bookings...
          </p>
        ) : displayedBookings.length > 0 ? (
          <div className="mt-5 space-y-8">
            {pendingBookings.length > 0 && (
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">
                    Waiting for Confirmation
                  </h2>
                  <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                    {pendingBookings.length}
                  </span>
                </div>
                <ul className="mt-3 space-y-4">
                  {pendingBookings.map((booking, index) =>
                    renderBookingCard(booking, index),
                  )}
                </ul>
              </section>
            )}

            {confirmedBookings.length > 0 && (
              <section>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900">
                    Confirmed Bookings
                  </h2>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {confirmedBookings.length}
                  </span>
                </div>
                <ul className="mt-3 space-y-4">
                  {confirmedBookings.map((booking, index) =>
                    renderBookingCard(booking, index),
                  )}
                </ul>
              </section>
            )}
          </div>
        ) : pageError ? null : (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
            {hasActiveSearch
              ? "No booking found for this ID."
              : "No pending or confirmed bookings found."}
          </p>
        )}
      </section>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  return {
    props: {
      admin: adminSession.admin,
    },
  };
}
