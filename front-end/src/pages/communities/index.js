import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Community() {
  const [activeTag, setActiveTag] = useState("All");

  const tags = ["All", "Luxor", "Cairo", "Siwa", "Alexandria", "Aswan", "Sharm", "Tips & Advice"  ];

  const stories = [
    {
      id: 1,
      featured: true,
      img: "/images/communities/story1.jpg",
      category: "Luxor · Featured",
      title: "Waking up at 4AM for the balloon ride that changed how I see Egypt forever",
      excerpt: "I almost skipped it — too tired, too cold. Then we rose above the Valley of the Kings as the sun cracked the horizon. Some things can't be captured in photos, only in memory.",
      author: "Sara Al-Masri",
      initials: "SA",
      avatarBg: "#c0392b",
      date: "2 days ago",
      likes: 284,
      comments: 47,
      tag: "Luxor",
    },
    {
      id: 2,
      featured: false,
      img: "/images/communities/story2.jpg",
      category: "Siwa · Hidden Gem",
      title: "The oasis that Instagram hasn't discovered yet",
      excerpt: "3 days completely offline, salt lake sunsets, and the friendliest locals I've ever met.",
      author: "Karim Mansour",
      initials: "KM",
      avatarBg: "#2980b9",
      date: "5 days ago",
      likes: 156,
      comments: 23,
      tag: "Siwa",
    },
    {
      id: 3,
      featured: false,
      img: "/images/communities/story3.jpg",
      category: "Alexandria · Local Life",
      title: "Eating ful medames by the sea at sunrise — an Alexandrian morning ritual",
      excerpt: "The corniche at 6AM with a paper cup of tea. This is the city nobody tells you about.",
      author: "Nour Fahmy",
      initials: "NF",
      avatarBg: "#27ae60",
      date: "1 week ago",
      likes: 98,
      comments: 14,
      tag: "Alexandria",
    },
    {
      id: 4,
      featured: false,
      img: "/images/communities/story4.jpg",
      category: "Cairo · History",
      title: "Standing inside the Great Pyramid — what the photos never show you",
      excerpt: "The heat, the silence, the weight of 4,000 years pressing in. It rewires something in your brain.",
      author: "Youssef Hassan",
      initials: "YH",
      avatarBg: "#8e44ad",
      date: "2 weeks ago",
      likes: 210,
      comments: 38,
      tag: "Cairo",
    },
  ];

  const tips = [
    { img: "/images/communities/tip1.jpg", title: "Best Time to Visit",  text: "Oct–Apr is ideal. Summer in Aswan hits 45°C — temples won't wait but heat will slow you." },
    { img: "/images/communities/tip2.jpg", title: "Cash & Cards",        text: "Always carry Egyptian pounds. ATMs in Luxor & Cairo are reliable; Siwa is cash-only territory." },
    { img: "/images/communities/tip3.jpg", title: "Local Guides",        text: "Official guides open doors — literally. Many restricted areas are guide-access only." },
    { img: "/images/communities/tip4.jpg", title: "Dress Code",          text: "Pack a light scarf. Shoulders & knees covered at temples is respectful and required." },
  ];

  const photos = [
    { img: "/images/communities/photo1.jpg", label: "Valley of the Kings · by @sara.travels" },
    { img: "/images/communities/photo2.jpg", label: "Aswan sunset · by @karim.m" },
    { img: "/images/communities/photo3.jpg", label: "Siwa Oasis · by @nour.f" },
    { img: "/images/communities/photo4.jpg", label: "Sharm reefs · by @youssef.h" },
    { img: "/images/communities/photo5.jpg", label: "Cairo nights · by @layla.r" },
  ];

  const members = [
    { initials: "SA", name: "Sara Al-Masri",  stories: 28, badge: "Top Writer",   bg: "#c0392b" },
    { initials: "KM", name: "Karim Mansour",  stories: 21, badge: "Explorer",     bg: "#2980b9" },
    { initials: "NF", name: "Nour Fahmy",     stories: 17, badge: "Local Expert", bg: "#27ae60" },
    { initials: "YH", name: "Youssef Hassan", stories: 14, badge: "Photographer", bg: "#8e44ad" },
    { initials: "LR", name: "Layla Rizk",     stories: 11, badge: "Rising Star",  bg: "#d35400" },
  ];

  const events = [
    { month: "MAY", day: "18", title: "Luxor Sunrise Balloon Meetup — Group Booking",            sub: "Luxor, Egypt · 12 travelers going · Hosted by Sara Al-Masri" },
    { month: "JUN", day: "3",  title: "Siwa Off-Grid Weekend — Desert Camping",                  sub: "Siwa Oasis · 8 spots left · Hosted by Karim Mansour" },
    { month: "JUN", day: "21", title: "Cairo Food Walk — Koshary, Foul & Everything In Between", sub: "Cairo · Free event · Hosted by Nour Fahmy" },
  ];

  const filteredStories =
    activeTag === "All" ? stories : stories.filter((s) => s.tag === activeTag);

  return (
    <div className="font-sans bg-[#f9fafb]">

      {/* ───────── HERO BANNER ───────── */}
      {/* EDIT 1: Added hero-bg.jpg as background image with overlay */}
      <section className="px-4 md:px-20 pt-10 pb-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden relative"
          style={{
            padding: "3.5rem 3rem",
            backgroundImage: "url('/images/communities/hero-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay to keep text readable */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "linear-gradient(135deg,rgba(26,26,26,0.88) 0%,rgba(45,37,25,0.82) 60%,rgba(61,48,32,0.78) 100%)",
            }}
          />

          {/* glow blobs */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle,rgba(245,197,24,.15) 0%,transparent 70%)",
              transform: "translate(60px,-60px)",
            }}
          />
          <div
            className="absolute bottom-0 pointer-events-none"
            style={{
              left: "20%",
              width: 400,
              height: 200,
              background: "radial-gradient(ellipse,rgba(245,197,24,.08) 0%,transparent 70%)",
              transform: "translateY(80px)",
            }}
          />

          {/* All content needs relative z-index to sit above the overlay */}
          <div className="relative z-10">
            <span className="inline-block bg-yellow-400/20 text-yellow-400 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-5">
              Community Hub
            </span>

            <h1
              className="text-4xl md:text-5xl font-extrabold text-white leading-tight max-w-xl mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Where every traveler becomes a{" "}
              <em className="not-italic text-yellow-400">storyteller</em>
            </h1>

            <p className="text-gray-400 text-base max-w-md leading-relaxed mb-8">
              Join thousands of explorers sharing their real Egypt experiences — from Siwa sunsets to Luxor nights.
            </p>

            <div className="flex gap-4 flex-wrap">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-400 text-black px-7 py-3 rounded-full font-semibold shadow-lg"
              >
                Join the Community
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-white/30 text-white px-7 py-3 rounded-full font-medium"
              >
                Browse Stories
              </motion.button>
            </div>

            <div className="flex gap-12 mt-10 pt-6 border-t border-white/10">
              {[["12,400+", "Members"], ["3,800+", "Stories Shared"], ["6", "Destinations"]].map(
                ([num, label]) => (
                  <div key={label}>
                    <div
                      className="text-2xl font-bold text-white"
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {num}
                    </div>
                    <div className="text-xs uppercase tracking-widest text-gray-500 mt-0.5">{label}</div>
                  </div>
                )
              )}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ───────── STORY FEED ───────── */}
      <section className="px-4 md:px-20 py-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Community Stories
          </h2>
          <Link href="#" className="text-sm text-gray-500 border-b border-gray-200">
            View all →
          </Link>
        </div>

        {/* Filter tags */}
        <div className="flex gap-2 flex-wrap mb-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                activeTag === tag
                  ? "bg-yellow-400 border-yellow-400 text-black"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Cards */}
        {/* EDIT 2: Featured card image fixed width/height, no empty space. Small cards get fixed h-40 image. */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {filteredStories.map((story, i) => {
            const isFeaturedFirst = story.featured && filteredStories[0]?.id === story.id;
            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer ${
                  isFeaturedFirst ? "md:col-span-3 md:flex md:h-72" : "flex flex-col"
                }`}
              >
                {/* Story image */}
                <div
                  className={`shrink-0 overflow-hidden ${
                    isFeaturedFirst
                      ? "md:w-120 w-full h-56 md:h-full"
                      : "w-full h-52"
                  }`}
                >
                  <img
                    src={story.img}
                    alt={story.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 min-h-0">
                  <div className="p-5 flex-1 overflow-hidden">
                    <p className="text-xs font-semibold tracking-widest uppercase text-yellow-500 mb-2">
                      {story.category}
                    </p>
                    <h3
                      className={`font-bold leading-snug mb-2 ${isFeaturedFirst ? "text-xl" : "text-base"}`}
                      style={{ fontFamily: "'Playfair Display', serif" }}
                    >
                      {story.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4">{story.excerpt}</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: story.avatarBg }}
                      >
                        {story.initials}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{story.author}</p>
                        <p className="text-xs text-gray-400">{story.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 px-5 py-3 border-t border-gray-100 mt-auto">
                    <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-700">
                      ♥ {story.likes} likes
                    </span>
                    <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-700">
                      💬 {story.comments} comments
                    </span>
                    <span className="text-xs text-gray-400 cursor-pointer hover:text-gray-700">↗ Share</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ───────── TRAVEL TIPS ───────── */}
      {/* EDIT 3: Increased card image height to h-44 and overall card min-height */}
      <section className="px-4 md:px-20 pb-12">
        <div className="bg-yellow-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Essential Egypt Travel Tips
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {tips.map((tip) => (
              <motion.div
                key={tip.title}
                whileHover={{ y: -3 }}
                className="bg-white rounded-xl overflow-hidden border border-yellow-100 flex flex-col"
                style={{ minHeight: "340px" }}
              >
                {/* Tip image — taller now */}
                <img
                  src={tip.img}
                  alt={tip.title}
                  className="w-full h-56 object-cover shrink-0"
                />
                <div className="p-4 flex flex-col flex-1">
                  <h4 className="font-semibold text-sm mb-1">{tip.title}</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">{tip.text}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── PHOTO WALL ───────── */}
      {/* EDIT 4: Label always visible — removed opacity-0 / hover:opacity-100, uses permanent gradient + white text */}
      <section className="px-4 md:px-20 pb-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Community Photo Wall
          </h2>
          <Link href="#" className="text-sm text-gray-500 border-b border-gray-200">
            Upload yours →
          </Link>
        </div>

        <div className="grid grid-cols-4 grid-rows-2 gap-3 h-85">
          {photos.map((photo, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className={`rounded-xl overflow-hidden relative cursor-pointer ${
                i === 0 ? "col-span-2 row-span-2" : ""
              }`}
            >
              <img
                src={photo.img}
                alt={photo.label}
                className="w-full h-full object-cover"
              />
              {/* Always-visible gradient + label */}
              <div
                className="absolute inset-0 flex items-end p-3"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 50%)",
                }}
              >
                <span className="text-white text-xs font-semibold drop-shadow">
                  {photo.label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── TOP MEMBERS ───────── */}
      <section className="px-4 md:px-20 pb-12">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-end justify-between mb-6">
            <h2 className="text-2xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
              Top Community Members
            </h2>
            <Link href="#" className="text-sm text-gray-500 border-b border-gray-200">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {members.map((m) => (
              <motion.div key={m.name} whileHover={{ y: -3 }} className="text-center cursor-pointer">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white mx-auto mb-3"
                  style={{ background: m.bg }}
                >
                  {m.initials}
                </div>
                <p className="text-sm font-semibold">{m.name}</p>
                <p className="text-xs text-gray-400">{m.stories} stories</p>
                <span className="inline-block mt-1 bg-yellow-50 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {m.badge}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── ASK THE COMMUNITY ───────── */}
      <section className="px-4 md:px-20 pb-12">
        <div className="bg-gray-900 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h3
              className="text-2xl font-bold text-white mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Have a question about Egypt?
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Over 12,000 travelers are ready to help — from visa tips to the best kushari spots in Cairo.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold text-sm"
            >
              Ask a Question
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-white/20 text-white px-6 py-3 rounded-full font-medium text-sm"
            >
              Browse Q&amp;A
            </motion.button>
          </div>
        </div>
      </section>

      {/* ───────── UPCOMING EVENTS ───────── */}
      <section className="px-4 md:px-20 pb-12">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-3xl font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
            Upcoming Community Meetups
          </h2>
          <Link href="#" className="text-sm text-gray-500 border-b border-gray-200">
            All events →
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {events.map((event) => (
            <motion.div
              key={event.title}
              whileHover={{ x: 4 }}
              className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-5 shadow-sm"
            >
              <div className="bg-yellow-50 rounded-xl p-3 text-center min-w-14">
                <p className="text-xs font-bold text-yellow-700 tracking-widest uppercase">{event.month}</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">{event.day}</p>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm mb-1">{event.title}</p>
                <p className="text-xs text-gray-400">{event.sub}</p>
              </div>
              <button className="bg-yellow-400 text-black text-sm font-semibold px-5 py-2 rounded-full shrink-0 hover:bg-yellow-300 transition">
                Join
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────── NEWSLETTER ───────── */}
      <section className="px-4 md:px-20 pb-16">
        <div
          className="rounded-2xl text-center p-10"
          style={{ background: "linear-gradient(135deg,#F5C518 0%,#e8a800 100%)" }}
        >
          <h3
            className="text-3xl font-bold text-gray-900 mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Get the weekly Egypt digest
          </h3>
          <p className="text-yellow-900/70 text-sm mb-6">
            New stories, hidden gems, and community meetups — straight to your inbox.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="KEMET@email.com"
              className="flex-1 px-5 py-3 rounded-full text-sm outline-none border-none"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}