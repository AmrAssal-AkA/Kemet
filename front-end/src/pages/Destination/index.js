import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { CheckIcon } from "@/components/ui//CheckIcon";

const defaultDestinationData = {
  hero: {
    title: "Alexandria:",
    subtitle: "The Pearl",
    description:
      "A city where classical history meets Mediterranean charm. Explore the ancient wonders and coastal beauty of this legendary metropolis.",
    bgImage: "/images/destination/1.png",
  },
  narrative: {
    title: "A Narrative Written in",
    highlight: "Limestone and Light.",
    text1:
      "Once the intellectual beacon of the ancient world, Alexandria holds a story woven with mysteries from the past. From the splendor of the Great Library to the enchanting allure of its Mediterranean coastline, the essence of the city awaits you.",
    text2:
      "Through centuries of waves and shifting sands, the city's spirit remains intact. A testament to human ambition and resilience, inviting you to discover the remnants of its legacy.",
    image1: "/images/destination/2.png",
    image2: "/images/destination/3.png",
    glassCard: {
      title: "331 BC",
      desc: "Founded by Alexander the Great, transforming into a beacon of knowledge and culture.",
    },
  },
  curated: [
    {
      id: 1,
      title: "Sunset Felucca Cruise",
      desc: "Drift along the ancient waters as the sun dips below the coastal horizon.",
      duration: "2.5 HOURS",
      image: "/images/destination/4.png",
    },
    {
      id: 2,
      title: "Roman Heritage Tour",
      desc: "A guided journey through the catacombs and amphitheaters of antiquity.",
      duration: "4 HOURS",
      image: "/images/destination/5.png",
    },
    {
      id: 3,
      title: "Seafood Gastronomy",
      desc: "An epicurean adventure through the city's finest coastal culinary traditions.",
      duration: "EVENING",
      image: "/images/destination/6.png",
    },
  ],
  hotel: {
    title: "The Steigenberger Cecil.",
    desc: "Experience the grandeur of a bygone era in the heart of Alexandria. Steeped in history and elegance, offering a flawless Mediterranean escape.",
    features: ["Panoramic Mediterranean views", "Royal & Presidential Suites"],
    image: "/images/destination/7.png",
  },
};

