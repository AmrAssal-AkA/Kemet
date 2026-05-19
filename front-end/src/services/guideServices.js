import { getCurrentUser } from "./authServices";
import { buildApiUrl } from "@/utils/apiBaseUrl";

async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

export async function getGuideProfile() {
  return getCurrentUser();
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.trips)) return data.data.trips;
  if (Array.isArray(data?.data?.bookings)) return data.data.bookings;
  if (Array.isArray(data?.data?.results)) return data.data.results;
  if (Array.isArray(data?.data?.result)) return data.data.result;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.trips)) return data.trips;
  if (Array.isArray(data?.bookings)) return data.bookings;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

export async function getGuideRequiredTrips() {
  const res = await fetch(buildApiUrl("/api/guideDashboard/guideRequiredTrips"), {
    credentials: "include",
  });

  const data = await handleResponse(res, "Assigned bookings could not be loaded.");
  return getArray(data);
}

export async function getGuideFee() {
  const res = await fetch(buildApiUrl("/api/guideDashboard/guideFee"), {
    credentials: "include",
  });

  return handleResponse(res, "Guide fee could not be loaded.");
}

function normalizeScheduleTime(value) {
  return String(value || "").trim().slice(0, 5);
}

export async function setGuideSchedule(payload) {
  const res = await fetch(buildApiUrl("/api/guideDashboard/setGuideSchedule"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      dayofweek: payload.dayofweek,
      startTime: normalizeScheduleTime(payload.startTime),
      endTime: normalizeScheduleTime(payload.endTime),
    }),
  });

  return handleResponse(res, "Availability could not be saved.");
}
