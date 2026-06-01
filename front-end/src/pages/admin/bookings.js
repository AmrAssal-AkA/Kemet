import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import {
  assignGuideToBooking,
  cancelAdminBooking,
  confirmAdminBooking,
  getAvailableGuidesForBooking,
  getAdminBookings,
  requireAdmin,
} from "@/services/adminService";

const PENDING_STATUSES = ["pending", "waiting for confirmation"];
const CONFIRMED_STATUSES = ["confirmed"];
const CANCELLED_STATUSES = ["cancelled", "canceled"];

const BOOKING_SECTIONS = [
  {
    key: "pending",
    label: "Pending",
    title: "Waiting for Confirmation",
    emptyMessage: "No pending bookings.",
    match: isPendingBooking,
    badgeClass: "bg-gray-50 text-gray-700",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    title: "Confirmed Bookings",
    emptyMessage: "No confirmed bookings.",
    match: isConfirmedBooking,
    badgeClass: "bg-emerald-50 text-emerald-700",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    title: "Cancelled Bookings",
    emptyMessage: "No cancelled bookings.",
    match: isCancelledBooking,
    badgeClass: "bg-red-50 text-red-700",
  },
];

function isPendingBooking(booking) {
  return PENDING_STATUSES.includes(
    String(booking.status || "")
      .trim()
      .toLowerCase(),
  );
}

function isConfirmedBooking(booking) {
  return CONFIRMED_STATUSES.includes(
    String(booking.status || "")
      .trim()
      .toLowerCase(),
  );
}

function isCancelledBooking(booking) {
  return CANCELLED_STATUSES.includes(
    String(booking.status || "")
      .trim()
      .toLowerCase(),
  );
}

function isVisibleBooking(booking) {
  return (
    isPendingBooking(booking) ||
    isConfirmedBooking(booking) ||
    isCancelledBooking(booking)
  );
}

function getBookingId(booking) {
  return booking._id || booking.bookingId || booking.id || "";
}

function getGuideId(guide) {
  return guide?._id || guide?.id || "";
}

function normalizeGuide(guide) {
  if (!guide) return null;

  const user =
    guide.userId && typeof guide.userId === "object" ? guide.userId : {};
  const id = getGuideId(guide);

  if (!id) return null;

  return {
    id,
    name: guide.name || user.name || "",
    email: guide.email || user.email || "",
  };
}

function getGuideLabel(guide) {
  const normalizedGuide = normalizeGuide(guide);
  if (!normalizedGuide) return "Not assigned";

  const name = normalizedGuide.name || "Guide";
  return normalizedGuide.email ? `${name} (${normalizedGuide.email})` : name;
}

function getGuideArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.guides)) return data.guides;
  if (Array.isArray(data?.data?.guides)) return data.data.guides;
  return [];
}

function formatDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "N/A";

  return date.toLocaleString();
}

function formatTripDate(value) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTotalPrice(amount, currency) {
  if (amount === null || amount === undefined || amount === "") return "N/A";

  const numericAmount = Number(amount);
  if (Number.isNaN(numericAmount)) return String(amount);

  return `${currency || "EGP"} ${numericAmount.toLocaleString()}`;
}

function getFirstValue(values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== "",
  );
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
  const normalizedStatuses = statuses.map((value) =>
    String(value).trim().toLowerCase(),
  );
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
    tripDate: formatTripDate(getTripDate(booking)),
    tripDuration: formatDurationDays(getTripDurationDays(booking)),
    guestCount: getGuestCount(booking),
    totalPrice: formatTotalPrice(
      booking.totalPrice ?? booking.price ?? booking.amount,
      booking.currency,
    ),
    paymentStatus: getPaymentStatus(booking),
    status: booking.status || "Pending",
    createdDate: formatDate(
      booking.createdAt || booking.created_at || booking.date,
    ),
    assignedGuide: normalizeGuide(booking.assignedGuide),
    guideIncluded: booking.guideIncluded === true,
  };
}


