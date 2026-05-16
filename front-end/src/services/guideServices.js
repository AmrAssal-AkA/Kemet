import { getCurrentUser } from "./authServices";
import { buildApiUrl } from "@/utils/apiBaseUrl";

async function handleResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[guideServices]", {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new Error(data?.message || data?.error || fallbackMessage);
  }

  return data;
}

export async function getGuideProfile() {
  return getCurrentUser();
}

export async function getGuideBookings() {
  return {
    bookings: [],
    message: "Assigned bookings API is not documented yet.",
  };
}

export async function getGuideAvailability() {
  return {
    schedule: [],
    message: "Schedule fetch API is not documented yet.",
  };
}

export async function updateGuideAvailability(payload) {
  const res = await fetch(buildApiUrl("/api/guideDashboard/setGuideSchedule"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      dayofweek: payload.dayofweek,
      startTime: payload.startTime,
      endTime: payload.endTime,
    }),
  });

  return handleResponse(res, "Availability could not be saved.");
}
