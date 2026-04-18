import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import axios from "axios";

const popularCities = [
  {
    name: "Alexandria",
    image: "/images/cities/alexandria.jpg",
    description:
      "A Mediterranean gem with seaside promenades, historic forts, and vibrant coastal culture.",
  },
  {
    name: "Luxor",
    image: "/images/cities/luxor.jpeg",
    description:
      "Walk through ancient temples and timeless monuments along the magical Nile River.",
  },
  {
    name: "Aswan",
    image: "/images/cities/aswan.webp",
    description:
      "A peaceful southern city known for river islands, Nubian heritage, and golden sunsets.",
  },
  {
    name: "Hurghada",
    image: "/images/cities/hurghada.jpg",
    description:
      "Crystal-clear Red Sea waters, coral reefs, and lively beach escapes for every traveler.",
  },
  {
    name: "Siwa",
    image: "/images/cities/siwa.jpg",
    description:
      "A serene desert oasis filled with palm groves, salt lakes, and unique local traditions.",
  },
];

const packages = [
  {
    title: "Luxor Temple & Nile Tour",
    days: "3 Days / 2 Nights",
    price: "$320",
    image: "/images/packages/nile-tour.jpg",
  },
  {
    title: "Desert Safari & Oasis Escape",
    days: "4 Days / 3 Nights",
    price: "$410",
    image: "/images/packages/desert-safari.jpg",
  },
  {
    title: "Red Sea Adventure",
    days: "5 Days / 4 Nights",
    price: "$520",
    image: "/images/packages/red-sea.webp",
  },
  {
    title: "Historical Cairo Experience",
    days: "2 Days / 1 Night",
    price: "$240",
    image: "/images/packages/historical-cairo.jpg",
  },
];

