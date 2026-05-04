const { onewayClient, roundtripClient } = require("../../config/flightApi");



exports.search = async (params) => {
  const {
    origin,
    destination,
    departureDate,
    returnDate,
    adults = 1,
    children = 0,
    infants = 0,
    cabinClass = "Economy",
    currency = "EGP",
  } = params;

  const isRoundTrip = !!returnDate;

  let response;

  if (isRoundTrip) {
    const path = `/${origin.toUpperCase()}/${destination.toUpperCase()}/${departureDate}/${returnDate}/${adults}/${children}/${infants}/${cabinClass}/${currency.toUpperCase()}`;
    console.log("FlightAPI round-trip path:", path);
    response = await roundtripClient.get(path);
  } else {
    const path = `/${origin.toUpperCase()}/${destination.toUpperCase()}/${departureDate}/${adults}/${children}/${infants}/${cabinClass}/${currency.toUpperCase()}`;
    console.log("FlightAPI one-way path:", path);
    response = await onewayClient.get(path);
  }

  const data = response.data;

  const placesMap = buildPlacesMap(data.places || data.legs?.[0]?.places || []);
  const carriersMap = buildCarriersMap(data.carriers || []);
  const agentsMap = buildAgentsMap(data.agents || []);
  const legsMap = buildLegsMap(data.legs || []);
  const segmentsMap = buildSegmentsMap(data.segments || []);

  const itineraries = data.itineraries || [];

  return itineraries.map((itin) =>
    normalizeFlightApiOffer(
      itin,
      { placesMap, carriersMap, agentsMap, legsMap, segmentsMap },
      { isRoundTrip, currency },
    ),
  );
};


function buildPlacesMap(places) {
  const map = {};
  if (Array.isArray(places)) {
    places.forEach((place) => {
      if (place.id !== undefined) {
        map[place.id] = place;
      }
    });
  } else if (typeof places === "object") {
    Object.assign(map, places);
  }
  return map;
}


function buildCarriersMap(carriers) {
  const map = {};
  if (Array.isArray(carriers)) {
    carriers.forEach((carrier) => {
      if (carrier.id !== undefined) {
        map[carrier.id] = carrier;
      }
    });
  } else if (typeof carriers === "object") {
    Object.assign(map, carriers);
  }
  return map;
}


function buildAgentsMap(agents) {
  const map = {};
  if (Array.isArray(agents)) {
    agents.forEach((agent) => {
      if (agent.id !== undefined) {
        map[agent.id] = agent;
      }
    });
  } else if (typeof agents === "object") {
    Object.assign(map, agents);
  }
  return map;
}


function buildLegsMap(legs) {
  const map = {};
  if (Array.isArray(legs)) {
    legs.forEach((leg) => {
      if (leg.id) {
        map[leg.id] = leg;
      }
    });
  }
  return map;
}


function buildSegmentsMap(segments) {
  const map = {};
  if (Array.isArray(segments)) {
    segments.forEach((seg) => {
      if (seg.id) {
        map[seg.id] = seg;
      }
    });
  }
  return map;
}

function resolvePlace(placeId, placesMap) {
  const place = placesMap[placeId];
  if (!place) return String(placeId);
  return place.iata || place.alt_id || place.name || String(placeId);
}

function resolveCarrier(carrierId, carriersMap) {
  const carrier = carriersMap[carrierId];
  if (!carrier) return { code: String(carrierId), name: String(carrierId) };
  return {
    code: carrier.iata || carrier.alt_id || String(carrierId),
    name: carrier.name || String(carrierId),
  };
}

function normalizeFlightApiOffer(itin, lookups, meta) {
  const { placesMap, carriersMap, agentsMap, legsMap, segmentsMap } = lookups;
  const { isRoundTrip, currency } = meta;


  let bestPrice = Infinity;
  const bookingLinks = [];

  (itin.pricing_options || []).forEach((po) => {
    const amount = po.price?.amount;
    if (amount && amount < bestPrice) {
      bestPrice = amount;
    }

    (po.items || []).forEach((item) => {
      if (item.url) {
        bookingLinks.push(item.url);
      }
    });
  });

  if (itin.cheapest_price?.amount && itin.cheapest_price.amount < bestPrice) {
    bestPrice = itin.cheapest_price.amount;
  }

  if (bestPrice === Infinity) bestPrice = 0;

  const legIds = itin.leg_ids || [];
  const itineraries = legIds.map((legId, index) => {
    const leg = legsMap[legId] || {};

    const segments = (leg.segment_ids || []).map((segId) => {
      const seg = segmentsMap[segId] || {};
      const carrier = resolveCarrier(
        seg.marketing_carrier_id,
        carriersMap,
      );

      return {
        departure: {
          airport: resolvePlace(seg.origin_place_id, placesMap),
          terminal: null,
          dateTime: seg.departure || null,
        },
        arrival: {
          airport: resolvePlace(seg.destination_place_id, placesMap),
          terminal: null,
          dateTime: seg.arrival || null,
        },
        airline: {
          code: carrier.code,
          name: carrier.name,
          flightNumber: seg.marketing_flight_number
            ? `${carrier.code}${seg.marketing_flight_number}`
            : null,
          operatingCarrier: seg.operating_carrier_id
            ? resolveCarrier(seg.operating_carrier_id, carriersMap).code
            : carrier.code,
        },
        duration: seg.duration ? `PT${seg.duration}M` : null,
        cabin: null,
        stops: 0,
        aircraft: null,
      };
    });

    return {
      direction: index === 0 ? "outbound" : "return",
      duration: leg.duration ? `PT${leg.duration}M` : null,
      segments,
    };
  });

  return {
    id: itin.id || `flightapi-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    source: "flightapi",
    type: isRoundTrip ? "roundtrip" : "oneway",
    price: {
      total: bestPrice,
      currency: currency.toUpperCase(),
      base: null,
      perAdult: null,
      fees: [],
    },
    itineraries,
    validatingAirline: null,
    bookableSeats: null,
    lastTicketingDate: null,
    bookingLinks,
    rawData: itin,
  };
}
