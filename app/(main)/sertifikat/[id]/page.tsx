"use client";

import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import ValidasiSertifikatId from "@/components/(main)/sertifikat/validasi-sertifikat-id";
import { useParams } from "next/navigation";
import React from "react";

const CertificateValidationIdPage = () => {
  const params = useParams();
  const sertifikatId = params.id as string;

  return (
    <div>
      <Navbar />
      <ValidasiSertifikatId sertifikatId={sertifikatId} />
      <Footer />
    </div>
  );
};

export default CertificateValidationIdPage;
