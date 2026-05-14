import Help from "@/components/(main)/bantuan/help";
import FAQ from "@/components/(main)/faq";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import React from "react";

const HelpPage = () => {
  return (
    <div>
      <Navbar />
      <FAQ />
      <Help />
      <Footer />
    </div>
  );
};

export default HelpPage;
