"use client";

import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import Purchase from "@/components/(main)/pembayaran/purchase";
import { useParams } from "next/navigation";
import React from "react";

const PurchasePage = () => {
  const params = useParams();
  const batchSlug = params.batchSlug as string;

  return (
    <div>
      <Navbar />
      <Purchase batchSlug={batchSlug} />
      <Footer />
    </div>
  );
};

export default PurchasePage;
