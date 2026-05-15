"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  BookOpenCheck,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  FileQuestion,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const easeOutExpo: [number, number, number, number] = [0.16, 1, 0.3, 1];

const decisionItems = [
  {
    title: "Pilih jalur sesuai status",
    desc: "Mahasiswa Gunadarma, mahasiswa non-Gunadarma, dan peserta umum punya konteks harga dan data yang jelas.",
  },
  {
    title: "Lihat jadwal sebelum daftar",
    desc: "Tanggal kelas, mode online atau offline, kuota, dan periode pendaftaran tampil sebelum peserta mengambil keputusan.",
  },
  {
    title: "Pembayaran bisa dipantau",
    desc: "Status pembayaran tidak menggantung. Peserta tahu kapan perlu upload bukti dan kapan menunggu konfirmasi.",
  },
];

const flowItems = [
  { icon: CalendarCheck2, label: "Daftar", desc: "Pilih gelombang aktif." },
  { icon: CreditCard, label: "Bayar", desc: "Upload bukti transfer." },
  { icon: BookOpenCheck, label: "Belajar", desc: "Buka materi per pertemuan." },
  { icon: ClipboardList, label: "Tugas", desc: "Kirim jawaban tepat waktu." },
  { icon: FileQuestion, label: "Quiz", desc: "Ikuti evaluasi kelas." },
  { icon: GraduationCap, label: "Sertifikat", desc: "Validasi dokumen resmi." },
];

const trustItems = [
  "Dashboard siswa menampilkan program aktif, pembayaran, tugas, quiz, nilai, dan progres.",
  "Guru mengelola materi dan penilaian di ruang kelas yang sama dengan konteks pertemuan.",
  "Admin memverifikasi pembayaran dan data peserta dari catatan sistem, bukan dari chat terpisah.",
];

export default function LearnerCentricSections() {
  return (
    <>
      <DecisionSection />
      <LearningFlowSection />
      <TrustSection />
    </>
  );
}

function DecisionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="w-full border-b bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1fr)] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Keputusan lebih mudah
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl">
            Peserta tahu harus pilih apa.
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
            Banyak calon peserta berhenti karena jadwal, harga, dan syarat
            terasa tercecer. Di sini, pilihan program dibuat konkret sejak
            sebelum daftar.
          </p>
        </motion.div>

        <motion.div
          className="grid gap-3"
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOutExpo }}
        >
          {decisionItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="group rounded-lg border bg-card p-5 transition hover:border-primary/30 hover:bg-muted/20"
              initial={{ opacity: 0, x: 24 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.18 + index * 0.08,
                ease: easeOutExpo,
              }}
              whileHover={{ x: 6 }}
            >
              <div className="flex items-start gap-4">
                <motion.span
                  className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-extrabold text-primary"
                  whileHover={{ scale: 1.08, rotate: -2 }}
                >
                  {index + 1}
                </motion.span>
                <div>
                  <h3 className="text-base font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function LearningFlowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="w-full border-b bg-muted/25 py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-6">
        <motion.div
          className="max-w-3xl"
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Alur belajar
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl">
            Belajar brevet tanpa bingung langkah berikutnya.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Setiap pertemuan punya konteks: kapan kelas berjalan, apa materi
            yang dibuka, tugas yang perlu dikerjakan, dan quiz yang harus
            diikuti.
          </p>
        </motion.div>

        <motion.div
          className="relative mt-14 grid items-stretch gap-3 md:grid-cols-2 lg:grid-cols-6"
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOutExpo }}
        >
          <motion.div
            className="absolute left-0 top-8 hidden h-px w-full bg-primary/20 lg:block"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: easeOutExpo }}
            style={{ transformOrigin: "left" }}
          />
          {flowItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.label}
                className="group relative flex min-h-[168px] flex-col rounded-lg border bg-card p-4 transition hover:border-primary/35 hover:bg-background"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.18 + index * 0.07,
                  ease: easeOutExpo,
                }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center justify-between gap-3">
                  <motion.div
                    className="flex size-10 items-center justify-center rounded-md bg-primary/10 text-primary"
                    whileHover={{ scale: 1.08, rotate: 2 }}
                  >
                    <Icon className="size-5" />
                  </motion.div>
                  <span className="rounded-full border bg-background px-2.5 py-1 text-xs font-bold text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-6 text-sm font-bold">{item.label}</p>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {item.desc}
                </p>
                <motion.span
                  className="mt-auto block h-0.5 w-8 rounded-full bg-primary"
                  initial={{ scaleX: 0 }}
                  animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.35 + index * 0.05,
                    ease: easeOutExpo,
                  }}
                  style={{ transformOrigin: "left" }}
                />
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, margin: "-80px" });

  return (
    <section ref={ref} className="w-full bg-background py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: easeOutExpo }}
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Kepercayaan sistem
          </span>
          <h2 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-normal md:text-5xl lg:text-6xl">
            Resmi, rapi, dan bisa dibuktikan.
          </h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Brevet bukan cuma kelas. Peserta butuh bukti pembayaran yang jelas,
            progres belajar yang terlihat, dan sertifikat yang bisa divalidasi
            publik.
          </p>

          <div className="mt-8 grid gap-3">
            {trustItems.map((item, index) => (
              <motion.div
                key={item}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -18 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                  duration: 0.45,
                  delay: 0.15 + index * 0.08,
                  ease: easeOutExpo,
                }}
                whileHover={{ x: 4 }}
              >
                <motion.span
                  className="mt-1 shrink-0 text-primary"
                  whileHover={{ scale: 1.12, rotate: -4 }}
                >
                  <CheckCircle2 className="size-5" />
                </motion.span>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button className="rounded-full" asChild>
              <Link href="/jadwal-program">
                Lihat Jadwal
                <ArrowUpRight />
              </Link>
            </Button>
            <Button variant="outline" className="rounded-full" asChild>
              <Link href="/sertifikat">Validasi Sertifikat</Link>
            </Button>
          </div>
        </motion.div>

        <motion.aside
          className="rounded-lg border bg-card p-6"
          initial={{ opacity: 0, y: 34 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, delay: 0.1, ease: easeOutExpo }}
        >
          <ShieldCheck className="size-6 text-primary" />
          <h3 className="mt-5 text-2xl font-extrabold">
            Kenapa terasa lebih aman?
          </h3>
          <div className="mt-6 grid gap-4">
            <TrustPoint
              icon={BadgeCheck}
              title="Identitas peserta jelas"
              desc="Kategori peserta, NIM atau NIK, dan bukti pendukung dicatat sejak pendaftaran."
            />
            <TrustPoint
              icon={CreditCard}
              title="Status pembayaran terlihat"
              desc="Peserta melihat status tagihan, admin melihat bukti, semua berada di satu alur."
            />
            <TrustPoint
              icon={GraduationCap}
              title="Sertifikat bisa dicek"
              desc="Nomor sertifikat dapat divalidasi melalui halaman publik."
            />
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function TrustPoint({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <motion.div
      className="group rounded-md border bg-background p-4 transition hover:border-primary/30 hover:bg-muted/30"
      whileHover={{ y: -3 }}
    >
      <motion.div
        className="text-primary"
        whileHover={{ scale: 1.08, rotate: 2 }}
      >
        <Icon className="size-5" />
      </motion.div>
      <h4 className="mt-4 text-sm font-bold">{title}</h4>
      <p className="mt-2 text-xs leading-5 text-muted-foreground">{desc}</p>
    </motion.div>
  );
}
