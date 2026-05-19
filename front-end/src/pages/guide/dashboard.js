import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { getUserRole } from "@/utils/authSession";
import {
  getGuideFee,
  getGuideProfile,
  getGuideRequiredTrips,
  setGuideSchedule,
} from "@/services/guideServices";

const days = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

const initialAvailability = {
  dayofweek: "Saturday",
  startTime: "09:00",
  endTime: "17:00",
  isAvailable: true,
};

const primaryButtonClass =
  "w-full rounded-full px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm shadow-amber-200 transition [background:linear-gradient(135deg,#FFCE2A_0%,#f5b800_100%)] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-200 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:[background:#cbd5e1] disabled:shadow-none disabled:hover:translate-y-0";

function StatCard({ label, value, note }) {
  return (
    <div className="h-full min-w-0 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-gray-600">
        {label}
      </p>
      <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{value}</p>
      {note && <p className="mt-1 text-xs text-[#162766]">{note}</p>}
    </div>
  );
}

function ErrorCard({ label, message }) {
  return (
    <div className="rounded-3xl border border-red-100 bg-red-50 p-5 text-sm font-semibold text-red-700 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-red-500">
        {label}
      </p>
      <p className="mt-2">{message}</p>
    </div>
  );
}

function StatusMessage({ type, message }) {
  if (!message) return null;

  const className =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-red-100 bg-red-50 text-red-700";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${className}`}>
      {message}
    </div>
  );
}

function firstValue(...values) {
  return values.find((value) => value !== undefined && value !== null && value !== "");
}

function formatMoney(value) {
  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) return value;
  return `EGP ${numberValue.toLocaleString()}`;
}

function findNumericField(data, fieldNames, allowDirectValue = true) {
  if (data === null || data === undefined) return null;
  if (allowDirectValue && typeof data === "number") return data;
  if (allowDirectValue && typeof data === "string" && data.trim() !== "" && !Number.isNaN(Number(data))) {
    return Number(data);
  }
  if (Array.isArray(data)) {
    for (const item of data) {
      const value = findNumericField(item, fieldNames, false);
      if (value !== null) return value;
    }
    return null;
  }
  if (typeof data !== "object") return null;

  const normalizedFields = fieldNames.map((field) => field.toLowerCase());
  for (const [key, value] of Object.entries(data)) {
    if (normalizedFields.includes(key.toLowerCase())) {
      const numericValue = findNumericField(value, fieldNames, true);
      if (numericValue !== null) return numericValue;
    }
  }

  for (const value of Object.values(data)) {
    const nestedValue = findNumericField(value, fieldNames, false);
    if (nestedValue !== null) return nestedValue;
  }

  return null;
}

function getBookingStatus(booking) {
  return firstValue(booking.status, booking.bookingStatus, booking.tripStatus);
}

function getBookingTitle(booking) {
  return firstValue(
    booking.tripName,
    booking.name,
    booking.title,
    booking.trip?.name,
    booking.trip?.title,
    booking.booking?.tripName,
    "Trip details",
  );
}

function getBookingLocation(booking) {
  return firstValue(
    booking.location,
    booking.city,
    booking.trip?.location,
    booking.trip?.city,
    booking.booking?.location,
  );
}

function getBookingKey(booking, index) {
  return firstValue(booking._id, booking.id, booking.tripId, booking.bookingId, booking.trip?._id, index);
}

function getGuestName(guest) {
  if (!guest || typeof guest !== "object") return "";

  return [guest.firstName, guest.lastName].filter(Boolean).join(" ").trim();
}

function getGuestSummary(booking) {
  const explicitCount = firstValue(booking.numberOfGuests, booking.guestCount);
  if (explicitCount !== undefined && explicitCount !== null && explicitCount !== "") {
    return explicitCount;
  }

  if (Array.isArray(booking.guests)) {
    const names = booking.guests.map(getGuestName).filter(Boolean);
    if (names.length > 0) return names.join(", ");
    return `${booking.guests.length} ${booking.guests.length === 1 ? "guest" : "guests"}`;
  }

  if (booking.guests && typeof booking.guests === "object") {
    return getGuestName(booking.guests) || "Guest";
  }

  return booking.guests;
}

function getBookingDetails(booking) {
  return [
    ["Tourist", firstValue(booking.customerName, booking.userName, booking.user?.name, booking.customer?.name)],
    ["Date", firstValue(booking.date, booking.tripDate, booking.startDate, booking.bookingDate)],
    ["Guests", getGuestSummary(booking)],
    ["Total", firstValue(booking.totalPrice, booking.price, booking.finalPrice)],
  ].filter(([, value]) => value !== undefined && value !== null && value !== "");
}

