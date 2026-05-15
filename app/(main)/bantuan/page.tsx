import Help from "@/components/(main)/bantuan/help";
import FAQ from "@/components/(main)/faq";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Bantuan Brevet Pajak",
  description:
    "Temukan jawaban tentang pendaftaran, pembayaran, akses kelas, tugas, quiz, nilai, dan sertifikat di Tax Center Brevet LMS.",
  path: "/bantuan",
  keywords: ["bantuan brevet pajak", "FAQ brevet pajak", "panduan LMS brevet"],
});

const HelpPage = () => {
  return (
    <div>
      <Navbar />
      <Help />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HelpPage;
