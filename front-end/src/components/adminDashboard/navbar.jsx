import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaBell, FaCog, FaPlus } from "react-icons/fa";

import AddContent from "./AddContent";
import { VscChromeClose } from "react-icons/vsc";
import { adminDashboardMenuItems } from "@/config/dashboardMenus";

export default function AdminNavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  function toggleAddContent() {
    setIsOpen(true);
  }

  function closeAddContent() {
    setIsOpen(false);
  }

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-4 sm:px-6">
      <div className="order-2 w-full lg:order-1 lg:max-w-xl">
        <input
          type="text"
          placeholder="Search destinations, bookings, or articles..."
          className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-700 outline-none transition focus:border-amber-400 focus:bg-white"
        />
      </div>

      <div className="order-1 flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end lg:order-2 lg:ml-auto">
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
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 sm:flex-none"
          onClick={toggleAddContent}
        >
          <FaPlus className="text-xs" />
          <span>Add New Content</span>
        </button>
        <Link
          href="/blogs?addArticle=1"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-amber-300 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-50 sm:flex-none"
        >
          <FaPlus className="text-xs" />
          Create Post
        </Link>
      </div>

      <nav className="order-3 flex w-full gap-2 overflow-x-auto pb-1 lg:hidden">
        {adminDashboardMenuItems.map((item) => {
          const isActive = router.pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                isActive
                  ? "bg-amber-50 text-amber-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Icon className="text-xs" />
              {item.label}
            </Link>
          );
        })}
      </nav>

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
