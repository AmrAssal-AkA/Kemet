import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaSearch, FaTimes, FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";
import { searchTrips } from "@/services/searchServices";

const headerStyles = `
  .nav-link {
    position: relative;
    padding-bottom: 2px;
  }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 0;
    height: 2px;
    background: #FFCE2A;
    border-radius: 2px;
    transition: width 0.25s cubic-bezier(.4,0,.2,1);
  }
  .nav-link:hover::after,
  .nav-link.active::after {
    width: 100%;
  }
  .header-wrap {
    transition: box-shadow 0.3s ease, background 0.3s ease, padding 0.3s ease;
  }
  .header-wrap.scrolled {
    box-shadow: 0 4px 24px rgba(11,31,70,0.10);
    background: rgba(255,255,255,0.97);
    backdrop-filter: blur(10px);
  }
  .book-btn {
    background: linear-gradient(135deg, #FFCE2A 0%, #f5b800 100%);
    transition: transform 0.18s ease, box-shadow 0.18s ease;
    box-shadow: 0 2px 10px rgba(255,206,42,0.28);
  }
  .book-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(255,206,42,0.38);
  }
  .login-btn {
    border: 1.5px solid #e2e8f0;
    transition: border-color 0.18s, background 0.18s;
  }
  .login-btn:hover {
    border-color: #FFCE2A;
    background: #fffbea;
  }
  .user-btn {
    transition: background 0.18s, transform 0.18s;
  }
  .user-btn:hover {
    background: #f8fafc;
    transform: scale(1.05);
  }
  .search-panel {
    animation: slideDown 0.22s cubic-bezier(.4,0,.2,1);
  }
  .dropdown-menu {
    animation: dropIn 0.18s cubic-bezier(.4,0,.2,1);
    transform-origin: top right;
  }
  @keyframes dropIn {
    from { opacity: 0; transform: scale(0.95) translateY(-6px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  .mobile-menu {
    animation: slideDown 0.22s cubic-bezier(.4,0,.2,1);
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .mobile-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
    font-size: 15px;
    color: #334155;
    transition: color 0.15s;
  }
  .mobile-link:hover { color: #FFCE2A; }
  .mobile-link.active { color: #FFCE2A; font-weight: 600; }
  .top-bar {
    background: linear-gradient(90deg, #0b1f46 0%, #123c7a 50%, #0b1f46 100%);
  }
`;

const navLinks = [
  { href: "/", label: "Home", match: ["/", "/user-dashboard"] },
  { href: "/offerings", label: "Offerings" },
  { href: "/communities", label: "Communities" },
  { href: "/Destination", label: "Destination" },
  { href: "/hidden-gems", label: "Hidden Gems" },
  { href: "/blogs", label: "Blog" },
];

function getTripId(trip) {
  return trip?._id || trip?.id || trip?.tripId || "";
}

function getTripTitle(trip) {
  return trip?.name || trip?.title || "Untitled trip";
}

function getImageValue(image) {
  if (typeof image === "string") return image;
  return image?.imageUrl || image?.url || "";
}

function getTripImage(trip) {
  if (trip?.imageUrl) return trip.imageUrl;
  if (Array.isArray(trip?.image)) return getImageValue(trip.image[0]);
  if (Array.isArray(trip?.images)) return getImageValue(trip.images[0]);
  if (trip?.image) return getImageValue(trip.image);
  if (trip?.images) return getImageValue(trip.images);
  return "";
}

function getTripPrice(trip) {
  const value = trip?.finalPrice ?? trip?.price ?? trip?.basePrice;
  if (value === undefined || value === null || value === "") return "";
  return `EGP ${Number(value).toLocaleString()}`;
}

