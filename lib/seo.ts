import type { Metadata } from "next";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://brevet.taxcenterug.com";

export const siteConfig = {
  name: "Tax Center Brevet LMS",
  title: "Tax Center Brevet LMS | Universitas Gunadarma",
  description:
    "Platform resmi Tax Center Universitas Gunadarma untuk pendaftaran brevet pajak, pembayaran, pembelajaran, tugas, quiz, nilai, dan validasi sertifikat dalam satu alur.",
  shortDescription:
    "Daftar kelas brevet, pantau pembayaran, ikuti materi dan evaluasi, lalu validasi sertifikat resmi melalui LMS Tax Center Universitas Gunadarma.",
  author: "Tax Center Universitas Gunadarma",
  creator: "Tax Center Universitas Gunadarma",
  category: "Edukasi Perpajakan",
  ogImage: "/og-image.png",
  keywords: [
    "brevet pajak",
    "brevet pajak gunadarma",
    "tax center gunadarma",
    "kursus brevet pajak",
    "pelatihan brevet pajak",
    "sertifikat brevet pajak",
    "LMS brevet pajak",
    "validasi sertifikat brevet",
    "kelas pajak online",
    "kelas pajak offline",
    "edukasi perpajakan",
    "Universitas Gunadarma",
  ],
};

type CreatePageMetadataArgs = {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path = "/",
  keywords = [],
  image = siteConfig.ogImage,
  noIndex = false,
}: CreatePageMetadataArgs): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title,
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      locale: "id_ID",
      url,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: "Tax Center Brevet LMS Universitas Gunadarma",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : undefined,
  };
}
