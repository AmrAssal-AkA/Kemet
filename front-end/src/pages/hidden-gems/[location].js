import Head from 'next/head';
import { useRouter } from 'next/router';

// Real-life data for your locations matching your selected images
const locationData = {
  nuweiba: {
    title: "Nuweiba",
    tagline: "The Peaceful Coastal Haven",
    image: "/images/hidden-gems/Rectangle 181.png",
    description: "Nestled between the rugged Sinai mountains and the deep blue waters of the Gulf of Aqaba, Nuweiba is a serene escape from the bustling world. Once a thriving port and an important stopover for pilgrims, it has evolved into a laid-back destination famous for its pristine beaches, vibrant coral reefs, and traditional Bedouin camps. It is the perfect place to disconnect, stargaze, and enjoy the untouched natural beauty of the Red Sea."
  },
  cairo: {
    title: "Cairo",
    tagline: "The City of a Thousand Minarets",
    image: "/images/hidden-gems/Rectangle 180.png",
    description: "Cairo is a sprawling, vibrant metropolis where ancient history and modern life collide. From the awe-inspiring Pyramids of Giza on its western edge to the labyrinthine alleys of Khan el-Khalili, every corner tells a story. While famous for its monuments, its true hidden gems lie within the narrow streets of Islamic Cairo, the tranquil courtyards of ancient mosques, and the rich, complex flavors of its local street food."
  },
  alexandria: {
    title: "Alexandria",
    tagline: "The Pearl of the Mediterranean",
    image: "/images/hidden-gems/Rectangle 179.png",
    description: "Founded by Alexander the Great, this coastal city offers a distinctly Mediterranean vibe, blending Greco-Roman history with early 20th-century grandeur. Explore the legendary Catacombs of Kom el Shoqafa, stroll along the breezy Corniche, or dive into the intellectual legacy of the new Bibliotheca Alexandrina. Alexandria holds an air of nostalgia, with faded European-style cafes and stunning seaside fortresses."
  },
  sharm: {
    title: "Sharm El-Sheikh",
    tagline: "The Gateway to the Deep Blue",
    image: "/images/hidden-gems/Rectangle 182.png",
    description: "Sharm El-Sheikh is globally renowned for some of the most spectacular underwater scenery on the planet. Beyond its luxury resorts, the true magic lies in the Ras Mohammed National Park, where sheer drop-offs plunge into the abyss, teeming with colorful marine life. For land explorers, the dramatic desert landscapes and nearby Mount Sinai offer unforgettable sunrise treks."
  },
  siwa: {
    title: "Siwa Oasis",
    tagline: "Egypt's Desert Secret",
    image: "/images/hidden-gems/Rectangle 185.png",
    description: "Isolated deep within the Western Desert, the Siwa Oasis feels like another world. Surrounded by salt lakes, endless sand dunes, and thousands of date palms, Siwa is rich in unique Berber culture and ancient ruins, including the Temple of the Oracle where Alexander the Great once sought answers. Float in the crystal-clear salt pools or soak in the famous Cleopatra's Spring."
  },
  aswan: {
    title: "Aswan",
    tagline: "The Jewel of the Nile",
    image: "/images/hidden-gems/Rectangle 184.png",
    description: "Aswan is Egypt's most relaxed city, where the Nile flows gently past granite boulders and lush, palm-studded islands. This southern frontier is the gateway to Nubia, known for its vibrantly painted villages and incredibly hospitable people. Sail on a traditional felucca at sunset, visit the majestic Philae Temple salvaged from the rising waters, and experience a slower, more magical pace of life."
  }
};

function HiddenGemDetail() {
  const router = useRouter();
  const { location } = router.query;

  // Wait for Next.js to determine the route
  if (!location) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // Retrieve the specific data based on the URL (e.g. "cairo")
  const data = locationData[location.toLowerCase()];

  // If someone types an invalid location in the URL, show this
  if (!data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-[#111827]">
        <h1 className="text-4xl font-black mb-4">Location Not Found</h1>
        <button onClick={() => router.push('/hidden-gems')} className="bg-[#FBBF24] px-6 py-2 rounded-full font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{data.title} | KEMET Hidden Gems</title>
      </Head>

      <div className="bg-white min-h-screen font-sans text-[#111827] pb-32">
        {/* Large Hero Image Section */}
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <img src={data.image} alt={data.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-40"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-wide drop-shadow-lg mb-4 capitalize">
              {data.title}
            </h1>
            <span className="bg-[#FBBF24] text-[#111827] px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-md">
              {data.tagline}
            </span>
          </div>
        </section>

        {/* Description Section */}
        <section className="max-w-4xl mx-auto px-8 mt-20 text-center">
          <h2 className="text-4xl font-black mb-8 text-[#111827]">About {data.title}</h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            {data.description}
          </p>
          
          <div className="mt-16 flex justify-center gap-6">
            <button onClick={() => router.back()} className="px-8 py-3 rounded-full font-bold border-2 border-gray-200 hover:border-[#111827] transition-colors">
              ← Back to Tours
            </button>
            <button className="bg-[#111827] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-black transition-colors">
              Book a Trip Here
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default HiddenGemDetail;