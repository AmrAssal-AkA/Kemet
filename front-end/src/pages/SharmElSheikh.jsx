import CityPage from "@/components/CityPage";
import { getCityPageHiddenGems, getCityPagePackages } from "@/utils/cityPageData";

const data = {
  city:        "Sharm El Sheikh",
  heroImg:     "/sharm.jpeg",
  tagline:     "Sinai's jewel — where the desert meets the Red Sea",
  description: "The world's most spectacular coral reefs, mountain monasteries, and a coastline that turns a different shade of blue every hour. Sharm is Egypt's other side.",
  highlights: [
    { icon: "🤿", label: "World-Class Reefs" },
    { icon: "🏔️", label: "Mt. Sinai" },
    { icon: "🐠", label: "Marine Life" },
    { icon: "☀️", label: "350 Days Sun" },
  ],
  packages: [
    {
      img:   "/images/sharm/pkg1.jpg",
      days:  "Full Day",
      title: "Ras Mohammed National Park Snorkeling & Diving",
      desc:  "The coral wall drops 800 meters. Turtles, sharks, napoleon fish — the richest reef in the Red Sea.",
      price: "$130",
    },
    {
      img:   "/images/sharm/pkg2.jpg",
      days:  "Overnight",
      title: "Mount Sinai Sunrise Hike & St. Catherine's Monastery",
      desc:  "Climb by starlight, reach the summit at dawn, descend through the oldest monastery in Christendom.",
      price: "$185",
    },
    {
      img:   "/images/sharm/pkg3.jpg",
      days:  "Half Day",
      title: "Blue Hole & Dahab Day Trip",
      desc:  "The famous Blue Hole dive site and the hippest beach town in Egypt — all in one unforgettable day.",
      price: "$100",
    },
  ],
  tips: [
    { img: "/images/sharm/tip1.jpg", title: "Dive Level",     text: "Ras Mohammed is suitable for snorkelers too. You don't need to dive to see remarkable sea life." },
    { img: "/images/sharm/tip2.jpg", title: "Sinai Hike",     text: "Start at midnight to reach the summit for sunrise. Bring layers — the top is cold before dawn." },
    { img: "/images/sharm/tip3.jpg", title: "Best Months",    text: "Oct Apr for diving clarity. Water is warm year-round (22–28°C). August is hot but very quiet." },
    { img: "/images/sharm/tip4.jpg", title: "Beyond Naama",   text: "Naama Bay is the tourist zone. Take a bus to Dahab for real Red Sea life — better food, better vibes." },
  ],
  gems: [
    { img: "/images/sharm/gem1.jpg", tag: "Underwater",  location: "Tiran Strait",    title: "Tiran Island Reefs",       desc: "Four reef systems named after ships that sank on them. Some of the most dramatic walls in the world." },
    { img: "/images/sharm/gem2.jpg", tag: "Desert Life", location: "South Sinai",     title: "Colored Canyon",           desc: "Layered sandstone in burgundy, purple and ochre — carved by wind over millions of years." },
    { img: "/images/sharm/gem3.jpg", tag: "Local Gem",   location: "Old Market",      title: "Sharm Old Town Market",    desc: "Tourists go to Naama. Locals shop here. Spices, handmade Bedouin jewelry, and no tourist prices." },
  ],
};

export default function SharmElSheikh({ packages = data.packages, gems = [] }) {
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
