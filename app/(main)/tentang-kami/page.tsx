import AboutPage from "@/components/(main)/tentang-kami/about-page";
import { createPageMetadata } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = createPageMetadata({
  title: "Tentang Tax Center Brevet LMS",
  description:
    "Kenali Tax Center Brevet LMS: platform belajar brevet pajak yang membantu peserta mendaftar, mengikuti kelas, mengelola tugas, memantau nilai, dan memvalidasi sertifikat.",
  path: "/tentang-kami",
  keywords: [
    "tentang tax center gunadarma",
    "fitur LMS brevet pajak",
    "platform belajar brevet pajak",
  ],
});

export default function TentangKamiPage() {
  return <AboutPage />;
}
