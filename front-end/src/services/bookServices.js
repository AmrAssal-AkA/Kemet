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
  return (
    hotelOffer?.offers?.[0]?.id || hotelOffer?.id || hotelOffer?.hotel?.hotelId
  );
}

function toBackendGuest(traveler, index) {
  return {
    type: traveler?.type || (index === 0 ? "adult" : "adult"),
    firstName: traveler?.firstName,
    lastName: traveler?.lastName,
    nationality: traveler?.nationality,
    passportNumber: traveler?.passportNumber,
    dateOfBirth: traveler?.dateOfBirth,
    expiryDate: traveler?.expiryDate,
  };
}

function hasRequiredGuestFields(guest) {
  return Boolean(
    guest.firstName &&
    guest.lastName &&
    guest.nationality &&
    guest.passportNumber &&
    guest.dateOfBirth &&
    guest.expiryDate,
  );
}

function normalizeCheckoutItems(items = []) {
  return items.map((item) => ({
    name: item.name,
    description: item.description,
    image: item.image,
    price: Number(item.price || 0),
    quantity: Number(item.quantity || 1),
  }));
}

function buildBookingRequest(payload) {
  if (
    payload.guests &&
    payload.PassportNumber &&
    payload.totalPrice &&
    payload.items
  ) {
    return {
      ...payload,
      items: normalizeCheckoutItems(payload.items),
    };
  }

  const travelers = payload.travelers?.length
    ? payload.travelers
    : [payload.traveler];
  const guests = travelers.map(toBackendGuest);
  const passportNumber =
    payload.PassportNumber ||
    guests[0]?.passportNumber ||
    payload.traveler?.passportNumber;

  if (
    !passportNumber ||
    guests.some((guest) => !hasRequiredGuestFields(guest))
  ) {
    throw new Error(
      "Booking requires guest passport details: type, firstName, lastName, nationality, passportNumber, dateOfBirth, and expiryDate.",
    );
  }

  const request = {
    guests,
    tripDate: payload.tripDate,
    tripDurationDays: payload.tripDurationDays,
    passportNumber: passportNumber,
    totalPrice: Number(payload.totalPrice || 0),
    currency: payload.currency || "EGP",
    guideIncluded: Boolean(payload.guideIncluded),
    guideFee: payload.guideIncluded ? Number(payload.guideFee || 0) : 0,
    items: normalizeCheckoutItems(
      payload.items?.length
        ? payload.items
        : [
            {
              name: payload.tripName || "KEMET booking",
              description: payload.notes || "KEMET travel booking",
              image: payload.image,
              price: Number(payload.totalPrice || 0),
              quantity: 1,
            },
          ],
    ),
  };

  if (payload.selectedFlight) {
    request.flight = { data: payload.selectedFlight };
  }

  if (payload.selectedHotel) {
    request.hotel = {
      data: {
        ...payload.selectedHotel,
        id: getHotelOfferId(payload.selectedHotel),
      },
    };
  }

  if (payload.tripId) {
    request.trip = [payload.tripId];
  }

  if (payload.tripSchedule) {
    request.tripSchedule = payload.tripSchedule;
  }

  if (!request.flight && !request.hotel && !request.trip) {
    throw new Error("Booking must include a trip, flight, or hotel.");
  }

  return request;
}

function appendBookingFormData(formData, key, value) {
  if (value === undefined || value === null) return;
  if (Array.isArray(value) || typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }
  formData.append(key, String(value));
}

function buildBookingFormData(payload) {
  const request = buildBookingRequest(payload);
  const formData = new FormData();

  formData.append("passportImage", payload.passportImage);
  Object.entries(request).forEach(([key, value]) => {
    appendBookingFormData(formData, key, value);
  });

  return formData;
}

function normalizeHotelSearchPayload(payload) {
  return {
    cityCode: payload.cityCode,
    checkInDate: payload.checkInDate,
    checkOutDate: payload.checkOutDate,
    NumberOfGuests: Number(payload.NumberOfGuests || payload.adults || 1),
    NumberOfrooms: Number(payload.NumberOfrooms || payload.rooms || 1),
  };
}

export async function searchFlights(payload) {
  const res = await fetch("/api/flight/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await handleResponse(res, "Flight search failed.");
  return getArray(data);
}

export async function searchHotels(payload) {
  const res = await fetch("/api/hotels/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(normalizeHotelSearchPayload(payload)),
  });

  return handleResponse(res, "Hotel search failed.");
}

export async function createBooking(payload) {
  const hasPassportImage = Boolean(payload.passportImage);
  const body = hasPassportImage
    ? buildBookingFormData(payload)
    : JSON.stringify(buildBookingRequest(payload));
  const headers = hasPassportImage
    ? undefined
    : { "Content-Type": "application/json" };

  const res = await fetch("/api/booking/create", {
    method: "POST",
    headers,
    credentials: "include",
    body,
  });

  return handleResponse(res, "Booking creation failed.");
}
