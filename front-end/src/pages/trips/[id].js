/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getTripById } from "@/services/tripServices";

const NOT_AVAILABLE = "Not provided";
const ACCENT_LABEL_CLASSES = "text-xs font-bold uppercase tracking-[0.18em] text-amber-600";

function getImageValue(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTripTitle(trip) {
  return trip?.name || trip?.title || "Trip Details";
}

function getTripLocation(trip) {
  return trip?.location || trip?.city || NOT_AVAILABLE;
}

function getTripCategory(trip) {
  return trip?.category || trip?.AdvantureType || trip?.AdventureType || NOT_AVAILABLE;
}

function getTripDescription(trip) {
  return trip?.description || trip?.AdvantureDescription || trip?.AdventureDescription || "No description available.";
}

function getTripDuration(trip) {
  return trip?.duration || NOT_AVAILABLE;
}

function getTripCity(trip) {
  return trip?.city || NOT_AVAILABLE;
}

function getTripId(trip, fallbackId = "") {
  return trip?._id || trip?.id || trip?.tripId || fallbackId;
}

function getTripImage(trip) {
  if (Array.isArray(trip?.image)) return getImageValue(trip.image[0]);
  if (trip?.imageUrl) return trip.imageUrl;
  if (Array.isArray(trip?.images)) return getImageValue(trip.images[0]);
  if (trip?.image) return getImageValue(trip.image);
  if (trip?.images) return getImageValue(trip.images);
  return "";
}

function getTripPrice(trip) {
  const value = trip?.finalPrice ?? trip?.price ?? trip?.basePrice;
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

function getBasePrice(trip) {
  const value = trip?.basePrice ?? trip?.price;
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

function getFinalPrice(trip) {
  const value = trip?.finalPrice ?? trip?.price;
  if (value === undefined || value === null || value === "") return null;
  return Number(value);
}

function getGuideAvailability(trip) {
  if (trip?.guideAvailable === true) return "Available";
  if (trip?.guideAvailable === false) return "Not included";
  return NOT_AVAILABLE;
}

function getGuideFees(trip) {
  if (trip?.guidefees === undefined || trip?.guidefees === null || trip?.guidefees === "") {
    return null;
  }
  return Number(trip.guidefees);
}

function getGuestCapacity(trip) {
  if (trip?.guestCapacity === undefined || trip?.guestCapacity === null || trip?.guestCapacity === "") {
    return NOT_AVAILABLE;
  }
  return Number(trip.guestCapacity).toLocaleString();
}

function formatMoney(value) {
  if (value === null || Number.isNaN(Number(value))) return NOT_AVAILABLE;
  return `EGP ${Number(value).toLocaleString()}`;
}

function DetailCard({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className={ACCENT_LABEL_CLASSES}>{label}</p>
      <p className="mt-2 break-words text-base font-extrabold text-slate-900 sm:text-lg">{value}</p>
    </div>
  );
}

export default function TripDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const tripId = Array.isArray(id) ? id[0] : id;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    if (!tripId) return;

    async function loadTrip() {
      setLoading(true);
      setError("");
      try {
        const tripDetails = await getTripById(tripId);
        setTrip(tripDetails || null);
        setImageFailed(false);
      } catch (error) {
        setTrip(null);
        setError("Could not load trip details.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [tripId]);

  const imageSrc = useMemo(() => getTripImage(trip), [trip]);

  const overviewDetails = useMemo(() => {
    if (!trip) return [];
    return [
      ["City", getTripCity(trip)],
      ["Location", getTripLocation(trip)],
      ["Category", getTripCategory(trip)],
      ["Duration", getTripDuration(trip)],
      ["Guest Capacity", getGuestCapacity(trip)],
      ["Guide", getGuideAvailability(trip)],
    ].filter(([, value]) => value !== undefined && value !== null && value !== "" && value !== NOT_AVAILABLE);
  }, [trip]);

  const priceDetails = useMemo(() => {
    if (!trip) return [];
    const guideFees = getGuideFees(trip);
    return [
      ["Base price", formatMoney(getBasePrice(trip))],
      ["Guide fee", guideFees === null || trip.guideAvailable === false ? "" : formatMoney(guideFees)],
      ["Final price", formatMoney(getFinalPrice(trip))],
      ["Guest capacity", getGuestCapacity(trip)],
    ].filter(([, value]) => value !== undefined && value !== null && value !== "");
  }, [trip]);

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm font-semibold text-slate-500 shadow-sm">
          Loading trip details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">Trip Details Error</h1>
          <p className="mt-3 text-sm text-slate-500">{error || "Could not load trip details."}</p>
          <Link
            href="/BookTrip"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300"
          >
            Back to Booking
          </Link>
        </div>
      </main>
    );
  }

  if (!trip) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-extrabold text-slate-900">Trip Not Found</h1>
          <p className="mt-3 text-sm text-slate-500">Trip not found.</p>
          <Link
            href="/BookTrip"
            className="mt-6 inline-flex rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300"
          >
            Back to Booking
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="relative h-64 w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 sm:h-80 lg:h-[460px]">
          {imageSrc && !imageFailed && (
            <img
              src={imageSrc}
              alt={getTripTitle(trip)}
              onError={() => {
                setImageFailed(true);
              }}
              className="h-full w-full object-cover object-center"
            />
          )}
        </section>

        <article className="mt-8 grid w-full grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <section className="space-y-7">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.18em] text-slate-950">
                {getTripCategory(trip)}
              </p>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950 sm:text-5xl">
                {getTripTitle(trip)}
              </h1>
              <p className="mt-3 text-sm font-semibold text-slate-600 sm:text-lg">
                {getTripLocation(trip)}
              </p>
              <p className={`mt-8 ${ACCENT_LABEL_CLASSES}`}>Overview</p>
              <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">About This Trip</h2>
              <p className="mt-5 leading-8 text-slate-600">
                {getTripDescription(trip)}
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <p className={ACCENT_LABEL_CLASSES}>Details</p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {overviewDetails.map(([label, value]) => (
                  <DetailCard key={label} label={label} value={value} />
                ))}
                {overviewDetails.length === 0 && (
                  <p className="rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
                    No additional trip details are available.
                  </p>
                )}
              </div>
            </div>
          </section>

          <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-md shadow-slate-200/70 sm:p-7 lg:sticky lg:top-28">
            <p className={ACCENT_LABEL_CLASSES}>Trip Price</p>
            <p className="mt-2 text-4xl font-extrabold text-slate-900">
              {formatMoney(getTripPrice(trip))}
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-500">Per guest</p>

            <div className="mt-6 space-y-3 text-sm">
              {priceDetails.map(([label, value]) => (
                <p key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                  <span className={ACCENT_LABEL_CLASSES}>{label}</span>
                  <strong className="text-right text-slate-900">{value}</strong>
                </p>
              ))}
            </div>

            <Link
              href={{
                pathname: "/BookTrip",
                query: { tripId: getTripId(trip, tripId) },
              }}
              className="mt-6 flex w-full justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm shadow-amber-200 hover:bg-amber-300"
            >
              Book This Trip
            </Link>
          </aside>
        </article>
      </div>
    </main>
  );
}
