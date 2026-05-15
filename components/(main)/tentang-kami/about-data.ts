import {
  BookOpenCheck,
  CalendarDays,
  ClipboardList,
  CreditCard,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

export const platformFeatures = [
  {
    icon: CalendarDays,
    title: "Jadwal dan gelombang jelas",
    desc: "Peserta bisa melihat periode kelas, mode online atau offline, kuota, dan status pendaftaran sebelum mengambil keputusan.",
  },
  {
    icon: CreditCard,
    title: "Pembayaran terpantau",
    desc: "Upload bukti transfer, status konfirmasi, dan nominal pembayaran berada di satu alur yang mudah dicek.",
  },
  {
    icon: BookOpenCheck,
    title: "Materi per pertemuan",
    desc: "Materi kelas disusun mengikuti struktur pertemuan supaya peserta tidak perlu mencari file di banyak tempat.",
  },
  {
    icon: ClipboardList,
    title: "Tugas dan penilaian",
    desc: "Tugas dapat dikumpulkan dari dashboard, lalu guru memberi nilai dan umpan balik langsung di sistem.",
  },
  {
    icon: FileQuestion,
    title: "Quiz dalam LMS",
    desc: "Quiz membantu peserta mengukur pemahaman, sementara guru bisa mengelola soal dan hasil dengan lebih rapi.",
  },
  {
    icon: GraduationCap,
    title: "Sertifikat tervalidasi",
    desc: "Sertifikat dapat dicek melalui halaman validasi publik untuk memberi rasa aman bagi peserta dan pihak yang memeriksa.",
  },
];

export const roleCards = [
  {
    icon: UserRoundCheck,
    role: "Peserta",
    title: "Tahu langkah berikutnya",
    desc: "Dari daftar, bayar, masuk kelas, mengerjakan tugas, mengikuti quiz, sampai melihat progres sertifikat.",
  },
  {
    icon: UsersRound,
    role: "Guru",
    title: "Mengajar lebih terstruktur",
    desc: "Materi, tugas, quiz, dan nilai tersusun berdasarkan pertemuan sehingga kelas lebih mudah dikelola.",
  },
  {
    icon: LayoutDashboard,
    role: "Admin",
    title: "Operasional lebih terkendali",
    desc: "Data peserta, kelas, pembayaran, dan konten bisa dikelola dari dashboard yang sama.",
  },
];

export const journeySteps = [
  "Pilih program dan jadwal yang sesuai.",
  "Daftar dengan kategori peserta yang tepat.",
  "Upload bukti pembayaran dan tunggu konfirmasi.",
  "Masuk ke workspace kelas sesuai gelombang.",
  "Ikuti materi, tugas, quiz, nilai, dan progres sertifikat.",
];

export const trustPoints = [
  "Data pendaftaran dibuat spesifik, termasuk kategori peserta dan identitas pendukung.",
  "Status pembayaran memakai label yang jelas, bukan sekadar catatan manual.",
  "Kelas punya struktur pertemuan agar materi, tugas, dan quiz tidak tercampur.",
  "Sertifikat dapat diperiksa dari halaman validasi publik.",
];
