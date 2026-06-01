import Head from "next/head";
import Link from "next/link";

const ArrowRightIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 12H19M19 12L13 6M19 12L13 18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-[#F87171] mr-3 shrink-0"
  >
    <path
      d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="9"
      r="3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DistanceIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-[#F87171] mr-3 shrink-0"
  >
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PeopleIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 text-[#F87171] mr-3 shrink-0"
  >
    <path
      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8581 3.35159 17.6184 3.85189 18.1614 4.55231C18.7044 5.25274 18.9993 6.1137 19 7C18.9993 7.8863 18.7044 8.74726 18.1614 9.44769C17.6184 10.1481 16.8581 10.6484 16 10.87M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SearchIcon = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17ZM21 21l-5.2-5.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPlaceholder = ({ className }) => (
  <div
    className={`rounded-full bg-[#FBBF24] p-3 w-12 h-12 flex items-center justify-center text-white ${className}`}
  >
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6"
    >
      <path
        d="M12 2v20M2 12h20M17 5L5 17M7 5l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

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

const cityCards = [
  {
    name: "Cairo",
    href: "/hidden-gems/cairo",
    image: "/images/hidden-gems/Rectangle 180.png",
  },
  {
    name: "Alexandria",
    href: "/hidden-gems/alexandria",
    image: "/images/hidden-gems/Rectangle 179.png",
  },
  {
    name: "Luxor",
    href: "/hidden-gems/luxor",
    image: "/images/hidden-gems/Rectangle 181.png",
  },
  {
    name: "Aswan",
    href: "/hidden-gems/aswan",
    image: "/images/hidden-gems/Rectangle 184.png",
  },
  {
    name: "Siwa",
    href: "/hidden-gems/siwa",
    image: "/images/hidden-gems/Rectangle 185.png",
  },
  {
    name: "Sharm El Sheikh",
    href: "/hidden-gems/sharm-el-sheikh",
    image: "/images/hidden-gems/Rectangle 182.png",
  },
];

function HiddenGemsPage() {
  return (
    <>
      <Head>
        <title>Explore Hidden Gems | KEMET Tourism</title>
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
              Explore by city
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {cityCards.map((city) => (
                <Link
                  key={city.name}
                  href={city.href}
                  className="group relative block h-72 overflow-hidden rounded-[18px] shadow-sm sm:h-80"
                >
                  <img
                    src={city.image}
                    alt={city.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black opacity-30"></div>
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h4 className="text-3xl font-black text-white italic tracking-wide drop-shadow-sm md:text-4xl">
                      {city.name}
                    </h4>
                    <span className="mt-4 inline-flex bg-[#FBBF24] text-white px-5 py-2.5 rounded-[15px] font-black text-xs group-hover:bg-[#e5a913] transition-colors">
                      Explore
                    </span>
                  </div>
                </Link>
              ))}
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
                Delivering excellence in every detail of your trip.
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
                      alt={item.title}
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
              {/* <div className="absolute bottom-[20%] right-[15%] w-1/4 h-1/4 grid grid-cols-2 gap-x-2 gap-y-2 p-2 bg-white rounded-[15px] shadow-lg">
                    <img src="/images/hidden-gems/Rectangle 188.png" className="w-full h-full aspect-square rounded-[8px] object-cover"/>
                    <img src="/images/hidden-gems/Rectangle 189.png" className="w-full h-full aspect-square rounded-[8px] object-cover"/>
                    <img src="/images/hidden-gems/Rectangle 191.png" className="w-full h-full aspect-square rounded-[8px] object-cover"/>
                    <div className="w-full h-full aspect-square rounded-[8px] bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500">12+ More</div>
                 </div> */}
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
                <div className="relative aspect-[3/4] rounded-[15px] overflow-hidden shadow-sm">
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
                    {item.text}
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
