const API_BASE_URL = "https://kemet-two.vercel.app/";

export class BookingApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "BookingApiError";
    this.status = status;
    this.data = data;
  }
}

function getArray(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.offers)) return data.offers;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

async function handleResponse(res, errorMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    console.error("[bookServices]", {
      url: res.url,
      status: res.status,
      body: data,
    });
    throw new BookingApiError(
      data?.message || data?.error || errorMessage,
      res.status,
      data,
    );
  }

  return data;
}

function getHotelOfferId(hotelOffer) {
  return hotelOffer?.offers?.[0]?.id || hotelOffer?.id || hotelOffer?.hotel?.hotelId;
}

function toBackendTraveler(traveler, index) {
  return {
    id: String(index + 1),
    dateOfBirth: traveler?.dateOfBirth || "1990-01-01",
    name: {
      firstName: traveler?.firstName || `Guest${index + 1}`,
      lastName: traveler?.lastName || "Traveler",
    },
    gender: traveler?.gender || "MALE",
    contact: {
      emailAddress: traveler?.email || "traveler@example.com",
      phones: traveler?.phone
        ? [{ deviceType: "MOBILE", number: traveler.phone }]
        : [],
    },
    documents: [],
  };
}

function toHotelGuest(traveler) {
  return {
    name: {
      title: traveler?.gender === "FEMALE" ? "MS" : "MR",
      firstName: traveler?.firstName || "KEMET",
      lastName: traveler?.lastName || "Guest",
    },
    contact: {
      phone: traveler?.phone || "+201000000000",
      email: traveler?.email || "guest@example.com",
    },
  };
}

function buildBookingRequest(payload) {
  const travelers = payload.travelers?.length ? payload.travelers : [payload.traveler];
  const request = {
    tripIds: payload.tripId ? [payload.tripId] : [],
    travelers,
  };

  if (payload.selectedFlight) {
    request.flightOffer = payload.selectedFlight;
    request.travelers = travelers.map(toBackendTraveler);
  }

  if (payload.selectedHotel) {
    request.hotelOffer = {
      ...payload.selectedHotel,
      id: getHotelOfferId(payload.selectedHotel),
    };
    request.guests = travelers.map(toHotelGuest);
    request.payments = [
      {
        method: "creditCard",
      },
    ];
  }

  return request;
}

export async function searchFlights(payload) {
  const res = await fetch(`${API_BASE_URL}/api/flight/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res, "Flight search failed.");
  return getArray(data);
}

export async function searchHotels(payload) {
  const res = await fetch(`${API_BASE_URL}/api/hotels/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res, "Hotel search failed.");
  return getArray(data);
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE_URL}/api/booking/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(buildBookingRequest(payload)),
  });

  return handleResponse(res, "Booking creation failed.");
}
