import FAQ from "@/components/(main)/faq";
import FeaturedCourses from "@/components/(main)/featured-courses";
import FeaturedPrograms from "@/components/(main)/featured-programs";
import Footer from "@/components/(main)/footer";
import Hero from "@/components/(main)/hero";
import LearnerCentricSections from "@/components/(main)/learner-centric-sections";
import MarqueeBand from "@/components/(main)/marquee-band";
import Navbar from "@/components/(main)/navbar";
import Pricing from "@/components/(main)/priccing";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Brevet Pajak Tax Center Gunadarma",
  description:
    "Ikuti program brevet pajak bersama Tax Center Universitas Gunadarma dengan pendaftaran, pembayaran, materi, tugas, quiz, nilai, dan sertifikat dalam satu LMS.",
  path: "/",
  keywords: [
    "brevet pajak tax center",
    "brevet pajak universitas gunadarma",
    "LMS brevet pajak Indonesia",
  ],
});

const HomePage = () => {
  return (
    <div className="relative">
      <Navbar />
      <main>
        <Hero />
        <MarqueeBand />
        <LearnerCentricSections />
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
