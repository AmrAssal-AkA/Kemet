/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { createBooking, searchFlights, searchHotels } from "@/services/bookServices";
import { createPayment } from "@/services/paymentServices";
import { getTrips } from "@/services/tripServices";
import { getUserRole } from "@/utils/authSession";

const airportOptions = [
  { label: "Cairo", value: "CAI" },
  { label: "Alexandria", value: "ALY" },
  { label: "Hurghada", value: "HRG" },
  { label: "Luxor", value: "LXR" },
  { label: "Aswan", value: "ASW" },
  { label: "Borg El Arab", value: "HBE" },
  { label: "Port Said", value: "PSD" },
  { label: "St. Catherine", value: "SKV" },
  { label: "Taba", value: "TCP" },
  { label: "El Tor", value: "ELT" },
  { label: "Marsa Matruh", value: "MUH" },
  { label: "Sphinx/Giza", value: "SPX" },
];
const originAirportSuggestions = [
  { label: "New York JFK", value: "JFK" },
  { label: "London Heathrow", value: "LHR" },
  { label: "Paris Charles de Gaulle", value: "CDG" },
  { label: "Dubai", value: "DXB" },
  { label: "Doha", value: "DOH" },
  { label: "Istanbul", value: "IST" },
  { label: "Frankfurt", value: "FRA" },
  { label: "Amsterdam", value: "AMS" },
  { label: "Riyadh", value: "RUH" },
  { label: "Jeddah", value: "JED" },
];
const cityOptions = [
  { label: "Cairo", value: "CAI" },
  { label: "Alexandria", value: "ALY" },
  { label: "Hurghada", value: "HRG" },
  { label: "Luxor", value: "LXR" },
  { label: "Aswan", value: "ASW" },
  { label: "Port Said", value: "PSD" },
  { label: "St. Catherine", value: "SKV" },
  { label: "Taba", value: "TCP" },
  { label: "El Tor", value: "ELT" },
  { label: "Marsa Matruh", value: "MUH" },
  { label: "Sharm El Sheikh", value: "SSH" },
  { label: "Marsa Alam", value: "RMF" },
  { label: "Dabaa", value: "DBB" },
];
const nationalityOptions = [
  { label: "Egypt", value: "EG" },
  { label: "United States", value: "USA" },
  { label: "Europe", value: "EURO" },
];
const serviceFee = 0;

const initialTraveler = {
  type: "adult",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  nationality: "EG",
  passportNumber: "",
  dateOfBirth: "",
  expiryDate: "",
};

function createEmptyGuest() {
  return {
    type: "adult",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationality: "EG",
    passportNumber: "",
    dateOfBirth: "",
    expiryDate: "",
  };
}

const initialFlightSearch = {
  origin: "CAI",
  destination: "LXR",
  departureDate: "",
  returnDate: "",
  adults: 1,
  children: 0,
  infants: 0,
  travelClass: "ECONOMY",
  currencyCode: "EGP",
  max: 5,
};

const initialHotelSearch = {
  cityCode: "CAI",
  checkInDate: "",
  checkOutDate: "",
  NumberOfGuests: 1,
  NumberOfrooms: 1,
};

const initialPayment = {
  method: "stripe-card",
};
const FALLBACK_TRIP_IMAGE = "/siwa.jpeg";

function getTripId(trip) {
  return trip?._id || trip?.id || trip?.tripId;
}

function getTripTitle(trip) {
  return trip?.title || trip?.name || "KEMET Trip";
}

function getTripImage(trip) {
  if (!trip) return "";
  if (trip?.imageUrl) return trip.imageUrl;
  if (typeof trip?.image === "string") return trip.image;
  if (Array.isArray(trip?.image) && trip.image[0]?.imageUrl) return trip.image[0].imageUrl;
  if (Array.isArray(trip?.image) && typeof trip.image[0] === "string") return trip.image[0];
  if (Array.isArray(trip?.image) && trip.image[0]?.url) return trip.image[0].url;
  if (Array.isArray(trip?.images) && trip.images[0]?.imageUrl) return trip.images[0].imageUrl;
  if (Array.isArray(trip?.images) && typeof trip.images[0] === "string") return trip.images[0];
  if (Array.isArray(trip?.images) && trip.images[0]?.url) return trip.images[0].url;
  return FALLBACK_TRIP_IMAGE;
}

function getTripPrice(trip) {
  return Number(trip?.finalPrice || 0);
}

function getGuideFee(trip) {
  return Number(trip?.guidefees ?? trip?.guideFee ?? 0);
}

function splitName(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || "",
    lastName: parts.slice(1).join(" ") || "",
  };
}

function getFlightId(flight, index) {
  return flight?.id || flight?.source || `flight-${index}`;
}

