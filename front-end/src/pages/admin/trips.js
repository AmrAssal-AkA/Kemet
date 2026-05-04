import jwt from "jsonwebtoken";
import { parse } from "cookie";
import { useMemo, useState } from "react";
import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { createTrip } from "@/services/tripServices";

const initialForm = {
  title: "",
  city: "",
  location: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  imageUrl: "",
  rating: "",
  requiresGuide: false,
  guideFee: "0",
  guestCapacity: "1",
};

export default function AdminTrips({ admin }) {
  const { logout } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const pricePreview = useMemo(() => {
    const basePrice = Number(form.price || 0);
    const guideFee = form.requiresGuide ? Number(form.guideFee || 0) : 0;
    return {
      basePrice,
      guideFee,
      finalPrice: basePrice + guideFee,
    };
  }, [form.guideFee, form.price, form.requiresGuide]);

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    if (Number(form.price) < 1) {
      setStatus({ type: "error", message: "Price must be at least 1." });
      return;
    }

    if (Number(form.guideFee) < 0) {
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
        basePrice: pricePreview.basePrice,
        guideFee: pricePreview.guideFee,
        guestCapacity: Number(form.guestCapacity),
        finalPrice: pricePreview.finalPrice,
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
            <Field label="Image URL">
              <input type="file" name="imageUrl" onChange={handleChange} required className={inputClass} />
            </Field>
            <Field label="Rating optional">
              <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Guide fee">
              <input name="guideFee" type="number" min="0" value={form.guideFee} onChange={handleChange} className={inputClass} />
            </Field>
            <Field label="Guest capacity">
              <input name="guestCapacity" type="number" min="1" value={form.guestCapacity} onChange={handleChange} required className={inputClass} />
            </Field>
            <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 sm:col-span-2">
              Guide available for this trip
              <input
                type="checkbox"
                name="requiresGuide"
                checked={form.requiresGuide}
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
                <strong>EGP {pricePreview.guideFee.toLocaleString()}</strong>
              </p>
              <p className="flex justify-between border-t border-slate-200 pt-3 text-base">
                <span className="font-bold">Final Trip Price</span> <span className="text-slate-500 text-xs"> (including 14% tax)</span>
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
  const { req } = context;
  const cookie = parse(req.headers.cookie || "");
  const token = cookie["x-auth-token"];

  if (!token) {
    return {
      redirect: { destination: "/auth/auth", permanent: false },
    };
  }

  try {
    const user = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET || process.env.JWT_SECRET,
    );

    if (user.role !== "admin") {
      return {
        redirect: { destination: "/", permanent: false },
      };
    }

    return { props: { admin: user } };
  } catch (error) {
    console.error("Admin trip page verification error:", error.message);
    return {
      redirect: { destination: "/auth/auth", permanent: false },
    };
  }
}
