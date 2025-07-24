import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-[--color-black] text-[--color-black] font-sans flex flex-col items-center justify-center px-4">
      {/* Logo */}
      <div className="mt-12 mb-6">
        <Image
          src="/next.svg"
          alt="WOWorld Logo"
          width={180}
          height={38}
          priority
        />
      </div>

      {/* Hero Section */}
      <h1 className="text-4xl font-bold text-center text-[--color-white ] mb-4">
        Welcome to WOWorld Magazines
      </h1>
      <p className="text-lg text-center max-w-2xl mb-10 text-[--color-accent]">
        Discover the latest in fashion, art, culture, and lifestyle. Explore
        exclusive features, artist spotlights, and premium content curated for
        you.
      </p>

      {/* Features Section */}
      <section className="w-full max-w-4xl grid gap-6 md:grid-cols-3 mb-12">
        <div className="bg-[--color-warm] rounded-2xl p-6 shadow border border-[--color-primary]">
          <h2 className="text-xl font-semibold mb-2 text-[--color-primary]">
            Fashion
          </h2>
          <p className="text-[--color-black] text-base">
            Stay ahead with the latest trends and exclusive fashion editorials.
          </p>
        </div>
        <div className="bg-[--color-relaxed] rounded-2xl p-6 shadow border border-[--color-accent]">
          <h2 className="text-xl font-semibold mb-2 text-[--color-accent]">
            Art & Culture
          </h2>
          <p className="text-[--color-black] text-base">
            Explore artist spotlights, interviews, and cultural insights.
          </p>
        </div>
        <div className="bg-[--color-chic] rounded-2xl p-6 shadow border border-gray-200">
          <h2 className="text-xl font-semibold mb-2 text-[--color-black]">
            Lifestyle
          </h2>
          <p className="text-[--color-black] text-base">
            Inspiration for modern living, wellness, and personal growth.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <a
        href="/magazines"
        className="bg-[--color-primary] text-[--color-white] px-8 py-3 rounded-full font-semibold hover:bg-[--color-accent] transition mb-16"
      >
        Explore Magazines
      </a>

      {/* Footer */}
      <footer className="flex gap-8 flex-wrap items-center justify-center py-6 border-t border-gray-200 w-full max-w-4xl mx-auto">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </main>
  );
}
