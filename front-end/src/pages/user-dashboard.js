import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { getAuthRedirectPath, getUserRole } from "@/utils/authSession";
import { getTrips } from "@/services/tripServices";

// ─── DATA ─────────────────────────────────────────────────────────────────────

const popularCities = [
  { name: "Alexandria", image: "/images/cities/alexandria.jpg", href: "/Alexandria" },
  { name: "Cairo",      image: "/images/cities/cairo.jpeg",     href: "/Cairo" },
  { name: "Luxor",      image: "/images/cities/luxor.jpeg",     href: "/Luxor" },
  { name: "Aswan",      image: "/images/cities/aswan.webp",     href: "/Aswan" },
  { name: "Siwa",       image: "/images/cities/siwa.jpg",       href: "/Siwa" },
  { name: "Sharm",      image: "/sharm.jpeg",                   href: "/SharmElSheikh" },
];

const LEVELS = [
  { level: 1, name: "Wanderer",   minPoints: 0,    icon: "🪶" },
  { level: 2, name: "Explorer",   minPoints: 100,  icon: "🧭" },
  { level: 3, name: "Adventurer", minPoints: 250,  icon: "⛺" },
  { level: 4, name: "Discoverer", minPoints: 500,  icon: "🔭" },
  { level: 5, name: "Legend",     minPoints: 1000, icon: "👑" },
];

