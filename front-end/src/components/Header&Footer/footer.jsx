import axios from "axios";
import Link from "next/link";
import { useRef } from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaTiktok,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { useLanguage } from "@/i18n/LanguageContext";

function Footer() {
  const emailRef = useRef();
  const { t, isArabic } = useLanguage();

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;

    if (!email || typeof email !== "string") {
      toast.error(t("footer.invalidEmail"));
      return;
    }

    try {
      const res = await axios.post("/api/newsletter/subscribe", { email });
      
      if (res.status === 200) {
        toast.error(t("footer.alreadySubscribed"));
        emailRef.current.value = "";
      } else if(res.status === 201){
        toast.success(t("footer.subscribed"));
        emailRef.current.value = "";
      }else{
        throw error
      }
    }catch (error) {
      console.error("Subscription error:", error);
      toast.error(error.response?.data?.message || t("footer.subscribeError"));
    }
  }
  return (
    <footer className="mt-10 text-white antialiased" style={{ background: "linear-gradient(160deg, #06122e 0%, #0b1f46 40%, #102554 70%, #06122e 100%)" }}>

      {/* Top accent line */}
      <div className="h-0.75 w-full" style={{ background: "linear-gradient(90deg, transparent, #FFCE2A 30%, #f5b800 70%, transparent)" }} />

      {/* Newsletter strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-yellow-400">{t("footer.stayLoop")}</p>
              <h3 className="mt-1 text-lg font-bold text-white">{t("footer.weeklyInspiration")}</h3>
            </div>
            <div className="flex max-w-sm flex-1 gap-2">
              <input
                type="email"
                placeholder={t("footer.emailPlaceholder")}
                className="flex-1 rounded-full bg-white/10 px-5 py-2.5 text-sm text-white placeholder-white/40 outline-none border border-white/10 focus:border-yellow-400/60 transition-colors"
                ref={emailRef}
              />
              <button
                className="flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-black transition-all hover:-translate-y-0.5 active:translate-y-0"
                style={{ background: "linear-gradient(135deg,#FFCE2A,#f5b800)", boxShadow: "0 4px 14px rgba(255,206,42,.30)" }}
                onClick={handleNewsletterSubmit}
              >
                {t("footer.subscribe")} <FaArrowRight className={`text-xs ${isArabic ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <h2
              className="text-2xl font-extrabold tracking-tight text-white"
              style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "0.04em" }}
            >
              {t("footer.brand")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300/80 max-w-xs">
              {t("footer.description")}
            </p>

            <ul className="mt-6 space-y-3 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-0.5 shrink-0 text-yellow-400" />
                <span>{t("footer.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <FaEnvelope className="shrink-0 text-yellow-400" />
                <a href="mailto:kemet3003@gmail.com" className="transition-colors hover:text-yellow-400">
                  kemet3003@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="shrink-0 text-yellow-400" />
                <a href="tel:+201234567890" className="transition-colors hover:text-yellow-400">
                  +20 123 456 7890
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-yellow-400">{t("footer.services")}</h3>
            <div className="mt-5 flex flex-col gap-2.5">
              {[
                { href: "/offerings", label: t("footer.smartPlanner") },
                { href: "/Destination", label: t("footer.destinationDiscovery") },
                { href: "/offerings", label: t("footer.localExperiences") },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-yellow-400"
                >
                  <span className="inline-block h-px w-4 bg-white/20 transition-all duration-200 group-hover:w-6 group-hover:bg-yellow-400" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-yellow-400">{t("footer.company")}</h3>
            <div className="mt-5 flex flex-col gap-2.5">
              {[
                { href: "/about", label: t("footer.aboutUs") },
                { href: "/contact", label: t("footer.contactUs") },
                { href: "/offerings", label: t("nav.offerings") },
                { href: "/blogs", label: t("nav.blog") },
              ].map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-1.5 text-sm text-slate-300 transition-colors duration-200 hover:text-yellow-400"
                >
                  <span className="inline-block h-px w-4 bg-white/20 transition-all duration-200 group-hover:w-6 group-hover:bg-yellow-400" />
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-yellow-400">{t("footer.followUs")}</h3>
            <p className="mt-3 text-sm text-slate-400">{t("footer.community")}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { href: "https://instagram.com", icon: <FaInstagram />, label: "Instagram" },
                { href: "https://www.facebook.com/profile.php?id=61584789544926", icon: <FaFacebookF />, label: "Facebook" },
                { href: "https://tiktok.com", icon: <FaTiktok />, label: "TikTok" },
                { href: "https://x.com", icon: <FaTwitter />, label: "X" },
                { href: "https://youtube.com", icon: <FaYoutube />, label: "YouTube" },
              ].map(({ href, icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-slate-300 transition-all duration-200 hover:border-yellow-400 hover:text-yellow-400 hover:-translate-y-0.5"
                  style={{ backdropFilter: "blur(4px)", background: "rgba(255,255,255,0.04)" }}
                >
                  {icon}
                </a>
              ))}
            </div>

            {/* Trust badge */}
            <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <span className="text-2xl">🏺</span>
              <div>
                <p className="text-xs font-semibold text-white">{t("footer.trusted")}</p>
                <p className="text-[11px] text-slate-400">{t("footer.authenticSince")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} EG-Kemet. {t("footer.rights")}</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="transition-colors hover:text-yellow-400">{t("footer.privacy")}</Link>
            <Link href="/terms" className="transition-colors hover:text-yellow-400">{t("footer.terms")}</Link>
            <Link href="/sitemap" className="transition-colors hover:text-yellow-400">{t("footer.sitemap")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