function getGuideFeeCards(guideFee) {
  const fee = findNumericField(guideFee, [
    "totalGuideProfit",
  ]);

  return [
    {
      label: "Guide Profit",
      value: formatMoney(fee ?? 0),
      note: `${Number(guideFee?.confirmedBookingsCount || 0)} confirmed bookings`,
    },
  ];
}

function getAssignedBookingsLabel(status, count) {
  if (status === "loading") return "Loading assigned bookings...";
  if (status !== "success") return "";
  return `${count} assigned ${count === 1 ? "booking" : "bookings"}`;
}

function getAvailabilityErrorMessage(error) {
  const message = error?.message || "Availability could not be saved.";
  if (message.toLowerCase().includes("guide not found")) {
    return `${message}. The backend could not find a guide record for this logged-in account. If this account was recently upgraded to guide, log out and log in again.`;
  }
  return message;
}

function Field({ label, children }) {
  return (
    <label className="block w-full">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#162766]">
        {label}
      </span>
      {children}
    </label>
  );
}

function BookingCard({ booking }) {
  const status = getBookingStatus(booking);
  const location = getBookingLocation(booking);
  const details = getBookingDetails(booking);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">{getBookingTitle(booking)}</p>
          {location && <p className="mt-1 text-xs text-[#162766]">{location}</p>}
        </div>
        {status && (
          <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
            {status}
          </span>
        )}
      </div>
      {details.length > 0 && (
        <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <p key={label}>
              {label}: {value}
            </p>
          ))}
        </div>
      )}
    </article>
  );
}

