'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "News", path: "/news" },
  { label: "Books", path: "/books" },
  { label: "WOW Battle", path: "/wow-battle" },
  { label: "Open-Call", path: "/open-call", pulse: true },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    if (mobileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileOpen]);

  return (
    <header className="fixed w-full z-50 transition-all duration-500">
      {/* Animated background */}
      <div
        className={`absolute inset-0 z-[-1] bg-chic origin-top transform transition-transform duration-500 ease-out ${
          scrolled ? "scale-y-100" : "scale-y-0"
        }`}
      ></div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 transition-opacity duration-300"
          onClick={() => setMobileOpen(false)}
        ></div>
      )}

      <div
        className={`relative flex items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 transition-all duration-500 ${
          scrolled ? "top-0 py-2" : "top-4 py-6 sm:py-8 lg:py-2"
        }`}
      >
        {/* Logo */}
        <div className="w-[60px] sm:w-[72px] md:w-[84px] pt-1.5 pb-1.5 sm:pt-3 sm:pb-3 lg:pt-1 lg:pb-1 transition-all duration-300">
          <Link href="/">
            <Image
              src="/wowlogo.svg"
              alt="WOWorld Logo"
              width={72}
              height={72}
              priority
              className="transition-transform hover:scale-105 drop-shadow-xl"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 font-sans uppercase text-[14px] tracking-wider">
          {navItems.map(({ label, path, pulse }) => {
            const isActive = pathname === path;
            return (
              <Link
                key={label}
                href={path}
                className="relative flex flex-col items-center group"
              >
                <span className="absolute top-[-60px] flex justify-center overflow-hidden h-14 w-[12px]">
                  <span
                    className={`w-[2px] transition-all duration-300 ${
                      isActive
                        ? "bg-primary h-full"
                        : scrolled
                        ? "bg-black h-0 group-hover:h-full"
                        : "bg-white h-0 group-hover:h-full"
                    }`}
                  ></span>
                </span>
                <span
                  className={`transition-all duration-300 leading-[1.8] ${
                    isActive
                      ? scrolled
                        ? "text-black font-semibold"
                        : "text-primary font-semibold"
                      : scrolled
                      ? "text-black/70 font-medium group-hover:text-black"
                      : "text-black/70 font-medium group-hover:text-primary"
                  }`}
                >
                  {label}
                  {pulse && (
                    <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                  )}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Hamburger */}
        {!mobileOpen && (
          <button
            className={`md:hidden z-50 relative p-2 transition-colors duration-500 ${
              scrolled ? "text-black" : "text-primary"
            }`}
            onClick={() => setMobileOpen(true)}
          >
            <div
              className={`flex flex-col justify-center gap-[6px] w-[38px] h-[32px] transition-all duration-300`}
            >
              <span className="block w-full h-[2px] bg-current"></span>
              <span className="block h-[2px] bg-current ml-3 w-[calc(100%-12px)]"></span>
              <span className="block w-full h-[2px] bg-current"></span>
            </div>
          </button>
        )}
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[85%] max-w-sm bg-chic text-black z-40 origin-right transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
        ref={drawerRef}
      >
        <div className="flex flex-col justify-between h-full relative">
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 z-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="flex flex-col justify-center h-full px-6">
            <nav className="mt-16 font-sans text-lg uppercase tracking-wide font-medium w-full">
              {navItems.map(({ label, path, pulse }) => {
                const isActive = pathname === path;
                return (
                  <Link
                    key={label}
                    href={path}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-6 py-4 w-full ${
                      isActive
                        ? "text-primary font-semibold relative before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[20px] before:h-[2px] before:bg-primary"
                        : "text-black"
                    }`}
                  >
                    {label}
                    {pulse && (
                      <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}