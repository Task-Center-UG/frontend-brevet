import Footer from "@/components/(main)/footer";
import WorkshopSchedule from "@/components/(main)/jadwal-workshop/workshop-scchedule";
import Navbar from "@/components/(main)/navbar";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Jadwal Workshop Pajak",
  description:
    "Temukan jadwal workshop pajak dari Tax Center Universitas Gunadarma untuk menambah pemahaman praktis perpajakan.",
  path: "/jadwal-workshop",
  keywords: ["jadwal workshop pajak", "workshop pajak gunadarma", "pelatihan pajak"],
});

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
