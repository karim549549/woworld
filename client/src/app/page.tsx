"use client";

import Navbar from "@/components/navbar-components/navbar";
import HeroHeader from "@/components/home/hero-header";
import FeaturedIssues from "@/components/home/featuerd-issues";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroHeader />
      <FeaturedIssues />
    </>
  );
}