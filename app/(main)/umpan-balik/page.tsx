import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import UmpanBalikList from "@/components/(main)/umpan-balik/umpan-balik-list";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Umpan Balik Peserta",
  description:
    "Lihat pengalaman peserta belajar brevet pajak bersama Tax Center Universitas Gunadarma melalui LMS yang rapi dan mudah dipantau.",
  path: "/umpan-balik",
  keywords: ["testimoni brevet pajak", "umpan balik peserta", "pengalaman brevet pajak"],
});

const UmpanBalikPage = () => {
  return (
    <div>
      <Navbar />
      <UmpanBalikList />
      <Footer />
    </div>
  );
};

export default UmpanBalikPage;
