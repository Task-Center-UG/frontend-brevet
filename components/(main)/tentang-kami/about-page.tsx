"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileQuestion,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import Footer from "@/components/(main)/footer";
import Navbar from "@/components/(main)/navbar";
import { cn } from "@/lib/utils";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const platformFeatures = [
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

const roleCards = [
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

const journeySteps = [
  "Pilih program dan jadwal yang sesuai.",
  "Daftar dengan kategori peserta yang tepat.",
  "Upload bukti pembayaran dan tunggu konfirmasi.",
  "Masuk ke workspace kelas sesuai gelombang.",
  "Ikuti materi, tugas, quiz, nilai, dan progres sertifikat.",
];

const trustPoints = [
  "Data pendaftaran dibuat spesifik, termasuk kategori peserta dan identitas pendukung.",
  "Status pembayaran memakai label yang jelas, bukan sekadar catatan manual.",
  "Kelas punya struktur pertemuan agar materi, tugas, dan quiz tidak tercampur.",
  "Sertifikat dapat diperiksa dari halaman validasi publik.",
];

export default function AboutPage() {
  return (
    <div className="relative bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeatureSection />
        <RoleSection />
        <JourneySection />
        <TrustSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}

function SectionReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 34 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 34 }}
      transition={{ duration: 0.65, delay, ease: easeOutExpo }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}

function HeroSection() {
  return (
    <section className="border-b bg-[linear-gradient(135deg,oklch(0.985_0.006_78),oklch(0.955_0.01_86))] py-24 dark:bg-[linear-gradient(135deg,oklch(0.16_0.012_285),oklch(0.21_0.014_285))] md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end">
        <SectionReveal>
          <SectionEyebrow>Tentang LMS Brevet</SectionEyebrow>
          <h1 className="mt-6 max-w-4xl text-[2.75rem] font-extrabold leading-[0.98] tracking-normal md:text-[4.5rem] lg:text-[5.6rem]">
            Satu tempat untuk daftar, belajar, bayar, dan validasi sertifikat.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            LMS Brevet Tax Center membantu peserta menjalani kelas brevet dengan
            alur yang jelas. Setiap tahap dibuat terlihat, dari memilih jadwal
            sampai menyelesaikan evaluasi.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button className="rounded-full" asChild>
              <Link href="/jadwal-program">
                Lihat Jadwal
                <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/auth/sign-up">Daftar Akun</Link>
            </Button>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="rounded-lg border bg-card p-6">
          <ShieldCheck className="size-7 text-primary" />
          <h2 className="mt-6 text-2xl font-extrabold">
            Dibuat untuk mengurangi kebingungan peserta.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Peserta tidak perlu menebak status pembayaran, jadwal pertemuan,
            tugas yang aktif, atau sertifikat yang bisa dicek.
          </p>
          <div className="mt-6 grid gap-3">
            {["Pendaftaran", "Pembayaran", "Pembelajaran"].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-md border bg-background px-4 py-3 text-sm font-semibold"
              >
                {item}
                <CheckCircle2 className="size-4 text-primary" />
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="border-b py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <SectionReveal>
          <SectionEyebrow>Masalah peserta</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Kelas yang baik tetap terasa berat kalau alurnya tidak jelas.
          </h2>
        </SectionReveal>

        <SectionReveal delay={0.1} className="grid gap-4 md:grid-cols-2">
          {[
            "Tidak yakin harus daftar di gelombang mana.",
            "Sulit tahu pembayaran sudah diverifikasi atau belum.",
            "Materi, tugas, dan quiz terasa terpisah dari jadwal kelas.",
            "Sertifikat perlu bukti validasi yang mudah dibagikan.",
          ].map((item, index) => (
            <div key={item} className="rounded-lg border bg-card p-5">
              <span className="text-xs font-bold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-base font-bold leading-6">{item}</p>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}

function FeatureSection() {
  return (
    <section className="border-b bg-muted/25 py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="max-w-3xl">
          <SectionEyebrow>Fitur LMS</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl">
            Semua fitur diarahkan ke satu tujuan: peserta tahu harus melakukan
            apa.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Fitur di dalam LMS bukan hanya daftar menu. Setiap fitur membantu
            peserta memahami status, akses, dan progres belajar.
          </p>
        </SectionReveal>

        <div className="mt-14 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.title} delay={index * 0.04}>
                <div className="h-full rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:bg-background">
                  <Icon className="size-5 text-primary" />
                  <h3 className="mt-6 text-base font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function RoleSection() {
  return (
    <section className="border-b py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="max-w-3xl">
          <SectionEyebrow>Untuk siapa</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Peserta, guru, dan admin melihat konteks yang mereka butuhkan.
          </h2>
        </SectionReveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {roleCards.map((item, index) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.role} delay={index * 0.07}>
                <article className="rounded-lg border bg-card p-6">
                  <div className="flex items-center justify-between gap-3">
                    <Icon className="size-6 text-primary" />
                    <span className="rounded-full border bg-background px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {item.role}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </article>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JourneySection() {
  return (
    <section className="border-b bg-muted/25 py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center">
        <SectionReveal>
          <SectionEyebrow>Alur pengguna</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Dari minat sampai selesai belajar, langkahnya tersambung.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            LMS dibuat supaya peserta tidak berpindah ke banyak tempat untuk
            memahami apa yang harus dilakukan setelah mendaftar.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="grid gap-3">
          {journeySteps.map((item, index) => (
            <div
              key={item}
              className={cn(
                "rounded-lg border bg-card p-5",
                index % 2 === 1 && "lg:translate-x-8",
              )}
            >
              <div className="flex items-center gap-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-extrabold text-primary">
                  {index + 1}
                </span>
                <p className="text-sm font-bold leading-6">{item}</p>
              </div>
            </div>
          ))}
        </SectionReveal>
      </div>
    </section>
  );
}

function TrustSection() {
  return (
    <section className="border-b py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[420px_minmax(0,1fr)] lg:items-start">
        <SectionReveal>
          <SectionEyebrow>Rasa aman</SectionEyebrow>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
            Data belajar dan pembayaran lebih mudah dipercaya.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Sistem membantu mengurangi percakapan berulang karena status penting
            tampil langsung di dashboard.
          </p>
        </SectionReveal>

        <SectionReveal delay={0.1} className="rounded-lg border bg-card p-6">
          <BadgeCheck className="size-6 text-primary" />
          <div className="mt-6 grid gap-4">
            {trustPoints.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" />
                <p className="text-sm leading-6 text-muted-foreground">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <SectionReveal className="rounded-lg border bg-card p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <SectionEyebrow>Mulai dari jadwal</SectionEyebrow>
              <h2 className="mt-5 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl">
                Cari gelombang yang cocok, lalu lanjutkan dari dashboard.
              </h2>
              <p className="mt-5 max-w-2xl text-sm leading-6 text-muted-foreground">
                Kalau masih membandingkan program, mulai dari jadwal. Kalau
                sudah siap belajar, buat akun dan lanjutkan proses pendaftaran.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="rounded-full" asChild>
                <Link href="/jadwal-program">
                  Lihat Jadwal
                  <ArrowUpRight />
                </Link>
              </Button>
              <Button variant="outline" className="rounded-full" asChild>
                <Link href="/auth/sign-up">Daftar Akun</Link>
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