export default function GuideDashboard() {
  const router = useRouter();
  const { logout, user, sessionReady } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [guideFee, setGuideFee] = useState(null);
  const [availability, setAvailability] = useState(initialAvailability);
  const [loading, setLoading] = useState(true);
  const [bookingsStatus, setBookingsStatus] = useState("idle");
  const [bookingsError, setBookingsError] = useState("");
  const [statsStatus, setStatsStatus] = useState("idle");
  const [statsError, setStatsError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (!sessionReady) return;

    if (!user) {
      router.replace("/auth/auth");
      return;
    }

    const role = getUserRole(user);
    if (role !== "guide" && role !== "localguide") {
      router.replace("/");
      return;
    }

    async function loadDashboard() {
      setLoading(true);
      setError("");
      setBookings([]);
      setGuideFee(null);
      setBookingsStatus("idle");
      setBookingsError("");
      setStatsStatus("idle");
      setStatsError("");

      try {
        const guideProfile = await getGuideProfile();

        const guideRole = getUserRole(guideProfile);
        if (!guideProfile || (guideRole !== "guide" && guideRole !== "localguide")) {
          setError("Please login as a local guide to access this dashboard.");
          setProfile(guideProfile);
          setLoading(false);
          return;
        }

        setProfile(guideProfile);
        setLoading(false);
        setBookingsStatus("loading");
        setStatsStatus("loading");

        const [bookingsResult, guideFeeResult] = await Promise.allSettled([
          getGuideRequiredTrips(),
          getGuideFee(),
        ]);

        if (bookingsResult.status === "fulfilled") {
          setBookings(bookingsResult.value);
          setBookingsStatus("success");
        } else {
          setBookings([]);
          setBookingsError(bookingsResult.reason?.message || "Assigned bookings could not be loaded.");
          setBookingsStatus("error");
        }

        if (guideFeeResult.status === "fulfilled") {
          setGuideFee(guideFeeResult.value);
          setStatsStatus("success");
        } else {
          setGuideFee(null);
          setStatsError(guideFeeResult.reason?.message || "Guide fee could not be loaded.");
          setStatsStatus("error");
        }
      } catch (error) {
        setError(error?.message || "Please login as a local guide to access this dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [sessionReady, router, user]);

  const stats = useMemo(() => {
    const cards = [];

    if (bookingsStatus === "success") {
      const bookingsWithStatus = bookings.filter((booking) => getBookingStatus(booking));
      if (bookingsWithStatus.length > 0) {
        const upcoming = bookingsWithStatus.filter((booking) =>
          ["pending", "confirmed", "upcoming"].includes(
            String(getBookingStatus(booking)).toLowerCase(),
          ),
        ).length;
        const completed = bookingsWithStatus.filter(
          (booking) => String(getBookingStatus(booking)).toLowerCase() === "completed",
        ).length;

        cards.push({ label: "Upcoming Bookings", value: upcoming });
        cards.push({ label: "Completed Trips", value: completed });
      }
    }

    return [...cards, ...getGuideFeeCards(guideFee)];
  }, [bookings, bookingsStatus, guideFee]);

  async function handleLogout() {
    await logout();
    router.push("/auth/auth");
  }

  function handleAvailabilityChange(event) {
    const { name, value, type, checked } = event.target;
    setAvailability((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleAvailabilitySubmit(event) {
    event.preventDefault();
    setSaveStatus({ type: "", message: "" });

    if (!availability.isAvailable) {
      setSaveStatus({
        type: "error",
        message: "Unavailable days are not supported by the current backend API.",
      });
      return;
    }

    setSaving(true);
    try {
      await setGuideSchedule({
        dayofweek: availability.dayofweek,
        startTime: availability.startTime,
        endTime: availability.endTime,
      });
      setSaveStatus({ type: "success", message: "Availability saved successfully." });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: getAvailabilityErrorMessage(error),
      });
    } finally {
      setSaving(false);
    }
  }

  if (!sessionReady) {
    return null;
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#162766]">Loading guide dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f8fafc] px-4">
        <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-[#0F172A]">Guide Access</h1>
          <p className="mt-3 text-sm text-[#162766]">{error}</p>
          <button
            type="button"
            onClick={() => router.push("/auth/auth")}
            className="mt-6 rounded-full bg-[#A66D40] px-5 py-3 text-sm font-bold text-white"
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-4 py-8 text-[#0F172A] md:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl bg-[#0F172A] p-6 text-white shadow-sm md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#FFD33D]">
                Local Guide
              </p>
              <h1 className="mt-3 text-4xl font-extrabold">
                Welcome, {profile?.name || "Guide"}
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-200">
                Manage your availability and assigned trips
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-[#0F172A]"
            >
              Logout
            </button>
          </div>
        </section>

        {(statsStatus === "loading" || statsStatus === "error" || stats.length > 0) && (
          <section className="grid gap-4 md:grid-cols-3">
            {statsStatus === "loading" && <StatCard label="Guide Fee" value="Loading..." />}
            {statsStatus === "error" && <ErrorCard label="Guide Fee" message={statsError} />}
            {stats.map((card) => (
              <StatCard key={card.label} label={card.label} value={card.value} note={card.note} />
            ))}
          </section>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold">Assigned Bookings</h2>
                <p className="text-sm text-[#162766]">
                  Trip delivery queue for your assigned tours.
                </p>
              </div>
              {getAssignedBookingsLabel(bookingsStatus, bookings.length) && (
                <span className="inline-flex w-fit rounded-full bg-gray-50 px-3 py-1 text-xs font-bold text-gray-700">
                  {getAssignedBookingsLabel(bookingsStatus, bookings.length)}
                </span>
              )}
            </div>
            <div className="mt-5 space-y-3">
              {bookingsStatus === "loading" && (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-sm font-semibold text-slate-500">
                  Loading assigned bookings...
                </div>
              )}
              {bookingsStatus === "error" && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm font-semibold text-red-700">
                  {bookingsError}
                </div>
              )}
              {bookingsStatus === "success" && bookings.length > 0 && (
                bookings.map((booking, index) => (
                  <BookingCard key={getBookingKey(booking, index)} booking={booking} />
                ))
              )}
              {bookingsStatus === "success" && bookings.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  No assigned bookings found.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">Availability</h2>
              <p className="mt-1 text-sm text-[#162766]">Add guide availability for tour delivery.</p>

              <form onSubmit={handleAvailabilitySubmit} className="mt-5 w-full space-y-4">
                <Field label="Available Day">
                  <select
                    name="dayofweek"
                    value={availability.dayofweek}
                    onChange={handleAvailabilityChange}
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  >
                    {days.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid w-full gap-4">
                  <Field label="Start Time">
                    <input
                      type="time"
                      name="startTime"
                      value={availability.startTime}
                      onChange={handleAvailabilityChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    />
                  </Field>
                  <Field label="End Time">
                    <input
                      type="time"
                      name="endTime"
                      value={availability.endTime}
                      onChange={handleAvailabilityChange}
                      className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    />
                  </Field>
                </div>

                <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700">
                  Mark available
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={availability.isAvailable}
                    onChange={handleAvailabilityChange}
                    className="h-4 w-4 accent-[#FFD33D]"
                  />
                </label>

                <StatusMessage type={saveStatus.type} message={saveStatus.message} />
                {!availability.isAvailable && (
                  <p className="text-sm font-semibold text-red-600">
                    Mark available before saving. The documented API only accepts available time ranges.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={saving || !availability.isAvailable}
                  className={primaryButtonClass}
                >
                  {saving ? "Saving..." : "Save Availability"}
                </button>
              </form>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
