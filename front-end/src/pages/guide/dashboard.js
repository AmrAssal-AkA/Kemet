import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import {
  getGuideAvailability,
  getGuideBookings,
  getGuideProfile,
  updateGuideAvailability,
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

function StatCard({ label, value, note }) {
  return (
    <div className="rounded-3xl border border-[#FFD33D]/30 bg-white p-5 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#A66D40]">
        {label}
      </p>
      <p className="mt-3 text-3xl font-extrabold text-[#0F172A]">{value}</p>
      {note && <p className="mt-1 text-xs text-[#162766]">{note}</p>}
    </div>
  );
}

function StatusMessage({ type, message }) {
  if (!message) return null;

  const className =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : "border-amber-200 bg-amber-50 text-amber-800";

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${className}`}>
      {message}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-[0.14em] text-[#162766]">
        {label}
      </span>
      {children}
    </label>
  );
}

function BookingCard({ booking }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-[#0F172A]">{booking.tripName}</p>
          <p className="mt-1 text-xs text-[#162766]">{booking.location}</p>
        </div>
        <span className="rounded-full bg-[#FFD33D]/25 px-3 py-1 text-xs font-bold text-[#A66D40]">
          {booking.status}
        </span>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
        <p>Tourist: {booking.customerName}</p>
        <p>Date: {booking.date}</p>
        <p>Guests: {booking.numberOfGuests}</p>
        <p>Total: {booking.totalPrice}</p>
      </div>
    </article>
  );
}

export default function GuideDashboard() {
  const router = useRouter();
  const { logout, user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [availability, setAvailability] = useState(initialAvailability);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [saveStatus, setSaveStatus] = useState({ type: "", message: "" });

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/auth/auth");
      return;
    }

    if (user.role !== "guide") {
      router.replace("/");
      return;
    }

    async function loadDashboard() {
      setLoading(true);
      setError("");
      setInfo("");

      try {
        const guideProfile = await getGuideProfile();

        if (!guideProfile || guideProfile.role !== "guide") {
          setError("Please login as a local guide to access this dashboard.");
          setProfile(guideProfile);
          return;
        }

        setProfile(guideProfile);
        const [bookingsResult, availabilityResult] = await Promise.all([
          getGuideBookings(),
          getGuideAvailability(),
        ]);

        setBookings(bookingsResult.bookings || []);
        setSchedule(availabilityResult.schedule || []);
        setInfo(
          [bookingsResult.message, availabilityResult.message].filter(Boolean).join(" "),
        );
      } catch (error) {
        setError(error?.message || "Please login as a local guide to access this dashboard.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [authLoading, router, user]);

  const stats = useMemo(() => {
    const upcoming = bookings.filter((booking) =>
      ["Pending", "Confirmed"].includes(booking.status),
    ).length;
    const completed = bookings.filter((booking) => booking.status === "Completed").length;

    return {
      total: bookings.length,
      upcoming,
      completed,
      availableDays: schedule.length,
    };
  }, [bookings, schedule]);

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
      await updateGuideAvailability(availability);
      setSchedule((prev) => [...prev, availability]);
      setSaveStatus({ type: "success", message: "Availability saved successfully." });
    } catch (error) {
      setSaveStatus({
        type: "error",
        message: error?.message || "Availability could not be saved.",
      });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F6F3EE] px-4">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#162766]">Loading guide dashboard...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F6F3EE] px-4">
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
    <main className="min-h-screen bg-[#F6F3EE] px-4 py-8 text-[#0F172A] md:px-8">
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

        <StatusMessage type="error" message={info} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Assigned Bookings" value={stats.total} note="Documented API pending" />
          <StatCard label="Upcoming Bookings" value={stats.upcoming} />
          <StatCard label="Completed Trips" value={stats.completed} />
          <StatCard label="Available Days" value={stats.availableDays} />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-extrabold">Assigned Bookings</h2>
            <p className="text-sm text-[#162766]">Trip delivery queue for your assigned tours.</p>
            <div className="mt-5 space-y-3">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <BookingCard key={booking.id || booking.tripName} booking={booking} />
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
                  No assigned bookings are available from the current documented APIs.
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">Availability</h2>
              <p className="mt-1 text-sm text-[#162766]">Add guide availability for tour delivery.</p>

              <form onSubmit={handleAvailabilitySubmit} className="mt-5 space-y-4">
                <Field label="Available Day">
                  <select
                    name="dayofweek"
                    value={availability.dayofweek}
                    onChange={handleAvailabilityChange}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#FFD33D]"
                  >
                    {days.map((day) => (
                      <option key={day}>{day}</option>
                    ))}
                  </select>
                </Field>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Start Time">
                    <input
                      type="time"
                      name="startTime"
                      value={availability.startTime}
                      onChange={handleAvailabilityChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#FFD33D]"
                    />
                  </Field>
                  <Field label="End Time">
                    <input
                      type="time"
                      name="endTime"
                      value={availability.endTime}
                      onChange={handleAvailabilityChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#FFD33D]"
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

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-full bg-[#A66D40] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0F172A] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Availability"}
                </button>
              </form>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-extrabold">Schedule List</h2>
              <div className="mt-4 space-y-3">
                {schedule.length > 0 ? (
                  schedule.map((item, index) => (
                    <div
                      key={`${item.dayofweek}-${item.startTime}-${index}`}
                      className="rounded-2xl bg-[#FFD33D]/15 p-4 text-sm"
                    >
                      <p className="font-bold">{item.dayofweek}</p>
                      <p className="text-[#162766]">
                        {item.startTime} - {item.endTime}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
                    No existing schedule can be fetched from the current documented APIs.
                  </p>
                )}
              </div>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
