import { FaBell, FaCog, FaPlus } from "react-icons/fa";

export default function AdminNavBar() {
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
          type="button"
          className="ml-2 inline-flex items-center gap-2 rounded-full bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
        >
          <FaPlus className="text-xs" />
          Create Post
        </button>
      </div>
    </header>
  );
}
