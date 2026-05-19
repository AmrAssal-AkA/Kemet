import { buildApiUrl } from "@/utils/apiBaseUrl";

function normalizeSearchResults(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.trips)) return data.trips;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.data?.trips)) return data.data.trips;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  return [];
}

function normalizeValue(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim().toLowerCase();
}

function includesQuery(value, query) {
  return normalizeValue(value).includes(query);
}

function matchesTripSearch(trip, filters) {
  const locationQuery = normalizeValue(filters.location);
  const durationQuery = normalizeValue(filters.duration);
  const adventureTypeQuery = normalizeValue(filters.AdvantureType);
  const travelers = Number(filters.travelers) || 0;

  const locationMatches =
    includesQuery(trip?.city, locationQuery) ||
    includesQuery(trip?.location, locationQuery) ||
    includesQuery(trip?.name, locationQuery);

  const durationMatches = includesQuery(trip?.duration, durationQuery);

  const adventureTypeMatches =
    !adventureTypeQuery ||
    includesQuery(trip?.AdvantureType, adventureTypeQuery) ||
    includesQuery(trip?.AdventureType, adventureTypeQuery) ||
    includesQuery(trip?.category, adventureTypeQuery);

  const capacity = Number(trip?.guestCapacity);
  const travelersMatch =
    !travelers || !Number.isFinite(capacity) || capacity <= 0 || capacity >= travelers;

  return (
    locationMatches &&
    durationMatches &&
    adventureTypeMatches &&
    travelersMatch
  );
}

async function handleTripsResponse(res) {
  const responseText = await res.text();
  const data = responseText
    ? (() => {
        try {
          return JSON.parse(responseText);
        } catch {
          return null;
        }
      })()
    : null;

  if (!res.ok) {
    const backendMessage = data?.message || data?.error;
    throw new Error(
      backendMessage ||
        responseText ||
        `Trips request failed with status ${res.status}.`,
    );
  }

  return normalizeSearchResults(data);
}

export async function searchTrips(
  { location, duration, travelers = 1, AdvantureType = "" },
  options = {},
) {
  const res = await fetch(buildApiUrl("/api/Trip"), {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: options.signal,
  });

  const trips = await handleTripsResponse(res);

  return trips.filter((trip) =>
    matchesTripSearch(trip, {
      location,
      duration,
      travelers,
      AdvantureType,
    }),
  );
}

export const searchSite = searchTrips;
