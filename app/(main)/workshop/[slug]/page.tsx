import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import WorkshopDetail from "@/components/(main)/workshop/workshop-detail";
import React from "react";

const WorkshopDetailPage = () => {
  return (
    <div>
      <Navbar />
      <WorkshopDetail />
      <Footer />
    </div>
  );
};

export default WorkshopDetailPage;
