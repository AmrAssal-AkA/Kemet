import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { buildApiUrl } from "@/utils/apiBaseUrl";

import { ArrowRightIcon } from "@/components/ui/ArrowRightIcon";
import { LocationIcon } from "@/components/ui/LocationIcon";
import DistanceIcon from "@/components/ui/DistanceIcon";
import { PeopleIcon } from "@/components/ui/PeopleIcon";
import IconPlaceholder from "@/components/ui/IconPlaceholder";
import SearchIcon from "@/components/ui/SearchIcon";

const testimonialsData = [
  {
    id: 1,
    text: "KEMET made my Egypt experience magical, organized, insightful, and absolutely perfect. The depth of historical understanding was breathtaking.",
    name: "John Davis",
    role: "Customer",
    image: "/images/offerings/avatar.png",
  },
  {
    id: 2,
    text: "The tours to unique hidden locations in Egypt were wonderful. Recommendations for food, music, everything made it a deep cultural integration.",
    name: "Sophia Brown",
    role: "Customer",
    image: "/images/offerings/avatar (2).png",
  },
  {
    id: 3,
    text: "Planning a trip was never easier. Thanks to KEMET's vast insights and expert guidance. Highly recommend them for any travel.",
    name: "William Moore",
    role: "Customer",
    image: "/images/offerings/avatar (1).png",
  },
];

const FEATURED_LAYOUT = [
  { aspect: "aspect-[4/5]", titleSize: "text-5xl" },
  { aspect: "aspect-square", titleSize: "text-5xl" },
  { aspect: "aspect-[3/4]", titleSize: "text-5xl" },
  { aspect: "aspect-[4/5]", titleSize: "text-5xl" },
  { aspect: "aspect-square", titleSize: "text-5xl" },
  { aspect: "aspect-[3/4]", titleSize: "text-5xl" },
];

const getGemTitle = (gem) =>
  gem?.placeName || gem?.title || gem?.name || "Hidden gem";

const getGemImage = (gem) =>
  gem?.images?.[0]?.imageUrl || gem?.imageUrl || gem?.img || "";