export default function AdminBookings({ admin }) {
  const { user, logout } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [activeSection, setActiveSection] = useState("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState("");
  const [confirmStatus, setConfirmStatus] = useState({});
  const [cancelStatus, setCancelStatus] = useState({});
  const [guideOptionsByBooking, setGuideOptionsByBooking] = useState({});
  const [selectedGuideByBooking, setSelectedGuideByBooking] = useState({});
  const [assignStatus, setAssignStatus] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const statusBookings = useMemo(
    () => bookings.filter(isVisibleBooking).map(mapBooking),
    [bookings],
  );
  const sectionCounts = useMemo(
    () =>
      BOOKING_SECTIONS.reduce(
        (counts, section) => ({
          ...counts,
          [section.key]: statusBookings.filter(section.match).length,
        }),
        {},
      ),
    [statusBookings],
  );
  const activeSectionConfig =
    BOOKING_SECTIONS.find((section) => section.key === activeSection) ||
    BOOKING_SECTIONS[0];

  const displayedBookings = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return statusBookings
      .filter(activeSectionConfig.match)
      .filter((booking) => {
        if (!normalizedSearch) return true;
        return String(getBookingId(booking))
          .toLowerCase()
          .includes(normalizedSearch);
      })
  }, [activeSectionConfig, searchQuery, statusBookings]);
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
          setPageError(
            error.message || "Pending bookings could not be loaded.",
          );
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

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    setPageError("");
    setCancelStatus((current) => ({
      ...current,
      [bookingId]: { loading: true, error: "" },
    }));

    try {
      const response = await cancelAdminBooking(bookingId);
      const returnedBooking =
        response?.booking ||
        response?.cancelledBooking ||
        response?.data?.booking ||
        response?.data?.cancelledBooking ||
        (response?.status || response?.paymentStatus ? response : null);

      setBookings((current) =>
        current.map((booking) => {
          if ((booking._id || booking.id || booking.bookingId) !== bookingId) {
            return booking;
          }

          return {
            ...booking,
            ...(returnedBooking && typeof returnedBooking === "object"
              ? returnedBooking
              : {}),
            status: returnedBooking?.status || "Cancelled",
            paymentStatus:
              returnedBooking?.paymentStatus || booking.paymentStatus,
          };
        }),
      );
    } catch (error) {
      const message = error.message || "Booking could not be cancelled.";
      setCancelStatus((current) => ({
        ...current,
        [bookingId]: { loading: false, error: message },
      }));
      toast.error(message);
      return;
    }

    setCancelStatus((current) => ({
      ...current,
      [bookingId]: { loading: false, error: "" },
    }));
  };

  const loadAvailableGuides = async (bookingId, force = false) => {
    if (!bookingId) return;

    const existingOptions = guideOptionsByBooking[bookingId];
    if (!force && (existingOptions?.loaded || existingOptions?.loading)) return;

    setGuideOptionsByBooking((current) => ({
      ...current,
      [bookingId]: {
        ...(current[bookingId] || {}),
        loading: true,
        error: "",
      },
    }));

    try {
      const data = await getAvailableGuidesForBooking(bookingId);
      setGuideOptionsByBooking((current) => ({
        ...current,
        [bookingId]: {
          loading: false,
          loaded: true,
          error: "",
          guides: getGuideArray(data).map(normalizeGuide).filter(Boolean),
        },
      }));
    } catch (error) {
      const message = error.message || "Available guides could not be loaded.";
      setGuideOptionsByBooking((current) => ({
        ...current,
        [bookingId]: {
          ...(current[bookingId] || {}),
          loading: false,
          loaded: true,
          error: message,
          guides: [],
        },
      }));
      toast.error(message);
    }
  };

  const handleAssignGuide = async (bookingId) => {
    const guideId = selectedGuideByBooking[bookingId];
    if (!guideId) {
      toast.error("Select a guide before assigning.");
      return;
    }

    setPageError("");
    setAssignStatus((current) => ({
      ...current,
      [bookingId]: { loading: true, error: "" },
    }));

    try {
      const response = await assignGuideToBooking(bookingId, guideId);
      const returnedBooking = response?.booking || response?.data?.booking;
      const refreshedBookings = await getAdminBookings().catch(() => null);

      if (Array.isArray(refreshedBookings)) {
        setBookings(refreshedBookings);
      } else if (returnedBooking) {
        setBookings((current) =>
          current.map((booking) =>
            getBookingId(booking) === bookingId ? returnedBooking : booking,
          ),
        );
      }

      setAssignStatus((current) => ({
        ...current,
        [bookingId]: { loading: false, error: "" },
      }));
    } catch (error) {
      const message = error.message || "Guide could not be assigned.";
      setAssignStatus((current) => ({
        ...current,
        [bookingId]: { loading: false, error: message },
      }));
      toast.error(message);
    }
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
    const confirmAction = confirmStatus[booking.id] || {};
    const cancelAction = cancelStatus[booking.id] || {};
    const guideOptions = guideOptionsByBooking[booking.id] || {};
    const assignAction = assignStatus[booking.id] || {};
    const canConfirm = isPendingBooking(booking);
    const canCancel = isPendingBooking(booking) || isConfirmedBooking(booking);
    const canAssignGuide =
      booking.guideIncluded && !isCancelledBooking(booking);
    const selectedGuideId =
      selectedGuideByBooking[booking.id] ?? booking.assignedGuide?.id ?? "";
    const guideOptionsList = guideOptions.guides || [];
    const selectedAssignedGuideMissing =
      booking.assignedGuide &&
      !guideOptionsList.some((guide) => guide.id === booking.assignedGuide.id);
    const actionError =
      confirmAction.error ||
      cancelAction.error ||
      assignAction.error ||
      guideOptions.error;

    return (
      <li
        key={booking.id || `booking-${index}`}
        className="rounded-2xl border border-slate-200 p-4 transition hover:border-gray-300 hover:shadow-sm"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 break-words">
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

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {canConfirm && (
              <button
                type="button"
                onClick={() => handleConfirmBooking(booking.id)}
                disabled={
                  !booking.id || confirmAction.loading || assignAction.loading
                }
                className="w-full rounded-xl bg-[#0b1d3a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#132b52] disabled:cursor-not-allowed disabled:bg-slate-300 sm:w-auto"
              >
                {confirmAction.loading ? "Confirming..." : "Confirm Booking"}
              </button>
            )}
            {canCancel && (
              <button
                type="button"
                onClick={() => handleCancelBooking(booking.id)}
                disabled={!booking.id || cancelAction.loading}
                className="w-full rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {cancelAction.loading ? "Cancelling..." : "Cancel Booking"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-slate-400">
                Assigned guide
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {booking.assignedGuide
                  ? getGuideLabel(booking.assignedGuide)
                  : "Not assigned"}
              </p>
            </div>
            {canAssignGuide && canConfirm && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
                Assign before or while confirming
              </span>
            )}
          </div>

          {canAssignGuide && (
            <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <select
                value={selectedGuideId}
                onFocus={() => loadAvailableGuides(booking.id)}
                onClick={() => loadAvailableGuides(booking.id)}
                onChange={(event) =>
                  setSelectedGuideByBooking((current) => ({
                    ...current,
                    [booking.id]: event.target.value,
                  }))
                }
                disabled={guideOptions.loading || assignAction.loading}
                className="min-w-0 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">
                  {guideOptions.loading
                    ? "Loading guides..."
                    : "Select available guide"}
                </option>
                {selectedAssignedGuideMissing && (
                  <option value={booking.assignedGuide.id}>
                    {getGuideLabel(booking.assignedGuide)}
                  </option>
                )}
                {guideOptionsList.map((guide) => (
                  <option key={guide.id} value={guide.id}>
                    {getGuideLabel(guide)}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleAssignGuide(booking.id)}
                disabled={
                  !booking.id ||
                  !selectedGuideId ||
                  guideOptions.loading ||
                  assignAction.loading
                }
                className="w-full rounded-xl bg-amber-400 px-4 py-2 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300 lg:w-auto"
              >
                {assignAction.loading ? "Assigning..." : "Assign Guide"}
              </button>
            </div>
          )}

          {canAssignGuide &&
            guideOptions.loaded &&
            !guideOptions.loading &&
            guideOptionsList.length === 0 && (
              <p className="mt-3 text-sm font-semibold text-slate-500">
                No available guides for this booking.
              </p>
            )}
        </div>

        <dl className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-5">
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Trip Date
            </dt>
            <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
              {booking.tripDate}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Duration
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.tripDuration}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Guests
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.guestCount}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Total price
            </dt>
            <dd className="mt-1 break-words text-sm font-semibold text-slate-800">
              {booking.totalPrice}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Payment
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.paymentStatus}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Status
            </dt>
            <dd
              className={`mt-1 text-sm font-semibold ${
                isCancelledBooking(booking)
                  ? "text-red-700"
                  : isConfirmedBooking(booking)
                    ? "text-emerald-700"
                    : "text-gray-700"
              }`}
            >
              {booking.status}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Created
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.createdDate}
            </dd>
          </div>
          <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
            <dt className="text-xs font-semibold uppercase text-slate-400">
              Guide requested
            </dt>
            <dd className="mt-1 text-sm font-semibold text-slate-800">
              {booking.guideIncluded ? "Yes" : "No"}
            </dd>
          </div>
        </dl>

        {actionError && (
          <p className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {actionError}
          </p>
        )}
      </li>
    );
  };

  return (
    <AdminLayout adminName={user?.name || admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
            <p className="mt-1 text-sm text-slate-500">
              Switch between pending, confirmed, and cancelled customer
              bookings.
            </p>
          </div>
          <span className="w-fit rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700">
            {sectionCounts.pending || 0} pending /{" "}
            {sectionCounts.confirmed || 0} confirmed /{" "}
            {sectionCounts.cancelled || 0} cancelled
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 rounded-2xl bg-slate-50 p-2">
          {BOOKING_SECTIONS.map((section) => {
            const isActive = activeSection === section.key;

            return (
              <button
                key={section.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveSection(section.key)}
                className={`min-w-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#0b1d3a] text-white shadow-sm"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                {section.label} ({sectionCounts[section.key] || 0})
              </button>
            );
          })}
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
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
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

        {isLoading ? (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
            Loading bookings...
          </p>
        ) : displayedBookings.length > 0 ? (
          <section className="mt-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">
                {activeSectionConfig.title}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${activeSectionConfig.badgeClass}`}
              >
                {displayedBookings.length}
              </span>
            </div>
            <ul className="mt-3 space-y-4">
              {displayedBookings.map((booking, index) =>
                renderBookingCard(booking, index),
              )}
            </ul>
          </section>
        ) : pageError ? null : (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-5 text-sm font-medium text-slate-500">
            {hasActiveSearch
              ? "No booking found for this ID."
              : activeSectionConfig.emptyMessage}
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
