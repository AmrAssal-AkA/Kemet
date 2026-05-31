import { buildApiUrl } from "@/utils/apiBaseUrl";
let tripsCache = null;
let tripsRequest = null;

async function handleResponse(res, errorMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const backendMessage = data?.message || data?.error;
    throw new Error(
      `Trip API ${res.status}: ${backendMessage || errorMessage}`,
    );
  }

  return data;
}

function getHeaders(cookie) {
  return cookie ? { Cookie: cookie } : {};
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.trips)) return data.data.trips;
  if (Array.isArray(data?.data?.data)) return data.data.data;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data?.result)) return data.data.result;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.trips)) return data.trips;
  if (Array.isArray(data?.result)) return data.result;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

function getTripObject(data) {
  if (!data) return null;
  if (Array.isArray(data)) return data[0] || null;
  if (Array.isArray(data?.data)) return data.data[0] || null;
  if (Array.isArray(data?.result)) return data.result[0] || null;
  if (data?.trip && typeof data.trip === "object") return data.trip;
  if (data?.data?.trip && typeof data.data.trip === "object") return data.data.trip;
  if (data?.data && typeof data.data === "object") return data.data;
  if (data?.result && typeof data.result === "object") return data.result;
  return data;
}

function getTripIdentifier(trip) {
  return trip?._id || trip?.id || trip?.tripId;
}

function findTripByIdentifier(trips, tripId) {
  const normalizedId = String(tripId);
  return trips.find((trip) => String(getTripIdentifier(trip)) === normalizedId) || null;
}

function isFormData(value) {
  return typeof FormData !== "undefined" && value instanceof FormData;
}

function buildTripFormData(payload, { includeImage = true } = {}) {
  if (isFormData(payload)) return payload;

  const formData = new FormData();
  const basePrice = payload.price || payload.basePrice || 0;
  const guidefees = Number(payload.guidefees || 0);
  const guideAvailable = Boolean(payload.guideAvailable);
  const finalPrice =
    payload.finalPrice || (guideAvailable ? Number(basePrice) + guidefees : Number(basePrice)) * 1.14;
  const adventureType = payload.AdvantureType || payload.AdventureType || payload.category;
  const adventureDescription =
    payload.AdvantureDescription || payload.AdventureDescription || payload.description || "";

  formData.append("name", payload.name || payload.title);
  formData.append("city", payload.city);
  formData.append("location", payload.location);
  formData.append("price", String(basePrice));
  formData.append("basePrice", String(basePrice));
  formData.append("finalPrice", String(finalPrice));
  formData.append("duration", String(payload.duration));
  formData.append("description", payload.description);
  formData.append("category", adventureType);
  formData.append("AdvantureType", adventureType);
  formData.append("AdventureType", adventureType);
  formData.append("AdvantureDescription", adventureDescription);
  formData.append("AdventureDescription", adventureDescription);
  formData.append("guideAvailable", String(guideAvailable));
  formData.append("guidefees", String(payload.guidefees || 0));
  formData.append("guestCapacity", String(payload.guestCapacity || 1));

  if (includeImage && payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export async function createTrip(payload) {
  const formData = buildTripFormData(payload);

  const res = await fetch("/api/Trip/addTrip", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const data = await handleResponse(res, "Trip could not be created.");
  tripsCache = null;
  return data;
}

export async function getTrips({ force = false } = {}) {
  if (!force && tripsCache) return tripsCache;
  if (!force && tripsRequest) return tripsRequest;

  tripsRequest = fetch(buildApiUrl("/api/Trip"), {
    credentials: "include",
  })
    .then((res) => handleResponse(res, "Trips could not be loaded."))
    .then((data) => {
      tripsCache = getArray(data);
      return tripsCache;
    })
    .finally(() => {
      tripsRequest = null;
    });

  return tripsRequest;
}

export async function getAdminTrips(cookie = "") {
  const res = await fetch(buildApiUrl("/api/Trip"), {
    headers: getHeaders(cookie),
    credentials: "include",
  });

  const data = await handleResponse(res, "Trips could not be loaded.");
  return getArray(data);
}

export async function getTripById(id) {
  const tripId = Array.isArray(id) ? id[0] : id;

  if (!tripId) {
    throw new Error("Trip id is missing.");
  }

  try {
    const res = await fetch(buildApiUrl(`/api/Trip/${encodeURIComponent(tripId)}`), {
      credentials: "include",
    });

    const data = await handleResponse(res, "Trip could not be loaded.");
    return getTripObject(data);
  } catch (error) {
    const trips = await getTrips();
    const trip = findTripByIdentifier(trips, tripId);

    if (trip) return trip;
    throw error;
  }
}

export async function updateTrip(id, payload) {
  const formData = buildTripFormData(payload, { includeImage: Boolean(payload?.image) });

  const res = await fetch(`/api/Trip/updateTrip/${id}`, {
    method: "PUT",
    credentials: "include",
    body: formData,
  });

  const data = await handleResponse(res, "Trip could not be updated.");
  tripsCache = null;
  return data;
}

export async function deleteTrip(id) {
  const res = await fetch(`/api/Trip/deleteTrip/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  const data = await handleResponse(res, "Trip could not be deleted.");
  tripsCache = null;
  return data;
}
