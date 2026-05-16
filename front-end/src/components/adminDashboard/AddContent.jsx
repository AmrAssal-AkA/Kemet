import React, { useState } from "react";

export default function AddContent() {
  const [selectedType, setSelectedType] = useState("trips");
  const [tripName, setTripName] = useState("");
  const [city, setCity] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const contentTypes = [
    { id: "trips", label: "Trips", icon: "🧳" },
    { id: "offerings", label: "Offerings", icon: "🎁" },
    { id: "hiddenGems", label: "Hidden Gems", icon: "💎" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();


  };

  return (
    <div>
      <div className="bg-white rounded-xl w-full">
        <h2 className="text-3xl font-black mb-2 text-center text-[#111827]">
          Add New Content
        </h2>
        <p className="text-gray-500 mb-8 text-center text-base">
          Select the type of content you want to add
        </p>

        {/* Horizontal Content Type Selection */}
        <div className="grid grid-cols-3 gap-3 mb-10 bg-linear-to-br from-gray-50 to-gray-100 p-4 rounded-xl">
          {contentTypes.map((content) => (
            <button
              key={content.id}
              onClick={() => setSelectedType(content.id)}
              type="button"
              className={`p-5 rounded-xl font-bold text-center transition-all duration-300 transform hover:scale-105 border-2 ${
                selectedType === content.id
                  ? "bg-linear-to-br from-[#FBBF24] to-[#e5a913] text-white shadow-xl scale-105 border-[#FBBF24]"
                  : "bg-white text-gray-700 hover:bg-white border-gray-200 hover:border-[#FBBF24]/50 hover:shadow-md"
              }`}
            >
              <div className="text-5xl mb-2 drop-shadow-sm">{content.icon}</div>
              <div className="text-xs uppercase tracking-widest font-black">
                {content.label}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {selectedType === "trips" && (
            <>
              <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Enter trip name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Enter city"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                    required
                  />
                </div>

                <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Enter category"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                    required
                  />
                </div>

                <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                  <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 days"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                    required
                  />
                </div>
              </div>

              <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                  Price
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="e.g., $2,500"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300"
                  required
                />
              </div>
              <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                <label for="guestCapacity">Guest Capacity</label>
                <input
                  type="number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label for="guideFee">Guide Fee</label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all"
                  required
                />

                <label for="guideAvailable">guide Avalable</label>
                <input
                  type="checkbox"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all"
                  required
                />
              </div>

              <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter trip description"
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all resize-none bg-white hover:border-gray-300"
                  required
                />
                <p className="text-xs text-gray-500 mt-2">
                  {description.length}/2000 characters
                </p>
              </div>

              <div className="bg-linear-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100">
                <label className="block text-xs font-black text-gray-700 mb-2.5 uppercase tracking-wider">
                  Image Upload
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files?.[0] || null)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all bg-white hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#FBBF24] file:text-white hover:file:bg-[#e5a913]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-linear-to-br from-[#FBBF24] to-[#e5a913] text-white font-black py-3.5 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-base tracking-wide"
              >
                Add Trip
              </button>
            </>
          )}

          {selectedType === "offerings" && (
            <>
              <div>
                <label for="title" className="block text-gray-700">
                  Offering Name
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label for="description" className="block text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={20}
                  cols={50}
                  placeholder="Enter description"
                  maxLength={5000}
                  required
                  className="w-full px-3 py-2 border rounded-lg resize-vertical"
                />
              </div>
              <div>
                <label for="price" className="block text-gray-700">
                  Price
                </label>
                <input
                  type="number"
                  name="price"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <input
                  type="file"
                  name="image"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FBBF24] text-white font-black py-3 rounded-lg hover:bg-[#e5a913] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg tracking-wide"
              >
                Add offer
              </button>
            </>
          )}
          {selectedType == "hiddenGems" && (
            <>
              <div>
                <label for="placename">PlaceName</label>
                <input
                  type="text"
                  name="text"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label for="decription">Description</label>
              <textarea
                  rows={5}
                  placeholder="Enter trip description"
                  maxLength={2000}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[#FBBF24] focus:ring-2 focus:ring-[#FBBF24]/20 transition-all resize-none bg-white hover:border-gray-300"
                  required
                />
              </div>
              <div>
                <label for="location">images</label>
                <input
                  type="file"
                  name="images/*"
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#FBBF24] text-white font-black py-3 rounded-lg hover:bg-[#e5a913] transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg text-lg tracking-wide"
              >
                Add Hidden Gem
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