function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [searchDuration, setSearchDuration] = useState("");
  const [searchTravelers, setSearchTravelers] = useState(1);
  const [searchAdventureType, setSearchAdventureType] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const pathname = usePathname() || "/";
  const menuRef = useRef(null);
  const searchPanelRef = useRef(null);
  const searchInputRef = useRef(null);
  const { admin, user, logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target;
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }

      if (
        searchOpen &&
        searchPanelRef.current &&
        !searchPanelRef.current.contains(target) &&
        !(target instanceof Element && target.closest("[data-search-toggle='true']"))
      ) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [searchOpen]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return undefined;

    const focusTimer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [searchOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    setOpen(false);
    await logout();
  };

  const clearSearchFeedback = () => {
    setSearchError("");
    setSearchResults([]);
    setSearchSubmitted(false);
  };

  const toggleSearch = () => {
    setSearchOpen((prev) => {
      const nextOpen = !prev;
      if (nextOpen) clearSearchFeedback();
      return nextOpen;
    });
    setMenuOpen(false);
  };

  const closeSearch = () => {
    setSearchOpen(false);
  };

  const handleSearchSubmit = async (event) => {
    event.preventDefault();

    const location = searchLocation.trim();
    const duration = searchDuration.trim();
    const AdvantureType = searchAdventureType.trim();
    const travelers = Number(searchTravelers) || 1;

    setSearchSubmitted(true);
    setSearchResults([]);

    if (!location || !duration) {
      setSearchError("Please enter location and duration.");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    try {
      const results = await searchTrips({
        location,
        duration,
        travelers,
        AdvantureType,
      });
      setSearchResults(results);
    } catch (error) {
      setSearchResults([]);
      setSearchError("Search could not be completed.");
    } finally {
      setSearchLoading(false);
    }
  };

  if (pathname.startsWith("/admin")) return null;

  const isActive = (link) =>
    link.match ? link.match.includes(pathname) : pathname === link.href;
  const homeHref = user ? "/user-dashboard" : "/";

  return (
    <>
      <style>{headerStyles}</style>

      <div className="top-bar hidden items-center justify-center gap-1 px-4 py-1.5 text-xs tracking-wide text-white/80 md:flex">
        <span className="text-yellow-400">*</span>
        <span>Discover Egypt&apos;s Hidden Wonders - Book your journey today</span>
        <span className="text-yellow-400">*</span>
      </div>

      <header className={`header-wrap sticky top-0 z-50 w-full bg-white ${scrolled ? "scrolled" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-2.5">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <Image
              src="/Logo.png"
              alt="Kemet logo"
              width={120}
              height={50}
              className="inline-block"
            />
          </Link>

          <nav className="hidden gap-5 text-[13.5px] font-medium tracking-[0.01em] text-slate-600 lg:flex xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.label === "Home" ? homeHref : link.href}
                className={`nav-link whitespace-nowrap transition-colors duration-200 ${
                  isActive(link) ? "active font-semibold text-[#FFCE2A]" : "hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            <button
              type="button"
              data-search-toggle="true"
              onClick={toggleSearch}
              className="user-btn flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-slate-700"
              aria-label="Open search"
              aria-expanded={searchOpen}
            >
              <FaSearch className="text-xl text-slate-500" />
            </button>

            {!user ? (
              <Link href="/auth/auth">
                <button className="login-btn rounded-full px-4 py-1.5 text-sm font-medium text-slate-700">
                  Login
                </button>
              </Link>
            ) : (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="user-btn flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-slate-700"
                  aria-label="User menu"
                >
                  <FaUserCircle className="text-xl text-slate-500" />
                  <FaChevronDown className={`text-xs transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
                </button>

                {menuOpen && (
                  <div className="dropdown-menu absolute right-0 z-50 mt-2 w-48 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl">
                    {admin ? (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/user-dashboard"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          My Account
                        </Link>
                        <Link
                          href="/user-dashboard?tab=settings"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50"
                          onClick={() => setMenuOpen(false)}
                        >
                          Account Setting
                        </Link>
                      </>
                    )}
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 transition-colors hover:bg-rose-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <Link href="/BookTrip">
              <button className="book-btn rounded-full px-5 py-2 text-sm font-semibold text-black">
                Book Your Trip Now
              </button>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              data-search-toggle="true"
              onClick={toggleSearch}
              className="user-btn flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-slate-700"
              aria-label="Open search"
              aria-expanded={searchOpen}
            >
              <FaSearch className="text-xl text-slate-500" />
            </button>

            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <span className={`block h-0.5 w-6 rounded bg-slate-700 transition-all duration-200 ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 rounded bg-slate-700 transition-all duration-200 ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 rounded bg-slate-700 transition-all duration-200 ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div
            ref={searchPanelRef}
            className="search-panel absolute right-4 top-full z-50 mt-2 w-[calc(100%-2rem)] max-w-3xl lg:right-28"
          >
            <div className="rounded-3xl border border-[#f3df9a] bg-white p-4 text-[#3B2416] shadow-[0_18px_42px_rgba(59,36,22,0.16)]">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-black">Search Trips</p>
                <button
                  type="button"
                  onClick={closeSearch}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#f3df9a] bg-white text-[#7A5A3A] transition hover:bg-[#fff3bf]"
                  aria-label="Close search"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>

              <form onSubmit={handleSearchSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">
                    Location
                    <input
                      ref={searchInputRef}
                      value={searchLocation}
                      onChange={(event) => {
                        setSearchLocation(event.target.value);
                        clearSearchFeedback();
                      }}
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-black outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      placeholder="Alex"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">
                    Duration
                    <input
                      value={searchDuration}
                      onChange={(event) => {
                        setSearchDuration(event.target.value);
                        clearSearchFeedback();
                      }}
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-black outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      placeholder="3"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">
                    Travelers
                    <input
                      type="number"
                      min="1"
                      value={searchTravelers}
                      onChange={(event) => {
                        setSearchTravelers(event.target.value);
                        clearSearchFeedback();
                      }}
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-black outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    />
                  </label>

                  <label className="text-[11px] font-bold uppercase tracking-[0.12em] text-black">
                    Adventure Type
                    <input
                      value={searchAdventureType}
                      onChange={(event) => {
                        setSearchAdventureType(event.target.value);
                        clearSearchFeedback();
                      }}
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm font-semibold normal-case tracking-normal text-black outline-none transition placeholder:text-gray-400 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                      placeholder="safari"
                    />
                  </label>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={searchLoading}
                    className="book-btn w-full rounded-full px-5 py-2 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"
                  >
                    Search
                  </button>
                </div>
              </form>

              {(searchLoading || searchError || searchSubmitted || searchResults.length > 0) && (
                <div className="mt-4 overflow-hidden rounded-2xl border border-gray-300 bg-gray-50">
                  {searchLoading ? (
                    <p className="p-3 text-sm font-semibold text-gray-600">Searching...</p>
                  ) : searchError ? (
                    <p className="p-3 text-sm font-semibold text-rose-700">{searchError}</p>
                  ) : searchSubmitted && searchResults.length === 0 ? (
                    <p className="p-3 text-sm font-semibold text-gray-600">No trips found.</p>
                  ) : (
                    <div className="max-h-72 overflow-y-auto">
                    {searchResults.map((trip) => {
                      const tripId = getTripId(trip);
                      const imageSrc = getTripImage(trip);
                      const price = getTripPrice(trip);

                      return (
                        <Link
                          key={tripId || getTripTitle(trip)}
                          href={`/trips/${encodeURIComponent(tripId)}`}
                          onClick={closeSearch}
                          className="flex gap-3 border-b border-gray-300 p-3 transition last:border-b-0 hover:bg-gray-100"
                        >
                          {imageSrc && (
                            <Image
                              src={imageSrc}
                              alt={getTripTitle(trip)}
                              width={64}
                              height={64}
                              className="h-16 w-16 shrink-0 rounded-xl object-cover"
                              unoptimized
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-extrabold text-black">{getTripTitle(trip)}</p>
                            <p className="mt-1 truncate text-xs font-semibold text-gray-600">
                              {[trip.city || trip.location, trip.duration ? `${trip.duration} days` : ""]
                                .filter(Boolean)
                                .join(" - ")}
                            </p>
                            {price && (
                              <p className="mt-1 text-xs font-extrabold text-[#FFCE2A]">{price}</p>
                            )}
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
                </div>
              )}
            </div>
          </div>
        )}

        {open && (
          <div className="mobile-menu border-t border-slate-100 bg-white px-5 pb-5 pt-2 lg:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.label === "Home" ? homeHref : link.href}
                  onClick={() => setOpen(false)}
                  className={`mobile-link ${isActive(link) ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="mt-4 flex flex-col gap-2">
                {!user ? (
                  <Link onClick={() => setOpen(false)} href="/auth/auth">
                    <button className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
                      Login
                    </button>
                  </Link>
                ) : (
                  <>
                    {admin ? (
                      <Link onClick={() => setOpen(false)} href="/admin">
                        <button className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
                          Admin Panel
                        </button>
                      </Link>
                    ) : (
                      <Link onClick={() => setOpen(false)} href="/user-dashboard?tab=settings">
                        <button className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
                          Account Setting
                        </button>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-full border border-rose-200 py-2.5 text-sm font-medium text-rose-500"
                    >
                      Logout
                    </button>
                  </>
                )}
                <Link href="/BookTrip" onClick={() => setOpen(false)}>
                  <button className="book-btn w-full rounded-full py-2.5 text-sm font-semibold text-black">
                    Book Your Trip Now
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Header;
