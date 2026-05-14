import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import ValidasiSertifikat from "@/components/(main)/sertifikat/validasi-sertifikat";
import React from "react";

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
