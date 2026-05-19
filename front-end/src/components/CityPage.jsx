import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head";

// ─── HELPERS ──────────────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── MAIN TEMPLATE ────────────────────────────────────────────────────────────

export default function CityPage({
  city,
  heroImg,
  tagline,
  description,
  highlights = [],
  packages   = [],
  tips       = [],
  gems       = [],
}) {
  return (
    <>
      <Head>
        <title>{city} — Kemet Travel</title>
        <meta name="description" content={description} />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style>{`
        :root { --gold:#FFCE2A; --gold-dark:#e8b800; --navy:#06122e; }

        .btn-gold {
          background: linear-gradient(135deg,var(--gold) 0%,var(--gold-dark) 100%);
          box-shadow: 0 4px 14px rgba(255,206,42,.35);
          transition: transform .18s, box-shadow .18s;
        }
        .btn-gold:hover { transform:translateY(-2px); box-shadow:0 8px 22px rgba(255,206,42,.45); }

        .btn-ghost-white { border:1.5px solid rgba(255,255,255,.3); transition:border-color .18s,background .18s; }
        .btn-ghost-white:hover { border-color:var(--gold); background:rgba(255,206,42,.1); }

        .pkg-card { transition:transform .25s,box-shadow .25s; }
        .pkg-card:hover { transform:translateY(-8px); box-shadow:0 20px 40px rgba(0,0,0,.13); }
        .pkg-img { transition:transform .4s; }
        .pkg-card:hover .pkg-img { transform:scale(1.05); }

        .tip-card { transition:transform .25s; }
        .tip-card:hover { transform:translateY(-4px); }

        .gem-card { transition:transform .28s,box-shadow .28s; }
        .gem-card:hover { transform:translateY(-6px); box-shadow:0 18px 38px rgba(0,0,0,.14); }
        .gem-img { transition:transform .45s; }
        .gem-card:hover .gem-img { transform:scale(1.06); }
        .gem-overlay { background:linear-gradient(to top,rgba(6,18,46,.85) 0%,rgba(6,18,46,.2) 55%,transparent 100%); }

        .stat-chip { background:rgba(255,255,255,.10); border:1px solid rgba(255,255,255,.18); backdrop-filter:blur(8px); }

        /* Highlights scroll on tiny screens */
        .highlights-row { display:flex; flex-wrap:wrap; gap:0.75rem; margin-top:1.75rem; }
        @media (max-width:480px) {
          .highlights-row { flex-wrap:nowrap; overflow-x:auto; padding-bottom:4px; -webkit-overflow-scrolling:touch; }
          .highlights-row::-webkit-scrollbar { display:none; }
        }
      `}</style>

      <main className="font-sans bg-[#f9fafb]">

        {/* ══════ HERO ══════ */}
        <section className="relative overflow-hidden">
          <img
            src={heroImg}
            alt={city}
            className="w-full object-cover"
            style={{ height: "clamp(420px, 75vh, 860px)" }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(105deg,rgba(6,18,46,.85) 0%,rgba(11,31,70,.55) 50%,rgba(0,0,0,.15) 100%)" }}
          />
          <div
            className="absolute left-0 bottom-0 w-full h-px pointer-events-none"
            style={{ background: "linear-gradient(90deg,transparent,#FFCE2A 40%,#f5b800 60%,transparent)" }}
          />

          <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 md:px-20 pb-6 text-white">
            <motion.span {...fadeUp(0.1)}
              className="inline-block self-start mb-3 sm:mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-400 bg-yellow-400/15 px-4 py-1.5 rounded-full">
              ✦ Kemet Travel Guide
            </motion.span>

            <motion.h1
              {...fadeUp(0.2)}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-2 sm:mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {city}
            </motion.h1>

            {tagline && (
              <motion.p {...fadeUp(0.28)}
                className="text-yellow-400 text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 italic"
                style={{ fontFamily: "'Playfair Display', serif" }}>
                {tagline}
              </motion.p>
            )}

            <motion.p {...fadeUp(0.35)} className="hidden sm:block mb-6 sm:mb-8 max-w-md text-sm sm:text-base text-gray-300 leading-relaxed">
              {description}
            </motion.p>

            <motion.div {...fadeUp(0.44)} className="flex flex-col sm:flex-row gap-3">
              <Link href="/BookTrip" className="w-full sm:w-auto">
                <button className="btn-gold w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 font-semibold text-black text-sm">
                  Book a Trip
                </button>
              </Link>
              <Link href="/offerings" className="w-full sm:w-auto">
                <button className="btn-ghost-white w-full sm:w-auto rounded-full px-6 sm:px-8 py-3 sm:py-3.5 font-medium text-white text-sm">
                  View Packages
                </button>
              </Link>
            </motion.div>

            {highlights.length > 0 && (
              <motion.div {...fadeUp(0.52)} className="highlights-row">
                {highlights.map(({ icon, label }) => (
                  <div key={label} className="stat-chip flex-shrink-0 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 text-center">
                    <div className="text-base sm:text-lg font-extrabold text-yellow-400 leading-none">{icon}</div>
                    <div className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 mt-0.5 whitespace-nowrap">{label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* ══════ PACKAGES ══════ */}
        {packages.length > 0 && (
          <section className="py-12 sm:py-16 px-4 sm:px-8 md:px-20">
            <div className="mb-8 sm:mb-10">
              <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Top Experiences
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {city} Packages
              </h2>
              <p className="text-gray-500 text-sm mt-2 max-w-md leading-relaxed">
                Hand-picked tours and experiences curated by local experts.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {packages.map((pkg, i) => (
                <Link href="/BookTrip" key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.45 }}
                    className="pkg-card bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer"
                  >
                    {/* shorter image on mobile */}
                    <div className="overflow-hidden h-44 sm:h-52 relative">
                      <img src={pkg.img} alt={pkg.title} className="pkg-img w-full h-full object-cover" />
                      {pkg.days && (
                        <span className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                          {pkg.days}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5">
                      <span className="inline-block mb-2 bg-yellow-50 text-yellow-700 text-xs font-bold px-2.5 py-0.5 rounded-full border border-yellow-200">
                        From {pkg.price}
                      </span>
                      <h4 className="font-bold text-sm text-gray-900 mb-1 leading-snug">{pkg.title}</h4>
                      <p className="text-xs text-gray-400 mb-3 sm:mb-4 leading-relaxed">{pkg.desc}</p>
                      <div className="flex items-center justify-between">
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

            <div className="text-center mt-8 sm:mt-10">
              <Link href="/offerings">
                <button className="btn-gold rounded-full px-7 sm:px-9 py-3 sm:py-3.5 font-semibold text-black text-sm">
                  View All Packages
                </button>
              </Link>
            </div>
          </section>
        )}

        {/* ══════ TRAVEL TIPS ══════ */}
        {tips.length > 0 && (
          <section className="px-4 sm:px-8 md:px-20 pb-12 sm:pb-16">
            <div className="bg-yellow-50 rounded-2xl p-5 sm:p-8">
              <h2
                className="text-xl sm:text-2xl font-bold mb-5 sm:mb-6"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Essential {city} Tips
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {tips.map((tip) => (
                  <motion.div
                    key={tip.title}
                    whileHover={{ y: -3 }}
                    className="tip-card bg-white rounded-xl overflow-hidden border border-yellow-100 flex flex-col"
                  >
                    <div className="w-full overflow-hidden" style={{ aspectRatio: "16/9" }}>
                      <img src={tip.img} alt={tip.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════ HIDDEN GEMS ══════ */}
        {gems.length > 0 && (
          <section className="px-4 sm:px-8 md:px-20 pb-16 sm:pb-20">
            <div className="mb-8 sm:mb-10">
              <span className="inline-block mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                Off the Beaten Path
              </span>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight mt-1"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {city} Hidden Gems
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {gems.map((gem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
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
                    <h3
                      className="text-lg sm:text-xl font-extrabold text-white leading-tight mb-1 sm:mb-1.5"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {gem.title}
                    </h3>
                    <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{gem.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* ══════ CTA ══════ */}
        <section className="px-4 sm:px-8 md:px-20 pb-16 sm:pb-20">
          <div
            className="rounded-2xl sm:rounded-3xl p-7 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ background: "linear-gradient(135deg,#06122e 0%,#0b1f46 50%,#102554 100%)" }}
          >
            <div className="max-w-md">
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-2"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Ready to explore {city}?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Let our local experts craft the perfect itinerary for you — from hidden spots to iconic landmarks.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
              <Link href="/BookTrip" className="w-full sm:w-auto">
                <button className="btn-gold w-full sm:w-auto rounded-full px-7 sm:px-8 py-3 sm:py-3.5 font-semibold text-black text-sm whitespace-nowrap">
                  Plan My Trip
                </button>
              </Link>
              <Link href="/communities" className="w-full sm:w-auto">
                <button className="btn-ghost-white w-full sm:w-auto rounded-full px-7 sm:px-8 py-3 sm:py-3.5 font-medium text-white text-sm whitespace-nowrap">
                  Read Stories
                </button>
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}