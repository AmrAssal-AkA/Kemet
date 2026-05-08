import CityPage from "@/components/CityPage";

const data = {
  city:        "Cairo",
  heroImg:     "/cairo.jpeg",
  tagline:     "The city that never sleeps, and never lets you forget it",
  description: "Pyramids, bazaars, mosques, and chaos — all held together by the Nile. Cairo is not a destination. It's an experience that rewires you.",
  highlights: [
    { icon: "🏺", label: "Giza Pyramids" },
    { icon: "🕌", label: "Islamic Cairo" },
    { icon: "🛍️", label: "Khan El Khalili" },
    { icon: "🏛️", label: "Egyptian Museum" },
  ],
  packages: [
    {
      img:   "/images/cairo/pkg1.jpg",
      days:  "Full Day",
      title: "Pyramids of Giza & Sphinx — Private Guided Tour",
      desc:  "Enter the Great Pyramid, ride camels around the plateau, and watch the Sphinx at sunset.",
      price: "$140",
    },
    {
      img:   "/images/cairo/pkg2.jpg",
      days:  "Full Day",
      title: "Egyptian Museum & Islamic Cairo Walking Tour",
      desc:  "Tutankhamun's treasures in the morning, centuries of mosques and minarets in the afternoon.",
      price: "$110",
    },
    {
      img:   "/images/cairo/pkg3.jpg",
      days:  "Half Day",
      title: "Khan El Khalili Bazaar & Old Cairo Souqs",
      desc:  "Get lost in the oldest market in Africa. Spices, perfumes, gold, and the best koshary nearby.",
      price: "$60",
    },
  ],
  tips: [
    { img: "/images/cairo/tip1.jpg", title: "Traffic Reality",  text: "Cairo traffic is a sport. Use the metro for cross-city moves — it's fast, cheap, and air-conditioned." },
    { img: "/images/cairo/tip2.jpg", title: "Best Time",        text: "Oct–Apr. Summer heat in Cairo (40°C+) is brutal, especially near the pyramids with no shade." },
    { img: "/images/cairo/tip3.jpg", title: "Must Eat",         text: "Koshary for lunch, kofta in Islamic Cairo for dinner. End with konafa from a street stall." },
    { img: "/images/cairo/tip4.jpg", title: "Giza Tip",         text: "Go to the pyramids at 8AM sharp. By 10AM, the tourist buses arrive and the peace is gone." },
  ],
  gems: [
    { img: "/images/cairo/gem1.jpg", tag: "Hidden History", location: "Saqqara",        title: "Step Pyramid of Djoser",   desc: "Older than Giza and almost always empty. Egypt's first pyramid, standing for 4,700 years." },
    { img: "/images/cairo/gem2.jpg", tag: "Night View",     location: "Muqattam Hills",  title: "The Rooftop of Cairo",     desc: "Drive up at dusk. The entire city spreads beneath you — minarets, the Nile, and the pyramids in the distance." },
    { img: "/images/cairo/gem3.jpg", tag: "Local Life",     location: "Zamalek Island",  title: "Cairo's Quiet Island",     desc: "Embassies, cafés, and tree-lined streets. A city within a city that tourists rarely find." },
  ],
};

export default function Cairo() {
  return <CityPage {...data} />;
}