function getFlightSegments(flight) {
  return flight?.itineraries?.flatMap((itinerary) => itinerary?.segments || []) || [];
}

function getOutboundSegments(flight) {
  return flight?.itineraries?.[0]?.segments || [];
}

function getFlightAirport(location) {
  return location?.airport || location?.iataCode || location?.code || null;
}

function formatFlightValue(value) {
  return value || "Not available";
}

function getFlightOrigin(flight) {
  const firstSegment = getOutboundSegments(flight)[0];
  return getFlightAirport(firstSegment?.departure);
}

function getFlightDestination(flight) {
  const segments = getOutboundSegments(flight);
  const lastSegment = segments[segments.length - 1];
  return getFlightAirport(lastSegment?.arrival);
}

function getFlightAirlineName(flight) {
  const firstSegment = getFlightSegments(flight).find((segment) => segment?.airline?.name);
  return firstSegment?.airline?.name || null;
}

function getFlightCabinClass(flight) {
  const cabinSegment = getFlightSegments(flight).find((segment) => segment?.cabin);
  return cabinSegment?.cabin || null;
}

function getFlightTitle(flight) {
  const segments = flight?.itineraries?.[0]?.segments || [];
  const firstSegment = segments[0];
  const lastSegment = segments[segments.length - 1] || firstSegment;
  if (!firstSegment) return "Flight offer";
  return `${getFlightAirport(firstSegment.departure) || "From"} to ${getFlightAirport(lastSegment.arrival) || "Egypt"}`;
}

function getFlightPrice(flight) {
  return Number(flight?.price?.total || 0);
}

function getHotelId(hotel, index) {
  return hotel?.offers?.[0]?.id || hotel?.id || hotel?.hotel?.hotelId || `hotel-${index}`;
}

function getHotelTitle(hotel) {
  return hotel?.name || hotel?.hotel?.name || hotel?.hotel?.hotelId || "Hotel offer";
}

function getHotelPrice(hotel) {
  return Number(hotel?.offers?.[0]?.price?.total || hotel?.price?.total || 0);
}

function getHotelLocation(hotel, fallbackCityCode) {
  return hotel?.hotel?.cityCode || hotel?.cityCode || hotel?.source || fallbackCityCode;
}

function formatMoney(value, currency = "EGP") {
  return `${currency} ${Number(value || 0).toLocaleString()}`;
}

function getTodayDateInputValue() {
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  return today.toISOString().slice(0, 10);
}

