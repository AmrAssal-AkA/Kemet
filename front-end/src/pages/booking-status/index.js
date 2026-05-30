import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

const LAST_BOOKING_ID_KEY = "kemet:lastBookingId";

function normalizeValue(value) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizePaymentStatus(paymentStatus, sessionId) {
  const normalized = String(paymentStatus || "").trim().toLowerCase();

  if (["paid", "success", "successful"].includes(normalized) || sessionId) {
    return "Paid";
  }

  if (normalized === "failed") return "Failed";
  if (normalized === "refunded") return "Refunded";
  if (normalized === "partiallyrefunded" || normalized === "partially-refunded") {
    return "PartiallyRefunded";
  }

  return "Pending";
}

function normalizeBookingStatus(status) {
  const normalized = String(status || "").trim().toLowerCase();

  if (normalized === "confirmed") return "Confirmed";
  if (normalized === "cancelled" || normalized === "canceled") return "Cancelled";

  return "Pending";
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textArea);
  }
}

function StatusIcon() {
  return (
    <div className="relative mx-auto flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
      <div className="absolute inset-0 rounded-full bg-emerald-100" />
      <div className="absolute inset-4 rounded-full border border-emerald-300" />
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="relative h-10 w-10 text-emerald-600 sm:h-12 sm:w-12"
        aria-hidden="true"
      >
        <path
          d="M5 12.5L10 17.5L19 7.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="absolute -left-1 top-5 h-3 w-3 text-amber-400"
        aria-hidden="true"
      >
        <path d="M8 1.5L9.5 6.5L14.5 8L9.5 9.5L8 14.5L6.5 9.5L1.5 8L6.5 6.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg
        viewBox="0 0 16 16"
        fill="none"
        className="absolute -right-2 top-9 h-2.5 w-2.5 text-emerald-500"
        aria-hidden="true"
      >
        <path d="M8 1.5L9.5 6.5L14.5 8L9.5 9.5L8 14.5L6.5 9.5L1.5 8L6.5 6.5L8 1.5Z" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function DetailIcon({ type }) {
  const paths = {
    payment: "M4 7.5C4 6.12 5.12 5 6.5 5h11C18.88 5 20 6.12 20 7.5v9c0 1.38-1.12 2.5-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5v-9ZM4.5 9h15M7 14h4",
    booking: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0a9 9 0 0 1 18 0Z",
    id: "M8 7h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2ZM9 7V5h6v2M10 12h.01M14 12h.01",
  };

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 sm:h-11 sm:w-11">
      <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" aria-hidden="true">
        <path
          d={paths[type]}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function DetailCard({ type, label, value, tone = "navy", action = null }) {
  const valueClass =
    tone === "green"
      ? "text-emerald-600"
      : tone === "gold"
        ? "text-amber-600"
        : "text-[#082653]";

  return (
    <article className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <DetailIcon type={type} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0b3a78]">
          {label}
        </p>
        <p className={`mt-1.5 wrap-break-word text-lg font-black sm:text-xl ${valueClass}`}>
          {value}
        </p>
      </div>
      {action}
    </article>
  );
}

export default function BookingStatusPage() {
  const router = useRouter();
  const [storedBookingId, setStoredBookingId] = useState("");
  const [copied, setCopied] = useState(false);

  const sessionId = normalizeValue(router.query.session_id);
  const queryBookingId = normalizeValue(router.query.bookingId);
  const paymentStatusQuery = normalizeValue(router.query.paymentStatus);
  const bookingStatusQuery =
    normalizeValue(router.query.bookingStatus) || normalizeValue(router.query.status);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const timer = window.setTimeout(() => {
      setStoredBookingId(window.sessionStorage.getItem(LAST_BOOKING_ID_KEY) || "");
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!copied) return undefined;

    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const paymentStatus = useMemo(
    () => normalizePaymentStatus(paymentStatusQuery, sessionId),
    [paymentStatusQuery, sessionId],
  );
  const bookingStatus = useMemo(
    () => normalizeBookingStatus(bookingStatusQuery),
    [bookingStatusQuery],
  );

  const bookingId = queryBookingId || storedBookingId || "Not available";
  const canCopyBookingId = bookingId && bookingId !== "Not available";
  const statusHeadline =
    bookingStatus === "Confirmed"
      ? "Confirmed"
      : bookingStatus === "Cancelled"
        ? "Cancelled"
        : "Waiting for Confirmation";

  const handleCopyBookingId = async () => {
    if (!canCopyBookingId) return;

    try {
      await copyTextToClipboard(bookingId);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="overflow-hidden bg-slate-50 px-4 py-8 text-[#082653] sm:px-6 sm:py-10 lg:px-8">
      <section className="mx-auto max-w-5xl rounded-3xl border border-white/80 bg-white/95 px-5 py-8 shadow-[0_18px_55px_rgba(8,38,83,0.09)] sm:px-7 sm:py-9 lg:px-10">
        <StatusIcon />

        <div className="mt-4 text-center">
          <h1 className="text-2xl font-black tracking-tight text-[#082653] sm:text-3xl lg:text-4xl">
            Payment Successful
          </h1>
          <p className="mt-3 text-sm font-medium text-slate-500 sm:text-base">
            Your payment was completed successfully.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50/80 px-4 py-6 text-center shadow-inner sm:px-6 lg:px-8">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-blue-700">
            Booking Status
          </p>
          <h2 className="mt-3 text-xl font-black text-[#082653] sm:text-2xl">
            {statusHeadline}
          </h2>
          <div className="mx-auto mt-4 flex max-w-xs items-center justify-center gap-4 text-amber-500">
            <span className="h-px flex-1 bg-amber-300" />
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 shrink-0" aria-hidden="true">
              <path
                d="M7 3h10M7 21h10M8 3c0 4 2 6 4 7c2-1 4-3 4-7M8 21c0-4 2-6 4-7c2 1 4 3 4 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="h-px flex-1 bg-amber-300" />
          </div>
          <p className="mx-auto mt-5 max-w-2xl text-sm font-medium leading-6 text-slate-600">
            Your booking is waiting for admin confirmation.
            <br className="hidden sm:block" />
            Once approved, it will appear as confirmed in your dashboard.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <DetailCard type="payment" label="Payment Status" value={paymentStatus} tone="green" />
          <DetailCard type="booking" label="Booking Status" value={bookingStatus} tone="gold" />
          <DetailCard
            type="id"
            label="Booking ID"
            value={bookingId}
            action={
              canCopyBookingId ? (
                <button
                  type="button"
                  onClick={handleCopyBookingId}
                  className="inline-flex min-w-10 shrink-0 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 px-2.5 py-2 text-xs font-extrabold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  aria-label="Copy booking ID"
                >
                  {copied ? (
                    "Copied!"
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 8h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2ZM4 14H3a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v1"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ) : null
            }
          />
        </div>

        <div className="mx-auto mt-6 grid max-w-md gap-3 sm:grid-cols-2">
          <Link
            href="/user-dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-amber-400 px-5 py-2.5 text-center text-sm font-extrabold text-[#082653] shadow-sm transition hover:bg-amber-300 focus:outline-none focus:ring-4 focus:ring-amber-100"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/user-dashboard"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-blue-300 bg-white px-5 py-2.5 text-center text-sm font-extrabold text-[#082653] shadow-sm transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
          >
            Back to Home
          </Link>
        </div>
      </section>
    </main>
  );
}
