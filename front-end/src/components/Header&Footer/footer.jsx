import Link from "next/link";

function Footer() {
  return (
    <footer className="bg-[#3b4c6e] text-white mt-10">
      <div className="max-w-7xl mx-auto p-6 grid md:grid-cols-5 gap-6">

        <div>
          <h2 className="font-bold mb-2">EG-KEMET</h2>
          <p>Cairo, Egypt</p>
          <p>EG-KEMET@hello.com</p>
          <p>+2 000000</p>
        </div>

        <div>
          <h3 className="mb-2">Service</h3>
          <p className="hover:text-[#FFCE2A]">Smart Trip Planner</p>
          <p className="hover:text-[#FFCE2A]">Destination Discovery</p>
          <p className="hover:text-[#FFCE2A]">Local Experiences</p>
          <p className="hover:text-[#FFCE2A]">Travel Community</p>
          <p className="hover:text-[#FFCE2A]">Blog & Stories</p>
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

      </div>

      <p className="text-center pb-3">
        © 2025 Kemet
      </p>
    </footer>
  );
}

export default Footer;