export default function UserDashboard({ userName }) {
  const [searchCity, setSearchCity] = useState("");
  const [selectedTag, setSelectedTag] = useState("Top Picks");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const touchStartXRef = useRef(null);

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase()),
  );

  const carouselCities = useMemo(
    () => (filteredCities.length ? filteredCities : popularCities),
    [filteredCities],
  );

  const handlePrevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? carouselCities.length - 1 : prev - 1,
    );
  };

  const handleNextSlide = () => {
    setActiveSlide((prev) =>
      prev === carouselCities.length - 1 ? 0 : prev + 1,
    );
  };

  useEffect(() => {
    if (isUserInteracting || isCarouselPaused || carouselCities.length <= 1) return;

    const interval = setInterval(() => {
      handleNextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [isUserInteracting, isCarouselPaused, carouselCities.length]);

  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
    setIsUserInteracting(true);
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) {
      setIsUserInteracting(false);
      return;
    }

    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchStartXRef.current - touchEndX;

    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        handleNextSlide();
      } else {
        handlePrevSlide();
      }
    }

    touchStartXRef.current = null;
    setTimeout(() => setIsUserInteracting(false), 1200);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div
          className="relative min-h-[320px] overflow-hidden rounded-2xl bg-cover bg-center p-6 sm:min-h-[360px] sm:p-8 lg:min-h-[400px] lg:p-10"
          style={{ backgroundImage: "url('/images/BlogPageImages/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#0b1d3a]/60" />
          <div className="relative z-10 max-w-3xl pt-2 sm:pt-3 lg:pt-4">
            <p className="text-base font-semibold uppercase tracking-[0.2em] text-amber-300 sm:text-lg">
              Home
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-tight text-white sm:text-4xl lg:mt-4 lg:text-5xl">
              Hello {userName}, Discover Egypt through Kemet
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-100 sm:text-base lg:mt-4 lg:text-lg">
              Plan your smart trip to Egypt from templates to full guide-led
              experiences.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/Destination"
                className="rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-300"
              >
                Explore Now
              </Link>
              <Link
                href="/BookTrip"
                className="rounded-full bg-amber-400 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-300"
              >
                Book Trip
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Strip */}
      <section className="mx-auto mt-5 max-w-7xl px-4 sm:mt-7 sm:px-6 lg:mt-8 lg:px-8">
        <div className="rounded-3xl border border-gray-200 bg-white p-3 shadow-xl">
          <div className="grid grid-cols-1 overflow-hidden rounded-2xl md:grid-cols-5">
            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <div className="h-5 w-5 text-gray-400">📍</div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Location
                </p>
                <input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="Where to?"
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <div className="h-5 w-5 text-gray-400">📅</div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Date
                </p>
                <input
                  type="date"
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <div className="h-5 w-5 text-gray-400">👥</div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Travelers
                </p>
                <input
                  placeholder="Guests"
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-b border-gray-200 px-4 py-3 md:border-b-0 md:border-r">
              <div className="h-5 w-5 text-gray-400">☰</div>
              <div className="w-full">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Category
                </p>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="w-full bg-transparent text-sm font-semibold text-[#111827] outline-none"
                >
                  <option>Top Picks</option>
                  <option>Family Trips</option>
                  <option>Budget Friendly</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-center px-3 py-3">
              <Link
                href="/Destination"
                className="w-full rounded-full bg-[#FBBF24] px-6 py-3 text-center text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#e5a913]"
              >
                FIND
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Cities */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Explore Popular Cities</h2>
        <p className="mt-1 text-sm text-slate-600">
          Discover Egypt’s most iconic destinations.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {filteredCities.map((city) => (
            <Link
              key={city.name}
              href="/Destination"
              className="group text-center"
            >
              <div
                className="mx-auto h-24 w-24 rounded-full bg-cover bg-center ring-2 ring-white shadow-md transition group-hover:scale-105"
                style={{ backgroundImage: `url('${city.image}')` }}
              />
              <p className="mt-3 text-sm font-semibold">{city.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities Carousel */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden bg-white sm:p-6">
          <div className="mb-4 px-4 sm:px-0">
            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Explore Cities in Motion
            </h3>
          </div>

          <div
            className="group relative h-[420px] w-full overflow-hidden rounded-none sm:h-[520px] sm:rounded-2xl"
            onMouseEnter={() => {
              setIsCarouselHovered(true);
              setIsCarouselPaused(true);
            }}
            onMouseLeave={() => {
              setIsCarouselHovered(false);
              setIsCarouselPaused(false);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={() => setIsCarouselPaused(true)}
            onMouseUp={() => setIsCarouselPaused(false)}
          >
            {carouselCities.map((city, index) => (
              <div
                key={city.name}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url('${city.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-6 max-w-xl">
                  <h4 className="text-xl font-semibold tracking-wide text-white drop-shadow-md sm:text-2xl">
                    {city.name}
                  </h4>
                  <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-white/90 drop-shadow-sm sm:text-base">
                    {city.description}
                  </p>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handlePrevSlide}
              className={`absolute left-3 top-1/2 z-20 -translate-y-1/2 p-2 text-3xl leading-none text-white/90 transition-all duration-200 hover:text-white ${
                isCarouselHovered || isUserInteracting
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              aria-label="Previous slide"
            >
              ‹
            </button>

            <button
              type="button"
              onClick={handleNextSlide}
              className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 p-2 text-3xl leading-none text-white/90 transition-all duration-200 hover:text-white ${
                isCarouselHovered || isUserInteracting
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
              aria-label="Next slide"
            >
              ›
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2">
            {carouselCities.map((city, index) => (
              <button
                key={city.name}
                type="button"
                onClick={() => setActiveSlide(index)}
                className={`h-2.5 rounded-full transition-all ${
                  activeSlide === index
                    ? "w-8 bg-amber-400"
                    : "w-2.5 bg-slate-300 hover:bg-slate-400"
                }`}
                aria-label={`Go to ${city.name} slide`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Explore Our Packages</h2>
        <p className="mt-1 text-sm text-slate-600">
          Handpicked plans for different travel styles.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-[20px] border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl"
            >
              <div className="h-44 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${pkg.image}')` }}
                />
              </div>

              <div className="flex grow flex-col p-5">
                <h3 className="mb-2 text-base font-bold leading-tight text-[#111827]">
                  {pkg.title}
                </h3>
                <p className="mb-5 grow text-sm leading-relaxed text-gray-600">
                  {pkg.days}
                </p>

                <div className="mb-4 h-px w-full bg-gray-100" />

                <div className="flex items-end justify-between">
                  <span className="text-lg font-bold text-[#FBBF24]">
                    {pkg.price}
                  </span>

                  <Link
                    href="/BookTrip"
                    className="rounded-full bg-[#FBBF24] px-4 py-2 text-xs font-bold tracking-wide text-slate-900 transition-colors hover:bg-[#e5a913]"
                  >
                    Book
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/offerings"
            className="inline-block rounded-full bg-amber-400 px-6 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            View All Packages
          </Link>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const cookie = context.req.headers.cookie || "";

  if (!cookie || !cookie.includes("x-auth-token")) {
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }

  try {
    const response = await axios.post(
      "http://localhost:3000/api/auth/refresh",
      {},
      {
        headers: {
          Cookie: cookie,
        },
      },
    );

    const userName = response.data.user?.name;
    const userRole = response.data.user?.role;

    if(userRole !== "user") {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        }
      }
    }

    return {
      props: {
        userName,
        userRole,
      },
    };
  } catch (error) {
    console.error("Session verification error:", error.message);
    return {
      redirect: {
        destination: "/auth/auth",
        permanent: false,
      },
    };
  }
}
