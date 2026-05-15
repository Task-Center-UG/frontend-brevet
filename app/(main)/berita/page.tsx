import NewsList from "@/components/(main)/berita/news-list";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Berita dan Informasi Pajak",
  description:
    "Baca berita, pengumuman, dan informasi terbaru seputar program brevet, workshop, serta aktivitas Tax Center Universitas Gunadarma.",
  path: "/berita",
  keywords: ["berita pajak", "info brevet pajak", "pengumuman tax center"],
});

const NewsPage = () => {
  return (
    <div>
      <Navbar />
      <NewsList />
      <Footer />
    </div>
  );
};

export default NewsPage;
