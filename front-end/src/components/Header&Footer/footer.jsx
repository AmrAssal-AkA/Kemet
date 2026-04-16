import Link from "next/link";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="mt-10 bg-gradient-to-r from-[#0b1f46] via-[#123c7a] to-[#0b1f46] text-white antialiased">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-lg font-semibold tracking-[0.04em] text-white">EG - KEMET</h2>
            <ul className="mt-5 space-y-3 text-sm text-slate-100">
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-slate-300" />
                <span>123 Egypt St, Cairo</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-slate-300" />
                <span>kemet3003@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-slate-300" />
                <span>+20 123 456 7890</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">Services</h3>
            <div className="mt-5 space-y-2 text-sm">
              <Link href="/offerings" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Smart Trip Planner
              </Link>
              <Link href="/offerings" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Destination Discovery
              </Link>
              <Link href="/offerings" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Local Experiences
              </Link>
              <Link href="/offerings" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Travel Community
              </Link>
              <Link href="/Blog" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Blog & Guides
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">Company</h3>
            <div className="mt-5 space-y-2 text-sm">
              <Link href="/about" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                About Us
              </Link>
              <Link href="/contact" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Contact Us
              </Link>
              <Link href="/offerings" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Features
              </Link>
              <Link href="/Blog" className="block text-slate-100 transition-colors duration-200 hover:text-[#FFCE2A]">
                Blog
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-100">Social</h3>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-300/60 text-slate-100 transition-all duration-200 hover:border-[#FFCE2A] hover:text-[#FFCE2A]"
              >
                <FaInstagram className="text-sm" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61584789544926"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-300/60 text-slate-100 transition-all duration-200 hover:border-[#FFCE2A] hover:text-[#FFCE2A]"
              >
                <FaFacebookF className="text-sm" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-300/60 text-slate-100 transition-all duration-200 hover:border-[#FFCE2A] hover:text-[#FFCE2A]"
              >
                <FaTiktok className="text-sm" />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-300/60 text-slate-100 transition-all duration-200 hover:border-[#FFCE2A] hover:text-[#FFCE2A]"
              >
                <FaTwitter className="text-sm" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="grid h-9 w-9 place-items-center rounded-full border border-slate-300/60 text-slate-100 transition-all duration-200 hover:border-[#FFCE2A] hover:text-[#FFCE2A]"
              >
                <FaYoutube className="text-sm" />
              </a>
            </div>
          </div>
        </div>

<<<<<<< HEAD
        <div className="mt-8 border-t border-slate-200/20 pt-4">
          <p className="text-sm text-slate-200">© All rights Reserved to Kemet</p>
        </div>
=======
        {/* SERVICE - ALL LINKS UPDATED */}
        <div>
          <h3 className="mb-2">Service</h3>

          <Link href="/about" className="block hover:text-[#FFCE2A]">
            Smart Trip Planner
          </Link>

          <Link href="/about" className="block hover:text-[#FFCE2A]">
            Destination Discovery
          </Link>

          <Link href="/contact" className="block hover:text-[#FFCE2A]">
            Local Experiences
          </Link>

          <Link href="/contact" className="block hover:text-[#FFCE2A]">
            Travel Community
          </Link>

          <Link href="/Blog" className="block hover:text-[#FFCE2A]">
            Blog & Stories
          </Link>
        </div>

        <div>
          <h3 className="mb-2">Company</h3>
          <Link href="/about" className="block hover:text-[#FFCE2A]">About</Link>
          <Link href="/offerings" className="block hover:text-[#FFCE2A]">Features</Link>
          <Link href="/Blog" className="block hover:text-[#FFCE2A]">Blog</Link>
          <Link href="/contact" className="block hover:text-[#FFCE2A]">Contact</Link>
        </div>

        <div>
          <h3 className="mb-2">Social</h3>

          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FFCE2A]">
            Instagram
          </a>

          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FFCE2A]">
            Facebook
          </a>

          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FFCE2A]">
            YouTube
          </a>

          <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FFCE2A]">
            TikTok
          </a>

          <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="block hover:text-[#FFCE2A]">
            X
          </a>
        </div>

        <div>
          <h3 className="mb-2">Newsletter</h3>
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-2 rounded text-white"
          />
          <button className="w-full p-2 bg-white text-black rounded hover:bg-[#FFCE2A]">
            Send
          </button>
        </div>

>>>>>>> eb664aaeb1c3fc2d524764fdc521d263e605b83a
      </div>
    </footer>
  );
}

export default Footer;
