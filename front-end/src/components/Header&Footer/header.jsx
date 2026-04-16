"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";
import { useAuth } from "@/context/AuthContext";

function Header() {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef(null);
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  };

  return (
    <header className="w-full bg-white shadow-sm antialiased">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-2xl font-bold">
          <Image src="/logo.png" alt="Logo" width={100} height={50} className="inline-block mr-2" />
        </Link>

        <nav className="hidden md:flex gap-7 text-[15px] font-medium tracking-[0.01em] text-slate-700">
          <Link
            href={user ? "/user-dashboard" : "/"}
            className={`transition-colors duration-200 ${pathname === "/" || pathname === "/user-dashboard" ? "font-semibold text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Home
          </Link>

          <Link
            href="/offerings"
            className={`transition-colors duration-200 ${pathname === "/offerings" ? "font-semibold text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Offerings
          </Link>

          <Link
            href="/Blog"
<<<<<<< HEAD
            className={`transition-colors duration-200 ${pathname === "/Blog" ? "font-semibold text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
=======
            className={`transition ${pathname === "/Blog" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
>>>>>>> eb664aaeb1c3fc2d524764fdc521d263e605b83a
          >
            Blog
          </Link>

          <Link
            href="/about"
            className={`transition-colors duration-200 ${pathname === "/about" ? "font-semibold text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            className={`transition-colors duration-200 ${pathname === "/contact" ? "font-semibold text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Contact Us
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {!user ? (
            <Link href="/auth/auth">
              <button className="px-4 py-1 rounded-full bg-[#FFCE2A] text-black font-medium hover:brightness-95 transition">
                login
              </button>
            </Link>
          ) : (
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="grid h-10 w-10 place-items-center rounded-full border border-slate-300 text-slate-700 transition hover:bg-slate-100"
                aria-label="User menu"
              >
                <FaUserCircle className="text-2xl" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50">
                  <Link
                    href="/account-setting"
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Account Setting
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left rounded-lg px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          <Link href="/BookTrip">
            <button className="px-4 py-1 rounded-full bg-[#FFCE2A] text-black font-medium hover:brightness-95 transition">
              Book Your Trip Now
            </button>
          </Link>
        </div>

        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-3 text-[15px] font-medium tracking-[0.01em] text-slate-700">
          <Link
            onClick={() => setOpen(false)}
            href={user ? "/user-dashboard" : "/"}
            className={pathname === "/" || pathname === "/user-dashboard" ? "text-[#FFCE2A]" : ""}
          >
            Home
          </Link>

          <Link onClick={() => setOpen(false)} href="/offerings" className={pathname === "/offerings" ? "text-[#FFCE2A]" : ""}>
            Offerings
          </Link>

          <Link onClick={() => setOpen(false)} href="/Blog" className={pathname === "/Blog" ? "text-[#FFCE2A]" : ""}>
            Blog
          </Link>

          <Link onClick={() => setOpen(false)} href="/about" className={pathname === "/about" ? "text-[#FFCE2A]" : ""}>
            About Us
          </Link>

          <Link onClick={() => setOpen(false)} href="/contact" className={pathname === "/contact" ? "text-[#FFCE2A]" : ""}>
            Contact Us
          </Link>

          {!user ? (
            <Link onClick={() => setOpen(false)} href="/auth/auth" className="text-slate-700">
              Login
            </Link>
          ) : (
            <>
              <Link onClick={() => setOpen(false)} href="/account-setting" className="text-slate-700">
                Account Setting
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-rose-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}

export default Header;
