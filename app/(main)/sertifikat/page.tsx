import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import ValidasiSertifikat from "@/components/(main)/sertifikat/validasi-sertifikat";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = createPageMetadata({
  title: "Validasi Sertifikat Brevet Pajak",
  description:
    "Validasi sertifikat brevet pajak Tax Center Universitas Gunadarma secara cepat dengan nomor sertifikat atau data peserta.",
  path: "/sertifikat",
  keywords: [
    "validasi sertifikat brevet",
    "cek sertifikat brevet pajak",
    "sertifikat tax center gunadarma",
  ],
});

const CertificateValidationPage = () => {
  return (
    <div>
      <Navbar />
      <ValidasiSertifikat />
      <Footer />
    </div>
  );
};

export default CertificateValidationPage;
