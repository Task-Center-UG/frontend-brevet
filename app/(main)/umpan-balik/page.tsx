import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import UmpanBalikList from "@/components/(main)/umpan-balik/umpan-balik-list";
import React from "react";

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
