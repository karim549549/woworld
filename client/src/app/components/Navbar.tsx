'use client';
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/wowlogo.svg"
                  alt="WOWorld Logo"
                  width={42}
                  height={42}
                  priority
                  className="transition-transform group-hover:scale-105"
                />
              </div>
              <div className="hidden sm:block">
                <span className="font-black text-2xl text-gray-900 tracking-tight">
                  WO<span className="text-primary-600">World</span>
                </span>
                <div className="text-xs text-gray-500 font-medium tracking-wider uppercase -mt-1">
                  Magazine
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-2">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/news", label: "News" },
              { href: "/books", label: "Books" },
              { href: "/wow-battle", label: "WOW Battle" },
              { href: "/open-call", label: "Open-Call", pulse: true, featured: true },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label, pulse, featured }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-5 py-2.5 mx-1 text-sm font-semibold transition-all duration-300 rounded-full hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  featured 
                    ? 'text-white bg-gradient-to-r from-accent to-primary shadow-lg hover:shadow-xl hover:from-accent/90 hover:to-primary/90' 
                    : 'text-gray-700 hover:text-primary hover:bg-white/80 hover:shadow-md'
                }`}
              >
                {label}
                {pulse && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                  </div>
                )}
              </Link>
            ))}
            
            {/* CTA Button */}
            <div className="ml-4 pl-4 border-l border-gray-300/50">
              <Link 
                href="/account" 
                className="inline-flex items-center px-6 py-3 text-sm font-bold text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black hover:from-black hover:via-gray-900 hover:to-gray-800 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Account
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-3 rounded-full text-gray-700 hover:text-primary hover:bg-white/80 transition-all duration-300 shadow-md hover:shadow-lg backdrop-blur-sm"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <div className="relative w-6 h-6">
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200/50 bg-gradient-to-b from-white/95 to-gray-50/95 backdrop-blur-xl shadow-2xl">
          <div className="px-6 py-8 space-y-3">
            {[
              { href: "/", label: "Home" },
              { href: "/about", label: "About" },
              { href: "/news", label: "News" },
              { href: "/books", label: "Books" },
              { href: "/wow-battle", label: "WOW Battle" },
              { href: "/open-call", label: "Open-Call", pulse: true, featured: true },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label, pulse, featured }) => (
              <Link
                key={href}
                href={href}
                className={`relative block px-6 py-4 text-lg font-semibold transition-all duration-300 rounded-2xl transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                  featured 
                    ? 'text-white bg-gradient-to-r from-accent to-primary shadow-lg' 
                    : 'text-gray-700 hover:text-primary hover:bg-white/80 hover:shadow-md'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <span>{label}</span>
                  {pulse && (
                    <div className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
            
            {/* Mobile CTA */}
            <div className="pt-6 mt-6 border-t border-gray-200/50">
              <Link 
                href="/account" 
                className="flex items-center justify-center w-full px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                My Account
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}