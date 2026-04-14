import { useState } from "react";
import Link from "next/link";
import axios from "axios";

const popularCities = [
  { name: "Alexandria", image: "/images/cities/alexandria.jpg" },
  { name: "Luxor", image: "/images/cities/luxor.jpeg" },
  { name: "Aswan", image: "/images/cities/aswan.webp" },
  { name: "Hurghada", image: "/images/cities/hurghada.jpg" },
  { name: "Siwa", image: "/images/cities/siwa.jpg" },
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

  const filteredCities = popularCities.filter((city) =>
    city.name.toLowerCase().includes(searchCity.toLowerCase()),
  );

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Hero */}
      <section className="mx-auto max-w-[88rem] px-4 pt-8 sm:px-6 lg:px-8">
        <div
          className="relative min-h-[460px] overflow-hidden rounded-3xl bg-cover bg-center p-10 sm:min-h-[520px] sm:p-12 lg:min-h-[580px] lg:p-16"
          style={{ backgroundImage: "url('/images/BlogPageImages/hero.jpg')" }}
        >
          <div className="absolute inset-0 bg-[#0b1d3a]/60" />
          <div className="relative z-10 max-w-4xl pt-4 sm:pt-6 lg:pt-8">
            <p className="text-base font-semibold uppercase tracking-[0.2em] text-amber-300 sm:text-lg">
              Home
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl lg:mt-6 lg:text-6xl">
              Hello {userName}, Discover Egypt through Kemet
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-100 sm:text-lg lg:mt-6 lg:text-xl">
              Plan your smart trip to Egypt from templates to full guide-led
              experiences.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
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
      <section className="mx-auto mt-5 max-w-[82rem] px-4 sm:mt-7 sm:px-6 lg:mt-10 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md sm:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <input
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
              placeholder="Search your destination"
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#1a3f7a]"
            />
            <input
              placeholder="Date"
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#1a3f7a]"
            />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-base outline-none focus:border-[#1a3f7a]"
            >
              <option>Top Picks</option>
              <option>Family Trips</option>
              <option>Budget Friendly</option>
              <option>Luxury</option>
            </select>
            <Link
              href="/Destination"
              className="rounded-xl bg-amber-400 px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
            >
              Search
            </Link>
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

      {/* Featured Destination */}
      <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div
            className="h-72 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/cities/luxor.jpeg')" }}
          />
          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h3 className="text-3xl font-bold">LUXOR</h3>
              <p className="mt-2 text-sm text-slate-600">
                A journey through temples, ancient stories, and timeless Nile
                views.
              </p>
            </div>
            <div className="space-y-2 text-sm">
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                Top attractions
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                Best local experiences
              </p>
              <p className="rounded-lg bg-slate-50 px-3 py-2">
                City map & routes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold">Explore Our Packages</h2>
        <p className="mt-1 text-sm text-slate-600">
          Handpicked plans for different travel styles.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {packages.map((pkg) => (
            <div
              key={pkg.title}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div
                className="h-28 rounded-xl bg-cover bg-center"
                style={{ backgroundImage: `url('${pkg.image}')` }}
              />
              <h3 className="mt-3 text-sm font-semibold">{pkg.title}</h3>
              <p className="mt-1 text-xs text-slate-500">{pkg.days}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-[#1a3f7a]">
                  {pkg.price}
                </span>
                <Link
                  href="/BookTrip"
                  className="rounded-lg bg-amber-400 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-amber-300"
                >
                  Book
                </Link>
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
