import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-[--color-chic] border-b border-gray-200">
      {/* Logo */}
      <div className="flex items-center gap-2">
        {/* Inline SVG logo */}
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" aria-label="WOWorld Logo">
          <circle cx="19" cy="19" r="19" fill="#e02525" />
          <text x="50%" y="55%" textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold" fontFamily="sans-serif" dy=".3em">WOW</text>
        </svg>
        <span className="font-bold text-xl text-[--color-primary]">WOWorld</span>
      </div>
      {/* Navigation Links */}
      <div className="flex gap-6 font-medium text-[--color-black]">
        <Link href="/" className="hover:text-[--color-primary] transition">Home</Link>
        <Link href="/about" className="hover:text-[--color-primary] transition">About</Link>
        <Link href="/news" className="hover:text-[--color-primary] transition">News</Link>
        <Link href="/books" className="hover:text-[--color-primary] transition">Books</Link>
        <Link href="/wow-battle" className="hover:text-[--color-primary] transition">WOW Battle</Link>
        <Link href="/open-call" className="hover:text-[--color-primary] transition">Open-Call</Link>
        <Link href="/contact" className="hover:text-[--color-primary] transition">Contact</Link>
        <Link href="/account" className="hover:text-[--color-primary] transition">My Account</Link>
      </div>
    </nav>
  );
}