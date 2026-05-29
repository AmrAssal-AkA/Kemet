import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";
import { getHiddenGems } from "@/services/contentServices";
import { getTrips } from "@/services/tripServices";

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const cities = [
  { img: "alex.jpeg",  name: "Alexandria",      href: "/Alexandria" },
  { img: "cairo.jpeg", name: "Cairo",           href: "/Cairo" },
  { img: "luxor.jpeg", name: "Luxor",           href: "/Luxor" },
  { img: "aswan.jpeg", name: "Aswan",           href: "/Aswan" },
  { img: "siwa.jpeg",  name: "Siwa",            href: "/Siwa" },
  { img: "sharm.jpeg", name: "Sharm El Sheikh", href: "/SharmElSheikh" },
];

const stats = [
  { value: "6+",   label: "Destinations" },
  { value: "12k+", label: "Happy Travelers" },
  { value: "4.9★", label: "Avg Rating" },
  { value: "100%", label: "Local Guides" },
];

const reviews = [
  {
    avatar: "/images/home/avatar1.jpg",
    name: "Sara Al-Masri",
    country: "Egypt 🇪🇬",
    rating: 5,
    text: "The balloon ride over Luxor at sunrise was a life-changing moment. Kemet's local guide knew every story behind every temple. This is how Egypt should be experienced.",
    trip: "Luxor Heritage Tour",
  },
  {
    avatar: "/images/home/avatar2.jpg",
    name: "James Whitfield",
    country: "United Kingdom 🇬🇧",
    rating: 5,
    text: "I've traveled across 40 countries and Egypt with Kemet was top 3. They took us off the tourist path into places I didn't even know existed. Absolutely unforgettable.",
    trip: "Siwa Hidden Gems",
  },
  {
    avatar: "/images/home/avatar3.jpg",
    name: "Layla Haddad",
    country: "Lebanon 🇱🇧",
    rating: 5,
    text: "From the moment we landed to the last felucca sunset on the Nile — every detail was perfect. The team truly loves this country and it shows in everything they do.",
    trip: "Nile & Aswan Journey",
  },
];

const communityPreviews = [
  {
    img: "/images/communities/story1.jpg",
    category: "Luxor · Featured",
    title: "Waking up at 4AM for the balloon ride that changed how I see Egypt forever",
    author: "Sara Al-Masri",
    initials: "SA",
    avatarBg: "#c0392b",
    date: "2 days ago",
    likes: 284,
  },
  {
    img: "/images/communities/story2.jpg",
    category: "Siwa · Hidden Gem",
    title: "The oasis that Instagram hasn't discovered yet",
    author: "Karim Mansour",
    initials: "KM",
    avatarBg: "#2980b9",
    date: "5 days ago",
    likes: 156,
  },
];

const whyKemet = [
  { icon: "🏺", label: "Authentic Experiences" },
  { icon: "🗺️", label: "Smart Trip Planning" },
  { icon: "🤝", label: "Local Expert Guides" },
  { icon: "⭐", label: "5-Star Rated Tours" },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const SERIF = { fontFamily: "'Playfair Display', serif" };

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 32 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const FALLBACK_TRIP_IMAGE = "/siwa.jpeg";
const FALLBACK_GEM_IMAGE = "/images/home/gem1.jpg";

function getImageValue(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTripImage(trip) {
  if (trip?.img)                   return trip.img;
  if (trip?.imageUrl)              return trip.imageUrl;
  if (Array.isArray(trip?.image))  return getImageValue(trip.image[0])  || FALLBACK_TRIP_IMAGE;
  if (trip?.image)                 return getImageValue(trip.image)      || FALLBACK_TRIP_IMAGE;
  if (Array.isArray(trip?.images)) return getImageValue(trip.images[0]) || FALLBACK_TRIP_IMAGE;
  if (trip?.images)                return getImageValue(trip.images)     || FALLBACK_TRIP_IMAGE;
  return FALLBACK_TRIP_IMAGE;
}

function getHiddenGemImage(gem) {
  if (gem?.img) return gem.img;
  if (gem?.imageUrl) return gem.imageUrl;
  if (Array.isArray(gem?.images)) return getImageValue(gem.images[0]) || FALLBACK_GEM_IMAGE;
  if (gem?.images) return getImageValue(gem.images) || FALLBACK_GEM_IMAGE;
  return FALLBACK_GEM_IMAGE;
}

function normalizeHiddenGem(gem) {
  return {
    ...gem,
    img: getHiddenGemImage(gem),
    title: gem?.title || gem?.placeName || gem?.PlaceName || "Hidden gem",
    desc: gem?.desc || gem?.description || gem?.Description || "",
    tag: gem?.tag || "Hidden Gem",
    location: gem?.location || gem?.city || "Egypt",
  };
}

function StarRow({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} style={{ color: "#FFCE2A", fontSize: 14 }}>★</span>
      ))}
    </div>
  );
}

