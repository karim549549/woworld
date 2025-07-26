"use client";

import Navbar from "@/components/navbar-components/navbar";
import HeroHeader from "@/components/home/hero-header";
import Demo from "@/components/ui/horizontal-flowing-cards";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroHeader />
      <Demo />
    </>
  );
}