function DestinationPage(props) {
  const [data, setData] = useState(defaultDestinationData);
  const { trips } = props;

  useEffect(() => {
    const fetchDestinationData = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/destinations");
        const result = await response.json();
        if (result && result.length > 0) {
          setData(result[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchDestinationData();
  }, []);

  return (
    <>
      <Head>
        <title>Destination - {data.hero.title} | KEMET</title>
      </Head>

      <div className="bg-white min-h-screen font-sans">
        <section className="relative w-full h-[90vh] flex items-center justify-start overflow-hidden">
          <img
            src={data.hero.bgImage}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/40 to-black/60"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 w-full mt-20">
            <span className="bg-[#FBBF24] text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-widest shadow-sm">
              Destination
            </span>
            <h1 className="text-[100px] md:text-[130px] font-black text-[#111827] leading-none tracking-tighter opacity-90 mt-8 drop-shadow-sm">
              {data.hero.title}
            </h1>
            <h2 className="text-7xl md:text-9xl font-black text-[#FBBF24] italic leading-none drop-shadow-md">
              {data.hero.subtitle}
            </h2>
            <p className="max-w-2xl mt-8 text-[#111827] font-medium text-lg leading-relaxed mix-blend-multiply opacity-80">
              {data.hero.description}
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-32 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="flex flex-col items-start">
            <h2 className="text-5xl font-black text-[#111827] leading-tight mb-8">
              {data.narrative.title} <br />
              <span className="text-[#FBBF24]">{data.narrative.highlight}</span>
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              {data.narrative.text1}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed text-lg">
              {data.narrative.text2}
            </p>
            <div className="flex items-center gap-4 mt-8 group cursor-pointer">
              <div className="w-12 h-0.5 bg-[#FBBF24] group-hover:w-16 transition-all duration-300"></div>
              <span className="font-bold text-[#FBBF24] text-sm uppercase tracking-widest group-hover:text-[#e5a913] transition-colors">
                Discover the legacy
              </span>
            </div>
          </div>
          <div className="relative h-162.5 w-full">
            <img
              src={data.narrative.image1}
              className="absolute top-0 left-0 w-[65%] h-[80%] object-cover rounded-[40px] shadow-2xl z-10"
            />
            <img
              src={data.narrative.image2}
              className="absolute bottom-0 right-0 w-[60%] h-[75%] object-cover rounded-[40px] shadow-2xl z-0"
            />
            <div className="absolute top-1/2 left-[55%] transform -translate-x-1/2 -translate-y-1/2 bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-72 z-20 border border-white/50">
              <h4 className="font-black text-3xl text-[#111827] mb-3">
                {data.narrative.glassCard.title}
              </h4>
              <p className="text-sm text-gray-700 font-medium leading-relaxed">
                {data.narrative.glassCard.desc}
              </p>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="flex items-end justify-between mb-16">
            <div>
              <span className="text-[#FBBF24] font-black text-xs uppercase tracking-widest inline-block mb-4 bg-[#FBBF24]/10 px-4 py-2 rounded-full">
                Curated Experiences
              </span>
              <h2 className="text-5xl md:text-6xl font-black text-[#111827] mt-3 leading-tight">
                Unforgettable <br />
                <span className="text-[#FBBF24]">Moments Await</span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 group cursor-pointer pb-8 flex flex-col h-full hover:-translate-y-2"
              >
                <div className="relative w-full aspect-4/3 overflow-hidden p-4">
                  <img
                    src={trip.image}
                    alt={trip.name}
                    className="w-full h-full object-cover rounded-2xl transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
                  <span className="absolute top-6 right-6 bg-[#FBBF24] text-white px-3 py-1 rounded-full font-bold text-xs uppercase tracking-widest shadow-lg">
                    Featured
                  </span>
                </div>
                <div className="px-8 pt-6 flex flex-col grow">
                  <span className="text-[#FBBF24] font-bold text-xs uppercase tracking-wider mb-2">
                    {trip.category}
                  </span>
                  <h3 className="font-black text-2xl text-[#111827] mb-3 group-hover:text-[#FBBF24] transition-colors">
                    {trip.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 grow">
                    {trip.description}
                  </p>
                  <div className="w-full h-px bg-gray-100 mb-6"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 mb-1">
                        Starting from
                      </span>
                      <p className="text-xl font-black text-[#FBBF24]">
                        {trip.price}. EGP
                      </p>
                    </div>
                    <button className="text-[#111827] bg-gray-100 hover:bg-[#FBBF24] hover:text-white rounded-full p-3 transition-all duration-300 group/btn">
                      <ArrowRightIcon className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="bg-linear-to-br from-[#f9f9f9] to-[#f0f0f0] rounded-[48px] overflow-hidden flex flex-col md:flex-row shadow-xl hover:shadow-2xl transition-all duration-500">
            <div className="w-full md:w-[45%] h-150 overflow-hidden group">
              <img
                src={data.hotel.image}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="w-full md:w-[55%] p-16 md:p-24 flex flex-col justify-center">
              <span className="text-[#FBBF24] font-black text-xs uppercase tracking-widest mb-6 inline-block bg-[#FBBF24]/10 px-4 py-2 rounded-full w-max">
                Featured Stay
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-[#111827] mb-8 leading-tight">
                {data.hotel.title}
              </h3>
              <p className="text-gray-600 mb-12 leading-relaxed text-lg max-w-lg">
                {data.hotel.desc}
              </p>
              <ul className="space-y-5 mb-14">
                {data.hotel.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 text-base font-bold text-[#111827] hover:text-[#FBBF24] transition-colors"
                  >
                    <div className="w-5 h-5 rounded-full bg-[#FBBF24] flex items-center justify-center">
                      <CheckIcon />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="bg-[#111827] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest w-max hover:bg-[#FBBF24] hover:text-[#111827] transition-all shadow-lg transform hover:-translate-y-1 hover:shadow-2xl">
                View Itinerary
              </button>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-12 mb-32">
          <div className="relative bg-linear-to-br from-[#201c2c] via-[#2a2438] to-[#1a1620] rounded-[48px] p-24 text-center overflow-hidden flex flex-col items-center justify-center shadow-2xl hover:shadow-[0_20px_60px_rgba(251,191,36,0.3)] transition-all duration-500">
            <div className="absolute inset-6 border-2 border-[#FBBF24]/30 rounded-[40px] pointer-events-none"></div>

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-200 h-200 opacity-5 pointer-events-none">
              <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full text-[#FBBF24]"
              >
                <path
                  d="M50 0L93.3013 25V75L50 100L6.69873 75V25L50 0Z"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
                <path
                  d="M50 10L84.641 30V70L50 90L15.359 70V30L50 10Z"
                  stroke="currentColor"
                  strokeWidth="0.5"
                />
              </svg>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-5xl md:text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                Ready to write your own <br />
                <span className="text-[#FBBF24]">chapter?</span>
              </h2>
              <p className="text-gray-300 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                Join thousands of travelers who've discovered the magic of Egypt
                with EG-KEMET. From ancient wonders to hidden gems, your
                adventure starts here.
              </p>
              <button className="bg-[#FBBF24] text-[#111827] px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-white hover:shadow-2xl hover:shadow-[#FBBF24]/40 transition-all transform hover:-translate-y-2 group">
                Book Your Expedition
                <ArrowRightIcon className="w-4 h-4 inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DestinationPage;

export async function getStaticProps() {
  try {
    const response = await axios.get("http://localhost:8000/api/Trip");

    return {
      props: {
        trips: response.data,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.log("An error occured when fetching trips: " + error);
    return {
      props: {
        trips: [],
      },
      revalidate: 10,
    };
  }
}
