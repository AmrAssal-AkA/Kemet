import Head from "next/head";
import { useState, useEffect } from "react";
import Link from "next/link";
import {FaGreaterThan, FaLessThan} from 'react-icons/fa'
import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { CheckIcon } from "@/components/ui/CheckIcon";
import axios from "axios";

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

const FALLBACK_TRIP_IMAGE = "/siwa.jpeg";

function getImageValue(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTripImage(trip) {
  if (trip?.imageUrl) return trip.imageUrl;
  if (Array.isArray(trip?.image)) return getImageValue(trip.image[0]) || FALLBACK_TRIP_IMAGE;
  if (trip?.image) return getImageValue(trip.image) || FALLBACK_TRIP_IMAGE;
  if (Array.isArray(trip?.images)) return getImageValue(trip.images[0]) || FALLBACK_TRIP_IMAGE;
  if (trip?.images) return getImageValue(trip.images) || FALLBACK_TRIP_IMAGE;
  return FALLBACK_TRIP_IMAGE;
}

function DestinationPage(props) {
  const [data, setData] = useState(defaultDestinationData);
  const {trips} = props


  return (
    <>
      <Head>
        <title>Destination | KEMET</title>
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
              <span className="text-[#FBBF24] font-black text-xs uppercase tracking-widest">
                Curated Experiences
              </span>
              <h2 className="text-5xl font-black text-[#111827] mt-3">
                Curated Moments.
              </h2>
            </div>
            <div className="flex gap-4">
              <button className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#FBBF24] hover:text-white transition-all duration-300 text-xl font-black text-[#111827]">
                <FaLessThan />
              </button>
              <button className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center hover:bg-[#FBBF24] hover:text-white transition-all duration-300 text-xl font-black text-[#111827]">
                <FaGreaterThan />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 group cursor-pointer pb-8 flex flex-col h-full"
              >
                <div className="w-full aspect-4/3 overflow-hidden p-4">
                  <img
                    src={getTripImage(trip)}
                    alt={trip.name}
                    onError={(event) => {
                      event.currentTarget.src = FALLBACK_TRIP_IMAGE;
                    }}
                    className="w-full h-full object-cover rounded-3xl transform group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="px-8 pt-4 flex flex-col grow">
                  <h3 className="font-black text-2xl text-[#111827] mb-3">
                    {trip.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-8 grow">
                    {trip.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between font-bold text-lg transition-colors text-yellow-500">
                    <span>{Number(trip.fullPrice || trip.finalPrice || 0).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}  EGP</span>
                      <div className="ml-2 transform group-hover:translate-x-1 transition-transform text-yellow-500 group-hover:text-black w-6 h-6">
                         <ArrowRightIcon />
                      </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-24">
          <div className="bg-[#f4f4f5] rounded-[48px] overflow-hidden flex flex-col md:flex-row shadow-lg">
            <div className="w-full md:w-[45%] h-150">
              <img
                src={data.hotel.image}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full md:w-[55%] p-16 md:p-24 flex flex-col justify-center">
              <span className="text-[#FBBF24] font-black text-xs uppercase tracking-widest mb-6">
                Featured Stay
              </span>
              <h3 className="text-5xl font-black text-[#111827] mb-8 leading-tight">
                {data.hotel.title}
              </h3>
              <p className="text-gray-600 mb-12 leading-relaxed text-lg max-w-lg">
                {data.hotel.desc}
              </p>
              <ul className="space-y-5 mb-14">
                {data.hotel.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-4 text-base font-bold text-[#111827]"
                  >
                    <CheckIcon /> {feature}
                  </li>
                ))}
              </ul>
              <Link href="/BookTrip">
                <button className="bg-yellow-400 text-[#1f2a44] px-8 py-4 rounded-full font-semibold tracking-wider">
                   View Trip
                 </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-8 md:px-16 py-12 mb-32">
          <div className="relative bg-[#201c2c] rounded-[48px] p-24 text-center overflow-hidden flex flex-col items-center justify-center shadow-2xl">
            <div className="absolute inset-6 border-2 border-[#FBBF24]/20 rounded-[40px] pointer-events-none"></div>

            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-200 h-200 opacity-10 pointer-events-none">
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
              <h2 className="text-6xl font-black text-white mb-8 leading-tight tracking-tight">
                Ready to write your own <br />
                chapter?
              </h2>
              <p className="text-gray-300 mb-12 max-w-xl mx-auto text-lg leading-relaxed">
                Join us to explore the hidden gems and timeless monuments of
                Alexandria.
              </p>
                <Link href="/BookTrip">
              <button className="bg-[#FBBF24] text-[#111827] px-12 py-5 rounded-full font-black text-sm uppercase tracking-widest hover:bg-[#e5a913] hover:shadow-lg hover:shadow-[#FBBF24]/20 transition-all transform hover:-translate-y-1">
                Book Your Trip 
              </button>
                 </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default DestinationPage;


export async function getStaticProps() {
  
  try{
    const response = await axios.get("https://kemet-ochre.vercel.app/api/Trip/");

    return {
      props: {
        trips: response.data
      },
      revalidate: 60
    }
  }catch(error){
    console.log("error while fetch the data")
     
    return {
      props: {
        trips: []
      },
      revalidate: 10
    }
  }
} 
