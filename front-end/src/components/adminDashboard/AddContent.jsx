import { useState } from "react";
import { createHiddenGem, createOffering } from "@/services/contentServices";
import { createTrip } from "@/services/tripServices";

const initialTripForm = {
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

const initialOfferingForm = {
  title: "",
  city: "",
  description: "",
  price: "",
  image: null,
};

const initialHiddenGemForm = {
  PlaceName: "",
  city: "",
  Description: "",
  image: null,
};

const tabs = [
  { id: "trip", label: "Trip" },
  { id: "offerings", label: "Offerings" },
  { id: "hiddenGems", label: "Hidden Gems" },
];

const hiddenGemCityOptions = [
  "Cairo",
  "Alexandria",
  "Luxor",
  "Aswan",
  "Siwa",
  "Sharm El Sheikh",
];

function buildFormData(values, fields) {
  const formData = new FormData();

  fields.forEach((field) => {
    const value = values[field];
    if (field === "image") {
      if (value) formData.append("image", value);
      return;
    }
    formData.append(field, String(value ?? ""));
  });

  return formData;
}

function FormField({ label, children, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100";

export default function AddContent() {
  const [selectedType, setSelectedType] = useState("trip");
  const [tripForm, setTripForm] = useState(initialTripForm);
  const [offeringForm, setOfferingForm] = useState(initialOfferingForm);
  const [hiddenGemForm, setHiddenGemForm] = useState(initialHiddenGemForm);
  const [loadingType, setLoadingType] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  function updateForm(setter) {
    return (event) => {
      const { name, value, type, checked, files } = event.target;
      setter((current) => ({
        ...current,
        [name]: type === "checkbox" ? checked : type === "file" ? files?.[0] || null : value,
      }));
    };
  }

  async function handleTripSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoadingType("trip");

    try {
      const formData = buildFormData(tripForm, [
        "name",
        "city",
        "location",
        "price",
        "duration",
        "description",
        "AdvantureType",
        "AdvantureDescription",
        "guideAvailable",
        "guidefees",
        "guestCapacity",
        "image",
      ]);

      await createTrip(formData);
      setTripForm(initialTripForm);
      setStatus({ type: "success", message: "Trip created successfully." });
      window.dispatchEvent(new Event("kemet:trips-updated"));
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Trip could not be created." });
    } finally {
      setLoadingType("");
    }
  }

  async function handleOfferingSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoadingType("offerings");

    try {
      const formData = buildFormData(offeringForm, [
        "title",
        "city",
        "description",
        "price",
        "image",
      ]);

      await createOffering(formData);
      setOfferingForm(initialOfferingForm);
      setStatus({ type: "success", message: "Offering created successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Offering could not be created." });
    } finally {
      setLoadingType("");
    }
  }

  async function handleHiddenGemSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    setLoadingType("hiddenGems");

    try {
      const formData = buildFormData(hiddenGemForm, [
        "PlaceName",
        "Description",
        "image",
      ]);
      if (hiddenGemForm.city.trim()) {
        formData.append("city", hiddenGemForm.city.trim());
      }

      await createHiddenGem(formData);
      setHiddenGemForm(initialHiddenGemForm);
      setStatus({ type: "success", message: "Hidden gem created successfully." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Hidden gem could not be created." });
    } finally {
      setLoadingType("");
    }
  }

  return (
    <div className="bg-white">
      <h2 className="text-center text-2xl font-black text-slate-950 sm:text-3xl">
        Add New Content
      </h2>
      <p className="mt-2 text-center text-sm text-slate-500">
        Choose a content type and publish it to the live backend.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-slate-50 p-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setSelectedType(tab.id);
              setStatus({ type: "", message: "" });
            }}
            className={`rounded-xl px-3 py-3 text-xs font-extrabold uppercase tracking-[0.12em] transition sm:text-sm ${
              selectedType === tab.id
                ? "bg-amber-400 text-slate-950 shadow-sm"
                : "text-slate-500 hover:bg-white hover:text-slate-900"
            }`}
          >
            {tab.label}
          </button>
        ))}
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

      {selectedType === "trip" && (
        <form onSubmit={handleTripSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <FormField label="Trip Name">
            <input name="name" value={tripForm.name} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="City">
            <input name="city" value={tripForm.city} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Location">
            <input name="location" value={tripForm.location} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Price">
            <input name="price" type="number" min="1" value={tripForm.price} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Duration">
            <input name="duration" type="number" min="1" value={tripForm.duration} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Advanture Type">
            <input name="AdvantureType" value={tripForm.AdvantureType} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Guest Capacity">
            <input name="guestCapacity" type="number" min="1" value={tripForm.guestCapacity} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Guide Fee">
            <input name="guidefees" type="number" min="0" value={tripForm.guidefees} onChange={updateForm(setTripForm)} className={inputClass} />
          </FormField>
          <FormField label="Advanture Description" className="sm:col-span-2">
            <textarea name="AdvantureDescription" rows={3} value={tripForm.AdvantureDescription} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Description" className="sm:col-span-2">
            <textarea name="description" rows={4} value={tripForm.description} onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <FormField label="Image" className="sm:col-span-2">
            <input name="image" type="file" accept="image/*" onChange={updateForm(setTripForm)} required className={inputClass} />
          </FormField>
          <label className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold text-slate-700 sm:col-span-2">
            Guide available
            <input name="guideAvailable" type="checkbox" checked={tripForm.guideAvailable} onChange={updateForm(setTripForm)} className="h-4 w-4 accent-amber-400" />
          </label>
          <button type="submit" disabled={loadingType === "trip"} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300 sm:col-span-2">
            {loadingType === "trip" ? "Creating..." : "Create Trip"}
          </button>
        </form>
      )}

      {selectedType === "offerings" && (
        <form onSubmit={handleOfferingSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <FormField label="Offering Title">
            <input name="title" value={offeringForm.title} onChange={updateForm(setOfferingForm)} required className={inputClass} />
          </FormField>
          <FormField label="City">
            <input name="city" value={offeringForm.city} onChange={updateForm(setOfferingForm)} required className={inputClass} />
          </FormField>
          <FormField label="Price">
            <input name="price" type="number" min="1" value={offeringForm.price} onChange={updateForm(setOfferingForm)} required className={inputClass} />
          </FormField>
          <FormField label="Description" className="sm:col-span-2">
            <textarea name="description" rows={5} value={offeringForm.description} onChange={updateForm(setOfferingForm)} required className={inputClass} />
          </FormField>
          <FormField label="Image" className="sm:col-span-2">
            <input name="image" type="file" accept="image/*" onChange={updateForm(setOfferingForm)} required className={inputClass} />
          </FormField>
          <button type="submit" disabled={loadingType === "offerings"} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300 sm:col-span-2">
            {loadingType === "offerings" ? "Creating..." : "Create Offering"}
          </button>
        </form>
      )}

      {selectedType === "hiddenGems" && (
        <form onSubmit={handleHiddenGemSubmit} className="mt-6 grid gap-4">
          <FormField label="Place Name">
            <input name="PlaceName" value={hiddenGemForm.PlaceName} onChange={updateForm(setHiddenGemForm)} required className={inputClass} />
          </FormField>
          <FormField label="City (optional)">
            <select name="city" value={hiddenGemForm.city} onChange={updateForm(setHiddenGemForm)} className={inputClass}>
              <option value="">No city selected</option>
              {hiddenGemCityOptions.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Description">
            <textarea name="Description" rows={5} value={hiddenGemForm.Description} onChange={updateForm(setHiddenGemForm)} required className={inputClass} />
          </FormField>
          <FormField label="Image">
            <input name="image" type="file" accept="image/*" onChange={updateForm(setHiddenGemForm)} required className={inputClass} />
          </FormField>
          <button type="submit" disabled={loadingType === "hiddenGems"} className="rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300">
            {loadingType === "hiddenGems" ? "Creating..." : "Create Hidden Gem"}
          </button>
        </form>
      )}
    </div>
  );
}
