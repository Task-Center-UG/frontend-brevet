import NewsList from "@/components/(main)/berita/news-list";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import React from "react";

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