const QUICK_LINKS = [
  { icon: "🗺️", label: "Destinations", href: "/Destination" },
  { icon: "🎒", label: "Book a Trip",   href: "/BookTrip" },
  { icon: "💎", label: "Hidden Gems",   href: "/hidden-gems" },
  { icon: "👥", label: "Community",     href: "/communities" },
  { icon: "📖", label: "Travel Blogs",  href: "/blogs" },
  { icon: "🎁", label: "Offerings",     href: "/offerings" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 24 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

function getUserLevel(points) {
  return [...LEVELS].reverse().find((l) => points >= l.minPoints) || LEVELS[0];
}

function getNextLevel(points) {
  return LEVELS.find((l) => l.minPoints > points) || null;
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function UserDashboard() {
  const router = useRouter();
  const { user, sessionReady } = useAuth();

  const [searchCity, setSearchCity]           = useState("");
  const [selectedTag, setSelectedTag]         = useState("Top Picks");
  const [activeSlide, setActiveSlide]         = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused]   = useState(false);
  const [trips, setTrips]                     = useState([]);
  const [tripsLoading, setTripsLoading]       = useState(true);

  const touchStartXRef = useRef(null);

  const userName = user?.name || "Traveler";
  const userRole = getUserRole(user);

  // mock user points — replace with real API when available
  const userPoints   = 180;
  const currentLevel = getUserLevel(userPoints);
  const nextLevel    = getNextLevel(userPoints);
  const progressPct  = nextLevel
    ? ((userPoints - currentLevel.minPoints) / (nextLevel.minPoints - currentLevel.minPoints)) * 100
    : 100;

  // ── Auth guard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sessionReady) return;

    if (!user) {
      router.replace("/auth/auth");
      return;
    }

    if (userRole === "admin" || userRole === "guide" || userRole === "localguide") {
      router.replace(getAuthRedirectPath(user));
    }
  }, [router, sessionReady, user, userRole]);

  // ── Fetch trips ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getTrips()
      .then((data) => setTrips(data))
      .catch(() => setTrips([]))
      .finally(() => setTripsLoading(false));
  }, []);

  // ── City filtering ──────────────────────────────────────────────────────────
  const filteredCities = popularCities.filter((c) =>
    c.name.toLowerCase().includes(searchCity.toLowerCase())
  );

  const carouselCities = useMemo(
    () => (filteredCities.length ? filteredCities : popularCities),
    [filteredCities]
  );

  // ── Carousel controls ───────────────────────────────────────────────────────
  const handlePrevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === 0 ? carouselCities.length - 1 : prev - 1));
  }, [carouselCities.length]);

  const handleNextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev === carouselCities.length - 1 ? 0 : prev + 1));
  }, [carouselCities.length]);

  useEffect(() => {
    if (isUserInteracting || isCarouselPaused || carouselCities.length <= 1) return;
    const interval = setInterval(handleNextSlide, 4000);
    return () => clearInterval(interval);
  }, [handleNextSlide, isUserInteracting, isCarouselPaused, carouselCities.length]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsUserInteracting(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) { setIsUserInteracting(false); return; }
    const delta = touchStartXRef.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? handleNextSlide() : handlePrevSlide();
    touchStartXRef.current = null;
    setTimeout(() => setIsUserInteracting(false), 1200);
  };

  const displayTrips = trips.slice(0, 4);

  // ── Guard render ────────────────────────────────────────────────────────────
  if (!sessionReady || !user || ["admin", "guide", "localguide"].includes(userRole)) {
    return null;
  }

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-20">

      {/* ══════ HERO ══════ */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div
          className="relative min-h-80 overflow-hidden rounded-3xl bg-cover bg-center p-8 lg:p-12"
          style={{ backgroundImage: "url('/images/BlogPageImages/hero.jpg')" }}
        >
          <div className="absolute inset-0 rounded-3xl"
            style={{ background: "linear-gradient(105deg,rgba(6,18,46,.88) 0%,rgba(11,31,70,.6) 55%,rgba(0,0,0,.15) 100%)" }} />
          <div className="absolute bottom-0 left-0 w-full h-[3px]"
            style={{ background: "linear-gradient(90deg,transparent,#FFCE2A 40%,#f5b800 60%,transparent)" }} />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-xl">
              <motion.span {...fadeUp(0.1)}
                className="inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-4 py-1.5 rounded-full">
                ✦ Welcome Back
              </motion.span>
              <motion.h1 {...fadeUp(0.2)}
                className="text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                Hello, <em className="not-italic text-yellow-400">{userName}</em> 👋
              </motion.h1>
              <motion.p {...fadeUp(0.3)} className="text-gray-300 text-sm lg:text-base leading-relaxed mb-6">
                Plan your smart trip to Egypt — from hidden gems to full guide-led experiences.
              </motion.p>
              <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3">
                <Link href="/Destination"
                  className="rounded-full px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)", boxShadow: "0 4px 14px rgba(255,206,42,.4)" }}>
                  Explore Now
                </Link>
                <Link href="/BookTrip"
                  className="rounded-full px-6 py-3 text-sm font-medium text-white border transition hover:bg-white/10"
                  style={{ border: "1.5px solid rgba(255,255,255,0.3)" }}>
                  Book a Trip
                </Link>
              </motion.div>
            </div>

            {/* Level card */}
            <motion.div {...fadeUp(0.5)}
              className="flex-shrink-0 rounded-2xl p-5 w-full lg:w-64"
              style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", backdropFilter: "blur(12px)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ background: "rgba(255,206,42,0.15)", border: "1.5px solid rgba(255,206,42,0.3)" }}>
                  {currentLevel.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Explorer Level</p>
                  <p className="text-white font-extrabold text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {currentLevel.name}
                  </p>
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-[10px] text-gray-400 mb-1.5">
                  <span>{userPoints} pts</span>
                  {nextLevel && <span>{nextLevel.minPoints} pts</span>}
                </div>
                <div className="h-2 rounded-full w-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg,#FFCE2A,#f59e0b)" }}
                  />
                </div>
                {nextLevel && (
                  <p className="text-[10px] text-gray-400 mt-1.5">
                    {nextLevel.minPoints - userPoints} pts to{" "}
                    <span className="text-yellow-400 font-semibold">{nextLevel.name}</span>
                  </p>
                )}
              </div>
              <Link href="/hidden-gems"
                className="block text-center text-xs font-bold text-black rounded-full py-2 mt-3 transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)" }}>
                Earn More Points →
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════ QUICK LINKS ══════ */}
      <section className="mx-auto max-w-7xl px-4 mt-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {QUICK_LINKS.map((ql, i) => (
            <motion.div key={ql.label} {...fadeUp(i * 0.06)}>
              <Link href={ql.href}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-yellow-300 hover:shadow-md transition-all group">
                <span className="text-2xl group-hover:scale-110 transition-transform">{ql.icon}</span>
                <span className="text-xs font-semibold text-gray-600 group-hover:text-yellow-600 transition-colors text-center">{ql.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ SEARCH STRIP ══════ */}
      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-5">
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <span className="text-gray-400">📍</span>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Location</p>
                <input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Where to?"
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder-gray-400"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <span className="text-gray-400">📅</span>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Date</p>
                <input type="date" className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none" />
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <span className="text-gray-400">👥</span>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Travelers</p>
                <input placeholder="Guests" className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none placeholder-gray-400" />
              </div>
            </div>
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <span className="text-gray-400">☰</span>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</p>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-gray-900 outline-none">
                  <option>Top Picks</option>
                  <option>Family Trips</option>
                  <option>Budget Friendly</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-center px-3 py-3">
              <Link href="/Destination"
                className="w-full rounded-full py-3 text-center text-sm font-bold text-black transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)" }}>
                FIND
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ POPULAR CITIES ══════ */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Popular Destinations
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore Popular Cities
            </h2>
          </div>
          <Link href="/Destination" className="text-sm font-semibold text-gray-500 border-b border-gray-300 hover:text-yellow-600 hover:border-yellow-400 transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
          {filteredCities.map((city, i) => (
            <motion.div key={city.name} {...fadeUp(i * 0.07)}>
              <Link href={city.href} className="group text-center block">
                <div className="relative mx-auto h-20 w-20 sm:h-24 sm:w-24">
                  <div
                    className="w-full h-full rounded-full bg-cover bg-center shadow-md transition-all duration-300 group-hover:scale-105"
                    style={{ backgroundImage: `url('${city.image}')`, boxShadow: "0 0 0 3px #fff, 0 0 0 5px transparent" }}
                  />
                  <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200">
                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">View</span>
                  </div>
                </div>
                <p className="mt-2.5 text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-yellow-600 transition-colors">{city.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════ CAROUSEL ══════ */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mb-4">
          <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
            Discover
          </span>
          <h2 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            Explore Cities in Motion
          </h2>
        </div>

        <div
          className="group relative h-80 sm:h-[420px] w-full overflow-hidden rounded-3xl shadow-xl"
          onMouseEnter={() => { setIsCarouselHovered(true); setIsCarouselPaused(true); }}
          onMouseLeave={() => { setIsCarouselHovered(false); setIsCarouselPaused(false); }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {carouselCities.map((city, index) => (
            <div
              key={city.name}
              className={`absolute inset-0 transition-opacity duration-500 ${activeSlide === index ? "opacity-100" : "opacity-0"}`}
            >
              <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('${city.image}')` }} />
              <div className="absolute inset-0" style={{ background: "linear-gradient(to top,rgba(6,18,46,.8) 0%,transparent 60%)" }} />
              <div className="absolute bottom-8 left-8">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Egypt</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {city.name}
                </h3>
                <Link href={city.href}
                  className="inline-block text-xs font-bold text-black rounded-full px-5 py-2 transition hover:opacity-90"
                  style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)" }}>
                  Explore →
                </Link>
              </div>
            </div>
          ))}

          <button type="button" onClick={handlePrevSlide}
            className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-all ${isCarouselHovered || isUserInteracting ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ background: "rgba(0,0,0,0.4)" }}>
            ‹
          </button>
          <button type="button" onClick={handleNextSlide}
            className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white text-xl transition-all ${isCarouselHovered || isUserInteracting ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            style={{ background: "rgba(0,0,0,0.4)" }}>
            ›
          </button>

          <div className="absolute bottom-4 right-6 flex gap-2">
            {carouselCities.map((_, index) => (
              <button key={index} onClick={() => setActiveSlide(index)}
                className="rounded-full transition-all"
                style={{ width: activeSlide === index ? 28 : 8, height: 8, background: activeSlide === index ? "#FFCE2A" : "rgba(255,255,255,0.5)" }} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════ PACKAGES ══════ */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
              Top Experiences
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Explore Our Packages
            </h2>
          </div>
          <Link href="/offerings" className="text-sm font-semibold text-gray-500 border-b border-gray-300 hover:text-yellow-600 hover:border-yellow-400 transition-colors">
            View all →
          </Link>
        </div>

        {tripsLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayTrips.map((trip, i) => (
              <motion.div key={trip._id || trip.id || i} {...fadeUp(i * 0.08)}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                <div className="h-48 overflow-hidden relative">
                  <div
                    className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${trip.imageUrl || trip.image}')` }}
                  />
                  {trip.city && (
                    <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full"
                      style={{ background: "#FFCE2A", color: "#000" }}>
                      {trip.city}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 p-5">
                  <h3 className="font-bold text-sm text-gray-900 mb-1 leading-snug">{trip.title || trip.name}</h3>
                  <p className="text-xs text-gray-400 mb-1">{trip.duration}{trip.duration ? " days" : ""}</p>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4 line-clamp-2 flex-1">{trip.description}</p>
                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-base font-extrabold text-yellow-500">${trip.price || trip.finalPrice}</span>
                    <Link href="/BookTrip"
                      className="text-xs font-bold text-black rounded-full px-4 py-2 transition hover:opacity-90"
                      style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)" }}>
                      Book →
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/offerings"
            className="inline-block rounded-full px-8 py-3.5 text-sm font-bold text-black transition hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)", boxShadow: "0 4px 14px rgba(255,206,42,.35)" }}>
            View All Packages
          </Link>
        </div>
      </section>

      {/* ══════ HIDDEN GEMS CTA ══════ */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg,#06122e 0%,#0b1f46 60%,#102554 100%)" }}>
          <div className="absolute top-0 right-0 pointer-events-none"
            style={{ width: 300, height: 300, background: "radial-gradient(circle,rgba(255,206,42,.12) 0%,transparent 65%)", transform: "translate(80px,-80px)" }} />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="inline-block mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-3 py-1 rounded-full">
                Earn Points
              </span>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                Discover Egypt's Hidden Gems
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Visit secret places, upload your photo as proof, and earn points for real rewards.
                You're currently a{" "}
                <span className="text-yellow-400 font-semibold">{currentLevel.name} {currentLevel.icon}</span>.
              </p>
            </div>
            <Link href="/hidden-gems"
              className="flex-shrink-0 rounded-full px-7 py-3.5 font-bold text-sm text-black whitespace-nowrap transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg,#FFCE2A,#e8b800)", boxShadow: "0 4px 14px rgba(255,206,42,.35)" }}>
              Start Exploring
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}