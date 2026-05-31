import CityPage from "@/components/CityPage";
import { getCityPageHiddenGems, getCityPagePackages } from "@/utils/cityPageData";

const data = {
  city:        "Luxor",
  heroImg:     "/luxor.jpeg",
  tagline:     "The world's greatest open-air museum",
  description: "Every stone in Luxor has a story 3,000 years old. Hot air balloons at dawn, pharaohs' tombs at noon, and felucca sunsets on the Nile by evening.",
  highlights: [
    { icon: "🎈", label: "Balloon Rides" },
    { icon: "⚰️", label: "Valley of Kings" },
    { icon: "🛕", label: "Karnak Temple" },
    { icon: "🌅", label: "Nile Sunsets" },
  ],
  packages: [
    {
      img:   "/redballon.jpg",
      days:  "Sunrise",
      title: "Hot Air Balloon Ride Over the Valley of the Kings",
      desc:  "Rise above the Theban hills as the sun cracks the horizon. The single greatest view in Egypt.",
      price: "$250",
    },
    {
      img:   "/valley.jpeg",
      days:  "Full Day",
      title: "Valley of the Kings & Hatshepsut Temple Tour",
      desc:  "Enter royal tombs untouched for millennia and stand inside Egypt's most dramatic temple.",
      price: "$180",
    },
    {
      img:   "/karnak.jpeg",
      days:  "Full Day",
      title: "Karnak & Luxor Temples — Guided Expert Tour",
      desc:  "Walk the Avenue of Sphinxes and explore the largest religious complex ever built.",
      price: "$150",
    },
  ],
  tips: [
    { img: "/images/Luxor/tip1.jpg", title: "Start Early",     text: "Temples open at 6AM. Be there. By 9AM the heat and crowds make exploration hard." },
    { img: "/images/Luxor/tip2.jpg", title: "East vs West",    text: "East bank is temples of the living. West bank is tombs of the dead. Split your two days accordingly." },
    { img: "/images/Luxor/tip3.jpg", title: "Balloon Booking", text: "Book balloons 2–3 days ahead in peak season. Reputable operators include Magic Horizon and Sindbad." },
    { img: "/images/Luxor/tip4.jpg", title: "Getting Around",  text: "Luxury Nile Cruise in the west bank — it's flat, quiet, and one of the best cycling experiences in Egypt." },
  ],
  gems: [
    { img: "/images/Luxor/gem1.jpg", tag: "Secret Spot",  location: "West Bank, El Qarna",       title: "Bedouin lodge luxor",    desc: "A place so magical that words can’t do it justice — a hidden Bedouin retreat in Luxor where time slows down and every sunset feels unreal.." },
    { img: "/images/Luxor/gem2.jpg", tag: "Night Magic",  location: "East Bank",        title: "Karnak Sound & Light",   desc: "After the crowds leave, the temple is lit in gold and the ancient stories come alive." },
    { img: "/images/Luxor/gem3.jpg", tag: "Local Life",   location: "Banana Island",    title: "Felucca to Banana Island", desc: "A 15-minute sail to a tiny island of banana palms. The locals here live exactly as they did 100 years ago." },
  ],
};

export default function Luxor({ packages = data.packages, gems = [] }) {
  return <CityPage {...data} packages={packages} gems={gems} />;
}

export async function getStaticProps() {
  const [packages, gems] = await Promise.all([
    getCityPagePackages(data.city, data.packages),
    getCityPageHiddenGems(data.city),
  ]);

  return {
    props: { packages, gems },
    revalidate: 300,
  };
}
