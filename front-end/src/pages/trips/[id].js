/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { getTripById } from "@/services/tripServices";

function getTripTitle(trip) {
  return trip?.title || trip?.name || "KEMET Trip";
}

function getTripImage(trip) {
  if (trip?.imageUrl) return trip.imageUrl;
  if (typeof trip?.image === "string") return trip.image;
  if (Array.isArray(trip?.image) && trip.image[0]?.imageUrl) return trip.image[0].imageUrl;
  return "/siwa.jpeg";
}

function getTripPrice(trip) {
  return Number(trip?.finalPrice || trip?.basePrice || trip?.price || 0);
}

function formatMoney(value) {
  return `EGP ${Number(value || 0).toLocaleString()}`;
}

export default function TripDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    async function loadTrip() {
      setLoading(true);
      setError("");
      try {
        setTrip(await getTripById(id));
      } catch (error) {
        setTrip(null);
        setError(error.message || "Trip could not be loaded.");
      } finally {
        setLoading(false);
      }
    }

    loadTrip();
  }, [id]);

  const details = useMemo(() => {
    if (!trip) return [];
    return [
      ["Location", trip.location || trip.city || "Egypt"],
      ["Category", trip.category || "Trip"],
      ["Duration", trip.duration || "N/A"],
      ["Rating", trip.rating || "N/A"],
      ["Price", formatMoney(getTripPrice(trip))],
    ];
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
          <p className="mt-3 text-sm text-slate-500">{error}</p>
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
          <p className="mt-3 text-sm text-slate-500">This trip is not available.</p>
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
      <section className="relative min-h-[420px] overflow-hidden bg-slate-900">
        <img
          src={getTripImage(trip)}
          alt={getTripTitle(trip)}
          onError={(event) => {
            event.currentTarget.src = "/siwa.jpeg";
          }}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-slate-950/20" />
        <div className="relative mx-auto flex min-h-[420px] max-w-6xl items-end px-4 py-10 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-white">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
              {trip.category || "KEMET Trip"}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-6xl">
              {getTripTitle(trip)}
            </h1>
            <p className="mt-4 text-base font-semibold text-slate-200">
              {trip.location || trip.city || "Egypt"}
            </p>
          </div>
        </div>
      </section>

      <article className="mx-auto -mt-14 grid max-w-6xl gap-6 px-4 pb-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Overview
          </p>
          <h2 className="mt-2 text-2xl font-extrabold text-slate-900">About This Trip</h2>
          <p className="mt-5 leading-8 text-slate-600">
            {trip.description || "No description available for this trip yet."}
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {details.slice(0, 4).map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-2 text-lg font-extrabold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
            Trip Price
          </p>
          <p className="mt-2 text-4xl font-extrabold text-slate-900">
            {formatMoney(getTripPrice(trip))}
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-500">Per guest</p>

          <div className="mt-6 space-y-3 text-sm">
            {details.map(([label, value]) => (
              <p key={label} className="flex justify-between gap-4 border-b border-slate-100 pb-3">
                <span className="text-slate-500">{label}</span>
                <strong className="text-right">{value}</strong>
              </p>
            ))}
          </div>

          <Link
            href="/BookTrip"
            className="mt-6 flex w-full justify-center rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300"
          >
            Book This Trip
          </Link>
        </aside>
      </article>
    </main>
  );
}
