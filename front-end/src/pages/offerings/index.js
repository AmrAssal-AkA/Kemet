import Head from 'next/head';


const museumData = [
  { id: 1, title: 'Grand Egyptian Museum Grounds', text: 'Discover ancient artifacts and monumental architecture seamlessly integrated into modern design.', price: '$3,150', oldPrice: '$4,200', image: '/images/offerings/image2.png' },
  { id: 2, title: 'Grand Hall - Statue of Ramses II', text: 'Stand before the colossal statue of Ramses II, a breathtaking centerpiece of ancient history.', price: '$2,850', oldPrice: '$3,800', image: '/images/offerings/image11.png' },
  { id: 3, title: 'Pyramid View Terrace', text: 'Take in breathtaking, unobstructed views of the Giza pyramids right from the museum terrace.', price: '$4,100', oldPrice: '$5,500', image: '/images/offerings/image5.png' },
];

const gounaData = [
  { id: 1, title: 'LUXURY SUITE - EL GOUNA', text: 'Experience unmatched luxury and comfort in El Gouna with private access to the red sea lagoons.', price: '$4,900', oldPrice: '$6,500', image: '/images/offerings/image3.png' },
  { id: 2, title: 'THE GOUNA AQUARIUM VILLA', text: 'Stay in a unique, world-class villa surrounded by an immersive underwater marine environment.', price: '$7,200', oldPrice: '$9,500', image: '/images/offerings/image4.png' },
  { id: 3, title: 'MOSAIQUE EL GOUNA', text: 'A premium boutique stay featuring beautiful modern architecture and a serene waterfront view.', price: '$3,800', oldPrice: '$5,000', image: '/images/offerings/image10.png' },
];

const alexandriaData = [
  { id: 1, title: 'OCEANFRONT PENTHOUSE', text: 'Wake up to the sound of crashing waves in this exclusive penthouse overlooking the Mediterranean.', price: '$2,100', oldPrice: '$2,800', image: '/images/offerings/image8.png' },
  { id: 2, title: 'ROYAL ALEXANDRIA HOTEL ROOM', text: 'Classic elegance meets modern luxury right in the historical center of the coastal city.', price: '$1,950', oldPrice: '$2,600', image: '/images/offerings/image.png' },
  { id: 3, title: 'SEA VIEW SUITE', text: 'Enjoy sweeping panoramic views of the sea and the iconic Citadel of Qaitbay from your balcony.', price: '$1,800', oldPrice: '$2,400', image: '/images/offerings/image9.png' },
];

const testimonialsData = [
  { id: 1, name: 'Marwa Ahmed', role: 'Tour Guide | Nov 2025', text: 'EG-KEMET provided an absolutely seamless experience. The attention to detail and the deep historical insights made my trip unforgettable. I highly recommend them to anyone.', image: '/images/offerings/avatar.png' },
  { id: 2, name: 'Ahmed Khaled', role: 'Team Leader | Dec 2025', text: 'Booking with EG-KEMET was the best decision. The accommodations were top-notch and the guides were incredibly knowledgeable about every single location we visited.', image: '/images/offerings/avatar (2).png' },
  { id: 3, name: 'Azza Mostafa', role: 'Sales Specialist | Jan 2026', text: 'A truly magical journey. From the breathtaking Nile cruise to the extensive museum tours, everything was perfectly organized and deeply enriching for my whole family.', image: '/images/offerings/avatar (1).png' },
];

const ArrowRightIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-3">
    <path d="M12 21C16 16.8 19 12.8 19 9C19 5.13401 15.866 2 12 2C8.13401 2 5 5.13401 5 9C5 12.8 8 16.8 12 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="12" cy="9" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-3">
    <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const PeopleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-3">
    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8581 3.35159 17.6184 3.85189 18.1614 4.55231C18.7044 5.25274 18.9993 6.1137 19 7C18.9993 7.8863 18.7044 8.74726 18.1614 9.44769C17.6184 10.1481 16.8581 10.6484 16 10.87M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-3">
    <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const OfferingCard = ({ title, text, price, oldPrice, image }) => (
  <div className="bg-white border border-gray-200 rounded-[20px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col h-full">
    <div className="overflow-hidden h-52">
      <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
    </div>
    <div className="p-6 flex flex-col grow">
      <h3 className="font-bold text-lg text-[#111827] mb-2 leading-tight">{title}</h3>
      <p className="text-gray-600 text-sm mb-6 leading-relaxed grow">{text}</p>
      <div className="w-full h-px bg-gray-100 mb-4"></div>
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 line-through mb-0.5">{oldPrice}</span>
          <span className="font-bold text-lg text-[#FBBF24]">{price}</span>
        </div>
        <button className="text-[#111827] hover:text-[#FBBF24] transition-colors p-2 -mr-2">
          <ArrowRightIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

function Offerings() {
  return (
    <>
      <Head>
        <title>Offerings | KEMET</title>

      </Head>

      <div className="bg-white min-h-screen font-sans text-[#111827]">
        <main className="pt-28 pb-16 px-8 md:px-16 max-w-350 mx-auto">
          <section className="relative mb-32 rounded-[100px] overflow-hidden shadow-2xl">
             <img src="/images/offerings/Rectangle 172.png" alt="Hero" className="w-full h-150 object-cover" />

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 z-10">
              <h1 className="text-6xl md:text-8xl font-black mb-2 tracking-tight drop-shadow-lg">
                <span className="text-white">It's more than </span>
                <span className="text-[#FBBF24]">just a trip</span>
              </h1>
              <p className="text-xl text-white font-medium drop-shadow-md">
                Every path in Egypt has a story to tell
              </p>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-5xl z-20">
              <div className="bg-white rounded-full p-2 flex items-center shadow-xl border border-gray-100">
                <div className="flex-1 px-6 flex items-center border-r border-gray-200 hover:bg-gray-50 cursor-pointer rounded-l-full transition-colors py-2">
                  <LocationIcon />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Location</span>
                    <input type="text" placeholder="Where to?" className="w-full text-sm font-bold text-[#111827] bg-transparent outline-none placeholder-[#111827]" />
                  </div>
                </div>
                <div className="flex-1 px-6 flex items-center border-r border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors py-2">
                  <CalendarIcon />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Date</span>
                    <input type="date" className="w-full text-sm font-bold text-[#111827] bg-transparent outline-none cursor-pointer" />
                  </div>
                </div>
                <div className="flex-1 px-6 flex items-center border-r border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors py-2">
                  <PeopleIcon />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Travelers</span>
                    <input type="text" placeholder="Guests" className="w-full text-sm font-bold text-[#111827] bg-transparent outline-none placeholder-[#111827]" />
                  </div>
                </div>
                <div className="flex-1 px-6 flex items-center hover:bg-gray-50 cursor-pointer transition-colors py-2">
                  <MenuIcon />
                  <div className="flex flex-col w-full">
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Category</span>
                    <input type="text" placeholder="Type" className="w-full text-sm font-bold text-[#111827] bg-transparent outline-none placeholder-[#111827]" />
                  </div>
                </div>
                <a href="/Destination" className="bg-[#FBBF24] text-white px-10 py-5 rounded-full font-bold text-sm tracking-widest hover:bg-[#e5a913] transition-colors ml-2 shadow-sm text-center">FIND</a>
              </div>
            </div>
            <div className="absolute inset-0 bg-black opacity-20 pointer-events-none"></div>
          </section>

          <section className="mb-32">
            <div className="flex items-end justify-between mb-12">
              <h2 className="text-4xl font-bold text-[#111827]">
                Find your next adventure with <span className="text-[#FBBF24]">EG-KEMET</span>
              </h2>
              <a href="#" className="flex items-center gap-x-1 text-[#111827] font-bold text-sm hover:text-[#FBBF24] transition-colors pb-1">
                All <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <a href="#" className="group block">
                <div className="rounded-[20px] overflow-hidden mb-5 h-72 shadow-sm">
                  <img src="/images/offerings/image3.png" alt="Giza" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black tracking-widest"><span className="text-[#111827]">GIZA</span> <span className="text-[#FBBF24]">EGYPT</span></p>
                  <span className="font-black text-sm text-[#111827]">$400</span>
                </div>
                <h4 className="font-semibold text-[#111827] opacity-80">Pyramids & Sphinx / Grand Museum</h4>
              </a>

              <a href="#" className="group block">
                <div className="rounded-[20px] overflow-hidden mb-5 h-72 shadow-sm">
                  <img src="/images/offerings/image12.png" alt="Gouna" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black tracking-widest"><span className="text-[#111827]">GOUNA</span> <span className="text-[#FBBF24]">EGYPT</span></p>
                  <span className="font-black text-sm text-[#111827]">$600</span>
                </div>
                <h4 className="font-semibold text-[#111827] opacity-80">El Gouna / Hurghada City / Marina</h4>
              </a>

              <a href="#" className="group block">
                <div className="rounded-[20px] overflow-hidden mb-5 h-72 shadow-sm">
                  <img src="/images/offerings/image5.png" alt="Dahab" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-black tracking-widest"><span className="text-[#111827]">DAHAB</span> <span className="text-[#FBBF24]">EGYPT</span></p>
                  <span className="font-black text-sm text-[#111827]">$350</span>
                </div>
                <h4 className="font-semibold text-[#111827] opacity-80">St. Catherine / Mount Sinai / Blue Hole</h4>
              </a>
            </div>
            
            <div className="flex justify-center mt-16">
                <button className="bg-[#FBBF24] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-[#e5a913] hover:shadow-lg transition-all transform hover:-translate-y-0.5">Discover more</button>
            </div>
          </section>

          <section className="mb-32">
            <div className="rounded-[40px] overflow-hidden shadow-2xl h-125 mb-8 relative group cursor-pointer">
               <img src="/images/offerings/BIGG PICS.png" alt="Aswan Feature" className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
               <div className="absolute inset-0 bg-black opacity-10 group-hover:opacity-0 transition-opacity duration-700"></div>
            </div>
            <div className="flex justify-between items-start">
               <div>
                 <h2 className="text-3xl font-bold text-[#FBBF24] italic mb-4 tracking-wide">ASWAN-EGYPT</h2>
                 <p className="text-[#111827] text-lg leading-relaxed max-w-5xl opacity-90">
                   Imagine waking up to the gentle flow of the Nile, with the timeless temples of Luxor and Aswan drifting by your window. From the golden hues of sunset over the water to the star-filled desert sky at night, a Nile cruise is more than a vacation – it's magic brought to life.
                 </p>
               </div>
               <a href="#" className="flex items-center gap-x-1 text-gray-400 font-bold text-sm hover:text-[#FBBF24] transition-colors whitespace-nowrap mt-2">
                  All <ArrowRightIcon className="w-4 h-4" />
               </a>
            </div>
          </section>

          <section className="mb-24">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-black text-[#111827] uppercase tracking-wide">EXPLORE GREAT EGYPTIAN MUSEUM</h2>
              <a href="#" className="flex items-center gap-x-1 text-[#111827] font-bold text-sm hover:text-[#FBBF24] transition-colors pb-1">
                All <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {museumData.map(item => (
                <OfferingCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <section className="mb-24">
            <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold text-[#111827]">
                Explore unique places to stay in <span className="text-gray-500 uppercase tracking-wide">Gouna</span>
              </h2>
              <a href="#" className="flex items-center gap-x-1 text-[#111827] font-bold text-sm hover:text-[#FBBF24] transition-colors pb-1">
                All <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {gounaData.map(item => (
                <OfferingCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <section className="mb-32">
             <div className="flex items-end justify-between mb-10">
              <h2 className="text-3xl font-bold text-[#111827]">
                Explore unique places to stay in <span className="uppercase tracking-wide">Alexandria</span>
              </h2>
              <a href="#" className="flex items-center gap-x-1 text-[#111827] font-bold text-sm hover:text-[#FBBF24] transition-colors pb-1">
                All <ArrowRightIcon className="w-4 h-4" />
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {alexandriaData.map(item => (
                <OfferingCard key={item.id} {...item} />
              ))}
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-3xl font-bold text-[#111827] mb-14 text-center">
              What <span className="text-[#FBBF24] uppercase tracking-wide">EG-KEMET</span> users are saying
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonialsData.map(item => (
                    <div key={item.id} className="bg-white p-8 rounded-[20px] border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col group">
                        <div className="flex items-center gap-x-4 mb-6">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-100" />
                          <div>
                            <h4 className="font-bold text-[#111827] text-sm">{item.name}</h4>
                            <p className="text-gray-400 text-xs font-medium mt-0.5">{item.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-x-1 mb-5">
                            {[...Array(5)].map((_, i) => (
                                <svg key={i} className="w-4 h-4 text-[#FBBF24]" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            ))}
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm mb-6 grow">{item.text}</p>
                        <a href="#" className="flex items-center gap-x-1 text-[#FBBF24] font-bold text-xs hover:text-[#e5a913] transition-colors w-max">
                            See more <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default Offerings;
