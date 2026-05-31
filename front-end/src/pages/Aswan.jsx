import CityPage from "@/components/CityPage";
import { getCityPageHiddenGems, getCityPagePackages } from "@/utils/cityPageData";

const data = {
  city:        "Aswan",
  heroImg:     "/aswan.jpeg",
  tagline:     "Where the Nile slows down and time follows",
  description: "Egypt's southernmost city sits on the most beautiful stretch of the Nile. Nubian villages in vivid color, feluccas drifting past granite boulders, and Abu Simbel waiting just beyond.",
  highlights: [
    { icon: "⛵", label: "Felucca Sailing" },
    { icon: "🏯", label: "Abu Simbel" },
    { icon: "🌺", label: "Nubian Villages" },
    { icon: "🌇", label: "Nile Sunsets" },
  ],
  packages: [
    {
      img:   "/images/aswan/pkg1.jpg",
      days:  "Day Trip",
      title: "Abu Simbel Temples — Ramesses II Colossal Statues",
      desc:  "Egypt's most dramatic monument, carved into a cliff face and relocated by the world. An unmissable journey.",
      price: "$220",
    },
    {
      img:   "/images/aswan/pkg2.jpg",
      days:  "Half Day",
      title: "Felucca Sunset Cruise Around Elephantine Island",
      desc:  "Sail silently past granite outcrops, watch herons land, and drift into Nubian territory.",
      price: "$80",
    },
    {
      img:   "/images/aswan/pkg3.jpg",
      days:  "Full Day",
      title: "Nubian Village Experience & Philae Temple",
      desc:  "Colorful houses, crocodile-keepers, home-cooked Nubian lunch, then the island temple of Isis.",
      price: "$130",
    },
  ],
  tips: [
    { img: "/images/aswan/tip1.jpg", title: "Best Season",    text: "Nov–Feb is paradise. March gets warm. April onward is brutally hot — Abu Simbel at 45°C is no joke." },
    { img: "/images/aswan/tip2.jpg", title: "Nubian Culture", text: "Accept the tea. Always. Nubian hospitality is sacred and refusing is considered rude." },
    { img: "/images/aswan/tip3.jpg", title: "Island Access",  text: "Philae Temple is on an island — boats run frequently from the dock near the High Dam." },
    { img: "/images/aswan/tip4.jpg", title: "Abu Simbel",     text: "The Sound & Light show at Abu Simbel is worth the overnight stay. Go early February for the solar alignment." },
  ],
  gems: [
    { img: "/images/aswan/gem1.jpg", tag: "Nubian Life",  location: "West Bank",     title: "Gharb Soheil Village",   desc: "The most authentic Nubian village near Aswan. Painted houses, warm families, and real home cooking." },
    { img: "/images/aswan/gem2.jpg", tag: "Ancient Site", location: "Nile Islands",  title: "Elephantine Island",     desc: "An inhabited island in the middle of the Nile with ruins of 3,000 years stacked on top of each other." },
    { img: "/images/aswan/gem3.jpg", tag: "Seko Nubian House.",  location: "Elephantine Island",   title: "seko kato nile view hote",       desc: "A 20-minute drive from Aswan, the desert begins. Completely silent. Completely yours." },
  ],
};

export default function Aswan({ packages = data.packages, gems = [] }) {
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
