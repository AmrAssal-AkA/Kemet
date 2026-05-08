const { onewayClient, roundtripClient } = require("../../config/flightApi");

exports.search = async (params) => {
  const { origin, destination, departureDate, returnDate, adults = 1, children = 0, infants = 0, cabinClass = "Economy", currency = "EGP" } = params;

  const isRoundTrip = !!returnDate;
  const o = origin.toUpperCase();
  const d = destination.toUpperCase();
  const cur = currency.toUpperCase();

  const response = isRoundTrip
    ? await roundtripClient.get(`/${o}/${d}/${departureDate}/${returnDate}/${adults}/${children}/${infants}/${cabinClass}/${cur}`)
    : await onewayClient.get(`/${o}/${d}/${departureDate}/${adults}/${children}/${infants}/${cabinClass}/${cur}`);

  const data = response.data;


  const placesMap = toMap(data.places || data.legs?.[0]?.places || []);
  const carriersMap = toMap(data.carriers || []);
  const legsMap = toMap(data.legs || []);
  const segmentsMap = toMap(data.segments || []);

  return (data.itineraries || []).map((itin) => {

    let bestPrice = Infinity;
    const bookingLinks = [];

    for (const po of itin.pricing_options || []) {
      if (po.price?.amount && po.price.amount < bestPrice) bestPrice = po.price.amount;
      for (const item of po.items || []) {
        if (item.url) bookingLinks.push(item.url);
      }
    }

    if (itin.cheapest_price?.amount && itin.cheapest_price.amount < bestPrice) {
      bestPrice = itin.cheapest_price.amount;
    }
    if (bestPrice === Infinity) bestPrice = 0;

      const itineraries = (itin.leg_ids || []).map((legId, index) => {
      const leg = legsMap[legId] || {};

      const segments = (leg.segment_ids || []).map((segId) => {
        const seg = segmentsMap[segId] || {};
        const carrier = getCarrier(seg.marketing_carrier_id, carriersMap);

        return {
          departure: { airport: getPlace(seg.origin_place_id, placesMap), terminal: null, dateTime: seg.departure || null },
          arrival: { airport: getPlace(seg.destination_place_id, placesMap), terminal: null, dateTime: seg.arrival || null },
          airline: {
            code: carrier.code,
            name: carrier.name,
            flightNumber: seg.marketing_flight_number ? `${carrier.code}${seg.marketing_flight_number}` : null,
            operatingCarrier: seg.operating_carrier_id ? getCarrier(seg.operating_carrier_id, carriersMap).code : carrier.code,
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
      id: itin.id || `flightapi-${Date.now()}`,
      source: "flightapi",
      type: isRoundTrip ? "roundtrip" : "oneway",
      price: { total: bestPrice, currency: cur, base: null, perAdult: null, fees: [] },
      itineraries,
      validatingAirline: null,
      bookableSeats: null,
      lastTicketingDate: null,
      bookingLinks,
      rawData: itin,
    };
  });
};



function toMap(items) {
  if (!Array.isArray(items)) return { ...items };
  const map = {};
  for (const item of items) {
    if (item.id !== undefined) map[item.id] = item;
  }
  return map;
}

function getPlace(id, map) {
  const p = map[id];
  return p ? (p.iata || p.alt_id || p.name || String(id)) : String(id);
}

function getCarrier(id, map) {
  const c = map[id];
  if (!c) return { code: String(id), name: String(id) };
  return { code: c.iata || c.alt_id || String(id), name: c.name || String(id) };
}
