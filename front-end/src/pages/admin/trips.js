import { useMemo, useState } from "react";
import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { requireAdmin } from "@/services/adminService";
import { createTrip, getAdminTrips } from "@/services/tripServices";

const initialForm = {
  title: "",
  city: "",
  location: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: null,
  guideAvailable: false,
  guidefees: "0",
  guestCapacity: "1",
};

export default function AdminTrips({ admin, initialTrips = [], initialError = "" }) {
  const { logout } = useAuth();
  const [trips] = useState(initialTrips);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: initialError ? "error" : "", message: initialError });

  const pricePreview = useMemo(() => {
    const basePrice = Number(form.price || 0);
    const guideCost = form.guideAvailable ? Number(form.guidefees || 0) : 0;
    return {
      basePrice,
      guideCost,
      finalPrice: basePrice + guideCost,
    };
  }, [form.guideAvailable, form.guidefees, form.price]);

  function handleChange(event) {
    const { name, value, type, checked, files } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (Number(form.price) < 1) {
      setStatus({ type: "error", message: "Price must be at least 1." });
      return;
    }

    if (Number(form.guidefees) < 0) {
      setStatus({ type: "error", message: "Guide fee cannot be negative." });
      return;
    }

    if (Number(form.guestCapacity) < 1) {
      setStatus({ type: "error", message: "Guest capacity must be at least 1." });
      return;
    }

    setLoading(true);
    try {
      await createTrip({
        ...form,
        name: form.title,
        price: pricePreview.basePrice,
        guideAvailable: form.guideAvailable,
        guidefees: pricePreview.guideCost,
        guestCapacity: Number(form.guestCapacity),
      });
      setStatus({ type: "success", message: "Trip created successfully." });
      setForm(initialForm);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Trip could not be created." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
            Trip Management
          </p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Create Trip</h1>
          <p className="mt-2 text-sm text-slate-500">
            Add database trips manually so they appear in the booking form.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Trip title/name">
              <input name="title" value={form.title} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="City">
              <input name="city" value={form.city} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Location">
              <input name="location" value={form.location} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Category">
              <input name="category" value={form.category} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Price">
              <input name="price" type="number" min="1" value={form.price} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Duration">
              <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Image">
              <input type="file" name="image" onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Guide fee">
              <input name="guidefees" type="number" min="0" value={form.guidefees} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Guest capacity">
              <input name="guestCapacity" type="number" min="1" value={form.guestCapacity} onChange={handleChange} required className={inputClass} />
            </Field>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 sm:col-span-2">
              Guide available for this trip
              <input
                type="checkbox"
                name="guideAvailable"
                checked={form.guideAvailable}
                onChange={handleChange}
                className="h-4 w-4 accent-amber-400"
              />
            </label>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                name="description"
                rows={5}
                value={form.description}
                onChange={handleChange}
                required
                className={inputClass}
              />
            </Field>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h2 className="text-lg font-extrabold text-slate-900">Price Preview</h2>
            <div className="mt-4 space-y-3 text-sm">
              <p className="flex justify-between">
                <span>Base Trip Price</span>
                <strong>EGP {pricePreview.basePrice.toLocaleString()}</strong>
              </p>
              <p className="flex justify-between">
                <span>Guide Fee</span>
                <strong>EGP {pricePreview.guideCost.toLocaleString()}</strong>
              </p>
              <p className="flex justify-between border-t border-slate-200 pt-3 text-base">
                <span className="font-bold">Final Trip Price</span>
                <strong>EGP {pricePreview.finalPrice.toLocaleString()}</strong>
              </p>
            </div>

            {status.message && (
              <p
                className={`mt-4 rounded-xl p-3 text-sm font-semibold ${
                  status.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-full bg-[#0b1d3a] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#132b52] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? "Creating..." : "Create Trip"}
            </button>
          </aside>
        </form>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <h2 className="text-xl font-extrabold text-slate-900">Current Trips</h2>
          {trips.length > 0 ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {trips.map((trip) => (
                <article key={trip._id || trip.tripId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{trip.name || trip.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{trip.location || trip.city || "Egypt"}</p>
                  <p className="mt-2 text-sm font-semibold text-amber-700">
                    EGP {Number(trip.price || 0).toLocaleString()}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Capacity: {trip.guestCapacity || 0} | Guide: {trip.guideAvailable ? "Available" : "Unavailable"}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm font-semibold text-slate-500">
              No trips found yet.
            </p>
          )}
        </div>
      </section>
    </AdminLayout>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

function Field({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export async function getServerSideProps(context) {
  const adminSession = await requireAdmin(context);
  if (adminSession.redirect) return adminSession;

  try {
    const initialTrips = await getAdminTrips(adminSession.cookie);
    return { props: { admin: adminSession.admin, initialTrips, initialError: "" } };
  } catch (error) {
    console.error("Admin trip page verification error:", error.message);
    return {
      props: {
        admin: adminSession.admin,
        initialTrips: [],
        initialError: error.message || "Trips could not be loaded.",
      },
    };
  }
}