function isPastDateInput(value) {
  if (!value) return false;

  const selectedDate = new Date(`${value}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate < today;
}

function formatTripDate(value) {
  if (!value) return "";

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseDurationDays(value) {
  if (value === undefined || value === null || value === "") return 0;

  const match = String(value).match(/\d+/);
  const days = match ? Number(match[0]) : Number(value);

  if (!Number.isInteger(days) || days < 1) return 0;
  return days;
}

function formatDurationDays(value) {
  const days = parseDurationDays(value);
  if (!days) return "";

  return `${days} ${days === 1 ? "day" : "days"}`;
}

function getDurationOptions(maxDurationDays) {
  if (!maxDurationDays) {
    return [{ label: "Select a trip first", value: "" }];
  }

  return Array.from({ length: maxDurationDays }, (_, index) => {
    const days = index + 1;
    return { label: formatDurationDays(days), value: String(days) };
  });
}

function hasPassportDetails(person) {
  return Boolean(
    person.nationality &&
      person.passportNumber?.trim() &&
      person.dateOfBirth &&
      person.expiryDate,
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function TextInput({ name, type = "text", value, onChange, placeholder, min, required }) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      required={required}
      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
    />
  );
}

function AirportCodeInput({ name, value, onChange, suggestions }) {
  return (
    <>
      <input
        name={name}
        type="text"
        value={value}
        onChange={onChange}
        list={`${name}-airport-suggestions`}
        inputMode="text"
        maxLength={3}
        placeholder="LHR"
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm uppercase outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
      />
      <datalist id={`${name}-airport-suggestions`}>
        {suggestions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </>
  );
}

function SelectInput({ name, value, onChange, options, disabled = false }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
    >
      {options.map((option) => (
        <option key={option.value || option} value={option.value || option}>
          {option.label || option}
        </option>
      ))}
    </select>
  );
}

function normalizeIataCode(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 3);
}

function isValidIataCode(value) {
  return /^[A-Z]{3}$/.test(value);
}

function Section({ eyebrow, title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default function BookTripPage() {
  const router = useRouter();
  const requestedTripId = Array.isArray(router.query.tripId)
    ? router.query.tripId[0]
    : router.query.tripId;
  const { user, sessionReady } = useAuth();
  const didLoadTrips = useRef(false);
  const [trips, setTrips] = useState([]);
  const [selectedTripId, setSelectedTripId] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [tripDurationDays, setTripDurationDays] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [traveler, setTraveler] = useState(initialTraveler);
  const [extraGuests, setExtraGuests] = useState([]);
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState(initialPayment);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [includeFlight, setIncludeFlight] = useState(false);
  const [includeHotel, setIncludeHotel] = useState(false);
  const [includeGuide, setIncludeGuide] = useState(false);
  const [flightSearch, setFlightSearch] = useState(initialFlightSearch);
  const [hotelSearch, setHotelSearch] = useState(initialHotelSearch);
  const [flightResults, setFlightResults] = useState([]);
  const [hotelResults, setHotelResults] = useState([]);
  const [selectedFlightIndex, setSelectedFlightIndex] = useState("");
  const [selectedHotelIndex, setSelectedHotelIndex] = useState("");
  const [passportImage, setPassportImage] = useState(null);
  const [loadingTrips, setLoadingTrips] = useState(true);
  const [loadingFlights, setLoadingFlights] = useState(false);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [notice, setNotice] = useState("");
  const userRole = user ? getUserRole(user) : "";

  useEffect(() => {
    if (!sessionReady) return;

    if (!user) {
      router.replace("/auth/auth");
      return;
    }

    if (userRole === "admin") {
      router.replace("/admin");
      return;
    }

    if (userRole === "guide" || userRole === "localguide") {
      router.replace("/guide/dashboard");
      return;
    }

    if (didLoadTrips.current) return;
    didLoadTrips.current = true;

    async function loadTrips() {
      setLoadingTrips(true);
      setError("");
      try {
        setTrips(await getTrips());
      } catch (error) {
        setError(error.message || "Trips could not be loaded.");
      } finally {
        setLoadingTrips(false);
      }
    }

    loadTrips();
  }, [router, sessionReady, user, userRole]);

  useEffect(() => {
    if (!requestedTripId || !trips.length) return;

    const matchingTrip = trips.find((trip) => String(getTripId(trip)) === String(requestedTripId));
    if (matchingTrip) {
      setSelectedTripId(getTripId(matchingTrip));
    }
  }, [requestedTripId, trips]);

  useEffect(() => {
    if (!sessionReady || !user) return;

    const { firstName, lastName } = splitName(user.name);
    setTraveler((current) => ({
      ...current,
      firstName: current.firstName || firstName,
      lastName: current.lastName || lastName,
      email: current.email || user.email || "",
    }));
  }, [sessionReady, user]);

  const selectedTrip = useMemo(
    () => trips.find((trip) => getTripId(trip) === selectedTripId),
    [selectedTripId, trips],
  );
  const maxDurationDays = useMemo(
    () => parseDurationDays(selectedTrip?.duration),
    [selectedTrip],
  );
  const durationOptions = useMemo(
    () => getDurationOptions(maxDurationDays),
    [maxDurationDays],
  );

  useEffect(() => {
    if (!selectedTrip || !maxDurationDays) {
      setTripDurationDays("");
      return;
    }

    setTripDurationDays((current) => {
      const currentDays = parseDurationDays(current);
      if (currentDays >= 1 && currentDays <= maxDurationDays) {
        return String(currentDays);
      }

      return "1";
    });
  }, [maxDurationDays, selectedTrip]);

  const selectedFlight = selectedFlightIndex !== "" ? flightResults[Number(selectedFlightIndex)] : null;
  const selectedHotel = selectedHotelIndex !== "" ? hotelResults[Number(selectedHotelIndex)] : null;
  const todayDateInputValue = useMemo(getTodayDateInputValue, []);
  const tripDateSummary = tripDate ? formatTripDate(tripDate) : "";
  const tripDurationSummary = formatDurationDays(tripDurationDays);

  const totals = useMemo(() => {
    const tripPrice = getTripPrice(selectedTrip);
    const guests = Math.max(Number(numberOfGuests) || 0, 0);
    const flightPrice = includeFlight && selectedFlight ? getFlightPrice(selectedFlight) : 0;
    const hotelPrice = includeHotel && selectedHotel ? getHotelPrice(selectedHotel) : 0;
    const guideFee = includeGuide ? getGuideFee(selectedTrip) : 0;

    return {
      tripPrice,
      guests,
      tripTotal: tripPrice * guests,
      flightPrice,
      hotelPrice,
      guideFee,
      serviceFee,
      totalPrice: tripPrice * guests + flightPrice + hotelPrice + guideFee + serviceFee,
    };
  }, [includeFlight, includeGuide, includeHotel, numberOfGuests, selectedFlight, selectedHotel, selectedTrip]);

  if (!sessionReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-4 text-slate-900">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-bold text-[#162766]">Checking your session...</p>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  if (userRole === "admin" || userRole === "guide" || userRole === "localguide") {
    return null;
  }

  function updateTraveler(event) {
    const { name, value } = event.target;
    setTraveler((current) => ({ ...current, [name]: value }));
  }

  function updateNumberOfGuests(event) {
    const value = event.target.value;
    const extraGuestCount = Math.max(Number(value) - 1, 0);

    setNumberOfGuests(value);
    setExtraGuests((current) => {
      if (current.length === extraGuestCount) return current;
      if (current.length > extraGuestCount) return current.slice(0, extraGuestCount);

      return [
        ...current,
        ...Array.from({ length: extraGuestCount - current.length }, createEmptyGuest),
      ];
    });
  }

  function updateExtraGuest(index, event) {
    const { name, value } = event.target;
    setExtraGuests((current) =>
      current.map((guest, guestIndex) =>
        guestIndex === index ? { ...guest, [name]: value } : guest,
      ),
    );
  }

  function buildTravelers() {
    return [
      {
        type: traveler.type,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        email: traveler.email,
        phone: traveler.phone,
        nationality: traveler.nationality,
        passportNumber: traveler.passportNumber,
        dateOfBirth: traveler.dateOfBirth,
        expiryDate: traveler.expiryDate,
      },
      ...extraGuests.map((guest) => ({
        type: guest.type,
        firstName: guest.firstName,
        lastName: guest.lastName,
        email: guest.email,
        phone: guest.phone,
        nationality: guest.nationality,
        passportNumber: guest.passportNumber,
        dateOfBirth: guest.dateOfBirth,
        expiryDate: guest.expiryDate,
      })),
    ];
  }

  function updateFlightSearch(event) {
    const { name, value } = event.target;
    setFlightSearch((current) => ({
      ...current,
      [name]: name === "origin" ? normalizeIataCode(value) : value,
    }));
  }

  function updateHotelSearch(event) {
    const { name, value } = event.target;
    setHotelSearch((current) => ({ ...current, [name]: value }));
  }

  async function handleFlightSearch() {
    setError("");
    setNotice("");
    setSelectedFlightIndex("");

    const origin = normalizeIataCode(flightSearch.origin);
    if (!isValidIataCode(origin)) {
      setFlightSearch((current) => ({ ...current, origin }));
      setError("Origin must be a valid 3-letter IATA airport code.");
      return;
    }

    setLoadingFlights(true);

    try {
      const results = await searchFlights({
        ...flightSearch,
        origin,
        adults: Number(flightSearch.adults),
        children: Number(flightSearch.children),
        infants: Number(flightSearch.infants),
        max: Number(flightSearch.max),
      });
      setFlightResults(results);
      if (!results.length) setNotice("No flight offers found for this search.");
    } catch (error) {
      setError(error.message || "Flight search failed.");
    } finally {
      setLoadingFlights(false);
    }
  }

  async function handleHotelSearch() {
    setError("");
    setNotice("");
    setSelectedHotelIndex("");
    setLoadingHotels(true);

    try {
      const result = await searchHotels({
        ...hotelSearch,
        NumberOfGuests: Number(hotelSearch.NumberOfGuests),
        NumberOfrooms: Number(hotelSearch.NumberOfrooms),
      });
      const results = Array.isArray(result?.offers) ? result.offers : [];
      setHotelResults(results);
      if (!results.length) {
        setNotice("No hotel offers found for this search.");
      }
    } catch (error) {
      setError(error.message || "Hotel search failed.");
    } finally {
      setLoadingHotels(false);
    }
  }

  function validate() {
    if (!traveler.firstName.trim()) return "First name is required.";
    if (!traveler.lastName.trim()) return "Last name is required.";
    if (!traveler.email.trim()) return "Email is required.";
    if (!traveler.phone.trim()) return "Phone number is required.";
    if (!hasPassportDetails(traveler)) return "Guest 1 passport details are required.";
    if (!passportImage) return "Passport image is required.";
    if (!selectedTrip) return "Please select a trip.";
    if (!tripDate) return "Trip Date is required.";
    if (isPastDateInput(tripDate)) return "Trip Date cannot be in the past.";
    if (!maxDurationDays) return "Selected trip duration is unavailable.";
    const selectedDurationDays = parseDurationDays(tripDurationDays);
    if (!selectedDurationDays) return "Trip Duration is required.";
    if (selectedDurationDays < 1) return "Trip Duration must be at least 1 day.";
    if (selectedDurationDays > maxDurationDays) {
      return `Trip Duration cannot exceed ${formatDurationDays(maxDurationDays)}.`;
    }
    if (Number(numberOfGuests) < 1) return "Number of guests must be at least 1.";
    if (Number(numberOfGuests) > 1) {
      const missingGuestIndex = extraGuests.findIndex(
        (guest) => !guest.firstName.trim() || !guest.lastName.trim() || !hasPassportDetails(guest),
      );

      if (missingGuestIndex !== -1) {
        return `Guest ${missingGuestIndex + 2} name and passport details are required.`;
      }
    }
    if (!payment.method) return "Payment method is required.";
    if (includeFlight && !selectedFlight) return "Select a flight before submitting.";
    if (includeHotel && !selectedHotel) return "Select a hotel before submitting.";
    if (!policyAgreed) return "Please agree to the booking policy.";
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      tripId: getTripId(selectedTrip),
      tripDate,
      tripDurationDays: parseDurationDays(tripDurationDays),
      numberOfGuests: Number(numberOfGuests),
      selectedFlightId: selectedFlight ? getFlightId(selectedFlight, selectedFlightIndex) : undefined,
      selectedHotelId: selectedHotel ? getHotelId(selectedHotel, selectedHotelIndex) : undefined,
      selectedFlight,
      selectedHotel,
      traveler,
      travelers: buildTravelers(),
      paymentMethod: payment.method,
      payment,
      notes: notes.trim(),
      guideIncluded: includeGuide,
      guideFee: includeGuide ? totals.guideFee : 0,
      totalPrice: totals.totalPrice,
      passportImage,
    };

    setSubmitting(true);
    try {
      const booking = await createBooking(payload);
      const bookingData = booking?.data || booking;
      const bookingId = bookingData?.bookingId || bookingData?._id;
      if (bookingId && typeof window !== "undefined") {
        window.sessionStorage.setItem("kemet:lastBookingId", String(bookingId));
        window.sessionStorage.setItem("kemet:lastTripDate", tripDate);
        window.sessionStorage.setItem(
          "kemet:lastTripDurationDays",
          String(parseDurationDays(tripDurationDays)),
        );
      }
      const checkout = bookingData?.checkoutUrl
        ? { url: bookingData.checkoutUrl }
        : await createPayment({
            bookingId,
            amount: totals.totalPrice,
            currency: "EGP",
            metadata: {
              tripId: getTripId(selectedTrip),
              tripName: selectedTrip ? getTripTitle(selectedTrip) : "KEMET booking",
              email: traveler.email,
              guestCount: Number(numberOfGuests),
              description: notes.trim() || "KEMET travel booking",
              image: getTripImage(selectedTrip),
            },
            items: [
              {
                name: selectedTrip ? getTripTitle(selectedTrip) : "KEMET booking",
                description: notes.trim() || "KEMET travel booking",
                image: getTripImage(selectedTrip),
                price: totals.totalPrice,
                quantity: 1,
              },
            ],
          });

      if (checkout?.url) {
        setSuccess("Booking created. Redirecting to secure Stripe checkout...");
        window.location.href = checkout.url;
        return;
      }

      setSuccess("Booking created, but no checkout URL was returned.");
      setNotes("");
      setPolicyAgreed(false);
    } catch (error) {
      setError(error.message || "Booking request invalid.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-2xl bg-[#0b1d3a] p-6 text-white shadow-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
            KEMET Booking
          </p>
          <h1 className="mt-3 text-4xl font-extrabold">Book Your Trip</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-200">
            Complete the form below to reserve your personalized travel experience
            across Egypt&apos;s most remarkable destinations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <Section eyebrow="Step 1" title="Select Trip">
              {loadingTrips ? (
                <p className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
                  Loading trips...
                </p>
              ) : trips.length === 0 ? (
                <p className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-700">
                  No trips found. Create a trip from the Admin dashboard first.
                </p>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {trips.map((trip) => {
                    const tripId = getTripId(trip);
                    const selected = tripId === selectedTripId;

                    return (
                      <article
                        key={tripId}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedTripId(tripId)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") setSelectedTripId(tripId);
                        }}
                        className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
                          selected ? "border-amber-400 ring-4 ring-amber-100" : "border-slate-200"
                        }`}
                      >
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <h3 className="font-extrabold text-slate-900">{getTripTitle(trip)}</h3>
                              <p className="mt-1 text-sm text-slate-500">
                                {trip.location || trip.city || "Egypt"}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                              {trip.category || "Trip"}
                            </span>
                          </div>
                          <div className="grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                            <p>Duration: {trip.duration || "N/A"}</p>
                            {trip.rating && <p>Rating: {trip.rating}</p>}
                          </div>
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                              {selected ? "Selected" : "Click card to select"}
                            </span>
                            <Link
                              href={`/trips/${tripId}`}
                              onClick={(event) => event.stopPropagation()}
                              className="rounded-full border border-amber-300 px-4 py-2 text-sm font-bold text-slate-900 hover:bg-amber-400"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </Section>

            <Section eyebrow="Step 2" title="Traveler Details / Guest 1">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First name">
                  <TextInput name="firstName" value={traveler.firstName} onChange={updateTraveler} required />
                </Field>
                <Field label="Last name">
                  <TextInput name="lastName" value={traveler.lastName} onChange={updateTraveler} required />
                </Field>
                <Field label="Email">
                  <TextInput name="email" type="email" value={traveler.email} onChange={updateTraveler} required />
                </Field>
                <Field label="Phone number">
                  <TextInput name="phone" value={traveler.phone} onChange={updateTraveler} required />
                </Field>
                <Field label="Trip Date">
                  <TextInput
                    name="tripDate"
                    type="date"
                    min={todayDateInputValue}
                    value={tripDate}
                    onChange={(event) => setTripDate(event.target.value)}
                    required
                  />
                </Field>
                <Field label="Trip Duration">
                  <SelectInput
                    name="tripDurationDays"
                    value={tripDurationDays}
                    onChange={(event) => setTripDurationDays(event.target.value)}
                    options={durationOptions}
                    disabled={!selectedTrip || maxDurationDays <= 1}
                  />
                </Field>
                <Field label="Nationality">
                  <SelectInput name="nationality" value={traveler.nationality} onChange={updateTraveler} options={nationalityOptions} />
                </Field>
                <Field label="Passport number">
                  <TextInput name="passportNumber" value={traveler.passportNumber} onChange={updateTraveler} required />
                </Field>
                <Field label="Date of birth">
                  <TextInput name="dateOfBirth" type="date" value={traveler.dateOfBirth} onChange={updateTraveler} required />
                </Field>
                <Field label="Passport expiry">
                  <TextInput name="expiryDate" type="date" value={traveler.expiryDate} onChange={updateTraveler} required />
                </Field>
                <Field label="Passport image">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(event) => setPassportImage(event.target.files?.[0] || null)}
                    required
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-amber-100 file:px-4 file:py-2 file:text-sm file:font-bold file:text-amber-800 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />
                </Field>
              </div>
            </Section>

            <Section eyebrow="Step 3" title="Guests & Add-ons">
              <div className="grid gap-4 sm:grid-cols-4">
                <Field label="Number of guests">
                  <TextInput
                    name="numberOfGuests"
                    type="number"
                    min="1"
                    value={numberOfGuests}
                    onChange={updateNumberOfGuests}
                    required
                  />
                </Field>
                <label className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={includeFlight}
                    onChange={(event) => {
                      setIncludeFlight(event.target.checked);
                      setSelectedFlightIndex("");
                    }}
                    className="h-4 w-4 accent-amber-500"
                  />
                  Include Flight
                </label>
                <label className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={includeHotel}
                    onChange={(event) => {
                      setIncludeHotel(event.target.checked);
                      setSelectedHotelIndex("");
                    }}
                    className="h-4 w-4 accent-amber-500"
                  />
                  Include Hotel
                </label>
                <label className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-bold">
                  <input
                    type="checkbox"
                    checked={includeGuide}
                    onChange={(event) => setIncludeGuide(event.target.checked)}
                    className="h-4 w-4 accent-amber-500"
                  />
                  Include guide
                </label>
              </div>
            </Section>

            {Number(numberOfGuests) > 1 && (
              <Section eyebrow="Step 3A" title="Extra Guest Details">
                <p className="mb-5 text-sm text-slate-500">
                  Guest 1 uses the main traveler information above. Add details for
                  the remaining guests.
                </p>
                <div className="space-y-4">
                  {extraGuests.map((guest, index) => (
                    <div
                      key={`guest-${index + 2}`}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <h3 className="text-lg font-extrabold text-slate-900">
                        Guest {index + 2}
                      </h3>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <Field label="First name">
                          <TextInput
                            name="firstName"
                            value={guest.firstName}
                            onChange={(event) => updateExtraGuest(index, event)}
                            required
                          />
                        </Field>
                        <Field label="Last name">
                          <TextInput
                            name="lastName"
                            value={guest.lastName}
                            onChange={(event) => updateExtraGuest(index, event)}
                            required
                          />
                        </Field>
                        <Field label="Email optional">
                          <TextInput
                            name="email"
                            type="email"
                            value={guest.email}
                            onChange={(event) => updateExtraGuest(index, event)}
                          />
                        </Field>
                        <Field label="Phone optional">
                          <TextInput
                            name="phone"
                            value={guest.phone}
                            onChange={(event) => updateExtraGuest(index, event)}
                          />
                        </Field>
                        <Field label="Nationality">
                          <SelectInput
                            name="nationality"
                            value={guest.nationality}
                            onChange={(event) => updateExtraGuest(index, event)}
                            options={nationalityOptions}
                          />
                        </Field>
                        <Field label="Passport number">
                          <TextInput
                            name="passportNumber"
                            value={guest.passportNumber}
                            onChange={(event) => updateExtraGuest(index, event)}
                            required
                          />
                        </Field>
                        <Field label="Date of birth">
                          <TextInput
                            name="dateOfBirth"
                            type="date"
                            value={guest.dateOfBirth}
                            onChange={(event) => updateExtraGuest(index, event)}
                            required
                          />
                        </Field>
                        <Field label="Passport expiry">
                          <TextInput
                            name="expiryDate"
                            type="date"
                            value={guest.expiryDate}
                            onChange={(event) => updateExtraGuest(index, event)}
                            required
                          />
                        </Field>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {includeFlight && (
              <Section eyebrow="Optional" title="Flight Search">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="Origin">
                    <AirportCodeInput
                      name="origin"
                      value={flightSearch.origin}
                      onChange={updateFlightSearch}
                      suggestions={originAirportSuggestions}
                    />
                  </Field>
                  <Field label="Destination">
                    <SelectInput name="destination" value={flightSearch.destination} onChange={updateFlightSearch} options={airportOptions} />
                  </Field>
                  <Field label="Departure">
                    <TextInput name="departureDate" type="date" value={flightSearch.departureDate} onChange={updateFlightSearch} />
                  </Field>
                  <Field label="Return">
                    <TextInput name="returnDate" type="date" value={flightSearch.returnDate} onChange={updateFlightSearch} />
                  </Field>
                  <Field label="Adults">
                    <TextInput name="adults" type="number" min="1" value={flightSearch.adults} onChange={updateFlightSearch} />
                  </Field>
                  <Field label="Class">
                    <SelectInput
                      name="travelClass"
                      value={flightSearch.travelClass}
                      onChange={updateFlightSearch}
                      options={["ECONOMY", "PREMIUM_ECONOMY", "BUSINESS", "FIRST"]}
                    />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={handleFlightSearch}
                  disabled={loadingFlights || !flightSearch.departureDate}
                  className="mt-5 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loadingFlights ? "Searching..." : "Search Flights"}
                </button>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {flightResults.map((flight, index) => (
                    <button
                      type="button"
                      key={getFlightId(flight, index)}
                      onClick={() => setSelectedFlightIndex(String(index))}
                      className={`rounded-2xl border p-4 text-left shadow-sm ${
                        selectedFlightIndex === String(index)
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <p className="font-extrabold">{getFlightTitle(flight)}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {flight.itineraries?.[0]?.duration || "Duration unavailable"}
                      </p>
                      <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                        <div>
                          <dt className="font-bold uppercase tracking-wide text-slate-400">Airline</dt>
                          <dd className="mt-0.5">{formatFlightValue(getFlightAirlineName(flight))}</dd>
                        </div>
                        <div>
                          <dt className="font-bold uppercase tracking-wide text-slate-400">Class</dt>
                          <dd className="mt-0.5">{formatFlightValue(getFlightCabinClass(flight))}</dd>
                        </div>
                        <div>
                          <dt className="font-bold uppercase tracking-wide text-slate-400">Origin</dt>
                          <dd className="mt-0.5">{formatFlightValue(getFlightOrigin(flight))}</dd>
                        </div>
                        <div>
                          <dt className="font-bold uppercase tracking-wide text-slate-400">Destination</dt>
                          <dd className="mt-0.5">{formatFlightValue(getFlightDestination(flight))}</dd>
                        </div>
                      </dl>
                      <p className="mt-2 text-sm font-bold text-amber-700">
                        {formatMoney(getFlightPrice(flight), flight.price?.currency || "EGP")}
                      </p>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            {includeHotel && (
              <Section eyebrow="Optional" title="Hotel Search">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Field label="City">
                    <SelectInput name="cityCode" value={hotelSearch.cityCode} onChange={updateHotelSearch} options={cityOptions} />
                  </Field>
                  <Field label="Guests">
                    <TextInput name="NumberOfGuests" type="number" min="1" value={hotelSearch.NumberOfGuests} onChange={updateHotelSearch} />
                  </Field>
                  <Field label="Check in">
                    <TextInput name="checkInDate" type="date" value={hotelSearch.checkInDate} onChange={updateHotelSearch} />
                  </Field>
                  <Field label="Check out">
                    <TextInput name="checkOutDate" type="date" value={hotelSearch.checkOutDate} onChange={updateHotelSearch} />
                  </Field>
                  <Field label="Rooms">
                    <TextInput name="NumberOfrooms" type="number" min="1" value={hotelSearch.NumberOfrooms} onChange={updateHotelSearch} />
                  </Field>
                </div>
                <button
                  type="button"
                  onClick={handleHotelSearch}
                  disabled={loadingHotels || !hotelSearch.checkInDate || !hotelSearch.checkOutDate}
                  className="mt-5 rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {loadingHotels ? "Searching..." : "Search Hotels"}
                </button>
                <div className="mt-5 grid gap-3 md:grid-cols-2">
                  {hotelResults.map((hotel, index) => (
                    <button
                      type="button"
                      key={getHotelId(hotel, index)}
                      onClick={() => setSelectedHotelIndex(String(index))}
                      className={`rounded-2xl border p-4 text-left shadow-sm ${
                        selectedHotelIndex === String(index)
                          ? "border-amber-400 bg-amber-50"
                          : "border-slate-200 bg-white"
                      }`}
                    >
                      <p className="font-extrabold">{getHotelTitle(hotel)}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {getHotelLocation(hotel, hotelSearch.cityCode)}
                      </p>
                      <p className="mt-2 text-sm font-bold text-amber-700">
                        {formatMoney(getHotelPrice(hotel))}
                      </p>
                    </button>
                  ))}
                </div>
              </Section>
            )}

            <Section eyebrow="Step 4" title="Payment & Notes">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Payment method
                </p>
                <p className="mt-2 text-lg font-extrabold text-slate-900">
                  Card via Stripe
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  You will enter card details on Stripe&apos;s secure checkout page
                  after the booking is created.
                </p>
              </div>
              <label className="mt-4 block">
                <span className="text-xs font-bold uppercase tracking-wide text-slate-500">
                  Special request notes
                </span>
                <textarea
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  rows={4}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  placeholder="Optional notes for your booking"
                />
              </label>
              <label className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={policyAgreed}
                  onChange={(event) => setPolicyAgreed(event.target.checked)}
                  className="mt-1 h-4 w-4 accent-amber-500"
                />
                I agree to the booking policy and understand that flight and hotel
                availability is confirmed by the backend provider.
              </label>
            </Section>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-600">
              Summary
            </p>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">Booking Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="rounded-2xl bg-slate-50 p-4">
                {selectedTrip && (
                  <img
                    src={getTripImage(selectedTrip)}
                    alt={getTripTitle(selectedTrip)}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_TRIP_IMAGE;
                    }}
                    className="mb-4 h-40 w-full rounded-xl object-cover"
                  />
                )}
                <p className="font-extrabold text-slate-900">
                  {selectedTrip ? getTripTitle(selectedTrip) : "No trip selected"}
                </p>
                <p className="mt-1 text-slate-500">
                  {selectedTrip ? selectedTrip.location || selectedTrip.city || "Egypt" : "Choose one trip card."}
                </p>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Trip price</span>
                <strong>{formatMoney(totals.tripPrice)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Number of guests</span>
                <strong>{totals.guests || 0}</strong>
              </div>
              {tripDateSummary && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Trip Date</span>
                  <strong>{tripDateSummary}</strong>
                </div>
              )}
              {tripDurationSummary && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Trip Duration</span>
                  <strong>{tripDurationSummary}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Trip subtotal</span>
                <strong>{formatMoney(totals.tripTotal)}</strong>
              </div>
              {includeFlight && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Flight price</span>
                  <strong>{formatMoney(totals.flightPrice)}</strong>
                </div>
              )}
              {includeHotel && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Hotel price</span>
                  <strong>{formatMoney(totals.hotelPrice)}</strong>
                </div>
              )}
              {includeGuide && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Guide fee</span>
                  <strong>{formatMoney(totals.guideFee)}</strong>
                </div>
              )}
              {serviceFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Service fee</span>
                  <strong>{formatMoney(totals.serviceFee)}</strong>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Payment method</span>
                <strong>Stripe card</strong>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <div className="flex justify-between text-lg">
                  <span className="font-extrabold">Final total</span>
                  <strong className="text-amber-700">{formatMoney(totals.totalPrice)}</strong>
                </div>
              </div>
            </div>

            {(error || notice || success) && (
              <div className="mt-5 space-y-3">
                {error && <p className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600">{error}</p>}
                {notice && <p className="rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">{notice}</p>}
                {success && <p className="rounded-2xl bg-emerald-50 p-4 text-sm font-bold text-emerald-700">{success}</p>}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-amber-400 px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? "Submitting..." : "Create Booking"}
            </button>
          </aside>
        </form>
      </div>
    </main>
  );
}
