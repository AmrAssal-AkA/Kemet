import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Destination", href: "/Destination" },
  { label: "Blog", href: "/Blog" },
  { label: "Offerings", href: "/offerings" },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const router = useRouter();
  const [homeHref, setHomeHref] = useState("/");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { logout, user } = useAuth();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (user) {
      setHomeHref("/user-dashboard");
      setIsLoggedIn(true);
    } else {
      setHomeHref("/");
      setIsLoggedIn(false);
    }
  }, [user]);

  useEffect(() => {
    const updateCurrentPath = () => {
      setCurrentPath(router.asPath.split("?")[0]);
    };

    updateCurrentPath();
    router.events.on("routeChangeComplete", updateCurrentPath);

    return () => {
      router.events.off("routeChangeComplete", updateCurrentPath);
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-24 w-full max-w-7xl items-center justify-between px-4 sm:h-24 sm:px-6 lg:px-8">
        <Link href={homeHref} className="flex items-center gap-4">
          <Image
            src="/Logo.png"
            alt="Kemet Logo"
            width={84}
            height={84}
            priority
            className="h-16 w-16 object-contain sm:h-21 sm:w-21"
          />
          <span className="text-3xl font-extrabold leading-none tracking-tight text-slate-900 sm:text-[2.6rem]">
            Kemet
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {(() => {
            const normalizedCurrent =
              currentPath !== "/"
                ? currentPath.replace(/\/+$/, "")
                : currentPath;

            const isHomeActive =
              normalizedCurrent === "/" ||
              normalizedCurrent.startsWith("/user-dashboard");

            return (
              <>
                <Link
                  href={homeHref}
                  className={`relative pb-1 text-sm font-semibold transition ${
                    isHomeActive
                      ? "text-amber-500"
                      : "text-slate-700 hover:text-amber-500"
                  }`}
                >
                  Home
                  {isHomeActive && (
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-amber-500" />
                  )}
                </Link>

                {navItems.map((item) => {
                  const normalizedItem =
                    item.href !== "/"
                      ? item.href.replace(/\/+$/, "")
                      : item.href;
                  const isActive = normalizedCurrent
                    .toLowerCase()
                    .startsWith(normalizedItem.toLowerCase());

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative pb-1 text-sm font-semibold transition ${
                        isActive
                          ? "text-amber-500"
                          : "text-slate-700 hover:text-amber-500"
                      }`}
                    >
                      {item.label}
                      {isActive && (
                        <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-amber-500" />
                      )}
                    </Link>
                  );
                })}
              </>
            );
          })()}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`${isLoggedIn ? "/user-dashboard" : "/auth/auth"}`}
            className="hidden rounded-full bg-amber-400 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-amber-300 sm:inline-flex"
          >
            Book Trip
          </Link>
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 sm:inline-flex"
            >
              Logout
            </button>
          )}
          <Link
            href="/Destination"
            className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 md:hidden"
          >
            Menu
          </Link>
        </div>
      </div>
    </header>
  );
}
