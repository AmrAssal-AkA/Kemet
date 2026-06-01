import Head from "next/head";
import Link from "next/link";

import { getHiddenGems } from "@/services/contentServices";

function normalizeCity(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "");
}

function formatLocationName(value) {
  return String(value || "")
    .replace(/-/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getGemTitle(gem) {
  return gem?.placeName || gem?.PlaceName || gem?.name || "Hidden Gem";
}

function getGemDescription(gem) {
  return gem?.description || gem?.Description || "";
}

function getGemCity(gem) {
  return gem?.city || "";
}

function getImageUrl(image) {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.imageUrl || image.url || image.secure_url || "";
}

function getGemImages(gem) {
  const images = Array.isArray(gem?.images) ? gem.images : [];
  const normalizedImages = images.map(getImageUrl).filter(Boolean);
  const fallbackImage = getImageUrl(gem?.imageUrl || gem?.image);

  if (normalizedImages.length > 0) return normalizedImages;
  return fallbackImage ? [fallbackImage] : [];
}

function HiddenGemCard({ gem }) {
  const title = getGemTitle(gem);
  const description = getGemDescription(gem);
  const city = getGemCity(gem);
  const images = getGemImages(gem);
  const primaryImage = images[0];
  const galleryImages = images.slice(1, 4);

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      {primaryImage ? (
        <img
          src={primaryImage}
          alt={title}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="grid h-64 w-full place-items-center bg-slate-100 px-5 text-center text-sm font-semibold text-slate-400">
          No image available
        </div>
      )}

      <div className="flex grow flex-col p-5">
        {city && (
          <span className="w-fit rounded-full bg-[#FBBF24] px-3 py-1 text-xs font-extrabold uppercase tracking-[0.14em] text-[#111827]">
            {city}
          </span>
        )}
        <h2 className="mt-4 text-2xl font-black leading-tight text-[#111827]">
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-7 text-slate-600">
            {description}
          </p>
        ) : (
          <p className="mt-3 text-sm leading-7 text-slate-400">
            No description provided.
          </p>
        )}

        {galleryImages.length > 0 && (
          <div className="mt-5 grid grid-cols-3 gap-2">
            {galleryImages.map((image, index) => (
              <img
                key={`${image}-${index}`}
                src={image}
                alt={`${title} gallery ${index + 2}`}
                className="h-20 w-full rounded-2xl object-cover"
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

export default function HiddenGemsByLocation({
  locationName,
  hiddenGems = [],
  loadError = "",
}) {
  return (
    <>
      <Head>
        <title>{locationName} Hidden Gems | KEMET Tourism</title>
      </Head>

      <main className="min-h-screen bg-linear-to-b from-slate-50 to-white px-4 py-10 text-[#111827] md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-8 lg:p-10">
            <Link
              href="/hidden-gems"
              className="inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-[#111827] hover:text-[#111827]"
            >
              Back to hidden gems page
            </Link>
            <div className="mt-8 max-w-3xl">
              <span className="inline-flex rounded-full bg-[#FBBF24] px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#111827]">
                Hidden Gems
              </span>
              <h1 className="mt-5 text-4xl font-black leading-tight text-[#111827] md:text-6xl">
                {locationName}
              </h1>
            </div>
          </section>

          {loadError && (
            <p className="mt-6 rounded-3xl border border-amber-200 bg-amber-50 p-5 text-sm font-semibold text-amber-700">
              {loadError}
            </p>
          )}

          <section className="mt-8">
            {hiddenGems.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {hiddenGems.map((gem, index) => (
                  <HiddenGemCard
                    key={gem._id || gem.id || `${getGemTitle(gem)}-${index}`}
                    gem={gem}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
                <p className="text-base font-bold text-slate-600">
                  No hidden gems in DB yet for this city.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

export async function getServerSideProps(context) {
  const location = context.params?.location || "";
  const locationName = formatLocationName(location);
  const normalizedLocation = normalizeCity(location);

  try {
    const hiddenGems = await getHiddenGems(context.req.headers.cookie || "");
    const filteredHiddenGems = hiddenGems.filter((gem) => {
      const city = getGemCity(gem);
      if (!city) return false;
      return normalizeCity(city) === normalizedLocation;
    });

    return {
      props: {
        locationName,
        hiddenGems: filteredHiddenGems,
        loadError: "",
      },
    };
  } catch (error) {
    console.error("Hidden gems could not be loaded:", error.message);
    return {
      props: {
        locationName,
        hiddenGems: [],
        loadError: "Hidden gems could not be loaded right now.",
      },
    };
  }
}
