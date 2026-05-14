"use client";

import NewsDetail from "@/components/(main)/berita/news-detail";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { useParams } from "next/navigation";
import React from "react";

const NewsDetailPage = () => {
  const params = useParams();
  const newsSlug = params.slug as string;

  return (
    <div>
      <Navbar />
      <NewsDetail newsSlug={newsSlug} />
      <Footer />
    </div>
  );
};

export default NewsDetailPage;
