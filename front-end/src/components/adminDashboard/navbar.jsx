import Link from "next/link";
import { useState } from "react";
import { FaBell, FaCog, FaPlus } from "react-icons/fa";

import AddContent from "./AddContent";
import { VscChromeClose } from "react-icons/vsc";

export default function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);

  function toggleAddContent() {
    setIsOpen(true);
  }

  function closeAddContent() {
    setIsOpen(false);
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
      <div className="w-full max-w-xl">
        <input
          type="text"
          placeholder="Search destinations, bookings, or articles..."
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Notifications"
        >
          <FaBell />
        </button>
        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
          aria-label="Settings"
        >
          <FaCog />
        </button>
        <button
          className="ml-2 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
          onClick={toggleAddContent}
        >
          <FaPlus className="text-xs" />
          Add New Content
        </button>
        <Link
          href="/blogs?addArticle=1"
          className="inline-flex items-center gap-2 rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-50"
        >
          <FaPlus className="text-xs" />
          Create Post
        </Link>
      </div>

      {/* Modal for adding content */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm opacity-100 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-8 relative max-h-[95vh] overflow-y-auto border border-gray-100 transform transition-all duration-300 scale-100 animate-in zoom-in-95">
            <button
              onClick={closeAddContent}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 transition-all duration-200 transform hover:scale-110 active:scale-95"
            >
              <VscChromeClose className="text-2xl" />
            </button>
            <AddContent onClose={closeAddContent} />
          </div>
        </div>
      )}
    </header>
  );
}
