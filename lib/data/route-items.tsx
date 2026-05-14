import {
  BookCopy,
  LifeBuoy,
  ScanText,
  Send,
  ShieldUser,
  SquareTerminal,
  User,
  Users,
} from "lucide-react";

export const routeItems = {
  // ADMIN
  navMain: [
    {
      title: "Kursus",
      url: "/dashboard/kursus",
      icon: BookCopy,
      isActive: false,
      items: [
        {
          title: "List Kursus",
          url: "/dashboard/kursus",
        },
        {
          title: "Tambah Kursus",
          url: "/dashboard/kursus/tambah",
        },
      ],
    },
    {
      title: "Berita",
      url: "/dashboard/berita",
      icon: SquareTerminal,
      isActive: false,
      items: [
        {
          title: "List Berita",
          url: "/dashboard/berita",
        },
        {
          title: "Tambah Berita",
          url: "/dashboard/berita/tambah",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Bantuan",
      url: "/bantuan",
      icon: LifeBuoy,
    },
    {
      title: "Umpan Balik",
      url: "/dashboard/umpan-balik",
      icon: Send,
    },
  ],
  managementNav: [
    {
      name: "Peserta",
      url: "/dashboard/peserta",
      icon: User,
    },
    {
      name: "Pengajar",
      url: "/dashboard/pengajar",
      icon: Users,
    },
    {
      name: "Administrator",
      url: "/dashboard/admin",
      icon: ShieldUser,
    },
  ],
  managementTransaction: [
    {
      name: "Transaksi",
      url: "/dashboard/transaksi",
      icon: ScanText,
    },
  ],

  // GURU
  managementCourses: [
    {
      name: "Kelas",
      url: "/dashboard/kelas",
      icon: BookCopy,
    },
  ],

  // MAHASISWA
  managementMyCourses: [
    {
      name: "Kursus Saya",
      url: "/dashboard/program-saya",
      icon: BookCopy,
    },
  ],
  managementPurchasing: [
    {
      name: "Pembayaran",
      url: "/dashboard/pembayaran",
      icon: ScanText,
    },
  ],
};