function SectionHeading({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mb-8 sm:mb-10 text-center">
      {eyebrow && (
        <span className={`inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full ${
          light ? "text-yellow-300 bg-yellow-400/20" : "text-yellow-600 bg-yellow-50"
        }`}>
          {eyebrow}
        </span>
      )}
      
/ 


      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight ${
          light ? "text-white" : "text-gray-900"
        }`}
        style={SERIF}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-3 text-sm md:text-base max-w-lg mx-auto leading-relaxed px-4 ${
          light ? "text-gray-400" : "text-gray-500"
        }`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Home({ trips, hiddenGems }) {
  return (
    <>
      <Head>
        <title>Kemet Travel — Discover Egypt through Egyptian Eyes</title>
        <meta name="description" content="Plan your smart trip to Egypt with Kemet Travel. Explore temples, beaches, and hidden gems through Egyptian eyes." />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </Head>

      <style>{`
        :root { --gold:#FFCE2A; --gold-dark:#e8b800; --navy:#0b1f46; }

        .btn-gold {
          background: linear-gradient(135deg,var(--gold) 0%,var(--gold-dark) 100%);
          box-shadow: 0 4px 14px rgba(255,206,42,.35);
          transition: transform .18s ease, box-shadow .18s ease;
        }
        .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(255,206,42,.45); }

        .btn-ghost-white { border:1.5px solid rgba(255,255,255,.3); transition:border-color .18s,background .18s; }
        .btn-ghost-white:hover { border-color:var(--gold); background:rgba(255,206,42,.1); }

        .city-ring {
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px transparent;
          transition: box-shadow .25s, transform .25s;
        }
        .city-card:hover .city-ring { box-shadow:0 0 0 3px #fff, 0 0 0 5px var(--gold); }
        .city-overlay { opacity:0; transition:opacity .2s; }
        .city-card:hover .city-overlay { opacity:1; }

        .pkg-card { transition:transform .25s, box-shadow .25s; }
        .pkg-card:hover { transform:translateY(-8px); box-shadow:0 20px 40px rgba(0,0,0,.12); }
        .pkg-img { transition:transform .4s; }
        .pkg-card:hover .pkg-img { transform:scale(1.05); }

        .gem-card { transition:transform .28s, box-shadow .28s; }
        .gem-card:hover { transform:translateY(-6px); box-shadow:0 18px 38px rgba(0,0,0,.14); }
        .gem-img { transition:transform .45s; }
        .gem-card:hover .gem-img { transform:scale(1.06); }
        .gem-overlay { background:linear-gradient(to top,rgba(6,18,46,.85) 0%,rgba(6,18,46,.2) 55%,transparent 100%); }

        .review-card { transition:transform .25s, box-shadow .25s; }
        .review-card:hover { transform:translateY(-6px); }

        .comm-card { transition:transform .25s, box-shadow .25s; }
        .comm-card:hover { transform:translateY(-5px); box-shadow:0 16px 36px rgba(0,0,0,.10); }
        .comm-img { transition:transform .4s; }
        .comm-card:hover .comm-img { transform:scale(1.04); }

        .feature-img { transition:transform .5s; }
        .feature-card:hover .feature-img { transform:scale(1.03); }

        .stat-chip {
          background: rgba(255,255,255,.10);
          border: 1px solid rgba(255,255,255,.18);
          backdrop-filter: blur(8px);
        }

        /* FIX: prevent horizontal overflow site-wide */
        html, body { overflow-x: hidden; }
      `}</style>

      <main className="font-sans bg-[#f9fafb] overflow-x-hidden">

        {/* ═══════════════════════════════════════════
            SECTION 1 — HERO
        ═══════════════════════════════════════════ */}
        <section className="relative overflow-hidden">
          <img
            src="/hero.png"
            alt="Egypt hero"
            className="w-full object-cover"
            style={{ height: "clamp(500px, 80vh, 920px)" }}
          />

          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(105deg,rgba(6,18,46,.82) 0%,rgba(11,31,70,.55) 50%,rgba(0,0,0,.15) 100%)" }}
          />
          <div
            className="absolute left-0 bottom-0 w-full pointer-events-none"
            style={{ height: 3, background: "linear-gradient(90deg,transparent,#FFCE2A 40%,#f5b800 60%,transparent)" }}
          />

          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-20 pb-8 text-white">

            <motion.span {...fadeUp(0.1)}
              className="inline-block self-start mb-3 sm:mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-4 py-1.5 rounded-full">
              ✦ Egypt's #1 Travel Guide
            </motion.span>

            {/* FIX: text-3xl on xs → 4xl → 5xl → 7xl; was jumping from 4xl straight to 7xl */}
            <motion.h1
              {...fadeUp(0.2)}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-extrabold leading-[1.08] mb-4 sm:mb-5 max-w-2xl"
              style={SERIF}
            >
              Discover{" "}
              <em className="not-italic text-yellow-400">KEMET</em>{" "}
              through Egyptian eyes
            </motion.h1>

            {/* FIX: hide on xs so content doesn't overflow short screens */}
            <motion.p {...fadeUp(0.32)}
              className="hidden sm:block mb-6 sm:mb-8 max-w-md text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
              Plan your smart trip to Egypt — from temples to beaches and hidden gems.
            </motion.p>

            {/* FIX: stack buttons on xs, row on sm+ */}
            <motion.div {...fadeUp(0.42)} className="flex flex-col sm:flex-row gap-3 mb-0">
              <Link href="/blogs" className="w-full sm:w-auto">
                <button className="btn-gold w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-black text-sm">
                  Explore Now
                </button>
              </Link>
              <Link href="/Destination" className="w-full sm:w-auto">
                <button className="btn-ghost-white w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 font-medium text-white text-sm">
                  View Destinations
                </button>
              </Link>
            </motion.div>

            {/* FIX: horizontal scroll on xs so chips never wrap onto 2 rows and push content down */}
            <motion.div
              {...fadeUp(0.52)}
              className="flex gap-2 sm:gap-3 mt-6 sm:mt-10 overflow-x-auto pb-1"
              style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
            >
              {stats.map(({ value, label }) => (
                <div key={label} className="stat-chip shrink-0 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                  <div className="text-base sm:text-lg font-extrabold text-yellow-400 leading-none">{value}</div>
                  <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 mt-0.5 whitespace-nowrap">{label}</div>
                </div>
              ))}
            </motion.div>

          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 2 — POPULAR CITIES
        ═══════════════════════════════════════════ */}
        <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-8 md:px-20">
          {/* FIX: header row — stack fully on mobile, side-by-side on lg only */}
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between mb-8 sm:mb-10 md:mb-12">
            <div>
              <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Popular Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-1" style={SERIF}>
                Explore Popular Cities
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed">
                Egypt's most iconic destinations — each city with its own story, charm, and unforgettable experiences.
              </p>
            </div>

            {/* FIX: sort filters scroll horizontally on mobile so they never wrap awkwardly */}
            <div
              className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 shrink-0"
              style={{ scrollbarWidth: "none" }}
            >
              <span className="text-gray-400 text-sm shrink-0">Sort by:</span>
              {[
                ["Popular",     "bg-yellow-400 text-black"],
                ["Hidden Gems", "bg-gray-100 text-gray-600 hover:bg-gray-200"],
                ["Top Rated",   "bg-gray-100 text-gray-600 hover:bg-gray-200"],
              ].map(([label, cls]) => (
                <Link href="/offerings" key={label}>
                  <span className={`shrink-0 text-[13px] font-medium px-4 py-1.5 rounded-full cursor-pointer transition-colors ${cls}`}>
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* FIX: city circles — 3 per row on xs (was all 6 in one flex row, too small on mobile) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-y-6 gap-x-4 sm:gap-8 md:gap-10 max-w-3xl mx-auto sm:max-w-none">
            {cities.map((city, i) => (
              <Link href={city.href} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.45 }}
                  whileHover={{ y: -4 }}
                  className="city-card text-center cursor-pointer group"
                >
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto">
                    <img
                      src={`/${city.img}`}
                      alt={city.name}
                      className="city-ring w-full h-full rounded-full object-cover shadow-md"
                    />
                    <div className="city-overlay absolute inset-0 rounded-full bg-black/35 flex items-center justify-center">
                      <span className="text-white text-[10px] font-semibold">View</span>
                    </div>
                  </div>
                  {/* FIX: smaller text on xs so "Sharm El Sheikh" doesn't overflow */}
                  <p className="mt-2 text-[10px] sm:text-xs md:text-sm font-semibold text-gray-800 group-hover:text-yellow-600 transition-colors leading-tight">
                    {city.name}
                  </p>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 3 — FEATURED LUXOR BANNER
        ═══════════════════════════════════════════ */}
        <section className="px-4 sm:px-8 md:px-20 pb-12 sm:pb-14 md:pb-16">
          <Link href="/Luxor">
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25 }}
              // FIX: fluid height via clamp — no more fixed pixel on xs that clips text
              className="feature-card relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl cursor-pointer group"
              style={{ height: "clamp(180px, 30vw, 340px)" }}
            >
              <img src="/balloninluxor.jpg" alt="Balloon over Luxor" className="feature-img w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(0,0,0,.75) 0%,rgba(0,0,0,.1) 60%,transparent 100%)" }} />

              <div className="absolute top-3 sm:top-4 md:top-5 left-3 sm:left-4 md:left-5">
                <span className="inline-block bg-yellow-400 text-black text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                  Featured Destination
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-7">
                <h3 className="text-xl sm:text-2xl md:text-4xl font-extrabold text-white mb-1 sm:mb-2 leading-tight" style={SERIF}>
                  LUXOR
                </h3>
                {/* FIX: description hidden on mobile (no xs breakpoint in Tailwind default config) */}
                <p className="text-gray-300 text-sm max-w-md leading-relaxed hidden sm:block">
                  Discover the Valley of the Kings and breathtaking hot air balloons.
                </p>
                <div className="inline-flex items-center gap-1.5 mt-1.5 sm:mt-4 text-yellow-400 text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all duration-200">
                  Explore Luxor <span>→</span>
                </div>
              </div>
            </motion.div>
          </Link>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 4 — PACKAGES
        ═══════════════════════════════════════════ */}
        <section className="py-6 pb-14 sm:pb-16 md:pb-20 px-4 sm:px-8 md:px-20">
          <SectionHeading
            eyebrow="Top Experiences"
            title="Explore Our Luxor Packages"
            subtitle="Hand-picked tours and experiences for every kind of traveler."
          />
          {trips.length > 0 ? (
            // FIX: 1-col → 2-col sm → 2-col md → 4-col lg; md:grid-cols-4 at 768px was too cramped
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {trips.map((pkg, i) => (
                <Link href="/BookTrip" key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="pkg-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer h-full flex flex-col"
                  >
                    <div className="overflow-hidden h-40 sm:h-44 shrink-0">
                      <img
                        src={getTripImage(pkg)}
                        alt={pkg.title || pkg.name || "Trip image"}
                        onError={(e) => { e.currentTarget.src = FALLBACK_TRIP_IMAGE; }}
                        className="pkg-img w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="inline-block mb-2 bg-yellow-50 text-yellow-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-200">
                        From {pkg.price}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mb-1 leading-snug">{pkg.name}</h4>
                      <p className="text-xs text-gray-400 mb-3 leading-relaxed flex-1">{pkg.description}</p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-yellow-500 font-extrabold text-base">{pkg.price}</span>
                        <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded-full px-3 py-1 hover:border-yellow-400 hover:text-yellow-600 transition-colors">
                          Book →
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center">No packages available at the moment. Check back soon!</p>
          )}

          <div className="text-center mt-8 sm:mt-10">
            <Link href="/offerings">
              <button className="btn-gold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 font-semibold text-black text-sm">
                View All Packages
              </button>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 5 — HIDDEN GEMS
        ═══════════════════════════════════════════ */}
        <section className="px-4 sm:px-8 md:px-20 pb-14 sm:pb-16 md:pb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Off the Beaten Path
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-1" style={SERIF}>
                Egypt's Hidden Gems
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed">
                Places most tourists never find — secret canyons, ancient oases, and forgotten lakes.
              </p>
            </div>
            <Link href="/hidden-gems" className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 border-b border-gray-300 hover:text-yellow-600 hover:border-yellow-400 transition-colors whitespace-nowrap">
              See all gems →
            </Link>
          </div>

          {hiddenGems.length > 0 ? (
            // FIX: replace fixed height:280 with aspect-ratio — scales correctly on every screen
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {hiddenGems.map((gem, i) => (
                <Link href="/hidden-gems" key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="gem-card relative rounded-2xl overflow-hidden cursor-pointer shadow-md"
                    style={{ aspectRatio: "4/3" }}
                  >
                    <img src={gem.img} alt={gem.title} className="gem-img w-full h-full object-cover absolute inset-0" />
                    <div className="gem-overlay absolute inset-0" />

                    <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                      <span className="inline-block bg-yellow-400 text-black text-[10px] font-bold uppercase tracking-widest px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full">
                        {gem.tag}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                      <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-yellow-400 mb-1">{gem.location}</p>
                      <h3 className="text-base sm:text-lg md:text-xl font-extrabold text-white leading-tight mb-1 sm:mb-1.5" style={SERIF}>{gem.title}</h3>
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{gem.desc}</p>
                      <div className="inline-flex items-center gap-1 mt-2 sm:mt-3 text-yellow-400 text-xs font-semibold">
                        Discover <span>→</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center">No hidden gems available at the moment. Check back soon!</p>
          )}

          <div className="text-center mt-7 md:hidden">
            <Link href="/hidden-gems">
              <button className="btn-gold rounded-full px-8 py-3 font-semibold text-black text-sm">See All Hidden Gems</button>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 6 — REVIEWS
        ═══════════════════════════════════════════ */}
        <section className="pb-14 sm:pb-16 md:pb-20 px-4 sm:px-8 md:px-20">
          <div
            className="rounded-2xl sm:rounded-3xl px-4 sm:px-8 md:px-12 py-10 sm:py-12 md:py-14 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#06122e 0%,#0b1f46 50%,#102554 100%)" }}
          >
            <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 500, height: 500, background: "radial-gradient(circle,rgba(255,206,42,.10) 0%,transparent 65%)", transform: "translate(120px,-120px)" }} />

            <div className="relative z-10">
              <SectionHeading
                eyebrow="Real Stories"
                title="What travelers say about us"
                subtitle="Over 12,000 explorers have discovered Egypt with Kemet. Here's what some of them shared."
                light
              />

              {/* FIX: 1-col on mobile → 3-col on md; was already correct, kept */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4">
                {reviews.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="review-card rounded-2xl p-5 sm:p-6 flex flex-col gap-4"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <StarRow count={r.rating} />
                    <p className="text-gray-300 text-sm leading-relaxed flex-1">"{r.text}"</p>
                    <span className="inline-block self-start bg-yellow-400/15 text-yellow-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                      {r.trip}
                    </span>
                    <div className="flex items-center gap-3 pt-2 border-t border-white/10">
                      <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover shrink-0" style={{ border: "2px solid rgba(255,206,42,.4)" }} />
                      <div>
                        <p className="text-white text-sm font-semibold leading-none">{r.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{r.country}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} style={{ color: "#FFCE2A", fontSize: 20 }}>★</span>
                  ))}
                </div>
                <p className="text-white font-bold text-lg">4.9 / 5</p>
                <p className="text-gray-400 text-sm text-center">based on 2,400+ verified reviews</p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 7 — COMMUNITY PREVIEW
        ═══════════════════════════════════════════ */}
        <section className="pb-14 sm:pb-16 md:pb-20 px-4 sm:px-8 md:px-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Community Hub
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-1" style={SERIF}>
                Stories from fellow travelers
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed">
                12,400+ explorers sharing their real Egypt — join the conversation.
              </p>
            </div>
            <Link href="/communities" className="hidden md:flex items-center gap-1 text-sm font-semibold text-gray-500 border-b border-gray-300 hover:text-yellow-600 hover:border-yellow-400 transition-colors whitespace-nowrap">
              View all stories →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {communityPreviews.map((story, i) => (
              <Link href="/communities" key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="comm-card bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer flex flex-col sm:flex-row"
                >
                  {/* FIX: image has explicit h on sm so it doesn't collapse (sm:h-auto alone can = 0) */}
                  <div className="overflow-hidden w-full sm:w-2/5 h-48 sm:h-52 shrink-0">
                    <img src={story.img} alt={story.title} className="comm-img w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col justify-between p-4 sm:p-5 flex-1">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500 mb-2">{story.category}</p>
                      <h3 className="font-bold text-sm sm:text-base text-gray-900 leading-snug mb-3" style={SERIF}>{story.title}</h3>
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0" style={{ background: story.avatarBg }}>
                          {story.initials}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{story.author}</p>
                          <p className="text-xs text-gray-400">{story.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                        <span className="text-xs text-gray-400">♥ {story.likes} likes</span>
                        <span className="text-xs font-semibold text-yellow-600 ml-auto">Read story →</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* FIX: CTA bar — text left-aligned on mobile, row on sm+ */}
          <div
            className="mt-6 sm:mt-8 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ background: "linear-gradient(135deg,#1a1a1a 0%,#2d2519 60%,#3d3020 100%)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div>
              <p className="text-white font-bold text-base mb-0.5">Ready to share your own story?</p>
              <p className="text-gray-400 text-sm">Join 12,400+ travelers and become part of Egypt's travel community.</p>
            </div>
            <Link href="/communities" className="shrink-0 w-full sm:w-auto">
              <button className="btn-gold w-full sm:w-auto rounded-full px-7 py-3 font-semibold text-black text-sm whitespace-nowrap">
                Join the Community
              </button>
            </Link>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 8 — WHY KEMET
        ═══════════════════════════════════════════ */}
        <section className="px-4 sm:px-8 md:px-20 pb-14 sm:pb-16 md:pb-20">
          <div
            className="rounded-2xl sm:rounded-3xl overflow-hidden relative p-6 sm:p-10 md:p-12"
            style={{ background: "linear-gradient(135deg,#06122e 0%,#0b1f46 50%,#102554 100%)" }}
          >
            <div className="absolute top-0 right-0 pointer-events-none" style={{ width: 400, height: 400, background: "radial-gradient(circle,rgba(255,206,42,.12) 0%,transparent 70%)", transform: "translate(100px,-100px)" }} />
            <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-10">
              <div className="max-w-lg">
                <span className="inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-3 py-1 rounded-full">
                  Why Kemet?
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white leading-tight mb-3" style={SERIF}>
                  Travel Egypt the way Egyptians do
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Every guide, every route, every hidden spot is curated by locals who grew up between these monuments.
                </p>
              </div>
              {/* FIX: chips always 2-col, full-width on mobile, auto on lg */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full lg:w-72 shrink-0">
                {whyKemet.map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-2 sm:gap-3 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span className="text-white text-xs sm:text-sm font-medium leading-tight">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            SECTION 9 — NEWSLETTER CTA
        ═══════════════════════════════════════════ */}
        <section className="px-4 sm:px-8 md:px-20 pb-14 sm:pb-16 md:pb-20">
          {/* FIX: overflow-hidden added here to prevent decorative circles causing horizontal scroll */}
          <div
            className="rounded-2xl sm:rounded-3xl text-center px-5 sm:px-8 py-12 sm:py-14 relative overflow-hidden"
            style={{ background: "linear-gradient(135deg,#FFCE2A 0%,#f5c000 50%,#e8a800 100%)" }}
          >
            {/* Decorative circles are safely clipped by overflow-hidden on parent */}
            <div className="absolute left-0 top-0 w-48 sm:w-64 h-48 sm:h-64 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.12)", transform: "translate(-50%,-50%)" }} />
            <div className="absolute right-0 bottom-0 w-36 sm:w-48 h-36 sm:h-48 rounded-full pointer-events-none" style={{ background: "rgba(255,255,255,0.10)", transform: "translate(40%,40%)" }} />

            <div className="relative z-10 max-w-xl mx-auto">
              <span className="inline-block mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-900/70 bg-yellow-900/10 px-3 py-1 rounded-full">
                Stay in the loop
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight" style={SERIF}>
                Get the weekly Egypt digest
              </h3>
              <p className="text-yellow-900/70 text-sm mb-8 leading-relaxed px-2">
                New stories, hidden gems, community meetups and exclusive deals — straight to your inbox every week.
              </p>
              <Link href="/auth/auth">
                <motion.button
                  whileHover={{ scale: 1.05, translateY: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="rounded-full px-8 sm:px-10 py-3 sm:py-3.5 text-sm font-bold text-white border-none cursor-pointer"
                  style={{ background: "#06122e", boxShadow: "0 4px 14px rgba(6,18,46,.35)" }}
                >
                  Sign In →
                </motion.button>
              </Link>
              <p className="mt-4 text-xs text-yellow-900/50">
                for more help.{" "}
                <Link href="/contact" className="underline font-semibold">contact us</Link>
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA FETCHING
// ─────────────────────────────────────────────────────────────────────────────
export async function getStaticProps() {
  try {
    const [trips, hiddenGems] = await Promise.all([
      getTrips({ force: true }),
      getHiddenGems(),
    ]);
    return {
      props: {
        trips,
        hiddenGems: hiddenGems.map(normalizeHiddenGem),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed fetching home page data:", error);
    return {
      props: { trips: [], hiddenGems: [] },
      revalidate: 10,
    };
  }
}
