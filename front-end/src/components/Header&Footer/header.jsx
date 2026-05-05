"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaUserCircle, FaChevronDown } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const { admin, user, logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  if (pathname.startsWith("/admin")) return null;

  const navLinks = [
    { href: user ? "/user-dashboard" : "/", label: "Home", match: ["/", "/user-dashboard"] },
    { href: "/offerings", label: "Offerings" },
    { href: "/communities", label: "Communities" },
    { href: "/Destination", label: "Destination" },
    { href: "/hidden-gems", label: "Hidden Gems" },
    { href: "/blogs", label: "Blog" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ];

  const isActive = (link) =>
    link.match
      ? link.match.includes(pathname)
      : pathname === link.href;

  return (
    <>
      <style>{`
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
      `}</style>

      {/* Top announcement bar */}
      <div className="top-bar hidden md:flex items-center justify-center py-1.5 px-4 text-xs text-white/80 tracking-wide gap-1">
        <span className="text-yellow-400">✦</span>
        <span>Discover Egypt's Hidden Wonders — Book your journey today</span>
        <span className="text-yellow-400">✦</span>
      </div>

      <header className={`header-wrap sticky top-0 z-50 w-full bg-white ${scrolled ? "scrolled" : ""}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-2.5">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={50}
              className="inline-block"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden gap-5 text-[13.5px] font-medium tracking-[0.01em] text-slate-600 lg:flex xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link transition-colors duration-200 whitespace-nowrap ${
                  isActive(link) ? "active font-semibold text-[#FFCE2A]" : "hover:text-slate-900"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2.5 lg:flex shrink-0">
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
                        href="/admin/"
                        className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        onClick={() => setMenuOpen(false)}
                      >
                        <span>🛡️</span> Admin Panel
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/user-dashboard"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>👤</span> My Account
                        </Link>
                        <Link
                          href="/account-setting"
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          onClick={() => setMenuOpen(false)}
                        >
                          <span>⚙️</span> Account Setting
                        </Link>
                      </>
                    )}
                    <div className="my-1 border-t border-slate-100" />
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <span>↩</span> Logout
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

          {/* Mobile Hamburger */}
          <button
            className="flex flex-col gap-1.5 p-2 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block h-0.5 w-6 bg-slate-700 rounded transition-all duration-200 ${open ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 rounded transition-all duration-200 ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-6 bg-slate-700 rounded transition-all duration-200 ${open ? "-rotate-45 -translate-y-2" : ""}`} />
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mobile-menu border-t border-slate-100 bg-white px-5 pb-5 pt-2 lg:hidden">
            <div className="flex flex-col">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
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
                    <Link onClick={() => setOpen(false)} href="/account-setting">
                      <button className="w-full rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700">
                        Account Setting
                      </button>
                    </Link>
                    <button type="button" onClick={handleLogout} className="w-full rounded-full border border-rose-200 py-2.5 text-sm font-medium text-rose-500">
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