function HiddenGemsPage() {
  const [tours, setTours] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHiddenGems = async () => {
      try {
        const response = await fetch(buildApiUrl("/api/hiddenGem"));
        if (response.ok) {
          const data = await response.json();
          setTours(data.allHiddenGem || data.tours || []);
          setGallery(data.gallery || []);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching hidden gems:", error);
        setIsLoading(false);
      }
    };

    fetchHiddenGems();
  }, []);

  const featuredItems = tours.length
    ? FEATURED_LAYOUT.map((layout, idx) => {
        const gem = tours[idx];
        if (!gem) {
          return null;
        }
        const title = getGemTitle(gem);
        const gemId = gem?._id || gem?.id;
        if (!gemId) {
          return null;
        }
        return {
          key: gemId,
          href: `/hidden-gems/${encodeURIComponent(gemId)}`,
          title,
          image: getGemImage(gem),
          ...layout,
        };
      }).filter(Boolean)
    : [];

  return (
    <>
      <Head>
        <title>Explore Hidden Gems | KEMET</title>
      </Head>

      <div className="bg-white min-h-screen font-sans text-[#111827]">
        <main className="pt-32 pb-16 px-8 md:px-16 max-w-350 mx-auto">
          <section className="relative mb-16 grid grid-cols-[1.5fr_1fr] gap-x-12 items-center">
            <div className="flex flex-col gap-6 items-start">
              <span className="bg-[#FBBF24] text-[#111827] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                explore hidden gems
              </span>
              <h1 className="text-6xl md:text-8xl font-black mb-2 tracking-tight leading-tight">
                Traveling opens the door to creating{" "}
                <span className="text-[#FBBF24]">memories</span>
              </h1>
              <p className="text-xl text-[#111827] opacity-80 max-w-2xl">
                Because the best memories are made
                <br />
                in the places few ever find
              </p>
            </div>

            <div className="relative h-150 flex items-center justify-center gap-x-6">
              <div className="absolute top-1/2 left-[18%] transform -translate-y-[45%] flex gap-x-6">
                <div className="w-24 aspect-2/5 rounded-full overflow-hidden shadow-2xl relative">
                  <img
                    src="/images/hidden-gems/Rectangle 178.png"
                    alt="Sunset boat"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 aspect-2/5 rounded-full overflow-hidden shadow-2xl mt-12 relative">
                  <img
                    src="/images/hidden-gems/Rectangle 177.png"
                    alt="Temple Ruin"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 aspect-2/5 rounded-full overflow-hidden shadow-2xl relative">
                  <img
                    src="/images/hidden-gems/Rectangle 176.png"
                    alt="Pyramid View"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <div className="w-full max-w-5xl mx-auto mb-32 relative z-20">
            <div className="bg-white rounded-[100px] p-2 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100">
              <div className="flex-1 px-6 flex items-center border-r border-gray-100 hover:bg-gray-50 cursor-pointer rounded-l-full transition-colors py-3">
                <LocationIcon />
                <div className="flex flex-col w-full gap-0.5">
                  <span className="text-xs text-[#111827] font-bold">
                    Location
                  </span>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="w-full text-xs font-medium text-gray-500 bg-transparent outline-none placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex-1 px-6 flex items-center border-r border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors py-3">
                <DistanceIcon />
                <div className="flex flex-col w-full gap-0.5">
                  <span className="text-xs text-[#111827] font-bold">
                    Distance
                  </span>
                  <input
                    type="text"
                    placeholder="Distance in Km"
                    className="w-full text-xs font-medium text-gray-500 bg-transparent outline-none placeholder-gray-400"
                  />
                </div>
              </div>
              <div className="flex-1 px-6 flex items-center hover:bg-gray-50 cursor-pointer transition-colors py-3">
                <PeopleIcon />
                <div className="flex flex-col w-full gap-0.5">
                  <span className="text-xs text-[#111827] font-bold">
                    Max People
                  </span>
                  <input
                    type="text"
                    placeholder="0"
                    className="w-full text-xs font-medium text-gray-500 bg-transparent outline-none placeholder-gray-400"
                  />
                </div>
              </div>
              <button className="bg-[#FBBF24] w-14 h-14 rounded-[20px] flex items-center justify-center hover:bg-[#e5a913] transition-colors ml-2 shadow-sm shrink-0 mr-1">
                <SearchIcon className="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <section className="mb-32 flex flex-col items-center">
            <span className="text-[#FBBF24] font-black text-sm mb-4">
              What we serve
            </span>
            <h2 className="text-4xl font-black text-[#111827] mb-16 text-center">
              We offer our best services
            </h2>
            <div className="grid grid-cols-3 gap-12 w-full max-w-6xl">
              {[
                {
                  icon: "sun",
                  title: "Calculate Weather",
                  text: "Travel planning, ideal weather forecast with real time info.",
                },
                {
                  icon: "map",
                  title: "Hidden gems",
                  text: "Discover secret spots and hidden treasures only with KEMET.",
                },
                {
                  icon: "heart",
                  title: "Customization",
                  text: "Tailor your experience exactly to your preferences.",
                },
              ].map((service) => (
                <div
                  key={service.title}
                  className="bg-white border border-gray-100 rounded-[25px] p-8 flex flex-col gap-6 shadow-sm hover:shadow-xl transition-shadow"
                >
                  <IconPlaceholder />
                  <h4 className="font-black text-xl text-[#111827] mb-0.5">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 text-sm grow leading-relaxed">
                    {service.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-32">
            <h2 className="text-4xl font-black text-[#111827] mb-12 uppercase tracking-wide">
              OUR FEATURED TOURS
            </h2>
            <div className="grid grid-cols-[1fr_1fr_1fr] gap-x-6 gap-y-6">
              {[0, 1, 2].map((columnIndex) => {
                const start = columnIndex * 2;
                const columnItems = featuredItems.slice(start, start + 2);

                return (
                  <div
                    key={`featured-column-${columnIndex}`}
                    className={`flex flex-col gap-6${columnIndex === 1 ? " mt-8" : ""}`}
                  >
                    {columnItems.map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className={`group relative block ${item.aspect} rounded-[15px] overflow-hidden shadow-sm`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black opacity-30"></div>
                        <h4
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${item.titleSize} font-black text-white italic tracking-wide opacity-80 group-hover:opacity-100 transition-opacity`}
                        >
                          {item.title}
                        </h4>
                        <div className="absolute bottom-4 right-4 bg-[#FBBF24] text-white px-5 py-2.5 rounded-[15px] font-black text-xs group-hover:bg-[#e5a913] transition-colors">
                          Explore
                        </div>
                      </Link>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mb-32 grid grid-cols-[1fr_1.2fr] gap-x-12 items-center">
            <div className="flex flex-col gap-6 items-start">
              <span className="bg-[#FBBF24] text-[#111827] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider">
                Experience
              </span>
              <h1 className="text-5xl font-black mb-2 tracking-tight leading-tight">
                With our all experience we will serve you
              </h1>
              <p className="text-xl text-[#111827] opacity-80 max-w-2xl leading-relaxed">
                "Delivering excellence in every detail of your trip."
              </p>
              <div className="grid grid-cols-3 gap-6 mt-6 w-full">
                {[
                  {
                    metric: "20+",
                    title: "Successful trip",
                    icon: "/images/hidden-gems/Rectangle 185.png",
                  },
                  {
                    metric: "30+",
                    title: "Recurring clients",
                    icon: "/images/hidden-gems/Rectangle 186.png",
                  },
                  {
                    metric: "10+",
                    title: "Years experience",
                    icon: "/images/hidden-gems/Rectangle 187.png",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="bg-white border border-gray-100 rounded-[25px] p-6 flex flex-col gap-4 shadow-sm items-center text-center"
                  >
                    <img
                      src={item.icon}
                      className="w-10 h-10 aspect-square rounded-full object-cover"
                    />
                    <h4 className="font-black text-3xl text-[#111827] mb-0.5">
                      {item.metric}
                    </h4>
                    <p className="text-gray-600 text-xs grow leading-relaxed">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-150 flex items-center justify-center">
              <div className="absolute top-[18%] left-[10%] w-2/3 h-2/3 overflow-hidden ">
                <img
                  src="/images/hidden-gems/experience 1.png"
                  alt="Traveler illustration"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </section>

          <section className="mb-32 flex flex-col items-start w-full">
            <span className="bg-[#FBBF24] text-[#111827] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
              Gallery
            </span>
            <h2 className="text-4xl font-black text-[#111827] mb-12">
              Visit our customers tour gallery
            </h2>
            <div className="grid grid-cols-4 gap-4 w-full">
              <div className="flex flex-col gap-4">
                <div className="relative aspect-3/4 rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 186.png"
                    alt="Gallery 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 188.png"
                    alt="Gallery 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 195.png"
                    alt="Gallery 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 191.png"
                    alt="Gallery 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative aspect-3/4 rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 187.png"
                    alt="Gallery 5"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 194.png"
                    alt="Gallery 6"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 193.png"
                    alt="Gallery 7"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="relative aspect-square rounded-[15px] overflow-hidden shadow-sm">
                  <img
                    src="/images/hidden-gems/Rectangle 189.png"
                    alt="Gallery 8"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mb-32 flex flex-col items-start w-full">
            <span className="bg-[#FBBF24] text-[#111827] px-4 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider mb-4">
              customer Love
            </span>
            <h2 className="text-4xl font-black text-[#111827] mb-12">
              What our customer say about us
            </h2>

            <div className="grid grid-cols-3 gap-8 w-full max-w-7xl">
              {testimonialsData.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-10 rounded-[25px] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col justify-between gap-6 group cursor-pointer h-full"
                >
                  <p className="text-gray-600 leading-relaxed text-sm grow">
                    "{item.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h4 className="font-black text-[#111827] text-sm">
                        {item.name}
                      </h4>
                      <p className="text-gray-400 text-xs font-medium">
                        {item.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2.5 mt-20 self-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#111827] opacity-10 cursor-pointer hover:opacity-100 transition-opacity"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#FBBF24] cursor-pointer"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#111827] opacity-10 cursor-pointer hover:opacity-100 transition-opacity"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#111827] opacity-10 cursor-pointer hover:opacity-100 transition-opacity"></span>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default HiddenGemsPage;




