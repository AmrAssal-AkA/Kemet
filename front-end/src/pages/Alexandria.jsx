import CityPage from "@/components/CityPage";
import { getCityPageHiddenGems, getCityPagePackages } from "@/utils/cityPageData";

const data = {
  city:        "Alexandria",
  heroImg:     "/alex.jpeg",
  tagline:     "Where the Mediterranean meets ancient history",
  description: "Egypt's pearl of the sea — a city of poets, conquerors, and fishermen. Stroll the corniche, dive into Roman catacombs, and eat the best seafood of your life.",
  highlights: [
    { icon: "🌊", label: "Mediterranean Coast" },
    { icon: "🏛️", label: "Greco-Roman Sites" },
    { icon: "🐟", label: "Fresh Seafood" },
    { icon: "📚", label: "Bibliotheca" },
  ],
  packages: [
    {
      img:   "/images/alex/pkg1.jpg",
      days:  "Full Day",
      title: "Catacombs of Kom El Shoqafa & Pompey's Pillar",
      desc:  "Explore Alexandria's most impressive Greco-Roman underground tombs and ancient monuments.",
      price: "$90",
    },
    {
      img:   "/images/alex/pkg2.jpg",
      days:  "Half Day",
      title: "Bibliotheca Alexandrina & Qaitbay Citadel Tour",
      desc:  "A cultural double — the reborn ancient library and the 15th-century sea fortress.",
      price: "$70",
    },
    {
      img:   "/images/alex/pkg3.jpg",
      days:  "Full Day",
      title: "Montaza Palace Gardens & Corniche Walk",
      desc:  "Stroll royal gardens overlooking the sea, then follow the waterfront at golden hour.",
      price: "$55",




      
    },
  ],
  tips: [
    { img: "/images/alex/tip1.jpg", title: "Best Season",      text: "winter (Dec–Feb) is the best season in Alexandria, Egypt. The weather is mild and refreshing, with cool sea breezes and comfortable temperatures perfect for walking along the Corniche." },
    { img: "/images/alex/tip2.jpg", title: "Getting Around",   text: "Trams are the local secret — cheap, slow, and full of character. Grab a window seat." },
    { img: "/images/alex/tip3.jpg", title: "What to Eat",      text: "Ful medames at sunrise, fresh calamari at sunset. Ask for the fish market near the port." },
    { img: "/images/alex/tip4.jpg", title: "Hidden Tip",       text: "The rooftop of Sofitel Cecil Hotel has one of the best sea views in the city — free to visit for a coffee." },
  ],
  gems: [
    { img: "/images/alex/gem1.jpg", tag: "Underwater", location: "Greco roman museum ",       title: "Sunken City of Heracleion", desc: "An ancient city lost beneath the waves — visible on glass-bottom boat tours." },
    { img: "/images/alex/gem2.jpg", tag: "Local Life", location: "Anfushi",            title: "The Old Fish Market",       desc: "Locals haggle at dawn. The freshest catch in Alexandria, eaten at plastic tables by the sea." },
    { img: "/images/alex/gem3.jpg", tag: "Hidden Gem", location: "Montaza",         title: "Royal Greenhouse",    desc: "Away from the crowds — The greenhouse contained rare plants and flowers brought from all over the world, and was a place for King Farouk to relax and drink tea.." },
  ],
};

export default function Alexandria({ packages = data.packages, gems = [] }) {
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
