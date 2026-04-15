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
          <Link className={pathname === "/" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"} href="/">Home</Link>
          <Link className={pathname === "/about" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"} href="/about">About Us</Link>
          <Link className={pathname === "/offerings" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"} href="/offerings">Offerings</Link>
          <Link className={pathname === "/Blog" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"} href="/Blog">Blog</Link>
          <Link className={pathname === "/contact" ? "text-[#FFCE2A]" : "hover:text-[#FFCE2A]"} href="/contact">Contact Us</Link>
        </nav>

        {/* Buttons */}
        <div className="hidden md:flex gap-2">
          <Link href="/auth/auth">
            <button className="px-4 py-1 border rounded-full hover:bg-[#FFCE2A]">
              login
            </button>
          </Link>

          <Link href="/BookTrip">
            <button className="px-4 py-1 bg-black text-white rounded-full hover:bg-[#FFCE2A] hover:text-black">
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile button */}
        <button className="md:hidden text-xl" onClick={() => setOpen(!open)}>
          ☰
        </button>
      </div>

     
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-3 text-sm">
          <Link onClick={() => setOpen(false)} className={pathname === "/" ? "text-[#FFCE2A]" : ""} href="/">Home</Link>
          <Link onClick={() => setOpen(false)} className={pathname === "/about" ? "text-[#FFCE2A]" : ""} href="/about">About Us</Link>
          <Link onClick={() => setOpen(false)} className={pathname === "/offerings" ? "text-[#FFCE2A]" : ""} href="/offerings">Offerings</Link>
          <Link onClick={() => setOpen(false)} className={pathname === "/Blog" ? "text-[#FFCE2A]" : ""} href="/Blog">Blog</Link>
          <Link onClick={() => setOpen(false)} className={pathname === "/contact" ? "text-[#FFCE2A]" : ""} href="/contact">Contact Us</Link>
        </div>
      )}
    </header>
  );
}

export default Header;