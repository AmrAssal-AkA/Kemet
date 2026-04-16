import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const cities = [
    { img: "alex.jpeg", name: "Alexandria" },
    { img: "cairo.jpeg", name: "Cairo" },
    { img: "luxor.jpeg", name: "Luxor" },
    { img: "aswan.jpeg", name: "Aswan" },
    { img: "siwa.jpeg", name: "Siwa" },
    { img: "sharm.jpeg", name: "Sharm El Sheikh" },
  ];

  return (
    <div className="font-sans bg-[#f9fafb]">

      {/* HERO */}
      <section className="relative">
        <img
          src="/hero.png"
          alt="hero"
          className="w-full h-[75vh] object-cover"
          width="100%" height="75vh"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/20 flex flex-col justify-center px-6 md:px-20 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold leading-tight mb-4"
          >
            Discover KEMET through Egyptian eyes
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 max-w-xl text-base md:text-lg text-gray-200"
          >
            Plan your smart trip to Egypt from temples to beaches and hidden gems.
          </motion.p>

          {/* UPDATED BUTTON → BLOG LINK */}
          <Link href="/Blog">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-8 py-3 rounded-full w-fit font-semibold shadow-lg"
            >
              Explore Now
            </motion.button>
          </Link>
        </div>
      </section>

      {/* SEARCH */}
      <div className="-mt-14 px-4 md:px-20 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-5 flex flex-col md:flex-row gap-4 items-center">
          <input placeholder="Where to?" className="flex-1 outline-none" />
          <input placeholder="Date" className="flex-1 outline-none" />
          <input placeholder="Guests" className="flex-1 outline-none" />
          <button className="bg-yellow-400 px-6 py-2 rounded-full font-semibold hover:bg-yellow-300 transition">
            Search
          </button>
        </div>
      </div>

      {/* CITIES */}
      <section className="py-16 px-4 md:px-20">

        <div className="flex flex-col lg:flex-row items-center justify-center text-center lg:text-left mb-10 gap-6 lg:gap-20 max-w-4xl mx-auto">
          <div className="lg:text-left">
            <h2 className="text-3xl font-bold mb-2">
              Explore Popular Cities
            </h2>
            <p className="text-gray-500 max-w-lg">
              Discover Egypt’s most iconic destinations — each city with its own story, charm, and unforgettable experiences.
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm flex-wrap justify-center">
            <span className="text-gray-400">Sort by:</span>
            <a href="/offerings" className="px-4 py-1.5 rounded-full bg-yellow-400 hover:bg-yellow-500">
              Popular
            </a>
            <a href="/offerings" className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
              Hidden Gems
            </a>
            <a href="/offerings" className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
              Top Rated
            </a>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {cities.map((city, i) => (
            <Link href="/offerings" key={i}>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-center cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={`/${city.img}`} width="112" height="112"
                    alt={city.name}
                    className="w-28 h-28 rounded-full object-cover mx-auto shadow-lg"
                  />

                  <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 hover:opacity-100 transition flex items-center justify-center text-white text-xs">
                    View
                  </div>
                </div>

                <p className="mt-3 text-sm font-semibold">
                  {city.name}
                </p>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED LUXOR */}
      <section className="px-4 md:px-20">
        <Link href="/Destination">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
          >
            <img
              src="/balloninluxor.jpg" width="100%" height="300"
              alt="Balloon over Luxor"
              className="w-full h-[300px] object-cover"
            />

            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">LUXOR</h3>
              <p className="text-gray-600">
                Discover the Valley of the Kings and breathtaking hot air balloons.
              </p>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* PACKAGES */}
      <section className="py-16 px-4 md:px-20">
        <h2 className="text-3xl font-bold mb-10 text-center">
          Explore Our Luxor Packages
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">

          <Link href="/BookTrip">
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
              <img src="/redballon.jpg" className="w-full h-44 object-cover" alt="balloon" />
              <div className="p-4">
                <h4 className="font-bold mb-1">Luxor: Sunrise Hot Air Balloon Ride Over the Nile</h4>
                <p className="text-sm text-gray-500 mb-2">Experience magical sunrise from above</p>
                <span className="text-yellow-500 font-semibold">$250</span>
              </div>
            </motion.div>
          </Link>

          <Link href="/BookTrip">
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
              <img src="/valley.jpeg" className="w-full h-44 object-cover" alt="valley" />
              <div className="p-4">
                <h4 className="font-bold mb-1">Luxor: Valley of the Kings, Queen Hatshepsut Temple</h4>
                <p className="text-sm text-gray-500 mb-2">Ancient wonders tour</p>
                <span className="text-yellow-500 font-semibold">$180</span>
              </div>
            </motion.div>
          </Link>

          <Link href="/BookTrip">
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
              <img src="/dinner.jpeg" className="w-full h-44 object-cover" alt="dinner" />
              <div className="p-4">
                <h4 className="font-bold mb-1">Luxor: Sunset Felucca Cruise with Local Dinner</h4>
                <p className="text-sm text-gray-500 mb-2">Nile river cruise with authentic meal</p>
                <span className="text-yellow-500 font-semibold">$120</span>
              </div>
            </motion.div>
          </Link>

          <Link href="/BookTrip">
            <motion.div whileHover={{ y: -8 }} className="bg-white rounded-2xl shadow-md overflow-hidden cursor-pointer">
              <img src="/karnak.jpeg" className="w-full h-44 object-cover" alt="temples" />
              <div className="p-4">
                <h4 className="font-bold mb-1">Guided Tour of Karnak & Luxor Temples</h4>
                <p className="text-sm text-gray-500 mb-2">Full day temple exploration</p>
                <span className="text-yellow-500 font-semibold">$150</span>
              </div>
            </motion.div>
          </Link>

        </div>

        <div className="text-center mt-10">
          <Link href="/offerings">
            <button className="bg-yellow-400 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition shadow">
              View All Packages
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
}