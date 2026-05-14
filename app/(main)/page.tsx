import FAQ from "@/components/(main)/faq";
import FeaturedCourses from "@/components/(main)/featured-courses";
import FeaturedPrograms from "@/components/(main)/featured-programs";
import Footer from "@/components/(main)/footer";
import Hero from "@/components/(main)/hero";
import MarqueeBand from "@/components/(main)/marquee-band";
import Navbar from "@/components/(main)/navbar";
import Pricing from "@/components/(main)/priccing";
import React from "react";

const HomePage = () => {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <FeaturedPrograms />
        <FeaturedCourses />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
