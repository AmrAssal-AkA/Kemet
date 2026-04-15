"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        <h1 className="font-bold text-lg">Kemet</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm">
          <Link
            href="/"
            className={`transition ${pathname === "/" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={`transition ${pathname === "/about" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            About Us
          </Link>

          <Link
            href="/offerings"
            className={`transition ${pathname === "/offerings" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Offerings
          </Link>

          <Link
            href="/blog"
            className={`transition ${pathname === "/blog" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Blog
          </Link>

          <Link
            href="/contact"
            className={`transition ${pathname === "/contact" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"}`}
          >
            Contact Us
          </Link>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex gap-2">
          <Link href="/auth/auth">
            <button className="px-4 py-1 border rounded-full hover:bg-[#FFCE2A] transition">
              login
            </button>
          </Link>

          <Link href="/BookTrip">
            <button className="px-4 py-1 bg-black text-white rounded-full hover:bg-[#FFCE2A] hover:text-black transition">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile Button */}
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-3 text-sm">
          <Link onClick={() => setOpen(false)} href="/" className={pathname === "/" ? "text-[#FFCE2A]" : ""}>
            Home
          </Link>

          <Link onClick={() => setOpen(false)} href="/about" className={pathname === "/about" ? "text-[#FFCE2A]" : ""}>
            About Us
          </Link>

          <Link onClick={() => setOpen(false)} href="/offerings" className={pathname === "/offerings" ? "text-[#FFCE2A]" : ""}>
            Offerings
          </Link>

          <Link onClick={() => setOpen(false)} href="/blog" className={pathname === "/blog" ? "text-[#FFCE2A]" : ""}>
            Blog
          </Link>

          <Link onClick={() => setOpen(false)} href="/contact" className={pathname === "/contact" ? "text-[#FFCE2A]" : ""}>
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;