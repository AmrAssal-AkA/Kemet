import CityPage from "@/components/CityPage";

const data = {
  city:        "Siwa",
  heroImg:     "/siwa.jpeg",
  tagline:     "The oasis at the edge of the world",
  description: "Siwa is not on the way to anywhere — it IS the destination. Salt lakes, olive groves, mud-brick ruins, and a silence so complete you can hear the desert breathe.",
  highlights: [
    { icon: "🌴", label: "Ancient Oasis" },
    { icon: "🧂", label: "Salt Lakes" },
    { icon: "🏜️", label: "White Desert" },
    { icon: "⭐", label: "Zero Light Pollution" },
  ],
  packages: [
    {
      img:   "/images/siwa/pkg1.jpg",
      days:  "Full Day",
      title: "Great Sand Sea Dune Safari & Sunset Camp",
      desc:  "4WD through rolling golden dunes, sandboard down them, then watch the stars emerge over the Great Sand Sea.",
      price: "$160",
    },
    {
      img:   "/images/siwa/pkg2.jpg",
      days:  "Half Day",
      title: "Cleopatra's Spring & Salt Lake Float",
      desc:  "Float effortlessly in the salt lake, swim in the ancient spring, and let the oasis restore you.",
      price: "$60",
    },
    {
      img:   "/images/siwa/pkg3.jpg",
      days:  "Full Day",
      title: "Oracle Temple of Amun & Shali Fortress Ruins",
      desc:  "Where Alexander the Great consulted the Oracle. The mud-brick fortress glows amber at dusk.",
      price: "$90",
    },
  ],
  tips: [
    { img: "/images/siwa/tip1.jpg", title: "Go Offline",      text: "Signal is weak and the Wi-Fi is slow. This is a feature, not a bug. Let Siwa disconnect you." },
    { img: "/images/siwa/tip2.jpg", title: "Transport",       text: "Rent a donkey cart or bicycle. Cars exist but miss the point. Siwa moves slowly on purpose." },
    { img: "/images/siwa/tip3.jpg", title: "Cash Only",       text: "There are no card machines in Siwa. Bring enough Egyptian pounds for your entire stay." },
    { img: "/images/siwa/tip4.jpg", title: "Best Stars",      text: "Zero light pollution. Walk 5 minutes from any accommodation and lie on the sand. The Milky Way is visible to the naked eye." },
  ],
  gems: [
    { img: "/images/siwa/gem1.jpg", tag: "Off-Grid",     location: "Great Sand Sea",  title: "The Fossil Rock Garden",   desc: "Ancient sea fossils embedded in desert rocks — proof the Sahara was once an ocean floor." },
    { img: "/images/siwa/gem2.jpg", tag: "Hidden Pool",  location: "Aghurmi",         title: "Fatnas Island Spring",     desc: "A tiny island in a salt lake, reached by a narrow causeway. Locals bring mint tea at sunset." },
    { img: "/images/siwa/gem3.jpg", tag: "Ancient Site", location: "Siwa Town",       title: "Old Shali Ghost Town",     desc: "The old mud-brick city was mostly dissolved by three days of rain in 1926. The ruins remain, haunting and beautiful." },
  ],
};

export default function Siwa() {
  return <CityPage {...data} />;
}