import { getHiddenGems } from "@/services/contentServices";
import { getTrips } from "@/services/tripServices";

function normalizeCityName(value = "") {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

function compactCityName(value = "") {
  return normalizeCityName(value).replace(/[^a-z0-9]/g, "");
}

function matchesCityValue(value, city) {
  const target = normalizeCityName(city);
  const compactTarget = compactCityName(city);
  const normalized = normalizeCityName(value);

  if (!normalized) return false;
  return normalized === target || compactCityName(normalized) === compactTarget;
}

function matchesTripCity(trip, city) {
  const candidates = [trip?.city, trip?.location, trip?.destination];
  return candidates.some((candidate) => {
    return matchesCityValue(candidate, city);
  });
}

function matchesHiddenGemCity(gem, city) {
  return Boolean(gem?.city) && matchesCityValue(gem.city, city);
}

function getFirstImage(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return getFirstImage(value[0]);
  return value.imageUrl || value.url || value.secure_url || "";
}

function formatDuration(duration) {
  if (duration === undefined || duration === null || duration === "") return "";
  const parsed = Number.parseInt(String(duration).match(/\d+/)?.[0] || "", 10);
  if (!Number.isFinite(parsed) || parsed < 1) return String(duration);
  return `${parsed} ${parsed === 1 ? "day" : "days"}`;
}

function formatPrice(price) {
  if (price === undefined || price === null || price === "") return "Contact us";
  if (typeof price === "number") return `EGP ${price}`;
  const text = String(price).trim();
  if (!text) return "Contact us";
  if (/^(egp|\$|€|£)/i.test(text)) return text;
  return `EGP ${text}`;
}

function mapTripToPackage(trip) {
  const price = trip?.price ?? trip?.finalPrice ?? trip?.finalProce ?? trip?.basePrice;

  return {
    id: trip?._id || trip?.tripId || trip?.id || "",
    img: getFirstImage(trip?.imageUrl || trip?.image || trip?.images),
    days: formatDuration(trip?.duration),
    title: trip?.name || trip?.title || "Kemet Trip",
    desc: trip?.description || trip?.category || trip?.AdvantureDescription || trip?.AdventureDescription || "",
    price: formatPrice(price),
  };
}

function mapHiddenGemToCard(gem) {
  return {
    id: gem?._id || gem?.id || "",
    img: getFirstImage(gem?.images || gem?.image || gem?.imageUrl),
    tag: "Hidden Gem",
    location: gem?.city || "",
    title: gem?.placeName || gem?.PlaceName || gem?.name || "Hidden Gem",
    desc: gem?.description || gem?.Description || "",
  };
}

export async function getCityPagePackages(city, fallbackPackages = []) {
  try {
    const trips = await getTrips({ force: true });
    const packages = trips
      .filter((trip) => matchesTripCity(trip, city))
      .map(mapTripToPackage)
      .filter((pkg) => pkg.title && pkg.img);

    return packages.length > 0 ? packages : fallbackPackages;
  } catch (error) {
    console.error(`City packages could not be loaded for ${city}:`, error.message);
    return fallbackPackages;
  }
}

export async function getCityPageHiddenGems(city) {
  try {
    const hiddenGems = await getHiddenGems();
    return hiddenGems
      .filter((gem) => matchesHiddenGemCity(gem, city))
      .map(mapHiddenGemToCard);
  } catch (error) {
    console.error(`City hidden gems could not be loaded for ${city}:`, error.message);
    return [];
  }
}
