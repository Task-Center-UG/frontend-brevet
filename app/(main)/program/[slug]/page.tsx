"use client";

import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import ProgramDetail from "@/components/(main)/program/program-detail";
import { useParams } from "next/navigation";
import React from "react";

const DetailProgramPage = () => {
  const params = useParams();
  const courseSlug = params.slug as string;

  return (
    <div>
      <Navbar />
      <ProgramDetail courseSlug={courseSlug} />
      <Footer />
    </div>
  );
};

export default DetailProgramPage;
