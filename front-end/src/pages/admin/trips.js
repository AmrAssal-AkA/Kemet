import { useEffect, useState } from "react";
import Image from "next/image";
import AdminLayout from "@/components/adminDashboard/AdminLayout";
import { useAuth } from "@/context/AuthContext";
import { requireAdmin } from "@/services/adminService";
import { deleteTrip, getAdminTrips, getTrips, updateTrip } from "@/services/tripServices";
import toast from "react-hot-toast";

const emptyEditForm = {
  name: "",
  city: "",
  location: "",
  price: "",
  duration: "",
  description: "",
  AdvantureType: "",
  AdvantureDescription: "",
  guideAvailable: false,
  guidefees: "0",
  guestCapacity: "1",
  image: null,
};

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";
const FALLBACK_IMAGE = "/siwa.jpeg";

function getTripId(trip) {
  return trip?._id || trip?.id || trip?.tripId;
}

function getImageValue(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getRawTripImage(trip) {
  if (trip?.imageUrl) return trip.imageUrl;

  const image = trip?.image;
  if (Array.isArray(image)) {
    const firstImage = getImageValue(image[0]);
    if (firstImage) return firstImage;
  } else {
    const imageValue = getImageValue(image);
    if (imageValue) return imageValue;
  }

  const images = trip?.images;
  if (Array.isArray(images)) {
    const firstImage = getImageValue(images[0]);
    if (firstImage) return firstImage;
  } else {
    const imageValue = getImageValue(images);
    if (imageValue) return imageValue;
  }

  return "";
}

function getTripImage(trip) {
  return getRawTripImage(trip) || FALLBACK_IMAGE;
}

function getTripPrice(trip) {
  return trip?.price ?? trip?.basePrice ?? 0;
}

function buildEditForm(trip) {
  return {
    name: trip?.name || trip?.title || "",
    city: trip?.city || "",
    location: trip?.location || "",
    price: String(getTripPrice(trip) || ""),
    duration: String(trip?.duration || ""),
    description: trip?.description || "",
    AdvantureType: trip?.AdvantureType || trip?.AdventureType || trip?.category || "",
    AdvantureDescription:
      trip?.AdvantureDescription || trip?.AdventureDescription || trip?.description || "",
    guideAvailable: Boolean(trip?.guideAvailable),
    guidefees: String(trip?.guidefees || 0),
    guestCapacity: String(trip?.guestCapacity || 1),
    image: null,
  };
}

function appendEditFormData(form) {
  const formData = new FormData();
  const basePrice = Number(form.price || 0);
  const guidefees = Number(form.guidefees || 0);
  const finalPrice = (form.guideAvailable ? basePrice + guidefees : basePrice) * 1.14;

  formData.append("name", form.name);
  formData.append("city", form.city);
  formData.append("location", form.location);
  formData.append("price", String(basePrice));
  formData.append("basePrice", String(basePrice));
  formData.append("finalPrice", String(finalPrice));
  formData.append("duration", String(form.duration));
  formData.append("description", form.description);
  formData.append("category", form.AdvantureType);
  formData.append("AdvantureType", form.AdvantureType);
  formData.append("AdventureType", form.AdvantureType);
  formData.append("AdvantureDescription", form.AdvantureDescription);
  formData.append("AdventureDescription", form.AdvantureDescription);
  formData.append("guideAvailable", String(Boolean(form.guideAvailable)));
  formData.append("guidefees", String(form.guidefees || 0));
  formData.append("guestCapacity", String(form.guestCapacity || 1));
  if (form.image) {
    formData.append("image", form.image);
  }
  return formData;
}

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

function Detail({ label, value }) {
  if (value === undefined || value === null || value === "") return null;

  return (
    <p className="text-sm text-slate-600">
      <span className="font-bold text-slate-800">{label}: </span>
      {String(value)}
    </p>
  );
}

export default function AdminTrips({ admin, initialTrips = [], initialError = "" }) {
  const { logout } = useAuth();
  const [trips, setTrips] = useState(initialTrips);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [editingTrip, setEditingTrip] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [status, setStatus] = useState({
    type: initialError ? "error" : "",
    message: initialError,
  });

  async function refreshTrips() {
    setLoading(true);
    try {
      const freshTrips = await getTrips({ force: true });
      setTrips(freshTrips);
      setStatus((current) => current.type === "error" ? { type: "", message: "" } : current);
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Trips could not be loaded." });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    window.addEventListener("kemet:trips-updated", refreshTrips);
    return () => window.removeEventListener("kemet:trips-updated", refreshTrips);
  }, []);

  function openEditModal(trip) {
    setEditingTrip(trip);
    setEditForm(buildEditForm(trip));
    setStatus({ type: "", message: "" });
  }

  function closeEditModal() {
    setEditingTrip(null);
    setEditForm(emptyEditForm);
  }

  function handleEditChange(event) {
    const { name, value, type, checked, files } = event.target;
    setEditForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
    }));
  }

  async function handleDelete(trip) {
    const tripId = getTripId(trip);
    if (!tripId) return;

    setActionLoading(`delete-${tripId}`);
    setStatus({ type: "", message: "" });

    try {
      await deleteTrip(tripId);
      setTrips((current) => current.filter((item) => getTripId(item) !== tripId));
      setStatus({ type: "success", message: "Trip deleted successfully." });
      toast.success("Trip deleted successfully.");
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Trip could not be deleted." });
      toast.error("Failed to delete trip.");
    } finally {
      setActionLoading("");
    }
  }

  async function handleEditSubmit(event) {
    event.preventDefault();
    const tripId = getTripId(editingTrip);
    if (!tripId) return;

    setActionLoading(`edit-${tripId}`);
    setStatus({ type: "", message: "" });

    try {
      const updated = await updateTrip(tripId, appendEditFormData(editForm));
      const updatedTrip = updated?.trip || updated?.data?.trip || updated?.data || null;
      if (updatedTrip) {
        setTrips((current) =>
          current.map((trip) => (getTripId(trip) === tripId ? updatedTrip : trip)),
        );
      } else {
        await refreshTrips();
      }
      setStatus({ type: "success", message: "Trip updated successfully." });
      toast.success("Trip updated successfully.");
      closeEditModal();
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Trip could not be updated." });
      toast.error("Failed to update trip.");
    } finally {
      setActionLoading("");
    }
  }

  return (
    <AdminLayout adminName={admin?.name} onLogout={logout}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
              Trip Management
            </p>
            <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Trips</h1>
            <p className="mt-2 text-sm text-slate-500">
              Review, edit, and delete created trips from the live backend.
            </p>
          </div>
          <button
            type="button"
            onClick={refreshTrips}
            disabled={loading}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {loading ? "Refreshing..." : "Refresh Trips"}
          </button>
        </div>

        {status.message && (
          <p
            className={`mt-5 rounded-2xl px-4 py-3 text-sm font-semibold ${
              status.type === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-red-50 text-red-600"
            }`}
          >
            {status.message}
          </p>
        )}

        {loading ? (
          <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            Loading trips...
          </p>
        ) : trips.length > 0 ? (
          <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {trips.map((trip) => {
              const tripId = getTripId(trip);
              const imageUrl = getTripImage(trip);

              return (
                <article key={tripId} className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 shadow-sm ">
                  <Image
                    src={imageUrl}
                    alt={trip.name || "Trip image"}
                    width={800}
                    height={420}
                    unoptimized
                    className="h-40 w-full object-cover"
                  />
                  <div className="flex flex-1 flex-col p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900">
                          {trip.name || trip.title || "Untitled Trip"}
                        </h2>
                        <p className="mt-1 text-sm font-semibold text-amber-700">
                          EGP {Number(getTripPrice(trip) || 0).toLocaleString()}
                          {trip.finalPrice ? ` / Final EGP ${Number(trip.finalPrice).toLocaleString()}` : ""}
                        </p>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-500">
                        {trip.AdvantureType || trip.AdventureType || trip.category || "Trip"}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2">
                      <Detail label="City" value={trip.city} />
                      <Detail label="Location" value={trip.location} />
                      <Detail label="Duration" value={trip.duration} />
                      <Detail label="Advanture Description" value={trip.AdvantureDescription || trip.AdventureDescription} />
                      <Detail label="Description" value={trip.description} />
                      <Detail label="Guide Available" value={trip.guideAvailable ? "Yes" : "No"} />
                      <Detail label="Guide Fees" value={trip.guidefees} />
                      <Detail label="Guest Capacity" value={trip.guestCapacity} />
                    </div>

                    <div className="mt-auto flex flex-col gap-3 pt-5 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => openEditModal(trip)}
                        className="rounded-full bg-[#0b1d3a] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#132b52]"
                      >
                        Edit Trip
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(trip)}
                        disabled={actionLoading === `delete-${tripId}`}
                        className="rounded-full border border-red-200 px-5 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
                      >
                        {actionLoading === `delete-${tripId}` ? "Deleting..." : "Delete Trip"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-6 rounded-2xl bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            No trips found yet.
          </p>
        )}
      </section>

      {editingTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-600">
                  Edit Trip
                </p>
                <h2 className="mt-1 text-2xl font-extrabold text-slate-900">
                  {editingTrip.name || "Trip Details"}
                </h2>
              </div>
              <button type="button" onClick={closeEditModal} className="rounded-full px-3 py-1 text-2xl text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                x
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
              {getRawTripImage(editingTrip) && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    Current Image
                  </p>
                  <Image
                    src={getRawTripImage(editingTrip)}
                    alt={editingTrip.name || "Current trip image"}
                    width={800}
                    height={360}
                    unoptimized
                    className="mt-2 h-48 w-full rounded-2xl object-cover"
                  />
                </div>
              )}
              <Field label="Trip Name">
                <input name="name" value={editForm.name} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="City">
                <input name="city" value={editForm.city} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Location">
                <input name="location" value={editForm.location} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Price">
                <input name="price" type="number" min="1" value={editForm.price} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Duration">
                <input name="duration" type="number" min="1" value={editForm.duration} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Advanture Type">
                <input name="AdvantureType" value={editForm.AdvantureType} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Guide Fee">
                <input name="guidefees" type="number" min="0" value={editForm.guidefees} onChange={handleEditChange} className={inputClass} />
              </Field>
              <Field label="Guest Capacity">
                <input name="guestCapacity" type="number" min="1" value={editForm.guestCapacity} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Advanture Description" className="sm:col-span-2">
                <textarea name="AdvantureDescription" rows={3} value={editForm.AdvantureDescription} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="Description" className="sm:col-span-2">
                <textarea name="description" rows={4} value={editForm.description} onChange={handleEditChange} required className={inputClass} />
              </Field>
              <Field label="New Image (optional)" className="sm:col-span-2">
                <input name="image" type="file" accept="image/*" onChange={handleEditChange} className={inputClass} />
              </Field>
              <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:col-span-2">
                Guide available
                <input name="guideAvailable" type="checkbox" checked={editForm.guideAvailable} onChange={handleEditChange} className="h-4 w-4 accent-amber-400" />
              </label>
              <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeEditModal} className="rounded-full border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={actionLoading === `edit-${getTripId(editingTrip)}`} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300">
                  {actionLoading === `edit-${getTripId(editingTrip)}` ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
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
