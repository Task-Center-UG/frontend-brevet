import Footer from "@/components/(main)/footer";
import WorkshopSchedule from "@/components/(main)/jadwal-workshop/workshop-scchedule";
import Navbar from "@/components/(main)/navbar";
import React from "react";

const WorkshopSchedulePage = () => {
  return (
    <div>
      <Navbar />
      <WorkshopSchedule />
      <Footer />
    </div>
  );
};

export default WorkshopSchedulePage;
