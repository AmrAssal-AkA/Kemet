import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { getBookedTrips } from "@/services/userServices";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const pastTrips = [
  {
    img: "/karnak.jpeg",
    title: "Guided Tour of Karnak & Luxor Temples",
    date: "Mar 10, 2025",
    rating: 5,
    review: "An unforgettable experience through ancient history.",
  },
  {
    img: "/dinner.jpeg",
    title: "Sunset Felucca Cruise with Local Dinner",
    date: "Jan 22, 2025",
    rating: 4,
    review: null,
  },
];

const communityActivity = [
  {
    initials: "SA",
    avatarBg: "#c0392b",
    name: "Sara Al-Masri",
    action: "liked your story",
    time: "2h ago",
    icon: "♥",
  },
  {
    initials: "KM",
    avatarBg: "#2980b9",
    name: "Karim Mansour",
    action: "commented on your photo",
    time: "5h ago",
    icon: "💬",
  },
  {
    initials: "LH",
    avatarBg: "#8e44ad",
    name: "Layla Haddad",
    action: "started following you",
    time: "1d ago",
    icon: "👤",
  },
];

const recommendedCities = [
  { img: "cairo.jpeg", name: "Cairo", match: "92% match" },
  { img: "aswan.jpeg", name: "Aswan", match: "87% match" },
  { img: "siwa.jpeg", name: "Siwa", match: "81% match" },
];

const STORIES_SHARED_COUNT = 3;
const VALID_DASHBOARD_TABS = ["overview", "trips", "liked", "community", "settings"];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const firstValue = (values) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

function getItemId(item) {
  return firstValue([item?._id, item?.id, item?.tripId, item?.bookingId]);
}

function getTripObject(source) {
  const trip = Array.isArray(source?.trip) ? source.trip[0] : source?.trip;
  const item = Array.isArray(source?.items) ? source.items[0] : source?.items;
  const candidate = firstValue([
    trip,
    source?.tripDetails,
    source?.package,
    item,
    source,
  ]);

  return candidate && typeof candidate === "object" ? candidate : {};
}

function normalizeImagePath(value, fallback) {
  if (!value) return fallback;
  if (String(value).startsWith("http") || String(value).startsWith("/")) return value;
  return `/${value}`;
}

function getImage(source, fallback) {
  const image = firstValue([
    source?.imageUrl,
    source?.img,
    source?.image?.[0]?.imageUrl,
    source?.images?.[0]?.imageUrl,
    source?.image?.[0]?.url,
    source?.images?.[0]?.url,
    source?.passportImages?.[0]?.url,
  ]);

  return normalizeImagePath(image, fallback);
}

function formatDateText(value) {
  if (!value) return "Date pending";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getBookingDateValue(booking) {
  return firstValue([
    booking?.tripSchedule?.date,
    booking?.date,
    booking?.tripDate,
    booking?.startDate,
    booking?.bookingDate,
    booking?.createdAt,
  ]);
}

function getDaysLeft(value) {
  const date = value ? new Date(value) : null;
  if (!date || Number.isNaN(date.getTime())) return 0;

  const diff = date.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function formatMoney(amount, currency = "EGP") {
  if (amount === undefined || amount === null || amount === "") return "";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return String(amount);

  return `${currency || "EGP"} ${numericAmount.toLocaleString()}`;
}

function normalizeStatus(value) {
  return String(value || "").trim();
}

function getStatusColor(status) {
  const normalized = normalizeStatus(status).toLowerCase();
  if (normalized === "confirmed" || normalized === "completed") return "#22c55e";
  if (normalized === "cancelled" || normalized === "canceled") return "#ef4444";
  return "#FFCE2A";
}

function isCompletedBooking(booking) {
  const status = normalizeStatus(booking?.status).toLowerCase();
  return status === "confirmed" || status === "completed";
}

function isUpcomingBooking(booking) {
  const status = normalizeStatus(booking?.status).toLowerCase();
  if (status !== "confirmed") return false;

  const dateValue = getBookingDateValue(booking);
  if (!dateValue) return true;

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return true;
  return date.getTime() >= Date.now();
}

function mapBookingToTrip(booking, index) {
  const trip = getTripObject(booking);
  const dateValue = getBookingDateValue(booking);
  const status = normalizeStatus(booking?.status) || "Pending";
  const paymentStatus = normalizeStatus(booking?.paymentStatus);
  const title = firstValue([
    trip?.name,
    trip?.title,
    booking?.tripName,
    booking?.tripTitle,
    booking?.name,
    booking?.title,
    "Booked trip",
  ]);

  return {
    id: getItemId(booking) || `booking-${index}`,
    img: getImage(trip, "/redballon.jpg"),
    title,
    location: firstValue([trip?.city, trip?.location, booking?.city, booking?.location]),
    date: formatDateText(dateValue),
    status,
    statusColor: getStatusColor(status),
    paymentStatus,
    price: formatMoney(
      firstValue([booking?.totalPrice, booking?.price, booking?.amount, trip?.finalPrice, trip?.basePrice]),
      booking?.currency,
    ),
    daysLeft: getDaysLeft(dateValue),
  };
}

function getUserInitials(name = "") {
  const parts = String(name).trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ME";
  return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function getDashboardErrorMessage(error) {
  if (!error) return "";
  if (error.status === 401 || error.status === 403) {
    return "Your session may have expired. Please sign in again to view your dashboard data.";
  }
  return error.message || "Dashboard data could not be loaded.";
}

function getDashboardRole(user) {
  if (!user) return null;
  if (user?.isAdmin === true) return "admin";
  if (user?.localGuide === true) return "guide";

  const role = String(user?.role || user?.userRole || user?.type || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (role === "admin") return "admin";
  if (role === "guide" || role === "localguide") return "guide";
  return "user";
}

function StarRow({ count = 5, total = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#FFCE2A" : "#374151", fontSize: 13 }}>
          ★
        </span>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mb-8">
      {eyebrow && (
        <span
          className={`inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full ${
            light
              ? "text-yellow-300 bg-yellow-400/20"
              : "text-yellow-600 bg-yellow-50"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-2xl md:text-3xl font-extrabold leading-tight ${light ? "text-white" : "text-gray-900"}`}
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-2 text-sm max-w-lg leading-relaxed ${light ? "text-gray-400" : "text-gray-500"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────

function Sidebar({ activeTab, setActiveTab, onLogout, showLogout = true }) {
  const nav = [
    { key: "overview", icon: "⬡", label: "Overview" },
    { key: "trips", icon: "🗺️", label: "My Trips" },
    { key: "liked", icon: "♥", label: "Liked Articles" },
    { key: "community", icon: "✦", label: "Community" },
    { key: "settings", icon: "⚙", label: "Settings" },
  ];
  return (
    <aside
      className="hidden lg:flex flex-col gap-1 w-56 shrink-0 sticky top-6 self-start"
      style={{ height: "fit-content" }}
    >
      <div
        className="rounded-2xl px-3 py-4"
        style={{
          background: "linear-gradient(135deg,#06122e 0%,#0b1f46 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {nav.map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200"
            style={{
              background: activeTab === key ? "rgba(255,206,42,0.15)" : "transparent",
              color: activeTab === key ? "#FFCE2A" : "rgba(255,255,255,0.55)",
              borderLeft: activeTab === key ? "2px solid #FFCE2A" : "2px solid transparent",
            }}
          >
            <span style={{ fontSize: 15, opacity: activeTab === key ? 1 : 0.7 }}>{icon}</span>
            {label}
          </button>
        ))}

        {showLogout && (
          <>
            <div className="mx-2 my-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }} />

            <button
              type="button"
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              <span style={{ fontSize: 15 }}>↩</span>
              Logout
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const { user, sessionReady, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [bookedTrips, setBookedTrips] = useState([]);
  const [isDashboardLoading, setIsDashboardLoading] = useState(true);
  const [bookedError, setBookedError] = useState("");
  const dashboardRole = useMemo(() => getDashboardRole(user), [user]);

  useEffect(() => {
    if (!router.isReady) return;

    const tab = Array.isArray(router.query.tab) ? router.query.tab[0] : router.query.tab;
    setActiveTab(VALID_DASHBOARD_TABS.includes(tab) ? tab : "overview");
  }, [router.isReady, router.query.tab]);

  useEffect(() => {
    if (!sessionReady) return;

    if (!user) {
      return;
    }

    if (dashboardRole !== "user") return;

    let isMounted = true;

    async function loadDashboardData() {
      setIsDashboardLoading(true);
      setBookedError("");

      try {
        const bookedResult = await getBookedTrips();
        if (!isMounted) return;
        setBookedTrips(Array.isArray(bookedResult) ? bookedResult : []);
      } catch (error) {
        if (!isMounted) return;
        setBookedTrips([]);
        setBookedError(getDashboardErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsDashboardLoading(false);
        }
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [dashboardRole, sessionReady, user]);

  useEffect(() => {
    if (!router.isReady || !sessionReady) return;

    if (!user) {
      router.replace("/");
      return;
    }

    if (dashboardRole === "admin") {
      router.replace("/admin");
      return;
    }

    if (dashboardRole === "guide") {
      router.replace("/guide/dashboard");
    }
  }, [dashboardRole, router, router.isReady, sessionReady, user]);

  const dashboardName = user?.name || "Explorer";
  const dashboardEmail = user?.email || "Not provided";
  const dashboardLocation = user?.Nationality || user?.nationality || "Egypt";
  const upcomingTripCards = useMemo(
    () => bookedTrips.filter(isUpcomingBooking).map(mapBookingToTrip),
    [bookedTrips],
  );
  const dashboardStats = useMemo(
    () => [
      {
        value: String(bookedTrips.filter(isCompletedBooking).length),
        label: "Trips Taken",
      },
      { value: String(upcomingTripCards.length), label: "Upcoming" },
      { value: "0", label: "Liked Articles" },
      { value: String(STORIES_SHARED_COUNT), label: "Stories Shared" },
    ],
    [bookedTrips, upcomingTripCards.length],
  );
  const settingsFields = useMemo(
    () => [
      { label: "Full Name", value: dashboardName },
      { label: "Email", value: dashboardEmail },
      { label: "Phone", value: user?.phone || user?.phoneNumber || "+20 100 000 0000" },
      { label: "Location", value: dashboardLocation },
    ],
    [dashboardEmail, dashboardLocation, dashboardName, user?.phone, user?.phoneNumber],
  );

  if (!router.isReady || !sessionReady || dashboardRole !== "user") {
    return (
      <>
        <Head>
          <title>My Dashboard â€” Kemet Travel</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <main className="font-sans bg-[#f9fafb] min-h-screen" />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Dashboard — Kemet Travel</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        :root { --gold:#FFCE2A; --gold-dark:#e8b800; --navy:#0b1f46; }

        .btn-gold {
          background: linear-gradient(135deg,var(--gold) 0%,var(--gold-dark) 100%);
          box-shadow: 0 4px 14px rgba(255,206,42,.35);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(255,206,42,.45); }

        .btn-ghost { border:1.5px solid #e2e8f0; transition:border-color .18s,background .18s; }
        .btn-ghost:hover { border-color:var(--gold); background:#fffbea; }

        .trip-card { transition:transform .25s,box-shadow .25s; }
        .trip-card:hover { transform:translateY(-6px); box-shadow:0 18px 40px rgba(0,0,0,.12); }
        .trip-img { transition:transform .4s; }
        .trip-card:hover .trip-img { transform:scale(1.05); }

        .gem-card { transition:transform .28s,box-shadow .28s; }
        .gem-card:hover { transform:translateY(-5px); box-shadow:0 16px 36px rgba(0,0,0,.13); }
        .gem-img { transition:transform .45s; }
        .gem-card:hover .gem-img { transform:scale(1.06); }
        .gem-overlay {
          background:linear-gradient(to top,rgba(6,18,46,.85) 0%,rgba(6,18,46,.2) 55%,transparent 100%);
        }

        .stat-chip { background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18); backdrop-filter:blur(8px); }

        .city-ring { box-shadow:0 0 0 3px #fff,0 0 0 5px transparent; transition:box-shadow .25s,transform .25s; }
        .city-card:hover .city-ring { box-shadow:0 0 0 3px #fff,0 0 0 5px var(--gold); }

        .notif-row { transition:background .18s; }
        .notif-row:hover { background:rgba(255,206,42,0.05); }

        .tab-pill { transition:background .2s,color .2s; }
        .progress-bar { animation: fillBar 1.2s ease forwards; }
        @keyframes fillBar { from { width:0 } }
      `}</style>

      <main className="font-sans bg-[#f9fafb] min-h-screen">

        {/* ══════ DASHBOARD HERO BANNER ══════ */}
        <section className="relative overflow-hidden" style={{ minHeight: 220 }}>
          <img src="/hero.png" alt="Egypt" className="w-full h-56 object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(105deg,rgba(6,18,46,.88) 0%,rgba(11,31,70,.65) 55%,rgba(0,0,0,.25) 100%)",
            }}
          />
          <div
            className="absolute left-0 bottom-0 w-full h-0.5 pointer-events-none"
            style={{
              background: "linear-gradient(90deg,transparent,#FFCE2A 40%,#f5b800 60%,transparent)",
            }}
          />

          {/* User Identity */}
          <div className="absolute inset-0 flex items-end px-6 md:px-20 pb-8">
            <motion.div {...fadeUp(0.1)} className="flex items-end gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-3xl font-extrabold text-gray-900 shadow-xl"
                  style={{
                    background: "linear-gradient(135deg,#FFCE2A 0%,#f5b800 100%)",
                    border: "3px solid rgba(255,255,255,0.85)",
                  }}
                >
                  {getUserInitials(dashboardName)}
                </div>
                <div
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ background: "#22c55e" }}
                />
              </div>

              <div className="pb-1">
                <span className="inline-block mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-3 py-0.5 rounded-full">
                  ✦ Explorer Member
                </span>
                <h1
                  className="text-2xl md:text-3xl font-extrabold text-white leading-none"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {dashboardName}
                </h1>
                <p className="text-gray-400 text-xs mt-1">
                  📍 {dashboardLocation} &nbsp;·&nbsp; Explorer Member
                </p>
              </div>
            </motion.div>

            {/* Stat chips — right side */}
            <motion.div
              {...fadeUp(0.25)}
              className="hidden md:flex flex-wrap gap-3 ml-auto pb-1"
            >
              {dashboardStats.map(({ value, label }) => (
                <div key={label} className="stat-chip rounded-xl px-4 py-2 text-center">
                  <div className="text-base font-extrabold text-yellow-400 leading-none">{value}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mobile stat row */}
        <div className="flex md:hidden gap-2 px-4 pt-4 overflow-x-auto">
          {dashboardStats.map(({ value, label }) => (
            <div
              key={label}
              className="shrink-0 rounded-xl px-4 py-2 text-center"
              style={{ background: "#06122e", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="text-sm font-extrabold text-yellow-400 leading-none">{value}</div>
              <div className="text-[10px] uppercase tracking-widest text-gray-400 mt-0.5">{label}</div>
            </div>
          ))}
        </div>

        {/* ══════ BODY ══════ */}
        <div className="px-4 md:px-20 py-8 flex gap-8 items-start">
          {/* Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={logout}
            showLogout={Boolean(user)}
          />

          {/* Main content */}
          <div className="flex-1 min-w-0">

            {/* ── OVERVIEW ── */}
            {activeTab === "overview" && (
              <div className="flex flex-col gap-10">

                {/* ── Upcoming Trips ── */}
                <motion.div {...fadeUp(0)}>
                  <div className="flex items-end justify-between mb-6">
                    <SectionHeading
                      eyebrow="Your Itinerary"
                      title="Upcoming Trips"
                      subtitle={`You have ${upcomingTripCards.length} ${upcomingTripCards.length === 1 ? "adventure" : "adventures"} coming up.`}
                    />
                    <button
                      onClick={() => setActiveTab("trips")}
                      className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gray-400 border-b border-gray-300 hover:text-yellow-600 hover:border-yellow-400 transition-colors whitespace-nowrap mb-8"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {isDashboardLoading && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        Loading your booked trips...
                      </p>
                    )}
                    {!isDashboardLoading && bookedError && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        {bookedError}
                      </p>
                    )}
                    {!isDashboardLoading && !bookedError && upcomingTripCards.length === 0 && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        No confirmed upcoming trips yet.
                      </p>
                    )}
                    {!isDashboardLoading && !bookedError && upcomingTripCards.map((trip, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.45 }}
                        className="trip-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                      >
                        <div className="overflow-hidden h-40 relative">
                          <img src={trip.img} alt={trip.title} className="trip-img w-full h-full object-cover" />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)" }} />
                          <span
                            className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: trip.statusColor + "22", color: trip.statusColor, border: `1px solid ${trip.statusColor}44` }}
                          >
                            {trip.status}
                          </span>
                          <span className="absolute bottom-3 left-3 text-white text-xs font-bold">
                            🗓 {trip.date}
                          </span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-gray-900 mb-1 leading-snug">{trip.title}</h4>
                          {trip.location && (
                            <p className="text-xs text-gray-400">{trip.location}</p>
                          )}
                          {trip.paymentStatus && (
                            <p className="text-xs text-gray-400">Payment: {trip.paymentStatus}</p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-yellow-600 font-extrabold text-base">{trip.price || "N/A"}</span>
                            <div className="flex gap-2">
                              <span className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1">Details</span>
                              <span className="text-xs font-medium text-red-400 border border-red-100 rounded-full px-3 py-1 hover:border-red-300 transition-colors cursor-pointer">Cancel</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <div
                                className="progress-bar h-full rounded-full"
                                style={{
                                  width: `${Math.max(10, 100 - trip.daysLeft * 3)}%`,
                                  background: "linear-gradient(90deg,#FFCE2A,#f5b800)",
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 shrink-0">{trip.daysLeft}d left</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* ── Recommendations ── */}
                <motion.div {...fadeUp(0.1)}>
                  <div
                    className="rounded-3xl px-6 md:px-10 py-10 relative overflow-hidden"
                    style={{
                      background: "linear-gradient(135deg,#06122e 0%,#0b1f46 50%,#102554 100%)",
                    }}
                  >
                    <div
                      className="absolute top-0 right-0 pointer-events-none"
                      style={{
                        width: 400, height: 400,
                        background: "radial-gradient(circle,rgba(255,206,42,.10) 0%,transparent 65%)",
                        transform: "translate(120px,-120px)",
                      }}
                    />
                    <div className="relative z-10">
                      <SectionHeading
                        eyebrow="Curated for You"
                        title="Recommended Next Destinations"
                        subtitle="Based on your travel history and preferences."
                        light
                      />
                      <div className="flex flex-wrap gap-6 mt-2">
                        {recommendedCities.map((city, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            whileHover={{ y: -4 }}
                            className="city-card text-center cursor-pointer group"
                          >
                            <div className="relative w-20 h-20 mx-auto">
                              <img
                                src={`/${city.img}`}
                                alt={city.name}
                                className="city-ring w-20 h-20 rounded-full object-cover shadow-md"
                              />
                            </div>
                            <p className="mt-2 text-sm font-semibold text-white group-hover:text-yellow-400 transition-colors">{city.name}</p>
                            <span className="inline-block mt-1 text-[10px] font-bold text-yellow-400 bg-yellow-400/15 px-2 py-0.5 rounded-full">{city.match}</span>
                          </motion.div>
                        ))}
                      </div>
                      <div className="mt-8">
                        <Link href="/Destination">
                          <button className="btn-gold rounded-full px-8 py-3 font-semibold text-black text-sm">
                            Browse All Destinations
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── Community Activity ── */}
                <motion.div {...fadeUp(0.15)}>
                  <SectionHeading
                    eyebrow="Activity"
                    title="Community Notifications"
                  />
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {communityActivity.map((n, i) => (
                      <div key={i} className="notif-row flex items-center gap-4 px-5 py-4 cursor-pointer rounded-xl">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: n.avatarBg }}
                        >
                          {n.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{n.name}</span>{" "}
                            <span className="text-gray-500">{n.action}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        <span className="text-lg">{n.icon}</span>
                      </div>
                    ))}
                    <div className="px-5 py-3">
                      <Link href="/communities">
                        <span className="text-sm font-semibold text-yellow-600 hover:text-yellow-500 transition-colors cursor-pointer">
                          View all activity →
                        </span>
                      </Link>
                    </div>
                  </div>
                </motion.div>

                {/* ── Loyalty / Explorer Score ── */}
                <motion.div {...fadeUp(0.2)}>
                  <div
                    className="rounded-2xl px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                    style={{
                      background: "linear-gradient(135deg,#1a1a1a 0%,#2d2519 60%,#3d3020 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div>
                      <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-3 py-0.5 rounded-full">
                        Explorer Level
                      </span>
                      <h3 className="text-white font-extrabold text-lg leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                        Pharaoh Tier 🏺
                      </h3>
                      <p className="text-gray-400 text-sm mt-1.5">1,240 / 2,000 XP to Legendary Explorer</p>
                      <div className="mt-3 w-64 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="progress-bar h-full rounded-full"
                          style={{ width: "62%", background: "linear-gradient(90deg,#FFCE2A,#f5b800)" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {["10% off next booking", "Priority guide assignment", "Exclusive hidden gems access"].map((perk) => (
                        <div key={perk} className="flex items-center gap-2 text-sm text-gray-300">
                          <span className="text-yellow-400 text-xs">✦</span>
                          {perk}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* ── TRIPS TAB ── */}
            {activeTab === "trips" && (
              <div className="flex flex-col gap-10">
                <motion.div {...fadeUp(0)}>
                  <SectionHeading eyebrow="Your Itinerary" title="Upcoming Trips" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                    {isDashboardLoading && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        Loading your booked trips...
                      </p>
                    )}
                    {!isDashboardLoading && bookedError && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        {bookedError}
                      </p>
                    )}
                    {!isDashboardLoading && !bookedError && upcomingTripCards.length === 0 && (
                      <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                        No confirmed upcoming trips yet.
                      </p>
                    )}
                    {!isDashboardLoading && !bookedError && upcomingTripCards.map((trip, i) => (
                      <div key={i} className="trip-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-hidden h-40 relative">
                          <img src={trip.img} alt={trip.title} className="trip-img w-full h-full object-cover" />
                          <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,.55) 0%,transparent 60%)" }} />
                          <span
                            className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full"
                            style={{ background: trip.statusColor + "22", color: trip.statusColor, border: `1px solid ${trip.statusColor}44` }}
                          >
                            {trip.status}
                          </span>
                          <span className="absolute bottom-3 left-3 text-white text-xs font-bold">🗓 {trip.date}</span>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-sm text-gray-900 mb-3 leading-snug">{trip.title}</h4>
                          {trip.location && (
                            <p className="text-xs text-gray-400">{trip.location}</p>
                          )}
                          {trip.paymentStatus && (
                            <p className="text-xs text-gray-400">Payment: {trip.paymentStatus}</p>
                          )}
                          <div className="flex items-center justify-between">
                            <span className="text-yellow-600 font-extrabold text-base">{trip.price || "N/A"}</span>
                            <div className="flex gap-2">
                              <span className="text-xs font-medium text-gray-500 border border-gray-200 rounded-full px-3 py-1 cursor-pointer hover:border-yellow-400 transition-colors">Details</span>
                              <span className="text-xs font-medium text-red-400 border border-red-100 rounded-full px-3 py-1 hover:border-red-300 transition-colors cursor-pointer">Cancel</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...fadeUp(0.1)}>
                  <SectionHeading eyebrow="History" title="Past Adventures" />
                  <div className="flex flex-col gap-4">
                    {pastTrips.map((trip, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
                        <div className="sm:w-40 h-32 sm:h-auto shrink-0 overflow-hidden">
                          <img src={trip.img} alt={trip.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col justify-between p-5 flex-1">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">🗓 {trip.date}</p>
                            <h4 className="font-bold text-sm text-gray-900 mb-2">{trip.title}</h4>
                            <StarRow count={trip.rating} />
                          </div>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                            {trip.review ? (
                              <p className="text-xs text-gray-400 italic max-w-xs">&quot;{trip.review}&quot;</p>
                            ) : (
                              <button className="btn-gold rounded-full px-5 py-2 font-semibold text-black text-xs">
                                Leave a Review
                              </button>
                            )}
                            <Link href="/BookTrip">
                              <span className="text-xs font-semibold text-yellow-600 cursor-pointer hover:text-yellow-500 transition-colors">
                                Book Again →
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...fadeUp(0.2)} className="text-center">
                  <Link href="/BookTrip">
                    <button className="btn-gold rounded-full px-10 py-3.5 font-semibold text-black text-sm">
                      Book a New Trip
                    </button>
                  </Link>
                </motion.div>
              </div>
            )}

            {/* ── LIKED ARTICLES ── */}
            {activeTab === "liked" && (
              <motion.div {...fadeUp(0)}>
                <SectionHeading
                  eyebrow="Articles"
                  title="Liked Articles"
                  subtitle="Blog articles you've liked will appear here."
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <p className="bg-white rounded-2xl shadow-sm border border-gray-100 px-5 py-6 text-sm text-gray-400">
                    No liked articles yet.
                  </p>
                </div>
                <div className="text-center mt-8">
                  <Link href="/blogs">
                    <button className="btn-gold rounded-full px-9 py-3.5 font-semibold text-black text-sm">
                      Explore Blog Articles
                    </button>
                  </Link>
                </div>
              </motion.div>
            )}

            {/* ── COMMUNITY ── */}
            {activeTab === "community" && (
              <motion.div {...fadeUp(0)} className="flex flex-col gap-8">
                <SectionHeading
                  eyebrow="Community Hub"
                  title="Your Stories & Activity"
                  subtitle="Share your Egypt journey with 12,400+ fellow travelers."
                />

                {/* My stories placeholder */}
                <div
                  className="rounded-2xl p-8 flex flex-col items-center text-center gap-4"
                  style={{ background: "#fff", border: "1.5px dashed #e2e8f0" }}
                >
                  <span style={{ fontSize: 40 }}>✍️</span>
                  <h3 className="font-bold text-gray-800 text-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
                    Share your first story
                  </h3>
                  <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                    Tell the community about your Egypt experience — a photo, a tip, a moment.
                  </p>
                  <Link href="/communities">
                    <button className="btn-gold rounded-full px-8 py-3 font-semibold text-black text-sm">
                      Write a Story
                    </button>
                  </Link>
                </div>

                {/* Activity notifications */}
                <div>
                  <p className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-widest">Recent Activity</p>
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
                    {communityActivity.map((n, i) => (
                      <div key={i} className="notif-row flex items-center gap-4 px-5 py-4 cursor-pointer rounded-xl">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                          style={{ background: n.avatarBg }}
                        >
                          {n.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            <span className="font-semibold">{n.name}</span>{" "}
                            <span className="text-gray-500">{n.action}</span>
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                        <span className="text-lg">{n.icon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SETTINGS ── */}
            {activeTab === "settings" && (
              <motion.div {...fadeUp(0)} className="flex flex-col gap-8">
                <SectionHeading eyebrow="Account" title="Profile & Preferences" />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {settingsFields.map(({ label, value }) => (
                      <div key={label}>
                        <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 block">
                          {label}
                        </label>
                        <input
                          defaultValue={value}
                          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-yellow-400 transition-colors"
                          style={{ background: "#fafafa" }}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                      Notifications
                    </p>
                    {["Trip reminders", "Community activity", "Newsletter & deals"].map((pref) => (
                      <div key={pref} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                        <span className="text-sm text-gray-700">{pref}</span>
                        <div
                          className="w-10 h-5 rounded-full relative cursor-pointer"
                          style={{ background: "linear-gradient(135deg,#FFCE2A,#f5b800)" }}
                        >
                          <div className="absolute right-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="btn-gold self-start rounded-full px-8 py-3 font-semibold text-black text-sm">
                    Save Changes
                  </button>
                </div>
              </motion.div>
            )}

          </div>
        </div>
      </main>
    </>
  );
}
